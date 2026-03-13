import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  updatePassword,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
  arrayUnion,
  getDocs,
  writeBatch,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAE7JtCsoP8DdsCof-OHraIloH_RPpJsbk',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cmit-hero-v2.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cmit-hero-v2',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cmit-hero-v2.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '162534902313',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:162534902313:web:b348ca176be06c3d4c6a38',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appId = 'cmit-hero-production-v1';

const getCollection = (name) => collection(db, 'artifacts', appId, 'public', 'data', name);
const getDocRef = (colName, docId) => doc(db, 'artifacts', appId, 'public', 'data', colName, docId);

const removeDiacriticsForGuest = (str) => {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').replace(/Đ/g, 'D').replace(/[^a-zA-Z0-9]/g, '').trim().toUpperCase();
};

const generateSmartGuestCode = (name, company) => {
  const cleanName = removeDiacriticsForGuest(name || '').slice(0, 8);
  const cleanCompany = removeDiacriticsForGuest(company || '').slice(0, 6);
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const dateSuffix = dd + mm + yyyy;
  if (cleanCompany) return 'GUEST-' + cleanCompany + '-' + cleanName + '-' + dateSuffix;
  return 'GUEST-' + cleanName + '-' + dateSuffix;
};

const ensureAnonymousAuth = async () => {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
};

export const generateQRToken = (employeeId) => {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `HERO-${employeeId}-${random}-${Date.now()}`;
};

export const ensureEmployeeQRToken = async (employee) => {
  if (employee.qrToken) return employee.qrToken;
  const token = generateQRToken(employee.id);
  try {
    await updateDoc(getDocRef('employees', employee.id), { qrToken: token });
    return token;
  } catch (e) {
    console.error('Loi tao QR Token:', e);
    return null;
  }
};

export {
  app,
  auth,
  db,
  appId,
  getCollection,
  getDocRef,
  generateSmartGuestCode,
  ensureAnonymousAuth,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  updatePassword,
  setDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
  arrayUnion,
  getDocs,
  writeBatch,
};
