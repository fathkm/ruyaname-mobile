import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
  signInWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider as FirebaseGoogleAuthProvider,
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { handleError } from "../utils/errorHandler";

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      const { message } = handleError(err, { email });
      setError(message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new FirebaseGoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (err) {
      const { message } = handleError(err, { provider: "google" });
      setError(message);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      await signInAnonymously(auth);
      onLogin();
    } catch (err) {
      const { message } = handleError(err, { loginType: "anonymous" });
      setError(message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🌙</Text>
        <Text style={styles.title}>RüyaNâme</Text>
      </View>
      <View style={styles.form}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#ccc"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#ccc"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonOutline} onPress={handleGoogleLogin}>
          <Image source={require("../../assets/google-icon.png")} style={styles.googleIcon} />
          <Text style={styles.buttonOutlineText}>Google ile Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonGhost} onPress={handleAnonymousLogin}>
          <Text style={styles.buttonGhostText}>Üyeliksiz Devam Et</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonLink} onPress={onSwitchToRegister}>
          <Text style={styles.buttonLinkText}>Hesabın yok mu? Kayıt ol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#0d1b2a" },
  header: { alignItems: "center", marginBottom: 32 },
  emoji: { fontSize: 48 },
  title: { fontSize: 32, fontWeight: "bold", color: "#FFD700", fontFamily: "serif" },
  form: { width: "100%", maxWidth: 400 },
  error: { backgroundColor: "#ffeded", color: "#ff6b6b", padding: 12, borderRadius: 8, marginBottom: 12, textAlign: "center" },
  input: { width: "100%", padding: 16, borderRadius: 8, borderWidth: 1, borderColor: "#FFD70033", backgroundColor: "#fff1", color: "#fff", fontSize: 16, marginBottom: 12 },
  button: { width: "100%", padding: 16, borderRadius: 8, backgroundColor: "#FFD700", alignItems: "center", marginBottom: 12 },
  buttonText: { color: "#1a1a1a", fontWeight: "bold", fontSize: 16 },
  buttonOutline: { width: "100%", padding: 16, borderRadius: 8, borderWidth: 1, borderColor: "#FFD700", backgroundColor: "transparent", flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  buttonOutlineText: { color: "#FFD700", fontSize: 16, marginLeft: 8 },
  googleIcon: { width: 20, height: 20 },
  buttonGhost: { width: "100%", padding: 16, borderRadius: 8, borderWidth: 1, borderColor: "#fff2", backgroundColor: "transparent", alignItems: "center", marginBottom: 12 },
  buttonGhostText: { color: "#fff", fontSize: 16 },
  buttonLink: { width: "100%", padding: 12, alignItems: "center" },
  buttonLinkText: { color: "#FFD700", fontSize: 16, textDecorationLine: "underline" },
});