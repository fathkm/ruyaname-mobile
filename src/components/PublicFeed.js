import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function PublicFeed() {
  return (
    <ScrollView style={styles.background} contentContainerStyle={styles.content}>
      <Text style={styles.title}>✨ Rüyahane</Text>
      <View style={styles.infoBox}>
        <Text style={styles.welcome}>Hoş Geldiniz! 👋</Text>
        <Text style={styles.infoText}>
          Rüyanızı yorumlatmak için "Ana Sayfa"dan başlayabilirsiniz. Rüya yorumunuz tamamlandıktan sonra buradan paylaşabilirsiniz.
        </Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Henüz paylaşılmış rüya bulunmuyor. İlk paylaşımı siz yapın! 🌟
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0d1b2a',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 28,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: 'rgba(65, 90, 119, 0.4)',
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  welcome: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  infoText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.9,
  },
});
