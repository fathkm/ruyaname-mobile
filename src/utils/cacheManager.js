// Cache süresi (24 saat)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Cache anahtarları
export const CacheKeys = {
  USER_PROFILE: 'user_profile',
  PAST_DREAMS: 'past_dreams',
  PUBLIC_DREAMS: 'public_dreams',
  YORUMCULAR: 'yorumcular',
  SETTINGS: 'settings',
};

// Cache'e veri kaydet
export const setCache = (key, data, duration = CACHE_DURATION) => {
  try {
    const item = {
      data,
      timestamp: new Date().getTime(),
      expiry: new Date().getTime() + duration,
    };
    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (err) {
    console.error('Cache kaydetme hatası:', err);
    return false;
  }
};

// Cache'den veri oku
export const getCache = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { data, expiry } = JSON.parse(item);
    
    // Cache süresi dolmuş mu kontrol et
    if (new Date().getTime() > expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Cache okuma hatası:', err);
    return null;
  }
};

// Cache'i temizle
export const clearCache = (key) => {
  try {
    if (key) {
      localStorage.removeItem(key);
    } else {
      // Tüm cache'i temizle
      Object.values(CacheKeys).forEach(k => localStorage.removeItem(k));
    }
    return true;
  } catch (err) {
    console.error('Cache temizleme hatası:', err);
    return false;
  }
};

// Cache'i güncelle
export const updateCache = (key, updateFn) => {
  try {
    const currentData = getCache(key);
    if (currentData === null) return false;

    const updatedData = updateFn(currentData);
    return setCache(key, updatedData);
  } catch (err) {
    console.error('Cache güncelleme hatası:', err);
    return false;
  }
};

// Cache durumunu kontrol et
export const isCacheValid = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return false;

    const { expiry } = JSON.parse(item);
    return new Date().getTime() <= expiry;
  } catch (err) {
    console.error('Cache kontrol hatası:', err);
    return false;
  }
};

// Memory cache için Map
const memoryCache = new Map();

// Memory cache'e veri kaydet (kısa süreli cache için)
export const setMemoryCache = (key, data, duration = 5 * 60 * 1000) => {
  try {
    const item = {
      data,
      expiry: new Date().getTime() + duration,
    };
    memoryCache.set(key, item);
    
    // Otomatik temizleme
    setTimeout(() => {
      memoryCache.delete(key);
    }, duration);

    return true;
  } catch (err) {
    console.error('Memory cache kaydetme hatası:', err);
    return false;
  }
};

// Memory cache'den veri oku
export const getMemoryCache = (key) => {
  try {
    const item = memoryCache.get(key);
    if (!item) return null;

    if (new Date().getTime() > item.expiry) {
      memoryCache.delete(key);
      return null;
    }

    return item.data;
  } catch (err) {
    console.error('Memory cache okuma hatası:', err);
    return null;
  }
}; 