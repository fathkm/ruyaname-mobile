import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Image, ActivityIndicator } from "react-native";
import { collection, query, where, orderBy, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useTheme } from '../../ThemeContext'; // DOĞRU
import HamburgerButton from "./HamburgerButton";

export default function PastDreams({ onBack, onToggleSideMenu, showSideMenu }) {
  const { theme } = useTheme();
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tümü");
  const [generatingImageForId, setGeneratingImageForId] = useState(null);

  const fetchDreams = async () => {
    try {
      setLoading(true);
      if (!auth.currentUser) throw new Error("Kullanıcı girişi yapılmamış");
      const q = query(
        collection(db, "ruyalar"),
        where("uid", "==", auth.currentUser.uid),
        orderBy("tarih", "desc")
      );
      const querySnapshot = await getDocs(q);
      const dreamsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDreams(dreamsList);
    } catch (error) {
      Alert.alert("Hata", "Rüyalarınız yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDreams();
  }, []);

  const deleteDream = async (dreamId) => {
    Alert.alert(
      "Rüya Sil",
      "Bu rüyayı silmek istediğinizden emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "ruyalar", dreamId));
              setDreams(dreams.filter((d) => d.id !== dreamId));
            } catch (err) {
              Alert.alert("Hata", "Rüya silinemedi.");
            }
          },
        },
      ]
    );
  };

  const toggleDreamVisibility = async (dreamId, currentState) => {
    try {
      await updateDoc(doc(db, "ruyalar", dreamId), {
        public: !currentState,
        guncellemeTarihi: new Date(),
      });
      setDreams((prevDreams) =>
        prevDreams.map((d) =>
          d.id === dreamId ? { ...d, public: !currentState } : d
        )
      );
      Alert.alert(
        !currentState ? "Rüya Paylaşıldı" : "Rüya Özel Yapıldı",
        !currentState
          ? "Rüyanız başarıyla paylaşıldı."
          : "Rüyanız özel yapıldı ve artık paylaşılmayacak."
      );
    } catch (err) {
      Alert.alert("Hata", "Rüya paylaşılırken bir sorun oluştu.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    if (timestamp.toDate) return timestamp.toDate().toLocaleString("tr-TR");
    if (typeof timestamp === "string") return timestamp;
    if (timestamp instanceof Date) return timestamp.toLocaleString("tr-TR");
    return "";
  };

  const filteredDreams = dreams.filter((dream) => {
    if (filter === "tümü") return true;
    if (filter === "paylaşılanlar") return dream.public === true;
    if (filter === "özel") return dream.public === false;
    return true;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HamburgerButton onClick={onToggleSideMenu} isVisible={showSideMenu} />
      <TouchableOpacity style={styles.closeButton} onPress={onBack}>
        <Text style={{ color: "#FFD700", fontSize: 24 }}>×</Text>
      </TouchableOpacity>
      <Text style={styles.title}>📜 Rüyalarım</Text>
      <View style={styles.filterRow}>
        {["tümü", "paylaşılanlar", "özel"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f && { backgroundColor: "#FFD70022", borderColor: "#FFD700" },
            ]}
            onPress={() => setFilter(f)}
          >
            <Text style={{ color: filter === f ? "#FFD700" : "#fff" }}>
              {f === "tümü"
                ? "🌟 Tümü"
                : f === "paylaşılanlar"
                ? "🌍 Paylaşılanlar"
                : "🔒 Özel"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 32 }} />
      ) : filteredDreams.length === 0 ? (
        <Text style={{ color: "#ccc", textAlign: "center", marginTop: 32 }}>
          Henüz rüya kaydın yok.
        </Text>
      ) : (
        filteredDreams.map((dream) => (
          <View key={dream.id} style={styles.dreamCard}>
            <Text style={styles.date}>{formatDate(dream.tarih)}</Text>
            {dream.gorsel ? (
              <Image source={{ uri: dream.gorsel }} style={styles.image} />
            ) : null}
            <Text style={styles.sectionTitle}>📝 Rüya İçeriği</Text>
            <Text style={styles.dreamText}>{dream.metin}</Text>
            {dream.yorum && (
              <>
                <Text style={styles.sectionTitle}>🔮 Rüya Tabiri</Text>
                <Text style={styles.dreamText}>{dream.yorum}</Text>
              </>
            )}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: dream.public ? "#ff634733" : "#48d1cc33" },
                ]}
                onPress={() => toggleDreamVisibility(dream.id, dream.public)}
              >
                <Text style={{ color: dream.public ? "#ff6347" : "#48d1cc" }}>
                  {dream.public ? "🔒 Özel Yap" : "🌍 Paylaş"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#ff6b6b22" }]}
                onPress={() => deleteDream(dream.id)}
              >
                <Text style={{ color: "#ff6b6b" }}>🗑 Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 16, backgroundColor: "#2A3B56" },
  closeButton: { position: "absolute", top: 16, right: 16, zIndex: 10 },
  title: { fontSize: 28, fontWeight: "bold", color: "#FFD700", marginVertical: 24 },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: "#fff2", marginHorizontal: 2 },
  dreamCard: { width: "100%", maxWidth: 500, backgroundColor: "#fff1", borderRadius: 15, padding: 16, marginBottom: 16 },
  date: { color: "#FFD70099", fontSize: 12, marginBottom: 8, textAlign: "right" },
  sectionTitle: { color: "#FFD700", fontWeight: "bold", marginTop: 8, marginBottom: 4 },
  dreamText: { color: "#fff", fontSize: 15, marginBottom: 8 },
  image: { width: "100%", height: 180, borderRadius: 10, marginBottom: 8, resizeMode: "cover" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  actionButton: { flex: 1, alignItems: "center", padding: 12, borderRadius: 8, marginHorizontal: 4 },
});