import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { setSeciliYorumcu } from "../slices/appSlice";
import { useTheme } from '../../ThemeContext'; // DOĞRU
import HamburgerButton from "./HamburgerButton";

const yorumcular = [
  {
    img: require("../../assets/hzyusuf.png"),
    isim: "Hz. Yusuf",
    tarzlar: ["dini"],
    bio: "İlahi rehberlikle rüyaların derin anlamlarını çözer.",
    uzmanlik: "Rüya tabirinde peygamberlik makamının özel bilgisi",
    donem: "M.Ö. 1700'ler",
    eserler: "Kur'an-ı Kerim'de geçen rüya tabirleri",
  },
  {
    img: require("../../assets/gazali.png"),
    isim: "İmam Gazali",
    tarzlar: ["dini", "felsefi-bilimsel"],
    bio: "Tasavvufun kalp merkezli dilini rüyalara taşır.",
    uzmanlik: "Tasavvufi rüya yorumlama",
    donem: "1058-1111",
    eserler: "İhya-u Ulumiddin",
  },
  {
    img: require("../../assets/ibnarabi.png"),
    isim: "İbn Arabi",
    tarzlar: ["klasik", "felsefi-bilimsel"],
    bio: "Sembol dilinin ustası, batınî işaretlerin izini sürer.",
    uzmanlik: "Sembolik ve irfani yorum",
    donem: "1165-1240",
    eserler: "Fütuhat-ı Mekkiyye",
  },
  {
    img: require("../../assets/sems.png"),
    isim: "Şems-i Tebrizi",
    tarzlar: ["klasik", "dini"],
    bio: "Sezgisel yaklaşımla derin ve ilham verici yorumlar yapar.",
    uzmanlik: "Sezgisel rüya yorumlama",
    donem: "1185-1248",
    eserler: "Makalat",
  },
  {
    img: require("../../assets/mevlana.png"),
    isim: "Mevlana",
    tarzlar: ["klasik", "dini"],
    bio: "Aşkın diliyle ruhu saran tabirler sunar.",
    uzmanlik: "Manevi ve aşk odaklı yorumlama",
    donem: "1207-1273",
    eserler: "Mesnevi",
  },
  {
    img: require("../../assets/jung.png"),
    isim: "Carl Jung",
    tarzlar: ["felsefi-bilimsel"],
    bio: "Rüyaları bilinçaltının dili olarak yorumlar.",
    uzmanlik: "Analitik psikoloji",
    donem: "1875-1961",
    eserler: "Rüyalar",
  },
  {
    img: require("../../assets/ruyacidede.png"),
    isim: "Rüyacı Dede",
    tarzlar: ["klasik"],
    bio: "Halk arasında kuşaktan kuşağa aktarılan yorum geleneği.",
    uzmanlik: "Geleneksel halk yorumları",
    donem: "Osmanlı Dönemi",
    eserler: "Sözlü gelenek",
  },
];

const tarzEtiketleri = {
  dini: "🕌 Dini",
  "felsefi-bilimsel": "📜 Felsefi",
  klasik: "📚 Klasik",
};

export default function Commentators({ onToggleSideMenu, showSideMenu }) {
  const { theme } = useTheme();
  const [aktifTarz, setAktifTarz] = useState("");
  const dispatch = useDispatch();

  const filtreliYorumcular = aktifTarz
    ? yorumcular.filter((y) => y.tarzlar.includes(aktifTarz))
    : yorumcular;

  const handleYorumcuSec = (yorumcu) => {
    dispatch(setSeciliYorumcu(yorumcu.isim));
    // Burada ödeme sayfasına yönlendirme için navigation kullanılmalı
    // navigation.navigate("Payment", { yorumcu });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HamburgerButton onClick={onToggleSideMenu} isVisible={showSideMenu} />
      <Text style={[styles.title, { color: theme.colors.gold }]}>Rüya Yorumcuları</Text>
      <View style={styles.tarzRow}>
        {Object.entries(tarzEtiketleri).map(([id, label]) => (
          <TouchableOpacity
            key={id}
            style={[
              styles.tarzButton,
              aktifTarz === id && { backgroundColor: theme.colors.gold }
            ]}
            onPress={() => setAktifTarz(aktifTarz === id ? "" : id)}
          >
            <Text style={[
              styles.tarzButtonText,
              aktifTarz === id && { color: theme.colors.textDark }
            ]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.grid}>
        {filtreliYorumcular.map((y) => (
          <View key={y.isim} style={[styles.card, { backgroundColor: theme.colors.primary }]}>
            <Image source={y.img} style={styles.avatar} />
            <Text style={[styles.name, { color: theme.colors.gold }]}>{y.isim}</Text>
            <Text style={styles.bio}>{y.bio}</Text>
            <View style={styles.tags}>
              {y.tarzlar.map((t) => (
                <Text key={t} style={styles.tag}>{tarzEtiketleri[t]}</Text>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.gold }]}
              onPress={() => handleYorumcuSec(y)}
            >
              <Text style={[styles.buttonText, { color: theme.colors.textDark }]}>Tabirlerini Gör</Text>
            </TouchableOpacity>
            <View style={styles.detailBox}>
              <Text style={styles.detail}><Text style={styles.detailLabel}>Uzmanlık:</Text> {y.uzmanlik}</Text>
              <Text style={styles.detail}><Text style={styles.detailLabel}>Dönem:</Text> {y.donem}</Text>
              <Text style={styles.detail}><Text style={styles.detailLabel}>Eserler:</Text> {y.eserler}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 16 },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 16 },
  tarzRow: { flexDirection: "row", justifyContent: "center", marginBottom: 16 },
  tarzButton: { padding: 10, borderRadius: 20, marginHorizontal: 6, backgroundColor: "#222" },
  tarzButtonText: { color: "#fff", fontWeight: "bold" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  card: { width: 260, borderRadius: 20, padding: 16, margin: 8, alignItems: "center", elevation: 2 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 8, borderWidth: 2, borderColor: "#FFD700" },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  bio: { fontSize: 14, color: "#ccc", marginBottom: 8, textAlign: "center" },
  tags: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  tag: { backgroundColor: "#fffbe6", color: "#222", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, margin: 2, fontSize: 12 },
  button: { width: "100%", padding: 10, borderRadius: 10, alignItems: "center", marginTop: 8 },
  buttonText: { fontWeight: "bold", fontSize: 16 },
  detailBox: { marginTop: 8, backgroundColor: "#333", borderRadius: 10, padding: 8, width: "100%" },
  detail: { color: "#FFD700", fontSize: 12, marginBottom: 2 },
  detailLabel: { fontWeight: "bold" },
});