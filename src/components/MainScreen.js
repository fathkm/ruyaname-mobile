import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setRuya, setSeciliYorumcu } from "../slices/appSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase"; // doğru içe aktarım
import 'react-native-gesture-handler';

// Firestore modülü (React Native Firebase)
import firestore from "@react-native-firebase/firestore";

import YorumcuSlider from "./YorumcuSlider";
import { generateDreamVisual } from "../utils/generateDreamVisual";
import { useTheme } from "../../ThemeContext";
import HamburgerButton from "./HamburgerButton";

const yorumcular = [
  { isim: "Hz.Yusuf", tarzlar: ["dini"], img: require("../../assets/hzyusuf.png") },
  { isim: "İmam Gazali", tarzlar: ["dini", "felsefi-bilimsel"], img: require("../../assets/gazali.png") },
  { isim: "İbn Arabi", tarzlar: ["klasik", "felsefi-bilimsel"], img: require("../../assets/ibnarabi.png") },
  { isim: "Şems-i Tebrizî", tarzlar: ["klasik", "dini"], img: require("../../assets/sems.png") },
  { isim: "Mevlânâ", tarzlar: ["klasik", "dini"], img: require("../../assets/mevlana.png") },
  { isim: "Carl Jung", tarzlar: ["felsefi-bilimsel"], img: require("../../assets/jung.png") },
  { isim: "Rüyacı Dede", tarzlar: ["klasik"], img: require("../../assets/ruyacidede.png") },
];

const dreamTips = [
  "💡 Rüyanızı yazdığınız anda hatırladığınız her detayı ekleyin",
  "🎯 Hissettiklerinizi de belirtirseniz yorum daha kişisel olur",
  "⭐ En etkili yorumlar için yorumcu seçmeyi unutmayın",
  "🌙 Gece gördüğünüz rüyayı sabah yazmak en doğru sonuçları verir",
  "📝 Rüyada gördüğünüz renkleri de yazmayı unutmayın",
  "👥 Rüyada karşılaştığınız kişiler önemli ipuçları verebilir",
  "🏠 Rüyadaki mekanlar genellikle iç dünyanızı yansıtır",
  "😊 Rüyada hissettiğiniz duygular gerçek yaşamla bağlantılıdır",
  "🔄 Tekrar eden rüyalar özel mesajlar taşıyor olabilir",
  "⏰ Rüyayı gördüğünüz zamanı da belirtmek faydalı olacaktır",
];

export default function MainScreen({
  userProfile,
  onLogout,
  onFreeResult,
  setPage,
  showSideMenu,
  onToggleSideMenu,
}) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const ruya = useSelector((state) => state.app.ruya);
  const seciliYorumcu = useSelector((state) => state.app.seciliYorumcu);

  const [tarz, setTarz] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [yorum, setYorum] = useState("");
  const [visualUrl, setVisualUrl] = useState(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [karakterSayisi, setKarakterSayisi] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [writingProgress, setWritingProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % dreamTips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setKarakterSayisi(ruya.length);
    setWritingProgress(Math.min((ruya.length / 1000) * 100, 100));
  }, [ruya]);

  const handleYorumla = async () => {
    if (!ruya) {
      Alert.alert("Uyarı", "Lütfen önce rüyanı yaz.");
      return;
    }
    try {
      const uid = auth.currentUser?.uid;
      if (uid) {
        await firestore().collection("ruyalar").add({
          uid,
          metin: ruya,
          tarih: Date.now(), // firestore.FieldValue.serverTimestamp() da kullanılabilir
          yorumcu: seciliYorumcu,
          tarz: tarz,
          isPublic: isPublic,
        });
      }
      setShowResults(true);
      setPage && setPage("freeResult");
    } catch (error) {
      Alert.alert("Hata", "Rüya kaydedilirken bir hata oluştu.");
      console.error("Firestore hata:", error);
    }
  };

  const handleGenerateImage = async () => {
    setGeneratingImage(true);
    try {
      const img = await generateDreamVisual(ruya);
      setVisualUrl(img);
    } catch (err) {
      Alert.alert("Hata", "Görsel oluşturulurken bir sorun oluştu.");
    }
    setGeneratingImage(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    onLogout && onLogout();
  };

  const filtreliYorumcular = yorumcular.filter((y) => y.tarzlar.includes(tarz));

  const handleBackToForm = () => {
    setShowResults(false);
    setYorum("");
    setVisualUrl(null);
  };

  const getProgressColor = () => {
    if (writingProgress < 30) return "#ff6b6b";
    if (writingProgress < 70) return "#ffd93d";
    return "#6bcf7f";
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <HamburgerButton onClick={onToggleSideMenu} isVisible={showSideMenu} />
          <Text style={[styles.headerTitle, { color: theme.colors.gold }]}>
            {showResults ? "🌙 Rüya Yorumu" : "🌙 RüyaNâme"}
          </Text>
          {!showResults && (
            <Text style={[styles.headerSubtitle, { color: theme.colors.textPrimary }]}>
              Hoş geldin{" "}
              <Text style={{ color: theme.colors.gold, fontWeight: "bold" }}>
                {userProfile?.isim || "misafir"}
              </Text>
            </Text>
          )}
        </View>

        {!showResults && (
          <>
            <View style={styles.tipBox}>
              <Text style={styles.tipText}>{dreamTips[currentTip]}</Text>
            </View>

            <View style={[styles.card, { backgroundColor: theme.colors.primary, borderColor: theme.colors.gold }]}>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${writingProgress}%`, backgroundColor: getProgressColor() },
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: theme.colors.gold }]}>
                  {karakterSayisi}/1000
                </Text>
              </View>

              <TextInput
                value={ruya}
                onChangeText={(text) => dispatch(setRuya(text))}
                placeholder="Rüyanı buraya yaz..."
                maxLength={1000}
                multiline
                style={[
                  styles.textArea,
                  {
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.gold,
                  },
                ]}
                placeholderTextColor={theme.colors.textSecondary}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.colors.gold }]}
                  onPress={handleYorumla}
                >
                  <Text style={[styles.buttonText, { color: "#1a1a1a" }]}>✨ Rüyamı Yorumla</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.colors.primary, borderColor: theme.colors.gold }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.gold }]}>🎨 Yorum Tarzını Seçin</Text>
              <View style={styles.tarzRow}>
                {[
                  { id: "dini", label: "Dini", icon: "🌙" },
                  { id: "felsefi-bilimsel", label: "Bilimsel", icon: "🔬" },
                  { id: "klasik", label: "Klasik", icon: "📜" },
                ].map((btn) => (
                  <TouchableOpacity
                    key={btn.id}
                    style={[
                      styles.tarzButton,
                      tarz === btn.id && {
                        borderColor: theme.colors.gold,
                        backgroundColor: "#fffbe6",
                      },
                    ]}
                    onPress={() => setTarz(btn.id)}
                  >
                    <Text style={styles.tarzIcon}>{btn.icon}</Text>
                    <Text style={[styles.tarzLabel, tarz === btn.id && { color: theme.colors.gold }]}>
                      {btn.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.colors.primary, borderColor: theme.colors.gold }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.gold }]}>Yorumcunu Seç</Text>
              <YorumcuSlider
                yorumcular={tarz ? filtreliYorumcular : yorumcular}
                seciliYorumcu={seciliYorumcu}
                onSelect={(yorumcu) => dispatch(setSeciliYorumcu(yorumcu))}
              />
            </View>
          </>
        )}

        {showResults && (
          <>
            <View style={[styles.card, { backgroundColor: theme.colors.primary, borderColor: theme.colors.gold }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.gold }]}>
                🎨 Rüyanı görselleştirmek ister misin?
              </Text>
              {visualUrl ? (
                <Image source={{ uri: visualUrl }} style={styles.visualImage} />
              ) : (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.colors.gold }]}
                  onPress={handleGenerateImage}
                  disabled={generatingImage}
                >
                  {generatingImage ? (
                    <ActivityIndicator color="#1a1a1a" />
                  ) : (
                    <Text style={[styles.buttonText, { color: "#1a1a1a" }]}>
                      Rüyayı Görselleştir (29.90₺)
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            <View style={{ alignItems: "center", marginTop: 24 }}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: "transparent",
                    borderColor: theme.colors.gold,
                    borderWidth: 2,
                  },
                ]}
                onPress={handleBackToForm}
              >
                <Text style={[styles.buttonText, { color: theme.colors.gold }]}>
                  Başka Bir Rüya Yorumla
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 8 },
  innerContainer: { width: "100%", maxWidth: 800, alignItems: "center", padding: 16 },
  header: { width: "100%", alignItems: "center", marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginTop: 32, marginBottom: 8 },
  headerSubtitle: { fontSize: 16, fontStyle: "italic", textAlign: "center" },
  tipBox: { backgroundColor: "#fffbe6", padding: 12, borderRadius: 12, marginBottom: 16, width: "100%" },
  tipText: { color: "#FFD700", fontWeight: "500", textAlign: "center" },
  card: { width: "100%", borderRadius: 15, padding: 16, marginBottom: 16, borderWidth: 1 },
  progressBarContainer: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  progressBarBackground: { flex: 1, height: 4, backgroundColor: "#eee", borderRadius: 2, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 2 },
  progressText: { marginLeft: 8, fontSize: 12, minWidth: 60, textAlign: "right" },
  textArea: { width: "100%", minHeight: 100, borderRadius: 12, padding: 12, borderWidth: 1, fontSize: 16, marginTop: 8 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  button: { flex: 1, padding: 12, borderRadius: 10, alignItems: "center", marginHorizontal: 4 },
  buttonText: { fontSize: 16, fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  tarzRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  tarzButton: { flex: 1, alignItems: "center", padding: 12, borderRadius: 10, borderWidth: 2, marginHorizontal: 4 },
  tarzIcon: { fontSize: 24, marginBottom: 4 },
  tarzLabel: { fontSize: 14, fontWeight: "600" },
  visualImage: { width: "100%", height: 200, borderRadius: 10, marginTop: 12, resizeMode: "cover" },
});
