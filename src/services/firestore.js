import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

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


// ... as funções getUserProfile e createUserProfile continuam iguais aqui em cima ...

// Função para buscar apenas os alunos associados a este Personal Trainer
export async function getClientsByTrainer(trainerId) {
  try {
    const clientsRef = collection(db, "users");
    // Faz uma query procurando utilizadores onde o role é "client" e o trainerId é o ID deste personal
    const q = query(
      clientsRef, 
      where("role", "==", "client"), 
      where("trainerId", "==", trainerId)
    );
    
    const querySnapshot = await getDocs(q);
    const clients = [];
    querySnapshot.forEach((doc) => {
      clients.push({ id: doc.id, ...doc.data() });
    });
    return clients;
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    throw error;
  }
}

// Função para o Personal Trainer criar/registar um aluno diretamente
export async function addClient(trainerId, clientData) {
  try {
    // Registamos o aluno na coleção "users" associando-o ao trainerId
    const usersRef = collection(db, "users");
    const docRef = await addDoc(usersRef, {
      ...clientData,
      trainerId,
      role: "client",
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar aluno:", error);
    throw error;
  }
}
// Função para criar um novo treino para um aluno específico
export async function createWorkoutForClient(clientId, workoutData) {
  try {
    // Aponta para a subcoleção "workouts" dentro do documento do aluno
    const workoutsRef = collection(db, "users", clientId, "workouts");
    const docRef = await addDoc(workoutsRef, {
      ...workoutData,
      completed: false,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao criar treino:", error);
    throw error;
  }
}