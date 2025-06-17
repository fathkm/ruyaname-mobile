// src/utils/analytics.js

import firestore from '@react-native-firebase/firestore';
import { collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import analytics from '@react-native-firebase/analytics'; // Firebase Analytics nesnesini içe aktarın

// Sayfa görüntüleme
export const trackPageView = (pageName) => {
  analytics().logScreen(pageName, { screen_class: pageName });
};

// Özel olay takibi
export const trackEvent = (eventName, properties = {}) => {
  analytics().logEvent(eventName, properties);
};

// Kullanıcı tanımlama
export const identifyUser = (userId, traits = {}) => {
  analytics().setUserId(userId);
  analytics().setUserProperties(traits);
};

// Özel olaylar
export const Events = {
  // Rüya ile ilgili
  DREAM_SUBMITTED: 'dream_submitted',
  DREAM_INTERPRETED: 'dream_interpreted',
  DREAM_SHARED: 'dream_shared',
  DREAM_LIKED: 'dream_liked',

  // Kullanıcı etkileşimleri
  USER_REGISTERED: 'user_registered',
  USER_LOGGED_IN: 'user_logged_in',
  USER_UPGRADED: 'user_upgraded',

  // Premium özellikler
  PREMIUM_VIEWED: 'premium_viewed',
  PAYMENT_STARTED: 'payment_started',
  PAYMENT_COMPLETED: 'payment_completed',

  // Yorumcu etkileşimleri
  YORUMCU_SELECTED: 'yorumcu_selected',
  YORUMCU_CONTACTED: 'yorumcu_contacted',

  // Uygulama durumu
  ERROR_OCCURRED: 'error_occurred',
  PERFORMANCE_ISSUE: 'performance_issue'
};
