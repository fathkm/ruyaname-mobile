// Görsel boyutlarını kontrol et
export const getOptimalImageSize = (containerWidth) => {
  // Ekran genişliğine göre optimal boyutu belirle
  if (containerWidth <= 640) return 640;  // Mobile
  if (containerWidth <= 768) return 768;  // Tablet
  if (containerWidth <= 1024) return 1024; // Laptop
  return 1280; // Desktop
};

// Lazy loading için IntersectionObserver
export const setupImageLazyLoading = (imageRef, src, onLoad) => {
  if (!window.IntersectionObserver) {
    // Fallback for older browsers
    const img = new Image();
    img.src = src;
    img.onload = onLoad;
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          if (imageRef.current) {
            imageRef.current.src = src;
            if (onLoad) onLoad();
          }
        };
        observer.disconnect();
      }
    });
  });

  if (imageRef.current) {
    observer.observe(imageRef.current);
  }

  return () => observer.disconnect();
};

// Base64 placeholder oluştur
export const createPlaceholder = (width, height, color = '#1a1a1a') => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='${color.replace('#', '%23')}'/%3E%3C/svg%3E`;
};

// Görsel URL'ini optimize et
export const getOptimizedImageUrl = (url, width) => {
  if (!url) return null;
  
  // Eğer zaten optimize edilmiş bir URL ise
  if (url.includes('width=') || url.includes('w=')) {
    return url;
  }

  try {
    const imageUrl = new URL(url);
    
    // Firebase Storage URL'i ise
    if (imageUrl.hostname.includes('firebasestorage.googleapis.com')) {
      return url; // Firebase zaten optimize ediyor
    }
    
    // Cloudinary URL'i ise
    if (imageUrl.hostname.includes('res.cloudinary.com')) {
      // Cloudinary transformasyon ekle
      return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
    }
    
    return url;
  } catch (err) {
    console.error('URL parsing error:', err);
    return url;
  }
};

// Görsel yükleme hatası işle
export const handleImageError = (event, fallbackUrl) => {
  const img = event.target;
  if (img.src !== fallbackUrl) {
    img.src = fallbackUrl;
  }
};

// WebP desteğini kontrol et
export const supportsWebP = async () => {
  if (!window.createImageBitmap) return false;

  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  try {
    const blob = await fetch(webpData).then(r => r.blob());
    return createImageBitmap(blob).then(() => true, () => false);
  } catch (err) {
    return false;
  }
}; 