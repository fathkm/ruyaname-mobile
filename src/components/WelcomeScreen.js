import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from '../../ThemeContext'; // DOĞRU

const quotes = [
  {
    yazar: "Hz. Yusuf",
    soz: "Rabbim! Bana öğrettiğin rüya tabirinden ve bana lütfettiğin ilimden istifade ettir.",
  },
  {
    yazar: "İbn Arabi",
    soz: "Rüya, hakikatle hayalin dans ettiği yerdir.",
  },
  {
    yazar: "Carl Jung",
    soz: "Rüyalar, bilinçaltının kutsal mektuplarıdır.",
  },
  {
    yazar: "Freud",
    soz: "Rüya, bastırılmış arzuların kamufle edilmiş sahnesidir.",
  },
  {
    yazar: "Mevlana",
    soz: "Sen rüyanda yürürsün, Hak seni uyandırmak ister.",
  },
  {
    yazar: "İmam Gazali",
    soz: "Rüya, kalbin sırlarına açılan bir penceredir.",
  },
  {
    yazar: "Muhyiddin İbnü'l-Arabi",
    soz: "Rüyalar, ruhun kendi aslına duyduğu özlemi gösterir.",
  },
  {
    yazar: "C.G. Jung",
    soz: "Kim rüyasını anlamazsa kendini de anlayamaz.",
  },
  {
    yazar: "Hz. Ali",
    soz: "İlmin başı sabırdır, rüyaların dili ise hikmettir.",
  },
  {
    yazar: "Şems-i Tebrizi",
    soz: "Rüya, hakikatin ince bir iplikle kalbine dokunmasıdır.",
  },
  {
    yazar: "Rumi",
    soz: "Rüyanda gördüğün senin en içten duandır belki de.",
  },
  {
    yazar: "Hallac-ı Mansur",
    soz: "Uyurken gördüğün gerçektir, çünkü onda ben yoksun.",
  },
  {
    yazar: "İmam Rabbani",
    soz: "Rüya, kalpteki suretlerin Rabbani bir dille konuşmasıdır.",
  },
  {
    yazar: "Martin Buber",
    soz: "İnsan rüyasında kendisiyle en çok yüzleşir.",
  },
  {
    yazar: "Nietzsche",
    soz: "Rüyalar, içimizdeki tanrıyı ve canavarı aynı anda uyandırır.",
  },
];

export default function WelcomeScreen({ onNext }) {
  const { theme } = useTheme();
  const [randomQuote, setRandomQuote] = useState(null);

  useEffect(() => {
    const sec = quotes[Math.floor(Math.random() * quotes.length)];
    setRandomQuote(sec);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors?.background || '#111' }]}> 
      {/* Ay İkonu */}
      <Text style={[styles.moonIcon, { textShadowColor: theme.shadows?.textGlowLarge || '#FFD700' }]}>🌙</Text>
      {/* Başlık */}
      <Text style={[styles.title, { color: theme.colors?.gold || '#FFD700', textShadowColor: theme.shadows?.textGlow || '#FFD700' }]}>RüyaNâme</Text>
      {/* Alıntı */}
      {randomQuote && (
        <View style={styles.quoteBox}>
          <Text style={[styles.quoteText, { color: theme.colors?.textPrimary || '#fff' }]}>"{randomQuote.soz}"</Text>
          <Text style={[styles.quoteAuthor, { color: theme.colors?.gold || '#FFD700' }]}>— {randomQuote.yazar}</Text>
        </View>
      )}
      {/* Devam Et Butonu */}
      <TouchableOpacity
        onPress={onNext}
        style={[styles.button, { backgroundColor: theme.colors?.gold || '#FFD700', shadowColor: theme.shadows?.button || '#FFD700' }]}
        activeOpacity={0.85}
      >
        <Text style={[styles.buttonText, { color: '#2A3B56' }]}>Devam Et</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  moonIcon: {
    fontSize: 64,
    marginBottom: 16,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
    textAlign: 'center',
  },
  title: {
    fontSize: 48,
    fontFamily: 'PlayfairDisplay-Bold', // Eğer özel font ekli ise
    marginBottom: 32,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quoteBox: {
    marginBottom: 36,
    maxWidth: 600,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 22,
    fontStyle: 'italic',
    lineHeight: 32,
    marginBottom: 10,
    textAlign: 'center',
  },
  quoteAuthor: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});
