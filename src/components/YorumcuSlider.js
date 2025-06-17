import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { useTheme } from '../../ThemeContext'; // DOĞRU

export default function YorumcuSlider({
  yorumcular = [],
  seciliYorumcu,
  onSelect,
}) {
  const { theme } = useTheme();
  const scrollRef = useRef();
  const [animasyonAktif, setAnimasyonAktif] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [userScrolling, setUserScrolling] = useState(false);

  // Otomatik kaydırma
  useEffect(() => {
    if (!animasyonAktif || userScrolling) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: scrollPosition + 1,
          animated: false,
        });
        setScrollPosition((prev) => prev + 1);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [animasyonAktif, scrollPosition, userScrolling]);

  // Yorumcular listesi
  const displayYorumcular =
  yorumcular.length > 0
    ? yorumcular
    : [
        { isim: "Hz. Yusuf", img: require("../../assets/hzyusuf.png") },
        { isim: "İmam Gazali", img: require("../../assets/gazali.png") },
        { isim: "İbn Arabi", img: require("../../assets/ibnarabi.png") },
        { isim: "Şems-i Tebrizî", img: require("../../assets/sems.png") },
        { isim: "Mevlânâ", img: require("../../assets/mevlana.png") },
        { isim: "Carl Jung", img: require("../../assets/jung.png") },
        { isim: "Rüyacı Dede", img: require("../../assets/ruyacidede.png") },
      ];
  // Döngüsel görüntü için kopya dizi
  const extendedList = [...displayYorumcular, ...displayYorumcular.slice(0, 3)];

  // ScrollView scroll event
  const handleScroll = (e) => {
    setScrollPosition(e.nativeEvent.contentOffset.x);
  };

  // Kullanıcı dokununca animasyonu durdur
  const handleTouchStart = () => {
    setUserScrolling(true);
    setAnimasyonAktif(false);
  };
  const handleTouchEnd = () => {
    setUserScrolling(false);
    setTimeout(() => setAnimasyonAktif(true), 1500);
  };

  // Sol/sağ oklar için fonksiyonlar
  const scrollBy = (amount) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: scrollPosition + amount,
        animated: true,
      });
      setScrollPosition(scrollPosition + amount);
      setAnimasyonAktif(false);
      setTimeout(() => setAnimasyonAktif(true), 2000);
    }
  };

  return (
    <View style={{ marginTop: 16, position: 'relative' }}>
      {/* Kaydırma Göstergeleri */}
      <View style={styles.dotsRow}>
        {[...Array(Math.min(displayYorumcular.length, 7))].map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: theme.colors.gold, opacity: 0.5 + (scrollPosition / 500) * 0.5 },
            ]}
          />
        ))}
      </View>
      {/* Sol Ok */}
      <TouchableOpacity
        style={[styles.arrowButton, { left: -15, backgroundColor: theme.colors.secondary, shadowColor: theme.shadows.cardSmall, borderColor: theme.colors.gold }]}
        onPress={() => scrollBy(-120)}
        activeOpacity={0.7}
      >
        <Text style={[styles.arrowText, { color: theme.colors.gold }]}>◀</Text>
      </TouchableOpacity>
      {/* Sağ Ok */}
      <TouchableOpacity
        style={[styles.arrowButton, { right: -15, backgroundColor: theme.colors.secondary, shadowColor: theme.shadows.cardSmall, borderColor: theme.colors.gold }]}
        onPress={() => scrollBy(120)}
        activeOpacity={0.7}
      >
        <Text style={[styles.arrowText, { color: theme.colors.gold }]}>▶</Text>
      </TouchableOpacity>
      {/* Yorumcular Kaydırıcı */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {extendedList.map((y, index) => (
          <TouchableOpacity
            key={`${y.isim}-${index}`}
            onPress={() => onSelect && onSelect(y.isim)}
            activeOpacity={0.8}
            style={[
              styles.yorumcuItem,
              seciliYorumcu === y.isim && styles.yorumcuItemSelected,
            ]}
          >
            <View
              style={[
                styles.avatarWrapper,
                seciliYorumcu === y.isim && {
                  backgroundColor: theme.gradients?.goldDiagonal || '#FFD700',
                  shadowColor: theme.shadows.buttonSmall,
                },
              ]}
            >
              <Image
                source={y.img}
                style={[
                  styles.avatar,
                  {
                    borderColor: seciliYorumcu === y.isim ? theme.colors.gold : theme.colors.textSecondary,
                  },
                ]}
                resizeMode="cover"
              />
            </View>
            <Text
              style={[
                styles.yorumcuName,
                {
                  color: seciliYorumcu === y.isim ? theme.colors.gold : theme.colors.textPrimary,
                  fontWeight: seciliYorumcu === y.isim ? '600' : 'normal',
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {y.isim}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -15,
    zIndex: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    opacity: 0.7,
    elevation: 2,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    paddingBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  yorumcuItem: {
    width: 90,
    alignItems: 'center',
    opacity: 0.7,
    transform: [{ scale: 1 }],
    marginHorizontal: 2,
    marginBottom: 2,
  },
  yorumcuItemSelected: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  avatarWrapper: {
    padding: 3,
    borderRadius: 50,
    backgroundColor: 'transparent',
    marginBottom: 4,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    marginBottom: 2,
  },
  yorumcuName: {
    fontSize: 13,
    marginTop: 6,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
});
