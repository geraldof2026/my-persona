import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase"; // Certifique-se de que o db está exportado no seu arquivo firebase.js
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { collection, addDoc, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { collection, addDoc, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
// (Mantém os imports e as funções anteriores que já lá tens)

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
// 5. Exclui um aluno do banco de dados
export async function deleteStudent(studentId) {
  const docRef = doc(db, "students", studentId);
  await deleteDoc(docRef);
}


// 6. Guarda um novo treino associado a um aluno
export async function addWorkout(personalId, workoutData) {
  const workoutsRef = collection(db, "workouts");
  const newWorkoutData = {
    ...workoutData,
    personalId: personalId,
    createdAt: new Date().toISOString()
  };
  
  const docRef = await addDoc(workoutsRef, newWorkoutData);
  return { id: docRef.id, ...newWorkoutData };
}

// 7. Procura todos os treinos criados por este Personal Trainer
export async function getWorkoutsByPersonal(personalId) {
  const workoutsRef = collection(db, "workouts");
  const q = query(workoutsRef, where("personalId", "==", personalId));
  const querySnapshot = await getDocs(q);
  
  const workouts = [];
  querySnapshot.forEach((doc) => {
    workouts.push({ id: doc.id, ...doc.data() });
  });
  
  return workouts;
}
// 8. Busca os treinos para o Painel do Aluno usando o e-mail dele
export async function getStudentWorkoutsByEmail(email) {
  // Primeiro, achamos o cadastro do aluno pelo e-mail
  const studentsRef = collection(db, "students");
  const qStudent = query(studentsRef, where("email", "==", email));
  const studentSnap = await getDocs(qStudent);

  if (studentSnap.empty) return []; // Se não achar, retorna vazio

  // Pega o ID que o Personal gerou para este aluno
  const alunoId = studentSnap.docs[0].id;

  // Agora busca os treinos vinculados a este ID
  const workoutsRef = collection(db, "workouts");
  const qWorkouts = query(workoutsRef, where("alunoId", "==", alunoId));
  const workoutsSnap = await getDocs(qWorkouts);

  const workouts = [];
  workoutsSnap.forEach((doc) => {
    workouts.push({ id: doc.id, ...doc.data() });
  });

  return workouts;
}