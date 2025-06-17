import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { yorumcuPromptlari } from './yorumcular/yorumcuPromptlari';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { generateDreamVisual } from '../utils/generateDreamVisual';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const yorumcular = [
  {
    isim: 'Hz. Yusuf',
    bio: 'Hz. Yusuf, vahiy ile yönlendirilen rüya tabirlerinin ilki olarak bilinir.',
    img: require('../../assets/hzyusuf.png'),
  },
  {
    isim: 'İmam Gazali',
    bio: 'Gazali, tasavvufi derinliği ve kalp merkezli yaklaşımıyla tanınır.',
    img: require('../../assets/gazali.png'),
  },
  {
    isim: 'İbn Arabi',
    bio: 'İbn Arabi, sembolik ve derin rüya yorumlarının öncüsüdür.',
    img: require('../../assets/ibnarabi.png'),
  },
  {
    isim: 'Şems-i Tebrizî',
    bio: 'Mevlânâ\'nın gönül rehberi olarak sezgisel tabirleriyle öne çıkar.',
    img: require('../../assets/sems.png'),
  },
  {
    isim: 'Mevlânâ',
    bio: 'Aşk merkezli, derin ruhsal tabirlerle kalplere hitap eder.',
    img: require('../../assets/mevlana.png'),
  },
  {
    isim: 'Carl Jung',
    bio: 'Rüyaları bilinçdışının dili olarak gören psikoloji öncüsüdür.',
    img: require('../../assets/jung.png'),
  },
  {
    isim: 'Rüyacı Dede',
    bio: 'Geleneksel halk yorumlarıyla tanınan sıcak bir halk figürüdür.',
    img: require('../../assets/ruyacidede.png'),
  },
];

const DETAYLI_DUYGULAR = {
  mutluluk: [
    'mutlu', 'sevinç', 'neşe', 'huzur', 'keyif', 'güzel', 'hoş', 'tatmin',
  ],
  üzüntü: ['üzgün', 'keder', 'acı', 'hüzün', 'ağlamak', 'mutsuz', 'çaresiz'],
  korku: ['korku', 'endişe', 'kaygı', 'tedirgin', 'tehlike', 'tehdit', 'panik'],
  öfke: ['öfke', 'kızgın', 'sinir', 'hiddet', 'nefret', 'kızgınlık', 'rahatsız'],
  heyecan: ['heyecan', 'coşku', 'tutku', 'merak', 'şaşkınlık', 'hayret'],
  sevgi: ['sevgi', 'aşk', 'şefkat', 'merhamet', 'yakınlık', 'dostluk'],
  manevi: ['inanç', 'dua', 'maneviyat', 'ruhsal', 'spiritüel', 'kutsal'],
};

const YASAM_ALANLARI = {
  iş: ['iş', 'çalışma', 'kariyer', 'ofis', 'meslek', 'başarı', 'proje'],
  ilişkiler: [
    'aile', 'arkadaş', 'sevgili', 'eş', 'partner', 'evlilik', 'çocuk',
  ],
  sağlık: ['sağlık', 'hastalık', 'tedavi', 'iyileşme', 'hastane', 'doktor'],
  eğitim: ['okul', 'öğrenim', 'eğitim', 'öğretmen', 'ders', 'sınav', 'başarı'],
  manevi: ['ibadet', 'dua', 'inanç', 'din', 'maneviyat', 'ruhsal gelişim'],
  sosyal: ['toplum', 'sosyal', 'arkadaşlık', 'etkinlik', 'organizasyon'],
};

const bildirKullaniciya = async (mesaj) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  try {
    await addDoc(collection(db, 'bildirimler'), {
      uid,
      mesaj,
      okundu: false,
      tarih: serverTimestamp(),
    });
  } catch (err) {
    console.error('📢 Bildirim eklenemedi:', err);
  }
};
// ... mevcut kod ...

export default function PremiumNotice({ onBack, userProfile }) {
  const ruya = useSelector((state) => state.app.ruya);
  const selectedYorumcu = useSelector((state) => state.app.seciliYorumcu);
  const [step, setStep] = useState(1);
  const [firstComment, setFirstComment] = useState("");
  const [systemQuestion, setSystemQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [secondComment, setSecondComment] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [userQuestionAnswer, setUserQuestionAnswer] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [permanentImageUrl, setPermanentImageUrl] = useState(null);
  const [isImageProcessed, setIsImageProcessed] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [kaydedildi, setKaydedildi] = useState(false);
  const [detayliAnaliz, setDetayliAnaliz] = useState(null);
  const [yasamAlanlariAnalizi, setYasamAlanlariAnalizi] = useState(null);
  const [trendAnalizi, setTrendAnalizi] = useState(null);
  const [imageData, setImageData] = useState(null);

  // Detaylı analiz fonksiyonları
  const detayliDuyguAnalizi = (metin) => {
    const analiz = {};
    Object.entries(DETAYLI_DUYGULAR).forEach(([duygu, kelimeler]) => {
      analiz[duygu] = kelimeler.reduce((count, kelime) => {
        const regex = new RegExp(kelime, "gi");
        const matches = (metin.match(regex) || []).length;
        return count + matches;
      }, 0);
    });
    return analiz;
  };

  const yasamAlanlariAnaliziYap = (metin) => {
    const analiz = {};
    Object.entries(YASAM_ALANLARI).forEach(([alan, kelimeler]) => {
      analiz[alan] = kelimeler.reduce((count, kelime) => {
        const regex = new RegExp(kelime, "gi");
        const matches = (metin.match(regex) || []).length;
        return count + matches;
      }, 0);
    });
    return analiz;
  };

  // Trend analizi fonksiyonu
  const trendAnaliziYap = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      const q = query(collection(db, "ruyalar"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const ruyalar = [];
      querySnapshot.forEach((doc) => {
        ruyalar.push(doc.data());
      });
      const sonOtuzGun = new Date();
      sonOtuzGun.setDate(sonOtuzGun.getDate() - 30);
      const trendler = ruyalar
        .filter((r) => r.tarih?.toDate() > sonOtuzGun)
        .reduce((acc, ruya) => {
          const duygular = detayliDuyguAnalizi(ruya.metin);
          Object.entries(duygular).forEach(([duygu, sayi]) => {
            acc[duygu] = (acc[duygu] || 0) + sayi;
          });
          return acc;
        }, {});
      setTrendAnalizi(trendler);
    } catch (error) {
      console.error("Trend analizi yapılırken hata:", error);
    }
  };

  useEffect(() => {
    const fetchFirst = async () => {
      if (!ruya || !selectedYorumcu) return;
      setLoading(true);
      // Analizleri yap
      const duygusalAnaliz = detayliDuyguAnalizi(ruya);
      const yasamAnalizi = yasamAlanlariAnaliziYap(ruya);
      setDetayliAnaliz(duygusalAnaliz);
      setYasamAlanlariAnalizi(yasamAnalizi);
      trendAnaliziYap();
      try {
        let prompt;
        if (yorumcuPromptlari && yorumcuPromptlari[selectedYorumcu]?.first) {
          prompt = yorumcuPromptlari[selectedYorumcu].first(
            ruya,
            userProfile?.isim || "misafir"
          );
        } else {
          prompt = `Sen deneyimli bir rüya yorumcususun, ${selectedYorumcu} karakterini canlandırıyorsun.\nTürkçe konuşuyorsun ve kullanıcıya \"sen\" diye hitap ediyorsun.\n\n📌 Kullanıcı profili:\nİsim: ${userProfile?.isim || "misafir"}\n\n📌 Kullanıcının Rüyası:\n\"\"\"${ruya}\"\"\"\n\nBu rüyayı ${selectedYorumcu} karakterine uygun bir şekilde, detaylı ve etkileyici bir şekilde yorumla.\nYorumun sonunda kullanıcının içsel yolculuğunu destekleyecek, etkileyici bir mesaj bırak.`;
        }
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.85,
          }),
        });
        if (!res.ok) {
          throw new Error(`API yanıt vermedi: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        const firstCommentText =
          data.choices?.[0]?.message?.content || "⚠️ Cevap alınamadı.";
        setFirstComment(firstCommentText);
        const questionPrompt = `Sen ${selectedYorumcu} karakterindesin ve bir rüya yorumcususun. Az önce aşağıdaki rüyayı yorumladın:\n\"\"\"${ruya}\"\"\"\n\nYorumun:\n\"\"\"${firstCommentText}\"\"\"\n\nŞimdi bu rüya sahibine, rüyasıyla veya yorumunla ilgili daha derinlemesine düşünmesini sağlayacak bir soru sor. \nBu soru, rüyayı daha iyi anlamlandırmasına yardımcı olacak, onun iç dünyasını keşfetmesini sağlayacak türden olmalı.\nSadece tek bir soru sor ve nazik ol. Soru kısa ve öz olsun.`;
        const questionRes = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-4",
              messages: [{ role: "user", content: questionPrompt }],
              temperature: 0.8,
            }),
          }
        );
        if (!questionRes.ok) {
          throw new Error(`Soru API yanıt vermedi: ${questionRes.status}`);
        }
        const questionData = await questionRes.json();
        setSystemQuestion(
          questionData.choices?.[0]?.message?.content ||
            "Bu rüya hakkında ne düşünüyorsun?"
        );
      } catch (err) {
        console.error("İlk yorum veya soru alınamadı:", err);
        setFirstComment("⚠️ İlk yorum alınırken hata oluştu: " + err.message);
        setSystemQuestion("Bu rüya hakkında ne düşünüyorsun?");
      }
      setLoading(false);
    };
    fetchFirst();
  }, [ruya, selectedYorumcu, userProfile]);

  // İkinci yorumu oluşturacak fonksiyon
  const fetchSecondComment = async () => {
    if (!ruya || !userAnswer || !selectedYorumcu) return;
    setLoading(true);
    try {
      const secondPrompt = `
Sen ${selectedYorumcu} karakterindesin ve bir rüya yorumcususun. Az önce aşağıdaki rüyayı yorumladın:
\"\"\"${ruya}\"\"\"

İlk yorumun:
\"\"\"${firstComment}\"\"\"

Sonra şu soruyu sordun:
\"\"\"${systemQuestion}\"\"\"

Rüya sahibinin cevabı:
\"\"\"${userAnswer}\"\"\"

Şimdi bu cevaba dayanarak ek bir yorum yap. Onun cevabındaki detaylara değin, içgörüler sun ve anlayışlı ol.
Yorumun samimi ve yardımcı olsun. Uzun bir cevap verme, 2-3 paragraf yeterli.
`;
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: secondPrompt }],
          temperature: 0.85,
        }),
      });
      if (!res.ok) {
        throw new Error(`API yanıt vermedi: ${res.status}`);
      }
      const data = await res.json();
      setSecondComment(
        data.choices?.[0]?.message?.content || "⚠️ İkinci yorum alınamadı."
      );
      setStep(2);
    } catch (err) {
      console.error("İkinci yorum alınamadı:", err);
      setSecondComment("⚠️ İkinci yorum alınırken hata oluştu: " + err.message);
      setStep(2);
    }
    setLoading(false);
  };

  // Kullanıcının kendi sorusuna cevap alacak fonksiyon
  const fetchUserQuestionAnswer = async () => {
    if (!userQuestion.trim() || !ruya || !selectedYorumcu) return;
    setLoading(true);
    try {
      let prompt;
      if (yorumcuPromptlari && yorumcuPromptlari[selectedYorumcu]?.question) {
        prompt = yorumcuPromptlari[selectedYorumcu].question(
          ruya,
          userQuestion,
          userProfile?.isim || "misafir"
        );
      } else {
        prompt = `
Sen deneyimli ve içten bir rüya yorumcusun, ${selectedYorumcu} karakterini canlandırıyorsun. 
Türkçe konuşuyorsun ve kullanıcıya "sen" diye hitap ediyorsun.

📌 Kullanıcı profili:
İsim: ${userProfile?.isim || "misafir"}

📌 Kullanıcının Rüyası:
\"\"\"${ruya}\"\"\"

📌 Kullanıcının Sorusu:
\"\"\"${userQuestion}\"\"\"

Bu soruya ${selectedYorumcu} olarak, karakterine uygun bir şekilde cevap ver.
Nazik, yardımsever ve bilge bir tavırla yanıtla.
Cevabın 2-3 paragrafı geçmesin.
        `;
      }
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.85,
        }),
      });
      if (!res.ok) {
        throw new Error(`API yanıt vermedi: ${res.status}`);
      }
      const data = await res.json();
      const result =
        data.choices?.[0]?.message?.content || "⚠️ Cevap alınamadı.";
      setUserQuestionAnswer(result);
      setStep(4);
    } catch (err) {
      console.error("Soru yanıtı alınamadı:", err);
      setUserQuestionAnswer(
        "⚠️ Yanıt alınırken bir hata oluştu. Lütfen tekrar deneyin."
      );
      setStep(4);
    }
    setLoading(false);
  };

  // Firestore'a kaydetme fonksiyonu
  const saveDreamToFirestore = async (isPublic) => {
    if (!ruya || !selectedYorumcu || !auth.currentUser || !permanentImageUrl) {
      if (!permanentImageUrl) {
        Alert.alert(
          "Uyarı",
          "Rüya görseli henüz işleniyor veya işlenemedi. Lütfen biraz bekleyin ve tekrar deneyin. Görsel olmadan kayıt yapılamaz."
        );
      }
      return false;
    }
    if (kaydedildi && isPublic) {
      Alert.alert("Bilgi", "Bu rüya zaten daha önce paylaşıldı.");
      return true;
    }
    if (kaydedildi && !isPublic) {
      return true;
    }
    setLoading(true);
    const fullInterpretation = `
İlk Yorum (${selectedYorumcu}):
${firstComment}

Sistemin Sorusu:
${systemQuestion}
Kullanıcının Cevabı:
${userAnswer}

İkinci Yorum (${selectedYorumcu} - Kullanıcı Cevabına Göre):
${secondComment}

Kullanıcının Sorusu:
${userQuestion || "Sorulmadı"}
Yorumcunun Cevabı (${selectedYorumcu}):
${userQuestionAnswer || "Sorulmadı"}
    `.trim();
    const dreamData = {
      uid: auth.currentUser.uid,
      metin: ruya,
      yorumcu: selectedYorumcu,
      isPremium: true,
      public: isPublic,
      yorum: fullInterpretation,
      tabir: firstComment,
      gorsel: permanentImageUrl,
      tarih: serverTimestamp(),
      guncellemeTarihi: serverTimestamp(),
      sistemSorusu: systemQuestion,
      kullaniciCevabi: userAnswer,
      ikinciYorum: secondComment,
      kullaniciSorusu: userQuestion || null,
      kullaniciSorusuCevabi: userQuestionAnswer || null,
    };
    try {
      const docRef = await addDoc(collection(db, "ruyalar"), dreamData);
      setKaydedildi(true);
      bildirKullaniciya(
        `Premium rüyanız ve yorumu başarıyla ${isPublic ? "paylaşıldı" : "kaydedildi"}!`
      );
      return true;
    } catch (error) {
      console.error("Firestore'a rüya kaydetme hatası:", error);
      Alert.alert("Hata", "Rüyanız kaydedilirken bir sorun oluştu. Lütfen tekrar deneyin.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // JSX
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.closeButton} onPress={onBack}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🌙 Premium Yorum</Text>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      )}
      {/* Step 1: İlk yorum, sistem sorusu, kullanıcı cevabı alanı */}
      {!loading && step === 1 && (
        <>
          <View style={styles.section}>
            {generatingImage ? (
              <View style={styles.generatingImageContainer}>
                <Text style={styles.generatingImageTitle}>🎨 Rüya Görseli Oluşturuluyor</Text>
                <ActivityIndicator size="large" color="#FFD700" style={{ marginVertical: 20 }} />
              </View>
            ) : imageData ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageData.dataUrl }} style={styles.dreamImage} resizeMode="contain" />
              </View>
            ) : null}
          </View>
          <View style={styles.commentBox}>
            <Text style={styles.commentText}>{firstComment}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔍 Temel Rüya Analizi</Text>
            {detayliAnaliz && (
              <View style={styles.analysisBox}>
                <Text style={styles.analysisTitle}>😊 Duygusal İpuçları</Text>
                {Object.entries(detayliAnaliz).filter(([_, sayi]) => sayi > 0).slice(0, 3).map(([duygu, sayi]) => (
                  <View key={duygu} style={styles.analysisRow}>
                    <Text style={styles.analysisKey}>{duygu.charAt(0).toUpperCase() + duygu.slice(1)}</Text>
                    <Text style={styles.analysisValue}>{sayi} referans</Text>
                  </View>
                ))}
                {Object.entries(detayliAnaliz).filter(([_, sayi]) => sayi > 0).length === 0 && (
                  <Text style={styles.analysisNone}>Belirgin duygusal ipucu bulunamadı</Text>
                )}
              </View>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>❓ Yorumcunun Sorusu</Text>
            <View style={styles.questionBox}>
              <Text style={styles.questionText}>{systemQuestion}</Text>
            </View>
            <TextInput
              value={userAnswer}
              onChangeText={setUserAnswer}
              placeholder="Yorumcunun sorusunu yanıtlayarak daha detaylı bir yorum alabilirsiniz..."
              placeholderTextColor="#aaa"
              style={styles.textInput}
              multiline
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (userAnswer.trim()) {
                  fetchSecondComment();
                } else {
                  Alert.alert("Uyarı", "Lütfen yorumcunun sorusunu yanıtlayın.");
                }
              }}
            >
              <Text style={styles.buttonText}>✉️ Yanıtı Gönder</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {/* Step 2: Kullanıcı cevabı ve ikinci yorum */}
      {!loading && step === 2 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Yanıtınız</Text>
          <View style={styles.answerBox}>
            <Text style={styles.answerText}>{userAnswer}</Text>
          </View>
          <Text style={styles.sectionTitle}>✨ {selectedYorumcu}'nun Yorumu</Text>
          <View style={styles.answerBox}>
            <Text style={styles.answerText}>{secondComment}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => setStep(3)}>
            <Text style={styles.buttonText}>➡️ Devam Et</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Step 3: Kullanıcının kendi sorusunu sorma alanı */}
      {!loading && step === 3 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ Kendi Sorunuzu Sorun</Text>
          <Text style={styles.sectionDesc}>{selectedYorumcu}'na rüyanızla ilgili başka bir soru sormak ister misiniz?</Text>
          <TextInput
            value={userQuestion}
            onChangeText={setUserQuestion}
            placeholder="Örneğin: Bu rüyada gökyüzündeki kuşların anlamı nedir? Bu rüyanın gelecekle ilgili bir mesajı var mı?"
            placeholderTextColor="#aaa"
            style={styles.textInput}
            multiline
          />
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <TouchableOpacity
              style={[styles.button, { flex: 1 }]}
              onPress={() => {
                if (userQuestion.trim()) {
                  fetchUserQuestionAnswer();
                } else {
                  Alert.alert("Uyarı", "Lütfen bir soru girin.");
                }
              }}
            >
              <Text style={styles.buttonText}>✉️ Soruyu Gönder</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonOutline, { flex: 1 }]}
              onPress={() => setStep(4)}
            >
              <Text style={styles.buttonOutlineText}>Soru Sormadan Bitir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Step 4: Yorumlama tamamlandı ve kaydetme/paylaşma butonları */}
      {!loading && step === 4 && (
        <View style={styles.section}>
          {userQuestion && userQuestionAnswer && (
            <View style={styles.answerBox}>
              <Text style={styles.sectionTitle}>❓ Sorunuz</Text>
              <Text style={styles.answerText}>{userQuestion}</Text>
              <Text style={styles.sectionTitle}>✨ Yorumcunun Cevabı</Text>
              <Text style={styles.answerText}>{userQuestionAnswer}</Text>
            </View>
          )}
          <Text style={styles.sectionTitle}>✅ Rüya Yorumu Tamamlandı</Text>
          <Text style={styles.sectionDesc}>Rüyanız başarıyla yorumlandı. Yeni bir rüya yorumlamak için ana ekrana dönebilirsiniz.</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            {!kaydedildi && (
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  const success = await saveDreamToFirestore(true);
                  if (success) {
                    bildirKullaniciya("🌙 Rüya yorumunuz başarıyla paylaşıldı!");
                  }
                }}
              >
                <Text style={styles.buttonText}>🌐 Rüyanı Paylaş</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.buttonOutline}
              onPress={async () => {
                if (!kaydedildi) {
                  await saveDreamToFirestore(false);
                }
                onBack();
              }}
            >
              <Text style={styles.buttonOutlineText}>↩ Ana Ekrana Dön</Text>
            </TouchableOpacity>
          </View>
          {kaydedildi && (
            <Text style={styles.successText}>✅ Rüyanız başarıyla kaydedildi/paylaşıldı!</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1b2a',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#2A3B56',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  loadingText: {
    color: '#FFD700',
    marginTop: 12,
    fontSize: 16,
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  sectionDesc: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 10,
  },
  commentBox: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  commentText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  analysisBox: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  analysisTitle: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 4,
  },
  analysisKey: {
    color: '#fff',
    fontSize: 14,
  },
  analysisValue: {
    color: '#FFD700',
    fontSize: 14,
  },
  analysisNone: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dreamImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    backgroundColor: '#222',
  },
  generatingImageContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
  },
  generatingImageTitle: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  questionBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  questionText: {
    color: '#FFD700',
    fontStyle: 'italic',
    fontSize: 15,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  button: {
    backgroundColor: '#f4d35e',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#0d1b2a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#f4d35e',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  buttonOutlineText: {
    color: '#f4d35e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  answerBox: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  answerText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 21,
  },
  successText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
});
