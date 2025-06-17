import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useTheme } from '../../ThemeContext'; // DOĞRU
import HamburgerButton from "./HamburgerButton";

const DUYGUSAL_DURUMLAR = {
  pozitif: ["mutlu", "heyecanlı", "huzurlu", "sevgi dolu", "başarılı"],
  negatif: ["korku", "endişe", "üzüntü", "stres", "kaygı"],
  notr: ["şaşkın", "meraklı", "düşünceli"],
};

const YAŞAM_ALANLARI = {
  iş: ["ofis", "toplantı", "iş", "çalışma", "proje", "başarı"],
  ilişkiler: ["aile", "arkadaş", "sevgili", "evlilik", "partner"],
  kişisel: ["ev", "hobiler", "sağlık", "spor", "eğitim"],
  manevi: ["inanç", "dua", "tapınak", "meditasyon", "huzur"],
};

export default function DreamAnalytics({ onBack, onToggleSideMenu, showSideMenu }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    analyzeDreams();
  }, []);

  const analyzeDreams = async () => {
    const user = auth.currentUser;
    if (!user?.uid) return;

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const q = query(
        collection(db, "ruyalar"),
        where("uid", "==", user.uid),
        where("tarih", ">=", thirtyDaysAgo),
        orderBy("tarih", "desc")
      );

      const snapshot = await getDocs(q);
      const dreams = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const dreamAnalytics = analyzeEmotionalPatterns(dreams);
      const dreamPatterns = findRecurringPatterns(dreams);
      const personalSuggestions = generatePersonalSuggestions(dreams, dreamAnalytics);

      setAnalytics(dreamAnalytics);
      setPatterns(dreamPatterns);
      setSuggestions(personalSuggestions);
    } catch (err) {
      console.error("Rüya analizi yapılırken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeEmotionalPatterns = (dreams) => {
    const emotionalStats = { pozitif: 0, negatif: 0, notr: 0, yasamAlanlari: {} };
    dreams.forEach((dream) => {
      Object.entries(DUYGUSAL_DURUMLAR).forEach(([type, keywords]) => {
        keywords.forEach((keyword) => {
          if (dream.metin?.toLowerCase().includes(keyword)) {
            emotionalStats[type]++;
          }
        });
      });
      Object.entries(YAŞAM_ALANLARI).forEach(([alan, keywords]) => {
        keywords.forEach((keyword) => {
          if (dream.metin?.toLowerCase().includes(keyword)) {
            emotionalStats.yasamAlanlari[alan] = (emotionalStats.yasamAlanlari[alan] || 0) + 1;
          }
        });
      });
    });
    return emotionalStats;
  };

  const findRecurringPatterns = (dreams) => {
    const patterns = [];
    const symbolCount = {};
    dreams.forEach((dream) => {
      dream.kategoriler?.forEach((kategori) => {
        symbolCount[kategori] = (symbolCount[kategori] || 0) + 1;
      });
    });
    Object.entries(symbolCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .forEach(([symbol, count]) => {
        patterns.push({ içerik: symbol, tekrar: count });
      });
    return patterns;
  };

  const generatePersonalSuggestions = (dreams, analytics) => {
    const suggestions = [];
    if (analytics.negatif > analytics.pozitif * 2) {
      suggestions.push("Son zamanlarda rüyalarında negatif duygular ağır basıyor. Meditasyon veya yoga gibi rahatlatıcı aktivitelere yönelmek faydalı olabilir.");
    }
    const enAzIlgiAlani = Object.entries(analytics.yasamAlanlari).sort(([, a], [, b]) => a - b)[0];
    if (enAzIlgiAlani) {
      suggestions.push(`${enAzIlgiAlani[0]} alanına daha fazla önem vermeyi düşünebilirsin. Bu alan rüyalarında az yer alıyor.`);
    }
    return suggestions;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HamburgerButton onClick={onToggleSideMenu} isVisible={showSideMenu} />
      <TouchableOpacity onPress={onBack} style={styles.closeButton}>
        <Text style={{ color: "#FFD700", fontSize: 24 }}>×</Text>
      </TouchableOpacity>
      <Text style={[styles.title, { color: theme.colors.gold }]}>✨ Rüya Analizi</Text>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.gold} style={{ marginTop: 32 }} />
      ) : !analytics ? (
        <View style={styles.card}>
          <Text>Son 30 günde yeterli rüya kaydı bulunamadı.</Text>
          <Text>Analiz için daha fazla rüya kaydetmelisin.</Text>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🔍 Duygusal Örüntüler</Text>
            <View style={styles.row}>
              <View style={styles.patternBox}>
                <Text style={{ color: "#4CAF50", fontSize: 22, fontWeight: "bold" }}>{analytics.pozitif}</Text>
                <Text style={styles.patternLabel}>Pozitif</Text>
              </View>
              <View style={styles.patternBox}>
                <Text style={{ color: "#FF5252", fontSize: 22, fontWeight: "bold" }}>{analytics.negatif}</Text>
                <Text style={styles.patternLabel}>Negatif</Text>
              </View>
              <View style={styles.patternBox}>
                <Text style={{ color: "#2196F3", fontSize: 22, fontWeight: "bold" }}>{analytics.notr}</Text>
                <Text style={styles.patternLabel}>Nötr</Text>
              </View>
            </View>
          </View>
          {patterns.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>🔄 Tekrar Eden Temalar</Text>
              {patterns.map((pattern, idx) => (
                <Text key={idx} style={styles.patternItem}>
                  {pattern.içerik} ({pattern.tekrar} kez)
                </Text>
              ))}
            </View>
          )}
          {suggestions.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>💡 Kişisel Öneriler</Text>
              {suggestions.map((s, idx) => (
                <Text key={idx} style={styles.suggestion}>{s}</Text>
              ))}
            </View>
          )}
          {analytics.yasamAlanlari && Object.keys(analytics.yasamAlanlari).length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>🏠 Yaşam Alanları</Text>
              <View style={styles.row}>
                {Object.entries(analytics.yasamAlanlari).map(([alan, deger]) => (
                  <View key={alan} style={styles.patternBox}>
                    <Text style={{ color: "#FFD700", fontSize: 18, fontWeight: "bold" }}>{deger}</Text>
                    <Text style={styles.patternLabel}>{alan}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 16 },
  closeButton: { position: "absolute", top: 16, right: 16, zIndex: 10 },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 16 },
  card: { width: "100%", backgroundColor: "#222", borderRadius: 16, padding: 16, marginVertical: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#FFD700" },
  row: { flexDirection: "row", justifyContent: "space-around", marginVertical: 8 },
  patternBox: { alignItems: "center", marginHorizontal: 8 },
  patternLabel: { fontSize: 14, color: "#ccc" },
  patternItem: { fontSize: 14, color: "#FFD700", marginVertical: 2 },
  suggestion: { fontSize: 14, color: "#fff", marginVertical: 2 },
});