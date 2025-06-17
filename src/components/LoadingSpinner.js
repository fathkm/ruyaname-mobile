import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

const LoadingSpinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FFD700" />
      <Text style={styles.text}>Yükleniyor...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(13, 27, 42, 0.8)",
  },
  text: {
    color: "#FFD700",
    fontFamily: "serif",
    fontSize: 18,
    marginTop: 16,
  },
});

export default LoadingSpinner;