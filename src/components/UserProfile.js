import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { auth, db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const sayfalar = [
  {
    kategori: "👤 Kişisel Kimlik",
    sorular: [
      { soru: "İsmin nedir?", name: "isim", tip: "text" },
      { soru: "Doğum tarihin?", name: "dogumTarihi", tip: "date" },
      { soru: "Hangi şehirde yaşıyorsun?", name: "sehir", tip: "text" },
      {
        soru: "Cinsiyetin?",
        name: "cinsiyet",
        tip: "button",
        ornekler: ["Erkek", "Kadın", "Belirtmek istemiyorum"],
      },
      {
        soru: "İlişki durumun?",
        name: "iliskiDurumu",
        tip: "button",
        ornekler: ["Bekar", "Evli", "Ayrı", "İlişkisi var", "Karmaşık"],
      },
    ],
  },
  {
    kategori: "🌙 Rüya ve Uyku Alışkanlıkları",
    sorular: [
      {
        soru: "Ne sıklıkla rüya görürsün?",
        name: "ruyaSikligi",
        tip: "button",
        ornekler: ["Her gece", "Haftada birkaç kez", "Nadiren", "Hatırlamam"],
      },
      {
        soru: "Rüyalarını nasıl hatırlarsın?",
        name: "ruyaHatirlama",
        tip: "button",
        ornekler: ["Çok net", "Bulanık", "Sadece hisler", "Hiç hatırlamam"],
      },
      {
        soru: "Hangi tür rüyalar daha çok görürsün?",
        name: "ruyaTuru",
        tip: "button",
        ornekler: ["Gerçekçi", "Fantastik", "Kabus", "Karışık", "Belirsiz"],
      },
      {
        soru: "Uyku kaliteniz nasıl?",
        name: "uykuKalitesi",
        tip: "button",
        ornekler: ["Çok iyi", "İyi", "Ortalama", "Kötü", "Çok kötü"],
      },
      {
        soru: "Genellikle kaçta uyursun?",
        name: "uykuSaati",
        tip: "button",
        ornekler: [
          "21:00-22:00",
          "22:00-23:00",
          "23:00-00:00",
          "00:00-01:00",
          "01:00+",
        ],
      },
    ],
  },
  {
    kategori: "🧠 Kişilik ve Davranış",
    sorular: [
      {
        soru: "Kendini nasıl biri olarak tanımlarsın?",
        name: "kisilikTanimi",
        tip: "button",
        ornekler: [
          "İçe dönük",
          "Dışa dönük",
          "Duygusal",
          "Mantıklı",
          "Karışık",
        ],
      },
      {
        soru: "Stresle nasıl başa çıkarsın?",
        name: "stresBasaCikma",
        tip: "button",
        ornekler: [
          "Konuşarak",
          "Yalnız kalarak",
          "Spor yaparak",
          "Uyuyarak",
          "Kaçınarak",
        ],
      },
      {
        soru: "Karar verirken neye öncelik verirsin?",
        name: "kararVerme",
        tip: "button",
        ornekler: [
          "Mantık",
          "Sezgi",
          "Duygu",
          "Deneyim",
          "Başkalarının görüşü",
        ],
      },
      {
        soru: "En çok hangi zamanda enerjin yüksek?",
        name: "enerjiZamani",
        tip: "button",
        ornekler: ["Sabah", "Öğlen", "Akşam", "Gece", "Değişken"],
      },
      {
        soru: "Değişimle ilişkin nasılsın?",
        name: "degisimIliskisi",
        tip: "button",
        ornekler: [
          "Severim",
          "Adapte olurum",
          "Zorlanırım",
          "Kaçınırım",
          "Korkutucu",
        ],
      },
    ],
  },
  {
    kategori: "💫 İç Dünya ve Duygular",
    sorular: [
      {
        soru: "Şu anki baskın duygusal halin?",
        name: "suankiDuygusal",
        tip: "button",
        ornekler: ["Umutlu", "Kaygılı", "Huzurlu", "Karışık", "Boşlukta"],
      },
      {
        soru: "Kendini en çok ne zaman mutlu hissedersin?",
        name: "mutlulukZamani",
        tip: "button",
        ornekler: [
          "Yalnızken",
          "Sevdiklerimle",
          "Başarılıyken",
          "Doğada",
          "Yaratırken",
        ],
      },
      {
        soru: "En derin korkun nedir?",
        name: "derinKorku",
        tip: "button",
        ornekler: [
          "Terkedilmek",
          "Başarısızlık",
          "Ölüm",
          "Kontrol kaybı",
          "Yalnızlık",
        ],
      },
      {
        soru: "Geçmişte seni en çok değiştiren olay?",
        name: "degistirenOlay",
        tip: "button",
        ornekler: [
          "Aşk",
          "Kayıp",
          "Başarı",
          "Hayal kırıklığı",
          "Aile değişimi",
        ],
      },
      {
        soru: "İç sesinle ilişkin nasıl?",
        name: "icSesIliskisi",
        tip: "button",
        ornekler: [
          "Güvenirim",
          "Sorgularım",
          "Karışık",
          "Duymazım",
          "Korkarım",
        ],
      },
    ],
  },
  {
    kategori: "🕌 Maneviyat ve İnanç",
    sorular: [
      {
        soru: "Maneviyatla ilişkin nasıl?",
        name: "maneviyatIliskisi",
        tip: "button",
        ornekler: ["Çok güçlü", "Arayışta", "Şüpheci", "İlgisiz", "Karmaşık"],
      },
      {
        soru: "Allah'a olan bağın?",
        name: "allahBagi",
        tip: "button",
        ornekler: ["Çok yakın", "Yakın", "Uzak", "Arayışta", "Belirsiz"],
      },
      {
        soru: "Namaz kılıyor musun?",
        name: "namazDurumu",
        tip: "button",
        ornekler: ["Düzenli", "Bazen", "Nadiren", "Hiç", "Özel zamanlarda"],
      },
      {
        soru: "Dua ediyor musun?",
        name: "duaDurumu",
        tip: "button",
        ornekler: ["Sık sık", "Zor zamanlarda", "Bazen", "Nadiren", "Hiç"],
      },
      {
        soru: "Kaderle ilişkin?",
        name: "kaderIliskisi",
        tip: "button",
        ornekler: ["İnanırım", "Kısmen", "Şüpheliyim", "İnanmam", "Karışık"],
      },
    ],
  },
  {
    kategori: "🌟 Hedefler ve Motivasyon",
    sorular: [
      {
        soru: "Hayattaki en büyük amacın?",
        name: "buyukAmac",
        tip: "button",
        ornekler: [
          "Kendimi tanımak",
          "Başarılı olmak",
          "İnsanlara faydalı olmak",
          "Huzur bulmak",
          "Sevmek-sevilmek",
        ],
      },
      {
        soru: "Seni en çok motive eden şey?",
        name: "motivasyonKaynagi",
        tip: "button",
        ornekler: [
          "Başarı",
          "Aile",
          "İnanç",
          "Kendini geliştirme",
          "Yardım etme",
        ],
      },
      {
        soru: "En çok değer verdiğin özellik?",
        name: "degerliOzellik",
        tip: "button",
        ornekler: ["Dürüstlük", "Sadakat", "Özgürlük", "Adalet", "Merhamet"],
      },
      {
        soru: "5 yıl sonra kendini nerede görüyorsun?",
        name: "gelecekVizyonu",
        tip: "button",
        ornekler: [
          "Kariyer odaklı",
          "Aile odaklı",
          "Seyahat halinde",
          "Sanat/yaratımda",
          "Belirsiz",
        ],
      },
    ],
  },
  {
    kategori: "🌍 Sosyal İlişkiler",
    sorular: [
      {
        soru: "İnsanlarla ilişkinde nasılsın?",
        name: "sosyalIliski",
        tip: "button",
        ornekler: [
          "Çok sosyal",
          "Seçici",
          "Çekingen",
          "Güven sorunu",
          "Değişken",
        ],
      },
      {
        soru: "Çevrende seni nasıl görürler?",
        name: "cevreBakisi",
        tip: "button",
        ornekler: ["Güvenilir", "Eğlenceli", "Derin", "Gizemli", "Değişken"],
      },
      {
        soru: "Ailende nasıl bir konumun var?",
        name: "aileKonumu",
        tip: "button",
        ornekler: ["Koruyucu", "Dinleyici", "İsyanci", "Barıştırıcı", "Uzak"],
      },
      {
        soru: "Arkadaşlıklarında neye öncelik verirsin?",
        name: "arkadaslikOncelik",
        tip: "button",
        ornekler: [
          "Güven",
          "Eğlence",
          "Derin konuşma",
          "Sadakat",
          "Ortak ilgiler",
        ],
      },
    ],
  },
  {
    kategori: "⚡ Zorluklar ve Başa Çıkma",
    sorular: [
      {
        soru: "Şu anda en büyük zorluğun?",
        name: "guncelZorluk",
        tip: "button",
        ornekler: [
          "Maddi sıkıntı",
          "İlişki problemi",
          "Kariyer belirsizliği",
          "Sağlık",
          "Aile meseleleri",
        ],
      },
      {
        soru: "Üzüldüğünde ne yaparsın?",
        name: "uzuldugundeYapar",
        tip: "button",
        ornekler: [
          "Ağlarım",
          "Müzik dinlerim",
          "Yalnız kalırım",
          "Konuşurum",
          "Dua ederim",
        ],
      },
      {
        soru: "Geçmişte yaşadığın en büyük kayıp?",
        name: "buyukKayip",
        tip: "button",
        ornekler: [
          "Sevdiğini kaybetme",
          "İş/okul",
          "Sağlık",
          "Güven",
          "Masumiyet",
        ],
      },
      {
        soru: "Öfkelendiğinde nasıl tepki verirsin?",
        name: "ofkeTepkisi",
        tip: "button",
        ornekler: [
          "Patlak veririm",
          "İçime atarım",
          "Konuşurum",
          "Uzaklaşırım",
          "Sessizleşirim",
        ],
      },
    ],
  },
  {
    kategori: "💭 Kişisel Paylaşım",
    sorular: [
      {
        soru: "Seni daha iyi tanımamız için bizimle paylaşmak istediğin özel bir şey var mı? (Deneyimler, düşünceler, hayaller...)",
        name: "kisiselPaylasim",
        tip: "textarea",
        placeholder:
          "İsteğe bağlı - Bu alan tamamen sana ait. Kendini ifade et, hikayeni anlat, ya da aklına gelen her şeyi paylaş...",
      },
    ],
  },
];

const hesaplaProfilTamamlanma = (data) => {
  let toplamSoru = 0;
  let cevaplanmis = 0;
  sayfalar.forEach((sayfa) => {
    sayfa.sorular.forEach((soru) => {
      toplamSoru++;
      if (data[soru.name] && data[soru.name].toString().trim() !== "") {
        cevaplanmis++;
      }
    });
  });
  return Math.round((cevaplanmis / toplamSoru) * 100);
};

const IlerlemeCubugu = ({ yuzde, currentPage, totalPages, theme }) => (
  <View style={[styles.progressContainer, { backgroundColor: theme?.colors?.primary || '#222' }]}> 
    <View style={styles.pageDotsContainer}>
      {Array.from({ length: totalPages }, (_, i) => (
        <View
          key={i}
          style={[
            styles.pageDot,
            {
              backgroundColor:
                i === currentPage
                  ? (theme?.colors?.gold || '#FFD700')
                  : 'rgba(255,215,0,0.2)',
            },
          ]}
        />
      ))}
    </View>
    <View style={styles.progressBarBg}>
      <View
        style={[
          styles.progressBarFill,
          {
            width: `${yuzde}%`,
            backgroundColor: theme?.colors?.gold || '#FFD700',
          },
        ]}
      />
    </View>
    <View style={styles.progressLabelRow}>
      <Text style={[styles.progressLabel, { color: theme?.colors?.gold || '#FFD700' }]}>Profil Tamamlanma</Text>
      <Text style={[styles.progressPercent, { color: theme?.colors?.gold || '#FFD700' }]}>{yuzde}%</Text>
    </View>
  </View>
);

const ProfilKarti = ({ baslik, deger, icon, theme }) => (
  <View style={[styles.profileCard, { backgroundColor: theme?.colors?.secondary || '#222' }]}> 
    <View style={styles.profileCardHeader}>
      <Text style={[styles.profileCardIcon, { color: theme?.colors?.gold || '#FFD700' }]}>{icon}</Text>
      <Text style={[styles.profileCardTitle, { color: theme?.colors?.gold || '#FFD700' }]}>{baslik}</Text>
    </View>
    <Text style={[styles.profileCardValue, { color: theme?.colors?.textPrimary || '#fff' }]}>{deger || "Belirtilmemiş"}</Text>
  </View>
);

export default function UserProfile({ onComplete, onCancel, initialData, theme = {} }) {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(() => initialData || {});
  const [tamamlanmaYuzdesi, setTamamlanmaYuzdesi] = useState(0);

  useEffect(() => {
    setTamamlanmaYuzdesi(hesaplaProfilTamamlanma(data));
  }, [data]);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      try {
        if (!initialData) {
          const userDoc = await getDoc(doc(db, "userProfiles", auth.currentUser.uid));
          if (userDoc.exists()) {
            setData(userDoc.data());
          }
        }
      } catch (error) {
        // Hata yönetimi
      } finally {
        setLoading(false);
      }
    };
    loadUserProfile();
  }, [initialData]);

  const handleChange = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const ileri = async () => {
    if (page < sayfalar.length - 1) {
      setPage((prev) => prev + 1);
    } else {
      try {
        await onComplete(data);
      } catch (error) {}
    }
  };

  const renderProfilOzeti = () => {
    const hesaplaYas = (dogumTarihi) => {
      if (!dogumTarihi) return "Belirtilmemiş";
      const dogum = new Date(dogumTarihi);
      const bugun = new Date();
      let yas = bugun.getFullYear() - dogum.getFullYear();
      const ayFark = bugun.getMonth() - dogum.getMonth();
      if (ayFark < 0 || (ayFark === 0 && bugun.getDate() < dogum.getDate())) {
        yas--;
      }
      return `${yas} yaşında`;
    };
    return (
      <View style={{ marginBottom: 32 }}>
        <Text style={styles.profileSummaryTitle}>✨ Profil Özeti</Text>
        <ProfilKarti baslik="İSİM" deger={data.isim} icon="👤" theme={theme} />
        <ProfilKarti baslik="YAŞ" deger={hesaplaYas(data.dogumTarihi)} icon="📅" theme={theme} />
        <ProfilKarti baslik="RÜYA SIKLIĞI" deger={data.ruyaSikligi} icon="🌙" theme={theme} />
        <ProfilKarti baslik="KİŞİLİK" deger={data.kisilikTanimi} icon="🧠" theme={theme} />
        <ProfilKarti baslik="DUYGUSAL HAL" deger={data.suankiDuygusal} icon="💫" theme={theme} />
        <ProfilKarti baslik="MANEVİYAT" deger={data.maneviyatIliskisi} icon="🕌" theme={theme} />
        <ProfilKarti baslik="BÜYÜK AMAÇ" deger={data.buyukAmac} icon="🌟" theme={theme} />
        <ProfilKarti baslik="GÜNCEL ZORLUK" deger={data.guncelZorluk} icon="⚡" theme={theme} />
        {data.kisiselPaylasim ? (
          <ProfilKarti baslik="KİŞİSEL PAYLAŞIM" deger={data.kisiselPaylasim} icon="💭" theme={theme} />
        ) : null}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.loadingEmoji}>✨</Text>
          <Text style={[styles.loadingText, { color: theme?.colors?.gold || '#FFD700' }]}>Profil yükleniyor...</Text>
        </View>
      </View>
    );
  }

  const current = sayfalar[page];

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View style={styles.innerContainer}>
        <IlerlemeCubugu yuzde={tamamlanmaYuzdesi} currentPage={page} totalPages={sayfalar.length} theme={theme} />
        <View style={styles.card}>
          {page === sayfalar.length ? (
            renderProfilOzeti()
          ) : (
            <>
              <Text style={[styles.categoryTitle, { color: theme?.colors?.gold || '#FFD700' }]}>{current.kategori}</Text>
              <Text style={styles.pageIndicator}>Sayfa {page + 1} / {sayfalar.length}</Text>
              {current.sorular.map((s, index) => (
                <View key={index} style={styles.questionBlock}>
                  <Text style={styles.questionText}>{s.soru}</Text>
                  {s.tip === "button" ? (
                    <View style={styles.buttonGrid}>
                      {s.ornekler.map((secenek) => (
                        <TouchableOpacity
                          key={secenek}
                          onPress={() => handleChange(s.name, secenek)}
                          style={[
                            styles.optionButton,
                            data[s.name] === secenek && styles.optionButtonSelected,
                            data[s.name] === secenek && { borderColor: theme?.colors?.gold || '#FFD700', backgroundColor: 'rgba(255,215,0,0.2)' },
                          ]}
                        >
                          <Text style={[
                            styles.optionButtonText,
                            data[s.name] === secenek && { color: '#000', fontWeight: 'bold' },
                          ]}>{secenek}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : s.tip === "textarea" ? (
                    <TextInput
                      value={data[s.name] || ""}
                      onChangeText={(text) => handleChange(s.name, text)}
                      placeholder={s.placeholder || "Cevabınızı yazın..."}
                      multiline
                      numberOfLines={6}
                      style={styles.textArea}
                      placeholderTextColor={theme?.colors?.textSecondary || '#aaa'}
                    />
                  ) : (
                    <TextInput
                      value={data[s.name] || ""}
                      onChangeText={(text) => handleChange(s.name, text)}
                      placeholder="Cevabınızı yazın..."
                      style={styles.input}
                      placeholderTextColor={theme?.colors?.textSecondary || '#aaa'}
                    />
                  )}
                </View>
              ))}
              <View style={styles.buttonRow}>
                {page > 0 && (
                  <TouchableOpacity onPress={() => setPage((prev) => prev - 1)} style={styles.backButton}>
                    <Text style={styles.backButtonText}>⬅️ Geri</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={ileri} style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>{page === sayfalar.length - 1 ? "Kaydet ✨" : "Devam Et ➡️"}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  root: {
    minHeight: '100%',
    padding: 16,
    backgroundColor: 'transparent',
  },
  innerContainer: {
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center',
  },
  progressContainer: {
    borderRadius: 20,
    marginBottom: 24,
    padding: 18,
    elevation: 2,
  },
  pageDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 6,
  },
  pageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontWeight: '500',
    fontSize: 15,
  },
  progressPercent: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#222',
    padding: 24,
    borderRadius: 24,
    elevation: 3,
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 22,
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pageIndicator: {
    textAlign: 'center',
    marginBottom: 18,
    color: '#aaa',
    fontSize: 15,
  },
  questionBlock: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 12,
    color: '#fff',
    fontWeight: '400',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(255,215,0,0.2)',
    borderColor: '#FFD700',
  },
  optionButtonText: {
    fontSize: 15,
    color: '#FFD700',
  },
  textArea: {
    width: '100%',
    minHeight: 120,
    padding: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: '#FFD700',
    marginRight: 8,
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 15,
    backgroundColor: '#FFD700',
    borderWidth: 0,
    marginLeft: 8,
  },
  nextButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    minHeight: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
  profileSummaryTitle: {
    color: '#FFD700',
    marginBottom: 32,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    backgroundColor: '#222',
    elevation: 2,
  },
  profileCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileCardIcon: {
    marginRight: 8,
    fontSize: 20,
  },
  profileCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileCardValue: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '400',
  },
});
