import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
// import analytics from '@react-native-firebase/analytics'; // Android'de sorun çıkabilir, sonra ekleriz

const firebaseConfig = {
  apiKey: 'AIzaSyDwiG9_cmSpGjffni3XiXNAVq7fubPrYs8',
  authDomain: 'ruyaname-1.firebaseapp.com',
  projectId: 'ruyaname-1',
  storageBucket: 'ruyaname-1.appspot.com',
  messagingSenderId: '518213785101',
  appId: '1:518213785101:web:6e8557f94d5e622a0e6744',
  measurementId: 'G-Q5ZN8QQTSG',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase, auth, storage };
