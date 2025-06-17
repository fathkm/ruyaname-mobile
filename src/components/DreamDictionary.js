import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useTheme } from '../../ThemeContext'; // DOĞRU

export default function DreamDictionary({ onToggleSideMenu, showSideMenu }) {
  const { theme } = useTheme();
  const [keyword, setKeyword] = useState("");
  const [meaning, setMeaning] = useState("");
  const [loading, setLoading] = useState(false);
  const [sonAramalar, setSonAramalar] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    // AsyncStorage ile son aramaları alabilirsin (burada sadeleştirilmiş)
    // AsyncStorage.getItem("sonRuyaAramalari").then(...)
  }, []);

  const handleQuery = async (aranacakKelime = keyword) => {
    if (!aranacakKelime.trim()) {
      showNotification("Lütfen bir kelime girin.");
      return;
    }
    if (aranacakKelime.length > 20) {
      showNotification("En fazla 20 karakter kullanabilirsiniz.");
      return;
    }

    setLoading(true);

    const basitTabirler = {
      su: "Rüyada su görmek, duygusal durumunuzu ve bilinçaltınızı temsil eder. Temiz su, manevi arınma ve iyileşmeyi, bulanık su ise duygusal karmaşayı simgeler.",
      ateş: "Rüyada ateş görmek, tutku, öfke veya değişimi simgeler. Kontrollü ateş yeni başlangıçları, kontrolsüz ateş ise hayatınızdaki kaosları temsil edebilir.",
      uçmak: "Rüyada uçmak, özgürlük arzusu ve sorunlardan kaçış isteğini temsil eder. Aynı zamanda yüksek hedefler ve başarı isteğini de simgeleyebilir.",
      düşmek: "Rüyada düşmek, kontrolü kaybetme korkusu veya hayatınızda yaşadığınız bir başarısızlık hissiyle ilişkilidir. Bazen de ani değişimleri sembolize eder.",
      yılan: "Rüyada yılan görmek, gizli tehlikeleri, sinsilik veya düşmanları temsil edebilir. Aynı zamanda bilgelik, şifa ve yenilenmeyi de sembolize eder.",
    };

    setTimeout(() => {
      let sonuc = basitTabirler[aranacakKelime.toLowerCase()];
      if (!sonuc) {
        sonuc = `"${aranacakKelime}" rüyada görüldüğünde genellikle kişinin iç dünyasını ve duygusal durumunu yansıtır. Olumlu bağlamda yeni fırsatları, olumsuz bağlamda ise korkuları temsil edebilir.`;
      }
      setMeaning(sonuc);

      // Son aramaları güncelle (AsyncStorage ile kalıcı yapabilirsin)
      const yeniAramalar = [
        aranacakKelime,
        ...sonAramalar.filter((x) => x !== aranacakKelime),
      ].slice(0, 5);
      setSonAramalar(yeniAramalar);

      setLoading(false);
    }, 1000);
  };

  const showNotification = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hamburger Menü Butonu */}
      {!showSideMenu && (
        <TouchableOpacity style={styles.menuButton} onPress={onToggleSideMenu}>
          <Text style={{ fontSize: 24, color: theme.colors.gold }}>☰</Text>
        </TouchableOpacity>
      )}

      <View style={styles.inner}>
        <Text style={[styles.title, { color: theme.colors.gold }]}>Rüya Sözlüğü</Text>
        <Text style={styles.desc}>Rüyanızda gördüğünüz sembolleri yazın, anlamını öğrenin</Text>

        {/* Arama */}
        <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
          <TextInput
            maxLength={20}
            placeholder="Rüya sembolünü yazın..."
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={handleQuery}
            style={[styles.input, { color: theme.colors.textPrimary, borderColor: theme.colors.gold }]}
            placeholderTextColor={theme.colors.textSecondary}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.gold }]}
            onPress={handleQuery}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#222" />
            ) : (
              <Text style={[styles.buttonText, { color: "#222" }]}>🔮 Tabiri Göster</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Son Aramalar */}
        {sonAramalar.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.sectionTitle}>🕒 Son Aramalarınız</Text>
            <View style={styles.row}>
              {sonAramalar.map((arama, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.tag}
                  onPress={() => {
                    setKeyword(arama);
                    handleQuery(arama);
                  }}
                >
                  <Text style={{ color: "#222" }}>{arama}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Yorum Sonucu */}
        {meaning && (
          <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.sectionTitle}>🔮 Rüya Tabiri: {keyword}</Text>
            <Text style={styles.meaning}>{meaning}</Text>
          </View>
        )}

        {/* Bildirim Popup */}
        {showPopup && (
          <View style={styles.popup}>
            <Text style={{ color: "#fff" }}>{popupMessage}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 16 },
  menuButton: { position: "absolute", left: 16, top: 16, zIndex: 10, backgroundColor: "#222", borderRadius: 8, padding: 8 },
  inner: { width: "100%", maxWidth: 500, alignItems: "center", marginTop: 48 },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 16 },
  desc: { fontSize: 14, color: "#ccc", marginBottom: 16, textAlign: "center" },
  card: { width: "100%", borderRadius: 15, padding: 16, marginBottom: 16 },
  input: { width: "100%", borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16, marginBottom: 8 },
  button: { padding: 12, borderRadius: 12, alignItems: "center", marginTop: 8 },
  buttonText: { fontWeight: "bold", fontSize: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#FFD700" },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { backgroundColor: "#fffbe6", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 4, margin: 2 },
  meaning: { color: "#fff", fontSize: 15, marginTop: 8 },
  popup: { position: "absolute", bottom: 32, left: "10%", right: "10%", backgroundColor: "#222", borderRadius: 12, padding: 16, alignItems: "center", zIndex: 100 },
});