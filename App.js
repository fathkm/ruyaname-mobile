import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { ThemeProvider } from './ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Firebase başlatma
import { auth } from './firebase';

// Sayfa bileşenleri
import MainScreen from './src/components/MainScreen';
import PremiumNotice from './src/components/PremiumNotice';
import FreeResult from './src/components/FreeResult';
import PastDreams from './src/components/PastDreams';
import Ruyahane from './src/components/Ruyahane';

import { initSentry, ErrorBoundary } from './src/utils/errorTracking';
import { trackPageView } from './src/utils/analytics';

const Drawer = createDrawerNavigator();

const ErrorFallback = () => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorTitle}>😔 Bir Sorun Oluştu</Text>
    <Text style={styles.errorText}>
      Endişelenmeyin, teknik ekibimiz durumdan haberdar edildi.
      Lütfen uygulamayı yeniden başlatın veya daha sonra tekrar deneyin.
    </Text>
    <TouchableOpacity
      onPress={() => {
        // Buraya örneğin: Restart paketi ile uygulamayı baştan başlatabilirsiniz
        // import { Restart } from 'fictional-restart-package'
        // Restart();
      }}
      style={styles.errorButton}
    >
      <Text style={styles.errorButtonText}>Uygulamayı Yenile</Text>
    </TouchableOpacity>
  </View>
);

export default function App() {
  useEffect(() => {
    initSentry();
    trackPageView('Ana Sayfa');
  }, []);

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Provider store={store}>
        <ThemeProvider>
          <NavigationContainer>
            <Drawer.Navigator
              initialRouteName="Ana Sayfa"
              screenOptions={{
                headerStyle: { backgroundColor: '#0D1B2A' },
                headerTintColor: '#FFD700',
                drawerStyle: { backgroundColor: '#0D1B2A' },
                drawerActiveTintColor: '#FFD700',
                drawerInactiveTintColor: '#ccc',
              }}
            >
              <Drawer.Screen name="Ana Sayfa" component={MainScreen} />
              <Drawer.Screen name="Premium Yorum" component={PremiumNotice} />
              <Drawer.Screen name="Ücretsiz Yorum" component={FreeResult} />
              <Drawer.Screen name="Geçmiş Rüyalar" component={PastDreams} />
              <Drawer.Screen name="Rüyahane" component={Ruyahane} />
            </Drawer.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 27, 42, 0.8)',
    padding: 32,
  },
  errorTitle: {
    fontSize: 24,
    color: '#FFD700',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 32,
  },
  errorButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#FFD700',
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#0D1B2A',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
