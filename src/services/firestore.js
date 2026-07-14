import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Procura o perfil do utilizador no Firestore
export async function getUserProfile(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null; // Utilizador novo
    }
  } catch (error) {
    console.error("Erro ao procurar perfil:", error);
    throw error;
  }
}

// Cria ou atualiza o perfil do utilizador
export async function createUserProfile(uid, data) {
  try {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, {
      uid,
      createdAt: new Date().toISOString(),
      ...data
    }, { merge: true });
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    throw error;
  }
}