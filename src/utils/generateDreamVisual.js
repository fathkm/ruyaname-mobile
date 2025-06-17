// ÖNEMLİ: Bu API anahtarını gerçek bir projede bu şekilde tutmayın!
// Güvenlik için bu anahtarı bir çevre değişkeni (.env dosyası) veya güvenli bir backend üzerinden kullanın
// Bu sadece prototip geliştirme amaçlıdır
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

import { handleError, createApiError } from './errorHandler';

// SHA-1 hash fonksiyonu
async function sha1(str) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function generateDreamVisual(dreamText) {
  try {
    console.log("Görsel oluşturma başladı");
    console.log("Backend URL:", process.env.REACT_APP_API_URL);
    
    // Test endpoint'ini kontrol et
    try {
      const testResponse = await fetch(`${process.env.REACT_APP_API_URL}/test`);
      const testData = await testResponse.json();
      console.log("Backend test response:", testData);
    } catch (error) {
      throw createApiError('connection', 'Backend bağlantısı kurulamadı');
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/generate-dream-visual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dreamText })
    });

    console.log("Backend response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      
      // HTTP durum koduna göre özel hata mesajları
      switch (response.status) {
        case 429:
          throw createApiError('rate-limit', 'Çok fazla istek gönderildi');
        case 401:
          throw createApiError('invalid-key', 'API anahtarı geçersiz');
        case 500:
          throw createApiError('server-error', 'Sunucu hatası');
        default:
          throw createApiError('unknown', errorData.error || 'Görsel oluşturma hatası');
      }
    }

    const responseData = await response.json();
    console.log("Backend response:", responseData);

    if (!responseData.success) {
      throw createApiError('processing', responseData.error || 'Görsel oluşturma başarısız');
    }
    
    return {
      dataUrl: `data:image/png;base64,${responseData.data.base64Image}`,
      base64Image: responseData.data.base64Image,
      prompt: responseData.data.prompt
    };
    
  } catch (error) {
    // Hata işleme
    const handledError = handleError(error, {
      dreamText: dreamText?.substring(0, 50) + '...',
      endpoint: 'generate-dream-visual'
    });
    
    console.error("Görsel oluşturma hatası:", handledError);
    throw error; // Hatayı yukarı fırlat
  }
} 