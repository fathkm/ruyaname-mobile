import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from '../../ThemeContext'; // DOĞRU
import { auth, db } from "../../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { generateDreamVisual } from "../utils/generateDreamVisual";
import { setRuya } from "../slices/appSlice";

export default function PaymentScreen({ onBack, onPaymentSuccess, selectedYorumcu }) {
  const { theme } = useTheme();
  const ruya = useSelector((state) => state.app.ruya);
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const PREMIUM_PRICE = 149.9;

  const handlePayment = async () => {
    if (paymentMethod === "card") {
      if (!cardNumber || !expiryDate || !cvv || !cardName) {
        Alert.alert("Uyarı", "Lütfen tüm kart bilgilerini doldurun.");
        return;
      }
    }

    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert("Hata", "Kullanıcı girişi yapılmamış. Ödeme yapılamadı.");
      return;
    }
    if (!ruya || !ruya.trim()) {
      Alert.alert("Hata", "Yorumlanacak rüya metni bulunamadı.");
      return;
    }
    if (!selectedYorumcu || !selectedYorumcu.isim) {
      Alert.alert("Hata", "Yorumcu seçimiyle ilgili bir sorun var.");
      return;
    }

    setLoading(true);

    try {
      const ruyaData = {
        uid,
        metin: ruya,
        tarih: serverTimestamp(),
        yorumcu: selectedYorumcu.isim,
        tarz: selectedYorumcu.tarzlar ? selectedYorumcu.tarzlar.join(", ") : "",
        isPremium: true,
        public: false,
        yorum: "Premium yorumunuz çok yakında eklenecektir.",
        gorsel: null,
      };

      const ruyaRef = await addDoc(collection(db, "ruyalar"), ruyaData);

      let imageUrl = null;
      try {
        imageUrl = await generateDreamVisual(ruya);
      } catch (imageError) {
        imageUrl = null;
      }

      if (ruyaRef && ruyaRef.id && imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("http")) {
        try {
          await updateDoc(doc(db, "ruyalar", ruyaRef.id), {
            gorsel: imageUrl,
            guncellemeTarihi: serverTimestamp(),
          });
        } catch (firestoreUpdateError) {
          // Görsel güncellenemedi
        }
      }

      setLoading(false);
      Alert.alert("Başarılı", "Ödeme başarılı! Premium yorumunuz ve rüya görseliniz hazır olduğunda size bildirilecektir.");
      dispatch(setRuya(""));
      onPaymentSuccess();
    } catch (error) {
      setLoading(false);
      Alert.alert("Hata", "Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onBack}>
        <Text style={{ color: "#FFD700", fontSize: 24 }}>×</Text>
      </TouchableOpacity>
      <Text style={styles.title}>💳 Premium Yorum Satın Al</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Seçili Yorumcu</Text>
        <View style={styles.yorumcuRow}>
          <Image
            source={selectedYorumcu?.img ? { uri: selectedYorumcu.img } : require("../../assets/default-avatar.png")}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.yorumcuName}>{selectedYorumcu?.isim}</Text>
            <Text style={styles.price}>₺{PREMIUM_PRICE}</Text>
          </View>
        </View>
        <Text style={styles.desc}>Detaylı ve kişiselleştirilmiş rüya yorumu</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ödeme Yöntemi</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.methodButton,
              paymentMethod === "card" && { backgroundColor: "#FFD700" },
            ]}
            onPress={() => setPaymentMethod("card")}
          >
            <Text style={{ color: paymentMethod === "card" ? "#2A3B56" : "#fff" }}>💳 Kredi Kartı</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.methodButton,
              paymentMethod === "mobile" && { backgroundColor: "#FFD700" },
            ]}
            onPress={() => setPaymentMethod("mobile")}
          >
            <Text style={{ color: paymentMethod === "mobile" ? "#2A3B56" : "#fff" }}>📱 Mobil Ödeme</Text>
          </TouchableOpacity>
        </View>
        {paymentMethod === "card" && (
          <View style={{ marginTop: 12 }}>
            <TextInput
              placeholder="Kart Üzerindeki İsim"
              value={cardName}
              onChangeText={setCardName}
              style={styles.input}
              placeholderTextColor="#ccc"
            />
            <TextInput
              placeholder="Kart Numarası"
              value={cardNumber}
              onChangeText={setCardNumber}
              style={styles.input}
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              maxLength={19}
            />
            <View style={styles.row}>
              <TextInput
                placeholder="AA/YY"
                value={expiryDate}
                onChangeText={setExpiryDate}
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholderTextColor="#ccc"
                maxLength={5}
              />
              <TextInput
                placeholder="CVV"
                value={cvv}
                onChangeText={setCvv}
                style={[styles.input, { flex: 1 }]}
                placeholderTextColor="#ccc"
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>
        )}
        {paymentMethod === "mobile" && (
          <View style={styles.mobileBox}>
            <Text style={{ color: "#fff", marginBottom: 8 }}>
              📱 Mobil ödeme işlemi telefon operatörünüz üzerinden gerçekleştirilecektir.
            </Text>
            <Text style={{ color: "#ccc", fontSize: 13 }}>
              Devam ettiğinizde SMS onayı alacaksınız.
            </Text>
          </View>
        )}
      </View>
      <View style={styles.card}>
        <Text style={styles.price}>₺{PREMIUM_PRICE}</Text>
        <Text style={styles.desc}>Premium Rüya Yorumu</Text>
      </View>
      <TouchableOpacity
        style={[styles.payButton, loading && { backgroundColor: "#FFD70099" }]}
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#2A3B56" />
        ) : (
          <Text style={styles.payButtonText}>₺{PREMIUM_PRICE} Öde ve Yorumu Al</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.security}>🔒 Tüm ödemeleriniz SSL ile güvence altındadır</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 16, backgroundColor: "#2A3B56" },
  closeButton: { position: "absolute", top: 16, right: 16, zIndex: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFD700", marginVertical: 24 },
  card: { width: "100%", maxWidth: 500, backgroundColor: "#fff1", borderRadius: 15, padding: 16, marginBottom: 16 },
  sectionTitle: { color: "#FFD700", fontWeight: "bold", marginBottom: 8 },
  yorumcuRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12, borderWidth: 2, borderColor: "#FFD700" },
  yorumcuName: { color: "#FFD700", fontWeight: "bold", fontSize: 16 },
  price: { color: "#FFD700", fontWeight: "bold", fontSize: 18, marginTop: 4 },
  desc: { color: "#fff", fontSize: 14, marginTop: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  methodButton: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: "#FFD700", alignItems: "center", marginHorizontal: 4 },
  input: { backgroundColor: "#fff1", color: "#fff", borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#FFD70033" },
  mobileBox: { backgroundColor: "#FFD70022", borderRadius: 10, padding: 16, marginTop: 8 },
  payButton: { width: "100%", maxWidth: 500, padding: 18, backgroundColor: "#FFD700", borderRadius: 15, alignItems: "center", marginTop: 8 },
  payButtonText: { color: "#2A3B56", fontWeight: "bold", fontSize: 18 },
  security: { color: "#ccc", fontSize: 12, marginTop: 12, textAlign: "center" },
});