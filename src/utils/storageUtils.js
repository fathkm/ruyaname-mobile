import { ref, uploadString, getDownloadURL } from 'firebase/storage';

// URL'den görseli Firebase Storage'a yükle
export const uploadImageToFirebaseStorage = async (storage, imageUrl, path) => {
  try {
    // Görsel URL'sini fetch ile al
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Blob'u base64'e çevir
    const reader = new FileReader();
    const base64Promise = new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
    });
    reader.readAsDataURL(blob);
    const base64Data = await base64Promise;

    // Storage referansını oluştur
    const storageRef = ref(storage, `ruya-gorselleri/${path}`);

    // Base64 veriyi yükle
    await uploadString(storageRef, base64Data, 'data_url');

    // Yüklenen dosyanın URL'sini al
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Firebase Storage yükleme hatası:', error);
    throw new Error('Görsel Firebase Storage\'a yüklenirken bir hata oluştu');
  }
}; 