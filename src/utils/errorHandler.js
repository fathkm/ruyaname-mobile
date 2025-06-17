// Error kategorileri
export const ErrorTypes = {
  AUTH: 'auth',
  API: 'api',
  NETWORK: 'network',
  STORAGE: 'storage',
  VALIDATION: 'validation',
  UNKNOWN: 'unknown'
};

// Kullanıcı dostu hata mesajları
const errorMessages = {
  // Yetkilendirme hataları
  'auth/wrong-password': 'Şifre hatalı.',
  'auth/user-not-found': 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.',
  'auth/email-already-in-use': 'Bu e-posta adresi zaten kullanımda.',
  'auth/invalid-email': 'Geçersiz e-posta adresi.',
  'auth/weak-password': 'Şifre çok zayıf. En az 6 karakter kullanın.',
  'auth/network-request-failed': 'İnternet bağlantınızı kontrol edin.',
  
  // API hataları
  'api/rate-limit': '🕒 Çok fazla istek gönderildi. Lütfen biraz bekleyin.',
  'api/invalid-key': '🔑 API erişim hatası. Yönetici ile iletişime geçin.',
  'api/server-error': '⚠️ Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
  
  // Ağ hataları
  'network/offline': '📡 İnternet bağlantınızı kontrol edin.',
  'network/timeout': '⌛ Sunucu yanıt vermiyor. Lütfen tekrar deneyin.',
  
  // Storage hataları
  'storage/quota-exceeded': '💾 Depolama alanı doldu.',
  'storage/unauthenticated': '🔒 Dosya yükleme için giriş yapmalısınız.',
  'storage/unauthorized': '🚫 Bu işlem için yetkiniz yok.',
  
  // Validation hataları
  'validation/required-field': '⚠️ Bu alan zorunludur.',
  'validation/invalid-format': '⚠️ Geçersiz format.',
  
  // Genel hatalar
  'default': 'Bir hata oluştu. Lütfen tekrar deneyin.'
};

// Hata tipini belirle
const getErrorType = (error) => {
  if (error.code?.startsWith('auth/')) return ErrorTypes.AUTH;
  if (error.code?.startsWith('api/')) return ErrorTypes.API;
  if (error.code?.startsWith('network/')) return ErrorTypes.NETWORK;
  if (error.code?.startsWith('storage/')) return ErrorTypes.STORAGE;
  if (error.code?.startsWith('validation/')) return ErrorTypes.VALIDATION;
  return ErrorTypes.UNKNOWN;
};

// Hata mesajını getir
const getErrorMessage = (error) => {
  return errorMessages[error.code] || errorMessages.default;
};

// Hata logla
const logError = (error, context = {}) => {
  const errorType = getErrorType(error);
  const timestamp = new Date().toISOString();
  
  console.error('🔴 ERROR LOG:', {
    type: errorType,
    timestamp,
    message: error.message,
    code: error.code,
    context,
    stack: error.stack
  });
  
  // TODO: Burada hata loglama servisi eklenebilir (örn: Sentry)
};

// Ana hata işleme fonksiyonu
export const handleError = (error, context = {}) => {
  const errorType = getErrorType(error);
  const userMessage = getErrorMessage(error);
  
  // Hatayı logla
  logError(error, context);
  
  return {
    type: errorType,
    message: userMessage,
    originalError: error
  };
};

// Validation hatası oluştur
export const createValidationError = (field, message) => {
  const error = new Error(message);
  error.code = `validation/${field}`;
  return error;
};

// API hatası oluştur
export const createApiError = (type, message) => {
  const error = new Error(message);
  error.code = `api/${type}`;
  return error;
}; 