import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage'i içe aktarın

// Tema değişikliğini uygulayan yardımcı fonksiyon
const applyTheme = async (mode) => {
  try {
    await AsyncStorage.setItem("theme", mode);
    // React Native'de temayı doğrudan uygulamanızın UI'ına göre ayarlamanız gerekir
  } catch (e) {
    console.error("Failed to save theme:", e);
  }
};

// Yazı boyutunu uygulayan yardımcı fonksiyon
const applyFontSize = async (size) => {
  try {
    await AsyncStorage.setItem("fontSize", size);
    // React Native'de yazı boyutunu doğrudan uygulamanızın UI'ına göre ayarlamanız gerekir
  } catch (e) {
    console.error("Failed to save font size:", e);
  }
};

// Başlangıç değerlerini AsyncStorage'den al
const getInitialTheme = async () => {
  try {
    const storedTheme = await AsyncStorage.getItem("theme");
    return storedTheme || "dark";
  } catch (e) {
    console.error("Failed to get theme:", e);
    return "dark"; // Hata durumunda varsayılan temayı döndürün
  }
};

const getInitialFontSize = async () => {
  try {
    const storedFontSize = await AsyncStorage.getItem("fontSize");
    return storedFontSize || "medium";
  } catch (e) {
    console.error("Failed to get font size:", e);
    return "medium"; // Hata durumunda varsayılan yazı boyutunu döndürün
  }
};

const initialState = {
  theme: {
    mode: "dark", // Başlangıçta varsayılan değer
    fontSize: "medium", // Başlangıçta varsayılan değer
  },
  language: "tr",
  account: {
    profileVisibility: "public",
    email: "",
    name: "",
  },
  privacy: {
    dreamVisibility: "public",
    profileViewability: "everyone",
    locationSharing: true,
  },
};

// Başlangıç ayarlarını AsyncStorage'den yükle ve uygula
const loadInitialSettings = async () => {
  const initialTheme = await getInitialTheme();
  const initialFontSize = await getInitialFontSize();
  initialState.theme.mode = initialTheme;
  initialState.theme.fontSize = initialFontSize;
  // React Native'de temayı ve yazı boyutunu uygulamanızın UI'ına göre ayarlamanız gerekir
  // Örneğin, bir Theme Context veya Global Styles kullanarak
};

// Başlangıç ayarları yükleme fonksiyonunu çağır (isteğe bağlı, genellikle App.js gibi bir yerde yapılır)
// loadInitialSettings();

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.theme.mode = action.payload;
      applyTheme(action.payload);
    },
    setFontSize: (state, action) => {
      state.theme.fontSize = action.payload;
      applyFontSize(action.payload);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setAccountSetting: (state, action) => {
      const { setting, value } = action.payload;
      state.account[setting] = value;
    },
    setPrivacySetting: (state, action) => {
      const { setting, value } = action.payload;
      state.privacy[setting] = value;
    },
    updateSettings: (state, action) => {
      const newState = { ...state, ...action.payload };
      if (newState.theme.mode !== state.theme.mode) {
        applyTheme(newState.theme.mode);
      }
      if (newState.theme.fontSize !== state.theme.fontSize) {
        applyFontSize(newState.theme.fontSize);
      }
      return newState;
    },
  },
});

export const {
  setThemeMode,
  setFontSize,
  setLanguage,
  setAccountSetting,
  setPrivacySetting,
  updateSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;