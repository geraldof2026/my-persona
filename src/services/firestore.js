import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase"; // Certifique-se de que o db está exportado no seu arquivo firebase.js

// 1. Busca o perfil do utilizador (usado no AuthContext)
export async function getUserProfile(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null; // Retorna nulo se for o primeiro acesso
}

// 2. Cria ou atualiza o perfil (usado no Onboarding)
export async function createUserProfile(uid, data) {
  const docRef = doc(db, "users", uid);
  // O merge: true garante que não vamos apagar dados antigos se atualizarmos depois
  await setDoc(docRef, data, { merge: true });
  return data;
}