import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { collection, getDocs, orderBy, query, where, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useTheme } from '../../ThemeContext'; // DOĞRU

export default function Notifications({ onBack }) {
  const { theme } = useTheme();
  const [bildirimler, setBildirimler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tumu");

  useEffect(() => {
    const fetchNotifications = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setLoading(false);
        return;
      }
      try {
        let q = query(
          collection(db, "bildirimler"),
          where("uid", "==", uid),
          orderBy("tarih", "desc")
        );
        if (filter !== "tumu") {
          q = query(q, where("tur", "==", filter));
        }
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBildirimler(data);
      } catch (err) {
        console.error("📛 Bildirimler alınamadı:", err);
      }
      setLoading(false);
    };
    fetchNotifications();
  }, [filter]);

  const handleMarkAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "bildirimler", id), { okundu: true });
      setBildirimler(bildirimler.map((b) => (b.id === id ? { ...b, okundu: true } : b)));
    } catch (err) {
      console.error("Bildirim güncellenirken hata:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "bildirimler", id));
      setBildirimler(bildirimler.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Bildirim silinirken hata:", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Text style={{ color: theme.colors.gold, fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.gold }]}>🔔 Bildirimler</Text>
      </View>
      <View style={styles.filterRow}>
        {["tumu", "yorumlar", "tabirler", "begeniler", "sistem"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && { backgroundColor: "#FFD70022", borderColor: "#FFD700" }]}
            onPress={() => setFilter(f)}
          >
            <Text style={{ color: filter === f ? "#FFD700" : "#fff" }}>
              {f === "tumu" ? "Tümü" : f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.gold} style={{ marginTop: 32 }} />
      ) : bildirimler.length === 0 ? (
        <Text style={{ color: "#ccc", textAlign: "center", marginTop: 32 }}>Henüz bir bildirim yok.</Text>
      ) : (
        bildirimler.map((b) => (
          <View
            key={b.id}
            style={[
              styles.notification,
              { backgroundColor: b.okundu ? "#222" : "#FFD70022" },
            ]}
          >
            <Text style={{ color: "#fff", marginBottom: 4 }}>{b.mesaj}</Text>
            <View style={styles.notificationRow}>
              <Text style={{ color: "#FFD70099", fontSize: 12 }}>
                🕒 {b.tarih?.toDate ? new Date(b.tarih.toDate()).toLocaleString() : "Tarih yok"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {!b.okundu && (
                  <TouchableOpacity onPress={() => handleMarkAsRead(b.id)}>
                    <Text style={styles.action}>Okundu İşaretle</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleDelete(b.id)}>
                  <Text style={[styles.action, { color: "#ff4444" }]}>Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: "center" },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: "bold" },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: "#fff2", marginHorizontal: 2 },
  notification: { width: "100%", borderRadius: 12, padding: 16, marginBottom: 12 },
  notificationRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  action: { color: "#FFD700", marginLeft: 16, fontSize: 13 },
});