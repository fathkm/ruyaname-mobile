import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from '../../ThemeContext'; // DOĞRU

export default function BottomNavigation({ active, onChange }) {
  const { theme } = useTheme();

  const buttons = [
    { key: "main", icon: "🏠", label: "Ana Sayfa" },
    { key: "feed", icon: "🌌", label: "Rüyahane" },
    { key: "yorumcular", icon: "🧙‍♂️", label: "Yorumcular" },
    { key: "sozluk", icon: "📖", label: "Sözlük" },
    { key: "hikmet", icon: "✨", label: "Hikmet" },
  ];

  return (
    <View style={[styles.nav, { backgroundColor: theme.colors.primary, borderTopColor: theme.colors.gold }]}>
      {buttons.map((btn) => (
        <TouchableOpacity
          key={btn.key}
          style={styles.button}
          onPress={() => onChange(btn.key)}
        >
          <Text style={[styles.icon, active === btn.key && { color: theme.colors.gold, fontSize: 28 }]}>
            {btn.icon}
          </Text>
          <Text style={[styles.label, active === btn.key && { color: theme.colors.gold, fontWeight: "bold" }]}>
            {btn.label}
          </Text>
          {active === btn.key && <View style={[styles.activeBar, { backgroundColor: theme.colors.gold }]} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    paddingVertical: 8,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  button: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
    position: "relative",
  },
  icon: {
    fontSize: 24,
    color: "#aaa",
  },
  label: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
  },
  activeBar: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 3,
    borderRadius: 2,
  },
});