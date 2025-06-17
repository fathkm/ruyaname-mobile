import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, query, where, doc, updateDoc, increment, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const theme = {
  colors: {
    primary: '#1a2233',
    secondary: '#22304a',
    gold: '#FFD700',
    goldBackground: 'rgba(255, 215, 0, 0.08)',
    textPrimary: '#fff',
    error: '#ff4444',
    errorBackground: 'rgba(255, 68, 68, 0.1)',
    border: '#FFD700',
  },
  gradients: {
    primaryToSecondary: '#0d1b2a',
  },
  effects: {
    blur: 'blur(10px)',
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    cardLarge: {
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 4,
    },
  },
};

export default function Ruyahane({ onToggleSideMenu, showSideMenu }) {
  const [ruyalar, setRuyalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const fetchRuyalar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const q = query(
        collection(db, 'ruyalar'),
        where('public', '==', true),
        limit(50)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setRuyalar([]);
        setLoading(false);
        return;
      }
      const paylasilanRuyalar = [];
      snapshot.forEach((doc) => {
        const ruyaData = doc.data();
        paylasilanRuyalar.push({
          id: doc.id,
          ...ruyaData,
        });
      });
      paylasilanRuyalar.sort((a, b) => {
        const dateA = a.tarih?.toDate?.() || new Date(0);
        const dateB = b.tarih?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
      setRuyalar(paylasilanRuyalar);
    } catch (err) {
      setError('Rüyaları yüklerken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [refreshCounter]);

  useEffect(() => {
    fetchRuyalar();
  }, [fetchRuyalar]);

  const refreshRuyalar = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  const handleLike = async (id) => {
    try {
      const ref = doc(db, 'ruyalar', id);
      await updateDoc(ref, {
        likes: increment(1),
      });
      setRuyalar((prev) =>
        prev.map((r) => (r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r))
      );
    } catch (err) {
      Alert.alert('Hata', 'Beğeni işlemi başarısız.');
    }
  };

  const renderRuyaImage = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return null;
    }
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.dreamImage}
          resizeMode="contain"
        />
      </View>
    );
  };

  const renderRuyaKarti = (ruya) => {
    const tarihStr = ruya.tarih?.toDate
      ? format(ruya.tarih.toDate(), 'dd.MM.yyyy HH:mm', { locale: tr })
      : 'Tarih yok';
    return (
      <View key={ruya.id} style={[styles.card, styles.cardLarge]}>
        {renderRuyaImage(ruya.gorsel)}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>📝 Rüya İçeriği</Text>
          <Text style={styles.sectionText}>{ruya.metin}</Text>
        </View>
        <View style={styles.sectionBoxGold}>
          <Text style={styles.sectionTitle}>🔮 Rüya Tabiri</Text>
          <Text style={styles.sectionText}>{ruya.tabir || ruya.yorum || 'Bu rüya henüz tabir edilmemiş.'}</Text>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterText}>
            {ruya.ruyaSahibi ? `👤 ${ruya.ruyaSahibi}` : ''}
            {ruya.ruyaSahibi && ruya.yorumcu ? ' | ' : ''}
            {ruya.yorumcu ? `🔮 ${ruya.yorumcu}` : ''}
            {ruya.ruyaSahibi || ruya.yorumcu ? ' | ' : ''}
            📅 {tarihStr}
          </Text>
          <TouchableOpacity style={styles.likeButton} onPress={() => handleLike(ruya.id)}>
            <Text style={styles.likeButtonText}>❤️ {ruya.likes || 0}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Örnek rüyalar (mobilde de gösterilecek)
  const ornekRuyalar = [
    {
      id: 'ornek-1',
      metin:
        'Rüyamda büyük bir bahçede yürüyordum. Etrafımda rengarenk çiçekler vardı ve arılar vızıldıyordu. Sonra bir ağacın altında oturdum ve dinledim kuş seslerini.',
      tabir:
        'Bahçe, kalbin manevî hâlidir. Rengarenk çiçekler amel-i sâlih meyvelerini, arılar da rızık getiren sebepleri işâret eder. Bu rüya, kalbinizin temizliğinden ve salih amellerinizden dolayı Allah\'ın size ihsan edeceği nimetlerin müjdesidir.',
      tarih: { toDate: () => new Date('2024-01-15') },
      yorumcu: 'İmam Gazali',
      ruyaSahibi: 'M*****',
      likes: 12,
      public: true,
    },
    {
      id: 'ornek-2',
      metin:
        'Denizde yüzüyordum, su çok berraktı. Altımda renkli balıklar yüzüyordu. Sonra sahile çıktım ve kumda yürürken inciler buldum.',
      tabir:
        'Deniz, ilmin ve hikmetin sembolüdür. Berrak suda yüzmek, kalbin safiyetini ve hakikate yakınlığınızı gösterir. Renkli balıklar, çeşitli ilimlerden faydalanacağınızı; inciler ise edindiğiniz ilimlerin değerli hikmete dönüşeceğini müjdeler.',
      tarih: { toDate: () => new Date('2024-01-14') },
      yorumcu: 'İbn Arabi',
      ruyaSahibi: 'A*****',
      likes: 8,
      public: true,
    },
    {
      id: 'ornek-3',
      metin:
        'Yüksek bir dağın tepesindeyim. Etrafıma bakıyorum, şehir çok uzakta görünüyor. Bir kartal yanımdan uçup gitti. Sonra aşağı inerken bir çeşme gördüm ve su içtim.',
      tabir:
        'Dağın tepesi, ruhani makamlara işarettir. Kartal, âli himmet ve yüksek gayenin remzidir. Çeşme suyu içmek, ledün ilminden ve manevî feyzden nasiplenmek demektir. Bu rüya, sulûk yolunda ilerleyeceğinizin müjdesidir.',
      tarih: { toDate: () => new Date('2024-01-13') },
      yorumcu: 'Şems-i Tebrizi',
      ruyaSahibi: 'S*****',
      likes: 15,
      public: true,
    },
    {
      id: 'ornek-4',
      metin:
        'Eski evimizin bahçesinde büyükannemle oturuyoruz. Elinde bir tespih var, dua ediyor. Sonra bana elma verdi, çok tatlıydı. Uyandığımda çok huzurluydum.',
      tabir:
        'Vefat etmiş büyükanne, bereket ve rahmetin müjdecisidir. Tespih, zikrin bereketini; elma ise îmanın tatlılığını ifade eder. Bu rüya, ecdadınızın dualarının size ulaştığını ve manevî miraslarından faydalanacağınızı gösterir.',
      tarih: { toDate: () => new Date('2024-01-12') },
      yorumcu: 'Hz. Yusuf',
      ruyaSahibi: 'F*****',
      likes: 22,
      public: true,
    },
    {
      id: 'ornek-5',
      metin:
        'Bir kitapçıdayım, raflar dolu kitapla. Bir kitap açtım, sayfaları altın harflerle yazılmış. Kitabı okurken anlayamadığım bir dil vardı ama sanki anlıyormuşum gibi hissediyordum.',
      tabir:
        'Bilinçaltınız, sembolik dili kullanarak sizinle iletişim kuruyor. Altın harfler, değerli içgörüleri temsil eder. Anlamadığınız halde anlıyor olmanız, sezgisel zekanızın geliştiğini ve gizli bilgilere erişiminizin açılacağını gösterir.',
      tarih: { toDate: () => new Date('2024-01-11') },
      yorumcu: 'Carl Jung',
      ruyaSahibi: 'E*****',
      likes: 9,
      public: true,
    },
  ];

  return (
    <ScrollView style={styles.background} contentContainerStyle={styles.content}>
      {/* HAMBURGER MENÜ BUTONU */}
      {!showSideMenu && (
        <TouchableOpacity style={styles.menuButton} onPress={onToggleSideMenu}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
      )}
      <View style={styles.innerContainer}>
        <View style={styles.headerBox}>
          <Text style={styles.headerTitle}>🏛️ Rüyahane</Text>
          <View style={styles.headerLine} />
        </View>
        <Text style={styles.headerDesc}>Tabir edilmiş rüyalar burada paylaşılır</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshRuyalar}>
          <Text style={styles.refreshButtonText}>🔄 Rüyaları Yenile</Text>
        </TouchableOpacity>
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {loading ? (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingEmoji}>⏳</Text>
            <Text style={styles.loadingText}>Rüyalar yükleniyor...</Text>
          </View>
        ) : ruyalar.length === 0 || ruyalar.length < 3 ? (
          <View style={{ width: '100%' }}>
            {ruyalar.map(renderRuyaKarti)}
            <Text style={styles.sampleTitle}>📚 Örnek Rüya Tabirleri</Text>
            {ornekRuyalar.slice(0, 5).map(renderRuyaKarti)}
            {ruyalar.length === 0 && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  💡 Yukarıdaki örnekler sadece gösterim amaçlıdır. Kendi rüyanızı tabir ettirmek için ana sayfaya gidin.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={{ width: '100%' }}>
            {ruyalar.map(renderRuyaKarti)}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: theme.gradients.primaryToSecondary,
  },
  content: {
    padding: 12,
    alignItems: 'center',
    paddingBottom: 40,
  },
  menuButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    backgroundColor: theme.colors.secondary,
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuButtonText: {
    color: theme.colors.gold,
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    marginTop: 60,
  },
  headerBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.6)',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTitle: {
    color: theme.colors.gold,
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerLine: {
    width: 60,
    height: 3,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 0,
    alignSelf: 'center',
  },
  headerDesc: {
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0.8,
    fontSize: 15,
  },
  refreshButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginBottom: 18,
    backgroundColor: theme.colors.goldBackground,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gold,
  },
  refreshButtonText: {
    color: theme.colors.gold,
    fontSize: 16,
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: theme.colors.errorBackground,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 15,
    textAlign: 'center',
  },
  loadingBox: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    padding: 32,
    marginBottom: 16,
  },
  loadingEmoji: {
    fontSize: 32,
    marginBottom: 8,
    color: theme.colors.gold,
  },
  loadingText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  sampleTitle: {
    color: theme.colors.gold,
    textAlign: 'center',
    marginVertical: 24,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    padding: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  infoText: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    opacity: 0.8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 18,
    ...theme.shadows.card,
  },
  cardLarge: {
    ...theme.shadows.cardLarge,
  },
  sectionBox: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  sectionBoxGold: {
    backgroundColor: theme.colors.goldBackground,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  sectionTitle: {
    color: theme.colors.gold,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionText: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'left',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dreamImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#222',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 10,
    marginTop: 8,
  },
  cardFooterText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    opacity: 0.7,
  },
  likeButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 0,
  },
  likeButtonText: {
    color: theme.colors.gold,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
