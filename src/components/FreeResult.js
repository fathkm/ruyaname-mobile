import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Image, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setSeciliYorumcu } from "../slices/appSlice";
import { useTheme } from '../../ThemeContext'; // DOĞRU

const yorumcular = [
  { isim: "Hz. Yusuf", bio: "Hz. Yusuf, vahiy ile yönlendirilen rüya tabirlerinin ilki olarak bilinir.", img: require("../../assets/hzyusuf.png") },
  { isim: "İmam Gazali", bio: "Gazali, tasavvufi derinliği ve kalp merkezli yaklaşımıyla tanınır.", img: require("../../assets/gazali.png") },
  { isim: "İbn Arabi", bio: "İbn Arabi, sembolik ve derin rüya yorumlarının öncüsüdür.", img: require("../../assets/ibnarabi.png") },
  { isim: "Şems-i Tebrizî", bio: "Mevlânâ'nın gönül rehberi olarak sezgisel tabirleriyle öne çıkar.", img: require("../../assets/sems.png") },
  { isim: "Mevlânâ", bio: "Aşk merkezli, derin ruhsal tabirlerle kalplere hitap eder.", img: require("../../assets/mevlana.png") },
  { isim: "Carl Jung", bio: "Rüyaları bilinçdışının dili olarak gören psikoloji öncüsüdür.", img: require("../../assets/jung.png") },
  { isim: "Rüyacı Dede", bio: "Geleneksel halk yorumlarıyla tanınan sıcak bir halk figürüdür.", img: require("../../assets/ruyacidede.png") },
];

export default function FreeResult({ onPremium, onBack, userProfile }) {
  const { theme } = useTheme();
  const ruya = useSelector((state) => state.app.ruya);
  const dispatch = useDispatch();

  const [yorum, setYorum] = useState("");
  const [loading, setLoading] = useState(false);
  const [visualUrl, setVisualUrl] = useState(null);

  // Sadece örnek: Yorum üret
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setYorum("🌙 Rüyanızın yorumu burada görünecek. (API entegrasyonu eklenmeli)");
      setLoading(false);
    }, 2000);
  }, [ruya]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.closeButton}>
        <Text style={{ color: "#FFD700", fontSize: 24 }}>×</Text>
      </TouchableOpacity>
      <Text style={[styles.title, { color: theme.colors.gold }]}>🌙 Rüya Yorumu</Text>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.gold} style={{ marginTop: 32 }} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.yorum}>{yorum}</Text>
        </View>
      )}

      {/* Premium yorum butonu */}
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.gold }]} onPress={onPremium}>
        <Text style={[styles.buttonText, { color: "#222" }]}>✨ Detaylı Analiz İçin Premium'a Geç</Text>
      </TouchableOpacity>

      {/* Premium yorumcular */}
      <Text style={[styles.sectionTitle, { color: theme.colors.gold }]}>Premium Yorumcular</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {yorumcular.map((yorumcu) => (
          <TouchableOpacity
            key={yorumcu.isim}
            style={styles.yorumcuCard}
            onPress={() => {
              dispatch(setSeciliYorumcu(yorumcu.isim));
              onPremium();
            }}
          >
            <Image source={yorumcu.img} style={styles.avatar} />
            <Text style={styles.yorumcuName}>{yorumcu.isim}</Text>
            <Text style={styles.yorumcuBio}>{yorumcu.bio}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 16 },
  closeButton: { position: "absolute", top: 16, right: 16, zIndex: 10 },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 16 },
  card: { width: "100%", backgroundColor: "#222", borderRadius: 16, padding: 16, marginVertical: 8 },
  yorum: { color: "#fff", fontSize: 16 },
  button: { padding: 12, borderRadius: 12, alignItems: "center", marginTop: 16, marginBottom: 8 },
  buttonText: { fontWeight: "bold", fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 24, marginBottom: 8 },
  yorumcuCard: { width: 140, backgroundColor: "#fffbe6", borderRadius: 12, padding: 12, marginRight: 12, alignItems: "center" },
  avatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 4, borderWidth: 2, borderColor: "#FFD700" },
  yorumcuName: { fontWeight: "bold", color: "#FFD700", fontSize: 14 },
  yorumcuBio: { fontSize: 12, color: "#222", textAlign: "center" },
});