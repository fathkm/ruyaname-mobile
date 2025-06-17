// RüyaNâme Tema Sistemi
// Mevcut tüm renk ve stil değerleri merkezi olarak yönetilir

export const themes = {
  // Koyu Tema (Default - SS'deki mavi tonlu tema)
  dark: {
    name: "Koyu Tema",
    colors: {
      // Ana renkler
      primary: "rgba(22, 41, 70, 0.7)", // Ana kart arkaplanı
      secondary: "rgba(13, 27, 42, 0.7)", // İkincil kart arkaplanı
      tertiary: "rgba(13, 27, 42, 0.5)", // Açık arkaplan

      // Özel durumlar
      primaryDark: "rgba(22, 41, 70, 0.8)", // PaymentScreen için
      primaryLight: "rgba(22, 41, 70, 0.9)", // Gradient için
      secondaryDark: "rgba(13, 27, 42, 0.95)", // Gradient başlangıç

      // Altın tonları
      gold: "#FFD700", // Ana altın
      goldHover: "#ffe066", // Hover durumu
      goldGradientStart: "#FFD700", // Gradient başlangıç
      goldGradientEnd: "#FFA500", // Gradient bitiş

      // Metin renkleri
      textPrimary: "#fff", // Ana metin
      textSecondary: "#E0E0E0", // İkincil metin
      textLight: "#ccc", // Açık metin
      textMuted: "#aaa", // Soluk metin
      textDisabled: "rgba(255, 255, 255, 0.6)", // Devre dışı metin
      textGold: "#FFD700", // Altın metin
      textDark: "#2A3B56", // Koyu metin (butonlar için)

      // Arka planlar
      background: "transparent", // Ana arka plan
      backgroundOverlay: "rgba(0, 0, 0, 0.4)", // Koyu overlay

      // Kenarlıklar
      borderGold: "rgba(255, 215, 0, 0.3)", // Ana altın kenarlık
      borderGoldSolid: "#FFD700", // Solid altın kenarlık
      borderLight: "rgba(255, 255, 255, 0.3)", // Açık kenarlık

      // Özel durumlar
      error: "#ff4444", // Hata rengi
      success: "#4CAF50", // Başarı rengi
      warning: "#FFA500", // Uyarı rengi
    },

    gradients: {
      // Ana gradientler
      gold: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
      goldHorizontal: "linear-gradient(90deg, #FFD700, #FFA500)",
      goldButton: "linear-gradient(45deg, #FFD700, #FFA500)",

      // Arka plan gradientleri
      primaryDark:
        "linear-gradient(135deg, rgba(13, 27, 42, 0.95) 0%, rgba(22, 41, 70, 0.90) 50%)",
      primaryFull:
        "linear-gradient(135deg, rgba(13, 27, 42, 0.95) 0%, rgba(22, 41, 70, 0.90) 100%)",
      primaryToSecondary:
        "linear-gradient(135deg, rgba(22, 41, 70, 0.7) 0%, rgba(13, 27, 42, 0.7) 100%)",
    },

    shadows: {
      // Kart gölgeleri
      card: "0 8px 24px rgba(0,0,0,0.4)",
      cardLarge: "0 20px 60px rgba(0,0,0,0.7)",
      cardMedium: "0 8px 25px rgba(0,0,0,0.3)",

      // Buton gölgeleri
      button: "0 10px 30px rgba(255, 215, 0, 0.5)",
      buttonHover: "0 15px 40px rgba(255, 215, 0, 0.7)",
      buttonSmall: "0 4px 12px rgba(255, 215, 0, 0.3)",

      // Metin gölgeleri
      textGlow: "0 0 20px rgba(255, 215, 0, 0.5)",
      textGlowLarge: "0 0 30px rgba(255, 215, 0, 0.8)",
    },

    borders: {
      // Radius değerleri
      radius: {
        small: "12px",
        medium: "20px",
        large: "25px",
        xlarge: "28px",
        round: "50px",
      },

      // Kenarlık stilleri
      gold: "1px solid rgba(255, 215, 0, 0.3)",
      goldSolid: "1px solid #FFD700",
      goldThick: "2px solid #FFD700",
      light: "1px solid rgba(255, 255, 255, 0.3)",
    },

    effects: {
      blur: "blur(6px)",
      blurHeavy: "blur(15px)",
    },
  },

  // Açık Tema (Şeffaf pencereler, gölgesiz)
  light: {
    name: "Açık Tema",
    colors: {
      // Ana renkler - Çok şeffaf
      primary: "rgba(255, 255, 255, 0.15)", // Çok şeffaf beyaz
      secondary: "rgba(255, 255, 255, 0.1)", // Daha şeffaf
      tertiary: "rgba(255, 255, 255, 0.05)", // En şeffaf

      // Özel durumlar
      primaryDark: "rgba(255, 255, 255, 0.2)",
      primaryLight: "rgba(255, 255, 255, 0.25)",
      secondaryDark: "rgba(255, 255, 255, 0.18)",

      // Altın tonları
      gold: "#FFD700", // Altın aynı kalır
      goldHover: "#ffe066",
      goldGradientStart: "#FFD700",
      goldGradientEnd: "#FFA500",

      // Metin renkleri - Kontrastlı
      textPrimary: "#fff", // Beyaz metin
      textSecondary: "#f0f0f0", // Açık gri
      textLight: "#e0e0e0", // Daha açık gri
      textMuted: "#d0d0d0", // Soluk gri
      textDisabled: "rgba(255, 255, 255, 0.7)",
      textGold: "#FFD700",
      textDark: "#2A3B56", // Koyu metin (butonlar için)

      // Arka planlar
      background: "transparent",
      backgroundOverlay: "rgba(0, 0, 0, 0.1)", // Çok hafif overlay

      // Kenarlıklar - Çok hafif
      borderGold: "rgba(255, 215, 0, 0.4)", // Biraz daha görünür altın
      borderGoldSolid: "#FFD700",
      borderLight: "rgba(255, 255, 255, 0.4)", // Daha görünür kenarlık

      // Özel durumlar
      error: "#ff4444",
      success: "#4CAF50",
      warning: "#FFA500",
    },

    gradients: {
      // Gradientler aynı ama daha şeffaf arka plan için
      gold: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
      goldHorizontal: "linear-gradient(90deg, #FFD700, #FFA500)",
      goldButton: "linear-gradient(45deg, #FFD700, #FFA500)",

      // Şeffaf arka plan gradientleri
      primaryDark:
        "linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.15) 50%)",
      primaryFull:
        "linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.15) 100%)",
      primaryToSecondary:
        "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)",
    },

    shadows: {
      // Çok hafif gölgeler
      card: "0 4px 12px rgba(0,0,0,0.1)", // Çok hafif
      cardLarge: "0 8px 20px rgba(0,0,0,0.15)", // Hafif
      cardMedium: "0 4px 10px rgba(0,0,0,0.08)",

      // Buton gölgeleri biraz daha belirgin
      button: "0 4px 15px rgba(255, 215, 0, 0.3)",
      buttonHover: "0 6px 20px rgba(255, 215, 0, 0.4)",
      buttonSmall: "0 2px 8px rgba(255, 215, 0, 0.2)",

      // Metin gölgeleri
      textGlow: "0 0 15px rgba(255, 215, 0, 0.4)",
      textGlowLarge: "0 0 20px rgba(255, 215, 0, 0.6)",
    },

    borders: {
      radius: {
        small: "12px",
        medium: "20px",
        large: "25px",
        xlarge: "28px",
        round: "50px",
      },

      // Kenarlıklar daha görünür
      gold: "1px solid rgba(255, 215, 0, 0.4)",
      goldSolid: "1px solid #FFD700",
      goldThick: "2px solid #FFD700",
      light: "1px solid rgba(255, 255, 255, 0.4)",
    },

    effects: {
      blur: "blur(4px)", // Daha az blur
      blurHeavy: "blur(8px)",
    },
  },

  // Klasik Mavi Tema (Estetik gökyüzü teması)
  classic: {
    name: "Klasik Mavi",
    colors: {
      // Ana renkler - Yumuşak mavi tonları
      primary: "rgba(25, 55, 109, 0.75)", // Derin gece mavisi
      secondary: "rgba(15, 35, 70, 0.8)", // Koyu gece mavisi
      tertiary: "rgba(35, 65, 120, 0.6)", // Açık gece mavisi

      // Özel durumlar
      primaryDark: "rgba(25, 55, 109, 0.85)",
      primaryLight: "rgba(35, 65, 120, 0.9)",
      secondaryDark: "rgba(15, 35, 70, 0.95)",

      // Altın tonları - Yıldız efekti için
      gold: "#FFD700", // Yıldız altını
      goldHover: "#FFF4A3", // Parlak yıldız
      goldGradientStart: "#FFD700",
      goldGradientEnd: "#FFEB3B", // Daha parlak bitiş

      // Metin renkleri
      textPrimary: "#FFFFFF", // Beyaz metin
      textSecondary: "#E3F2FD", // Açık mavi beyaz
      textLight: "#BBDEFB", // Açık gökyüzü mavisi
      textMuted: "#90CAF9", // Yumuşak mavi
      textDisabled: "rgba(255, 255, 255, 0.6)",
      textGold: "#FFD700", // Yıldız metni
      textDark: "#1A237E", // Koyu mavi metin (butonlar için)

      // Arka planlar - Gökyüzü efektleri
      background: "linear-gradient(180deg, rgba(15, 35, 70, 0.95) 0%, rgba(25, 55, 109, 0.9) 50%, rgba(35, 65, 120, 0.85) 100%)",
      backgroundOverlay: "rgba(15, 35, 70, 0.6)", // Gece gökyüzü overlay

      // Kenarlıklar - Yıldız parıltısı
      borderGold: "rgba(255, 215, 0, 0.4)",
      borderGoldSolid: "#FFD700",
      borderLight: "rgba(187, 222, 251, 0.3)", // Açık mavi kenarlık

      // Özel durumlar
      error: "#ff4444",
      success: "#4CAF50",
      warning: "#FFA500",
    },

    gradients: {
      // Yıldız gradientleri
      gold: "linear-gradient(135deg, #FFD700 0%, #FFEB3B 50%, #FFF176 100%)",
      goldHorizontal: "linear-gradient(90deg, #FFD700, #FFEB3B, #FFF176)",
      goldButton: "linear-gradient(45deg, #FFD700, #FFEB3B)",

      // Gökyüzü gradientleri
      primaryDark: "linear-gradient(135deg, rgba(15, 35, 70, 0.95) 0%, rgba(25, 55, 109, 0.9) 50%)",
      primaryFull: "linear-gradient(135deg, rgba(15, 35, 70, 0.95) 0%, rgba(25, 55, 109, 0.9) 100%)",
      primaryToSecondary: "linear-gradient(135deg, rgba(25, 55, 109, 0.75) 0%, rgba(15, 35, 70, 0.8) 100%)",
    },

    shadows: {
      // Gece efektli gölgeler
      card: "0 8px 24px rgba(0, 0, 0, 0.4)",
      cardLarge: "0 20px 60px rgba(0, 0, 0, 0.7)",
      cardMedium: "0 8px 25px rgba(0, 0, 0, 0.3)",

      // Yıldız parıltılı gölgeler
      button: "0 10px 30px rgba(255, 235, 59, 0.5)",
      buttonHover: "0 15px 40px rgba(255, 235, 59, 0.7)",
      buttonSmall: "0 4px 12px rgba(255, 235, 59, 0.3)",

      // Yıldız parıltılı metin gölgeleri
      textGlow: "0 0 20px rgba(255, 235, 59, 0.5)",
      textGlowLarge: "0 0 30px rgba(255, 235, 59, 0.8)",
    },

    borders: {
      radius: {
        small: "12px",
        medium: "20px",
        large: "25px",
        xlarge: "28px",
        round: "50px",
      },

      // Yıldız parıltılı kenarlıklar
      gold: "1px solid rgba(255, 235, 59, 0.3)",
      goldSolid: "1px solid #FFEB3B",
      goldThick: "2px solid #FFEB3B",
      light: "1px solid rgba(187, 222, 251, 0.3)",
    },

    effects: {
      blur: "blur(6px)",
      blurHeavy: "blur(15px)",
    },
  },

  // Mor Tema (Mistik ve büyülü atmosfer)
  purple: {
    name: "Mor Tema",
    colors: {
      // Ana renkler - Derin mor tonları
      primary: "rgba(75, 0, 130, 0.75)", // Derin mor
      secondary: "rgba(48, 25, 52, 0.8)", // Koyu mor
      tertiary: "rgba(102, 51, 153, 0.6)", // Açık mor

      // Özel durumlar
      primaryDark: "rgba(75, 0, 130, 0.85)",
      primaryLight: "rgba(102, 51, 153, 0.9)",
      secondaryDark: "rgba(48, 25, 52, 0.95)",

      // Altın tonları - Mistik efekt için
      gold: "#FFD700",
      goldHover: "#FFF4A3",
      goldGradientStart: "#FFD700",
      goldGradientEnd: "#FFEB3B",

      // Metin renkleri
      textPrimary: "#FFFFFF",
      textSecondary: "#E6E6FA", // Açık lavanta
      textLight: "#D8BFD8", // Açık orkide
      textMuted: "#DDA0DD", // Açık mor
      textDisabled: "rgba(255, 255, 255, 0.6)",
      textGold: "#FFD700",
      textDark: "#4B0082", // Koyu mor metin

      // Arka planlar - Mistik efektler
      background: "linear-gradient(180deg, rgba(48, 25, 52, 0.95) 0%, rgba(75, 0, 130, 0.9) 50%, rgba(102, 51, 153, 0.85) 100%)",
      backgroundOverlay: "rgba(48, 25, 52, 0.6)",

      // Kenarlıklar
      borderGold: "rgba(255, 215, 0, 0.4)",
      borderGoldSolid: "#FFD700",
      borderLight: "rgba(230, 230, 250, 0.3)", // Lavanta kenarlık

      // Özel durumlar
      error: "#ff4444",
      success: "#4CAF50",
      warning: "#FFA500",
    },

    gradients: {
      // Mistik gradientler
      gold: "linear-gradient(135deg, #FFD700 0%, #FFEB3B 50%, #FFF176 100%)",
      goldHorizontal: "linear-gradient(90deg, #FFD700, #FFEB3B, #FFF176)",
      goldButton: "linear-gradient(45deg, #FFD700, #FFEB3B)",

      // Mor gradientler
      primaryDark: "linear-gradient(135deg, rgba(48, 25, 52, 0.95) 0%, rgba(75, 0, 130, 0.9) 50%)",
      primaryFull: "linear-gradient(135deg, rgba(48, 25, 52, 0.95) 0%, rgba(75, 0, 130, 0.9) 100%)",
      primaryToSecondary: "linear-gradient(135deg, rgba(75, 0, 130, 0.75) 0%, rgba(48, 25, 52, 0.8) 100%)",
    },

    shadows: {
      // Mistik gölgeler
      card: "0 8px 24px rgba(75, 0, 130, 0.4)",
      cardLarge: "0 20px 60px rgba(75, 0, 130, 0.7)",
      cardMedium: "0 8px 25px rgba(75, 0, 130, 0.3)",

      // Altın parıltılı gölgeler
      button: "0 10px 30px rgba(255, 215, 0, 0.5)",
      buttonHover: "0 15px 40px rgba(255, 215, 0, 0.7)",
      buttonSmall: "0 4px 12px rgba(255, 215, 0, 0.3)",

      // Mistik metin gölgeleri
      textGlow: "0 0 20px rgba(255, 215, 0, 0.5)",
      textGlowLarge: "0 0 30px rgba(255, 215, 0, 0.8)",
    },

    borders: {
      radius: {
        small: "12px",
        medium: "20px",
        large: "25px",
        xlarge: "28px",
        round: "50px",
      },

      // Mistik kenarlıklar
      gold: "1px solid rgba(255, 215, 0, 0.3)",
      goldSolid: "1px solid #FFD700",
      goldThick: "2px solid #FFD700",
      light: "1px solid rgba(230, 230, 250, 0.3)",
    },

    effects: {
      blur: "blur(6px)",
      blurHeavy: "blur(15px)",
    },
  },
};

// Varsayılan tema
export const defaultTheme = themes.dark;

// Tema seçici hook (sonra eklenecek)
export const getTheme = (themeName = "dark") => {
  return themes[themeName] || themes.dark;
};
