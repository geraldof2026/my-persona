import { collection, addDoc, getDocs, query, where, doc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// 1. Busca perfil
export async function getUserProfile(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

// 2. Cria perfil
export async function createUserProfile(uid, data) {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, data, { merge: true });
  return data;
}

// 3. Cadastra Aluno
export async function addStudent(personalId, studentData) {
  const studentsRef = collection(db, "students");
  const newStudentData = { ...studentData, personalId: personalId, createdAt: new Date().toISOString() };
  const docRef = await addDoc(studentsRef, newStudentData);
  return { id: docRef.id, ...newStudentData };
}

// 4. Busca Alunos do Personal
export async function getStudentsByPersonal(personalId) {
  const studentsRef = collection(db, "students");
  const q = query(studentsRef, where("personalId", "==", personalId));
  const querySnapshot = await getDocs(q);
  const students = [];
  querySnapshot.forEach((doc) => students.push({ id: doc.id, ...doc.data() }));
  return students;
}

// 5. Exclui Aluno
export async function deleteStudent(studentId) {
  const docRef = doc(db, "students", studentId);
  await deleteDoc(docRef);
}

// 6. Guarda Treino
export async function addWorkout(personalId, workoutData) {
  const workoutsRef = collection(db, "workouts");
  const newWorkoutData = { ...workoutData, personalId: personalId, createdAt: new Date().toISOString() };
  const docRef = await addDoc(workoutsRef, newWorkoutData);
  return { id: docRef.id, ...newWorkoutData };
}

// 7. Busca Treinos do Personal
export async function getWorkoutsByPersonal(personalId) {
  const workoutsRef = collection(db, "workouts");
  const q = query(workoutsRef, where("personalId", "==", personalId));
  const querySnapshot = await getDocs(q);
  const workouts = [];
  querySnapshot.forEach((doc) => workouts.push({ id: doc.id, ...doc.data() }));
  return workouts;
}

// 8. Busca Treinos do Aluno via E-mail
export async function getStudentWorkoutsByEmail(email) {
  const studentsRef = collection(db, "students");
  const qStudent = query(studentsRef, where("email", "==", email));
  const studentSnap = await getDocs(qStudent);

  if (studentSnap.empty) return [];

  const alunoId = studentSnap.docs[0].id;
  const workoutsRef = collection(db, "workouts");
  const qWorkouts = query(workoutsRef, where("alunoId", "==", alunoId));
  const workoutsSnap = await getDocs(qWorkouts);

  const workouts = [];
  workoutsSnap.forEach((doc) => workouts.push({ id: doc.id, ...doc.data() }));
  return workouts;
}