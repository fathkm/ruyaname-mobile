import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { handleError } from '../utils/errorHandler';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onRegisterSuccess();
    } catch (err) {
      const { message } = handleError(err, { email });
      setError(message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await auth.signOut();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onRegisterSuccess();
    } catch (err) {
      const { message } = handleError(err, { provider: 'google' });
      setError(message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🌙</Text>
        <Text style={styles.title}>RüyaNâme</Text>
      </View>
      <View style={styles.formBox}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        <TextInput
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#aaa"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleEmailRegister}>
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleRegister}>
          <Image source={require('../assets/google-icon.png')} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Google ile Kayıt Ol</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton} onPress={onSwitchToLogin}>
          <Text style={styles.linkButtonText}>Zaten hesabın var mı? Giriş yap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1b2a',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    color: '#FFD700',
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  formBox: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  errorBox: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    fontSize: 15,
  },
  input: {
    width: '100%',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#FFD700',
    alignItems: 'center',
  },
  buttonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    width: '100%',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  googleButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#FFD700',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
