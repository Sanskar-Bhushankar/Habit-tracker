import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCFiwx57Ib9dd06sEAr1lHoivBWi1O558I",
  authDomain: "todolistnextapp-d2f2a.firebaseapp.com",
  projectId: "todolistnextapp-d2f2a",
  storageBucket: "todolistnextapp-d2f2a.firebasestorage.app",
  messagingSenderId: "542171740300",
  appId: "1:542171740300:web:cfa1749ca15895c018a3a9",
  measurementId: "G-80DSKN4QXC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Log initialization status
console.log('Firebase initialized:', {
  app: app.name,
  authDomain: auth.config.authDomain,
  currentUser: auth.currentUser
});