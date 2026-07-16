import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase"; // Certifique-se de que o db está exportado no seu arquivo firebase.js
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

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

// 3. Cadastra um novo aluno vinculado ao Personal Trainer
export async function addStudent(personalId, studentData) {
  const studentsRef = collection(db, "students");
  const newStudentData = {
    ...studentData,
    personalId: personalId, // Essa linha garante que o aluno é SEU e não de outro Personal
    createdAt: new Date().toISOString()
  };
  
  const docRef = await addDoc(studentsRef, newStudentData);
  return { id: docRef.id, ...newStudentData };
}

// 4. Busca apenas os alunos que pertencem a este Personal Trainer
export async function getStudentsByPersonal(personalId) {
  const studentsRef = collection(db, "students");
  // O query filtra o banco de dados para trazer só os seus alunos
  const q = query(studentsRef, where("personalId", "==", personalId));
  const querySnapshot = await getDocs(q);
  
  const students = [];
  querySnapshot.forEach((doc) => {
    students.push({ id: doc.id, ...doc.data() });
  });
  
  return students; // Retorna a lista completa para o Dashboard
}