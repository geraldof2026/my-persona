import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// As suas chaves oficiais do projeto My Persona
const firebaseConfig = {
  apiKey: "AIzaSyCjONpwUGpEpsu7W9QnF9xauT6jF3i1wV8",
  authDomain: "my-persona-2026.firebaseapp.com",
  projectId: "my-persona-2026",
  storageBucket: "my-persona-2026.firebasestorage.app",
  messagingSenderId: "540080014290",
  appId: "1:540080014290:web:5ccd99c1c0547a3616be0b",
  measurementId: "G-MS37M0V02M"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exporta os serviços que vamos usar nas telas do React
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;