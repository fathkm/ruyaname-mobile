import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { auth, db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { updateProfile, updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const defaultAvatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=2&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=3&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=4&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=5&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=6&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=2&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=3&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=4&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/personas/svg?seed=1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/personas/svg?seed=2&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/personas/svg?seed=3&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/personas/svg?seed=4&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/micah/svg?seed=1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/micah/svg?seed=2&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/micah/svg?seed=3&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/micah/svg?seed=4&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/bottts/svg?seed=1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/bottts/svg?seed=2&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/bottts/svg?seed=3&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/bottts/svg?seed=4&backgroundColor=ffdfbf',
];

const themeOptions = [
  { id: 'dark', name: 'Koyu Tema', icon: '🌙', description: 'Gece modu için ideal, göz yorgunluğunu azaltır' },
  { id: 'light', name: 'Açık Tema', icon: '☀️', description: 'Klasik aydınlık görünüm' },
  { id: 'classic', name: 'Klasik Mavi', icon: '🌊', description: 'Sakinleştirici mavi tonları' },
  { id: 'purple', name: 'Mor Tema', icon: '💜', description: 'Mistik ve etkileyici mor tema' },
];

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
    textSecondary: '#b0b8c1',
  },
};

export default function Settings({ onToggleSideMenu, showSideMenu }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatars[0]);
  const [showAvatarSelect, setShowAvatarSelect] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [themeName, setThemeName] = useState('dark');

  useEffect(() => {
    const loadUserData = async () => {
      if (auth.currentUser) {
        setUsername(auth.currentUser.displayName || '');
        setSelectedAvatar(auth.currentUser.photoURL || defaultAvatars[0]);
        setNewEmail(auth.currentUser.email || '');
      }
    };
    loadUserData();
  }, []);

  const showAlert = (message, type = 'success') => {
    Alert.alert(type === 'error' ? 'Hata' : 'Bilgi', message);
  };

  const handleUsernameUpdate = async () => {
    if (!username.trim()) {
      showAlert('Kullanıcı adı boş olamaz', 'error');
      return;
    }
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName: username });
      await updateDoc(doc(db, 'userProfiles', auth.currentUser.uid), { displayName: username });
      showAlert('Kullanıcı adı güncellendi');
    } catch (error) {
      showAlert('Kullanıcı adı güncellenirken hata oluştu', 'error');
    }
    setLoading(false);
  };

  const handleAvatarSelect = async (avatarUrl) => {
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { photoURL: avatarUrl });
      await updateDoc(doc(db, 'userProfiles', auth.currentUser.uid), { photoURL: avatarUrl });
      setSelectedAvatar(avatarUrl);
      showAlert('Profil fotoğrafı güncellendi');
    } catch (error) {
      showAlert('Profil fotoğrafı güncellenirken hata oluştu', 'error');
    }
    setLoading(false);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      showAlert('Yeni şifreler eşleşmiyor', 'error');
      return;
    }
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      showAlert('Şifreniz başarıyla güncellendi');
      setShowSecuritySettings(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      showAlert('Şifre güncellenirken hata oluştu. Mevcut şifrenizi kontrol edin.', 'error');
    }
    setLoading(false);
  };

  const handleEmailChange = async () => {
    if (!newEmail || !currentPassword) {
      showAlert('Tüm alanları doldurun', 'error');
      return;
    }
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, newEmail);
      showAlert('Email adresiniz başarıyla güncellendi');
      setShowSecuritySettings(false);
      setCurrentPassword('');
    } catch (error) {
      showAlert('Email güncellenirken hata oluştu. Mevcut şifrenizi kontrol edin.', 'error');
    }
    setLoading(false);
  };

  const handleCustomAvatarUpload = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, async (response) => {
      if (response.didCancel || !response.assets || !response.assets[0]) return;
      const asset = response.assets[0];
      if (asset.fileSize > 2 * 1024 * 1024) {
        showAlert('Dosya boyutu 2MB\'dan küçük olmalıdır', 'error');
        return;
      }
      setLoading(true);
      try {
        const responseFetch = await fetch(asset.uri);
        const blob = await responseFetch.blob();
        const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        await handleAvatarSelect(downloadURL);
      } catch (error) {
        showAlert('Fotoğraf yüklenirken hata oluştu', 'error');
      }
      setLoading(false);
    });
  };

  return (
    <ScrollView style={styles.background} contentContainerStyle={styles.content}>
      {!showSideMenu && (
        <TouchableOpacity style={styles.menuButton} onPress={onToggleSideMenu}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
      )}
      <View style={styles.innerContainer}>
        <Text style={styles.headerTitle}>Profil Ayarları</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil Bilgileri</Text>
          <View style={styles.profileRow}>
            <Image source={{ uri: selectedAvatar }} style={styles.avatar} />
            <View style={styles.avatarButtons}>
              <TouchableOpacity style={styles.avatarButton} onPress={() => setShowAvatarSelect(!showAvatarSelect)}>
                <Text style={styles.avatarButtonText}>Avatar Seç</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.avatarButton} onPress={handleCustomAvatarUpload}>
                <Text style={styles.avatarButtonText}>Fotoğraf Yükle</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.usernameBox}>
              <Text style={styles.label}>Kullanıcı Adı</Text>
              <View style={styles.usernameRow}>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                  placeholder="Kullanıcı adı"
                  placeholderTextColor="#aaa"
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleUsernameUpdate} disabled={loading}>
                  <Text style={styles.saveButtonText}>{loading ? '...' : 'Kaydet'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {showAvatarSelect && (
            <ScrollView horizontal style={styles.avatarGallery} showsHorizontalScrollIndicator={false}>
              {defaultAvatars.map((avatar, idx) => (
                <TouchableOpacity key={idx} onPress={() => handleAvatarSelect(avatar)}>
                  <Image
                    source={{ uri: avatar }}
                    style={[styles.avatarOption, selectedAvatar === avatar && styles.avatarOptionSelected]}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tema Seçimi</Text>
          <View style={styles.themeRow}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.themeOption, themeName === option.id && styles.themeOptionSelected]}
                onPress={() => setThemeName(option.id)}
              >
                <Text style={styles.themeIcon}>{option.icon}</Text>
                <Text style={styles.themeName}>{option.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Güvenlik Ayarları</Text>
          <Text style={styles.label}>Mevcut Email: {auth.currentUser?.email}</Text>
          <TouchableOpacity style={styles.securityButton} onPress={() => setShowSecuritySettings(!showSecuritySettings)}>
            <Text style={styles.securityButtonText}>{showSecuritySettings ? 'İptal' : 'Email ve Şifre Değiştir'}</Text>
          </TouchableOpacity>
          {showSecuritySettings && (
            <View style={styles.securityBox}>
              <Text style={styles.label}>Email Değiştir</Text>
              <TextInput
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="Yeni Email Adresi"
                placeholderTextColor="#aaa"
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleEmailChange} disabled={loading || !newEmail}>
                <Text style={styles.saveButtonText}>{loading ? '...' : 'Email Güncelle'}</Text>
              </TouchableOpacity>
              <Text style={[styles.label, { marginTop: 16 }]}>Şifre Değiştir</Text>
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Mevcut Şifre"
                placeholderTextColor="#aaa"
                style={styles.input}
                secureTextEntry
              />
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Yeni Şifre"
                placeholderTextColor="#aaa"
                style={styles.input}
                secureTextEntry
              />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Yeni Şifre (Tekrar)"
                placeholderTextColor="#aaa"
                style={styles.input}
                secureTextEntry
              />
              <TouchableOpacity style={styles.saveButton} onPress={handlePasswordChange} disabled={loading || !currentPassword || !newPassword || !confirmPassword}>
                <Text style={styles.saveButtonText}>{loading ? '...' : 'Şifre Güncelle'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  content: {
    padding: 16,
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
  },
  menuButtonText: {
    color: theme.colors.gold,
    fontSize: 24,
    fontWeight: 'bold',
  },
  innerContainer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    marginTop: 60,
  },
  headerTitle: {
    color: theme.colors.gold,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 15,
    padding: 18,
    marginBottom: 18,
  },
  sectionTitle: {
    color: theme.colors.gold,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 18,
    marginBottom: 18,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: theme.colors.gold,
    marginRight: 12,
  },
  avatarButtons: {
    flexDirection: 'column',
    gap: 8,
    marginRight: 12,
  },
  avatarButton: {
    backgroundColor: theme.colors.goldBackground,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 6,
    alignItems: 'center',
  },
  avatarButtonText: {
    color: theme.colors.gold,
    fontSize: 14,
    fontWeight: 'bold',
  },
  usernameBox: {
    flex: 1,
  },
  label: {
    color: theme.colors.textSecondary,
    marginBottom: 6,
    fontSize: 14,
  },
  usernameRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    color: theme.colors.textPrimary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.gold,
    padding: 10,
    marginBottom: 8,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: theme.colors.goldBackground,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.colors.gold,
    fontWeight: 'bold',
    fontSize: 15,
  },
  avatarGallery: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.gold,
    marginRight: 8,
  },
  avatarOptionSelected: {
    borderWidth: 3,
    borderColor: theme.colors.gold,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  themeOption: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gold,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 90,
  },
  themeOptionSelected: {
    backgroundColor: theme.colors.goldBackground,
    borderColor: theme.colors.gold,
  },
  themeIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  themeName: {
    color: theme.colors.gold,
    fontWeight: 'bold',
    fontSize: 15,
  },
  securityButton: {
    backgroundColor: theme.colors.goldBackground,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 10,
    alignItems: 'center',
  },
  securityButtonText: {
    color: theme.colors.gold,
    fontWeight: 'bold',
    fontSize: 15,
  },
  securityBox: {
    marginTop: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    padding: 14,
  },
});
