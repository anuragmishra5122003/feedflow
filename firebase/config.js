import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
 apiKey: "AIzaSyBcl-hAsAMl7iZ-BaIWStJMef0zxc-QUoM",
  authDomain: "feedflow-84341.firebaseapp.com",
  projectId: "feedflow-84341",
  storageBucket: "feedflow-84341.firebasestorage.app",
  messagingSenderId: "258678661151",
  appId: "1:258678661151:web:09251193c4ec4612dff52a"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const FIREBASE_API_KEY = firebaseConfig.apiKey;
export { app };