import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from '../../ThemeContext'; // DOĞRU

export default function IntroScreen({ onNext }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.card, { backgroundColor: theme.colors.primary, borderColor: theme.colors.gold }]}>
        <Text style={[styles.title, { color: theme.colors.gold }]}>🌙 RüyaNâme</Text>
        <Text style={[styles.text, { color: theme.colors.textPrimary }]}>
          Bu uygulama, rüyalarını daha derin anlamlandırabilmen için sana özel yorumlar sunar.
        </Text>
        <Text style={[styles.text, { color: theme.colors.textLight }]}>
          AI destekli sistemimiz, seni daha iyi tanıyabildiğinde çok daha etkileyici ve doğru yorumlar üretir. Bu nedenle aşağıdaki sorulara içtenlikle cevap vermen çok önemlidir.
        </Text>
        <Text style={[styles.text, styles.italic, { color: theme.colors.textMuted }]}>
          Bu bilgiler yalnızca rüya analizi amacıyla kullanılır. Hiçbir şekilde üçüncü kişilerle paylaşılmaz.
        </Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.gold }]} onPress={onNext}>
          <Text style={[styles.buttonText, { color: "#2A3B56" }]}>Başla ➡️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  card: {
    borderRadius: 24,
    maxWidth: 720,
    width: "100%",
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 20, fontFamily: "serif" },
  text: { fontSize: 16, marginBottom: 16, textAlign: "center" },
  italic: { fontStyle: "italic" },
  button: { marginTop: 24, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  buttonText: { fontWeight: "bold", fontSize: 18 },
});