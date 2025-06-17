import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const theme = {
  colors: {
    primary: '#1a2233',
    gold: '#FFD700',
    textPrimary: '#fff',
    textDark: '#1a1a1a',
  },
  borders: {
    radius: {
      medium: 12,
      large: 20,
    },
    light: '1px solid #FFD700',
    gold: '1px solid #FFD700',
  },
  gradients: {
    primaryFull: 'linear-gradient(180deg, #0d1b2a 0%, #1b263b 100%)',
    gold: 'linear-gradient(90deg, #FFD700 0%, #FFFACD 100%)',
  },
  effects: {
    blur: 'blur(10px)',
  },
  shadows: {
    textGlow: '0 0 8px #FFD700',
    button: '0 2px 8px rgba(0,0,0,0.15)',
  },
};

const ProfilKarti = ({ baslik, deger, icon }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardTitle}>{baslik}</Text>
    </View>
    <Text style={styles.cardValue}>{deger || 'Belirtilmemiş'}</Text>
  </View>
);

export default function ProfileScreen({ userProfile, onEdit, onClose, toggleSideMenu, showSideMenu }) {
  if (!userProfile) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.noProfileText}>Profil verisi bulunamadı.</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.background} contentContainerStyle={styles.scrollContent}>
      <View style={styles.profileContainer}>
        {/* Hamburger Menü */}
        {!showSideMenu && (
          <TouchableOpacity style={styles.hamburger} onPress={toggleSideMenu}>
            <Text style={styles.hamburgerText}>☰</Text>
          </TouchableOpacity>
        )}
        {/* Kapatma butonu */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
        <View style={styles.profileBox}>
          <Text style={styles.profileTitle}>👤 Profil Bilgilerin</Text>
          <ProfilKarti baslik="İSİM" deger={userProfile.isim} icon="📝" />
          <ProfilKarti baslik="CİNSİYET" deger={userProfile.cinsiyet} icon="👤" />
          <ProfilKarti baslik="DOĞUM TARİHİ" deger={userProfile.dogumTarihi} icon="📅" />
          <ProfilKarti baslik="DOĞUM YERİ" deger={userProfile.dogumYeri} icon="📍" />
          <ProfilKarti baslik="İLİŞKİ DURUMU" deger={userProfile.iliskiDurumu} icon="💑" />
          <ProfilKarti baslik="HOBİ" deger={userProfile.hobi} icon="🎨" />
          <ProfilKarti baslik="HAYATTA AMAÇ" deger={userProfile.hayattakiAmac} icon="🎯" />
          <ProfilKarti baslik="GÜNCEL KAYGI" deger={userProfile.guncelKaygi} icon="😰" />
          <ProfilKarti baslik="İÇ DÜNYA TARİF" deger={userProfile.icDunyaTarif} icon="🌟" />
          <ProfilKarti baslik="İNANÇ DURUMU" deger={userProfile.inancDurumu} icon="🕌" />
          <ProfilKarti baslik="DEĞER VERDİĞİ" deger={userProfile.degerVerdigi} icon="💎" />
          <View style={{ alignItems: 'center', marginTop: 32 }}>
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Text style={styles.editButtonText}>✏️ Bilgileri Düzenle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0d1b2a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
  },
  hamburger: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerText: {
    color: theme.colors.gold,
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    backgroundColor: theme.colors.primary,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  closeButtonText: {
    color: theme.colors.gold,
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileBox: {
    backgroundColor: theme.colors.primary,
    padding: 24,
    borderRadius: 20,
    marginTop: 48,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  profileTitle: {
    fontSize: 22,
    marginBottom: 24,
    textAlign: 'center',
    color: theme.colors.gold,
    fontWeight: 'bold',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  card: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardIcon: {
    color: theme.colors.gold,
    fontSize: 18,
    marginRight: 6,
  },
  cardTitle: {
    color: theme.colors.gold,
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardValue: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  editButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    marginTop: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  editButtonText: {
    color: '#1a1a1a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1b2a',
  },
  noProfileText: {
    color: theme.colors.textPrimary,
    fontSize: 18,
  },
});
