import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

const windowWidth = Dimensions.get('window').width;

export default function SideMenu({ onClose, onLogout, navigateToPage, userProfile }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onLogout?.();
    } catch (error) {
      // Hata yönetimi
    }
  };

  const handleNavigate = (target) => {
    navigateToPage(target);
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.menuBox}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>🌙 Menü</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.menuList}>
          <MenuButton onPress={() => handleNavigate('profile')} icon="👤" label="Profil" />
          <MenuButton onPress={() => handleNavigate('pastDreams')} icon="📜" label="Geçmiş Rüyalar" />
          <MenuButton onPress={() => handleNavigate('analytics')} icon="✨" label="Rüya Analizi" />
          <MenuButton onPress={() => handleNavigate('settings')} icon="⚙️" label="Ayarlar" />
          <View style={styles.menuDivider} />
          <MenuButton onPress={handleSignOut} icon="🔓" label="Çıkış Yap" style={styles.logoutButton} />
        </ScrollView>
      </View>
    </View>
  );
}

const MenuButton = ({ onPress, icon, label, style = {} }) => (
  <TouchableOpacity style={[styles.menuButton, style]} onPress={onPress}>
    <Text style={styles.menuButtonIcon}>{icon}</Text>
    <Text style={styles.menuButtonLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 999,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuBox: {
    width: 280,
    maxWidth: windowWidth * 0.85,
    height: '100%',
    backgroundColor: '#1a2233',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  menuTitle: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  closeButtonText: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
  },
  menuList: {
    paddingBottom: 32,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: 'rgba(255,215,0,0.04)',
  },
  menuButtonIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  menuButtonLabel: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255,215,0,0.2)',
    marginVertical: 12,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,68,68,0.08)',
  },
});
