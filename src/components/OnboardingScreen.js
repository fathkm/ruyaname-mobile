import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function OnboardingScreen({ onNext }) {
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [hasChild, setHasChild] = useState(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kişisel Bilgiler</Text>

      {/* Doğum Bilgileri */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Temel Bilgiler</Text>
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doğum Yeri</Text>
            <TextInput
              placeholder="İstanbul, Türkiye"
              value={birthPlace}
              onChangeText={setBirthPlace}
              style={styles.input}
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doğum Tarihi</Text>
            <TextInput
              placeholder="GG/AA/YYYY"
              value={birthDate}
              onChangeText={setBirthDate}
              style={styles.input}
              placeholderTextColor="#ccc"
            />
          </View>
        </View>
      </View>

      {/* Cinsiyet Seçimi */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Cinsiyet</Text>
        <View style={styles.row}>
          {["Erkek", "Kadın", "Belirtmek İstemiyorum"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.genderButton,
                gender === option && { backgroundColor: "#FFD700" },
              ]}
              onPress={() => setGender(option)}
            >
              <Text style={{ color: gender === option ? "#2A3B56" : "#fff" }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* İlişki Durumu */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>İlişki Durumu</Text>
        <View style={styles.row}>
          {["Bekar", "Evli", "Ayrı"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.statusButton,
                status === option && { backgroundColor: "#FFD700" },
              ]}
              onPress={() => setStatus(option)}
            >
              <Text style={{ color: status === option ? "#2A3B56" : "#fff" }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Çocuk Bilgisi */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Çocuk Bilgisi</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.choiceButton,
              hasChild === true && { backgroundColor: "#FFD700" },
            ]}
            onPress={() => setHasChild(true)}
          >
            <Text style={{ color: hasChild === true ? "#2A3B56" : "#fff" }}>
              Evet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.choiceButton,
              hasChild === false && { backgroundColor: "#FFD700" },
            ]}
            onPress={() => setHasChild(false)}
          >
            <Text style={{ color: hasChild === false ? "#2A3B56" : "#fff" }}>
              Hayır
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={onNext}>
        <Text style={styles.nextButtonText}>Devam Et ➔</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 16, backgroundColor: "#2A3B56" },
  title: { fontSize: 28, fontWeight: "bold", color: "#FFD700", marginVertical: 24 },
  card: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 20, padding: 20, marginBottom: 16, width: "100%", maxWidth: 500 },
  sectionTitle: { color: "#FFD700", fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  inputGroup: { flex: 1, marginRight: 8 },
  label: { color: "#fff", marginBottom: 4 },
  input: { backgroundColor: "#fff1", color: "#fff", borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#FFD70033" },
  genderButton: { flex: 1, padding: 14, borderRadius: 15, borderWidth: 2, borderColor: "#FFD700", alignItems: "center", marginHorizontal: 4 },
  statusButton: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: "#FFD700", alignItems: "center", marginHorizontal: 4 },
  choiceButton: { flex: 1, padding: 14, borderRadius: 20, borderWidth: 2, borderColor: "#FFD700", alignItems: "center", marginHorizontal: 8 },
  nextButton: { width: "100%", maxWidth: 500, padding: 18, backgroundColor: "#FFD700", borderRadius: 15, alignItems: "center", marginTop: 16 },
  nextButtonText: { color: "#2A3B56", fontWeight: "bold", fontSize: 18 },
});