import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from '../../ThemeContext'; // DOĞRU

export default function HamburgerButton({ onClick, isVisible, customStyle = {} }) {
  const { theme } = useTheme();

  if (isVisible) return null;

  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.button, { backgroundColor: theme.colors.secondary, ...customStyle }]}
      accessibilityLabel="Menüyü aç"
    >
      <Text style={[styles.icon, { color: theme.colors.gold }]}>☰</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    left: 16,
    top: 16,
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9998,
  },
  icon: {
    fontSize: 24,
  },
});