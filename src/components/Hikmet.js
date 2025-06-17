import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import hikmetData from "./hikmetData";
import { useTheme } from '../../ThemeContext'; // DOĞRU

export default function Hikmet({ onToggleSideMenu, showSideMenu }) {
  const { theme } = useTheme();
  const rastgeleSec = (liste) => liste[Math.floor(Math.random() * liste.length)];

  const [secimler, setSecimler] = useState({
    soz: "",
    hadis: "",
    ayet: "",
    tefekkur: "",
  });

  const yenile = () => {
    setSecimler({
      soz: rastgeleSec(hikmetData.hikmetliSozler),
      hadis: rastgeleSec(hikmetData.hadisler),
      ayet: rastgeleSec(hikmetData.ayetler),
      tefekkur: rastgeleSec(hikmetData.tefekkur),
    });
  };

  useEffect(() => {
    yenile();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!showSideMenu && (
        <TouchableOpacity style={styles.menuButton} onPress={onToggleSideMenu}>
          <Text style={{ fontSize: 24, color: theme.colors.gold }}>☰</Text>
        </TouchableOpacity>
      )}
      <View style={styles.inner}>
        <Text style={[styles.title, { color: theme.colors.gold }]}>🌟 Hikmet</Text>
        <TouchableOpacity style={[styles.refreshButton, { backgroundColor: theme.colors.primary }]} onPress={yenile}>
          <Text style={{ color: theme.colors.textPrimary, fontSize: 16 }}>🔄 Yenile</Text>
        </TouchableOpacity>
        <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.cardTitle}>⭐ Hikmetli Söz</Text>
          <Text style={styles.cardContent}>{secimler.soz}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.cardTitle}>📜 Hadis-i Şerif</Text>
          <Text style={styles.cardContent}>{secimler.hadis}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.cardTitle}>📖 Ayet-i Kerime</Text>
          <Text style={styles.cardContent}>{secimler.ayet}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.cardTitle}>🌙 Tefekkür</Text>
          <Text style={styles.cardContent}>{secimler.tefekkur}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 16 },
  menuButton: { position: "absolute", left: 16, top: 16, zIndex: 10, backgroundColor: "#222", borderRadius: 8, padding: 8 },
  inner: { width: "100%", maxWidth: 500, alignItems: "center", marginTop: 48 },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 16 },
  refreshButton: { borderRadius: 20, padding: 10, marginBottom: 16, alignItems: "center" },
  card: { width: "100%", borderRadius: 20, padding: 16, marginBottom: 12, alignItems: "center" },
  cardTitle: { fontWeight: "bold", color: "#FFD700", marginBottom: 6, fontSize: 16 },
  cardContent: { color: "#fff", textAlign: "center", fontSize: 15 },
});