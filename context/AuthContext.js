import { createContext, useContext, useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, FIREBASE_API_KEY } from '../firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

const BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = async (name, email, password) => {
    const res = await fetch(`${BASE_URL}:signUp?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const userData = {
      uid: data.localId,
      email: data.email,
      name,
      idToken: data.idToken,
      igConnected: false,
      igUsername: '',
      preferences: { liked: [1, 2, 3], avoided: [101] },
      automationActive: false,
      actionsCount: 0,
      feedScore: 0,
    };

    await setDoc(doc(db, 'users', data.localId), {
      name,
      email,
      createdAt: new Date().toISOString(),
      igConnected: false,
      igUsername: '',
      preferences: { liked: [1, 2, 3], avoided: [101] },
      automationActive: false,
      actionsCount: 0,
      feedScore: 0,
    });

    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}:signInWithPassword?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    let userData = {
      uid: data.localId,
      email: data.email,
      idToken: data.idToken,
    };

    try {
      const docSnap = await getDoc(doc(db, 'users', data.localId));
      if (docSnap.exists()) {
        userData = { ...userData, ...docSnap.data() };
      }
    } catch (e) {}

    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  const restoreSession = async () => {
    try {
      const stored = await AsyncStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);