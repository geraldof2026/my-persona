import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

// Criação do Contexto
const AuthContext = createContext();

// Hook personalizado para usar o Contexto de forma mais limpa
export function useAuth() {
  return useContext(AuthContext);
}

// Provedor que vai envolver a nossa aplicação
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Criar conta com E-mail e Palavra-passe
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Iniciar sessão com E-mail e Palavra-passe
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Iniciar sessão com o Google (Custo Zero e 1 clique)
  function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  // Terminar sessão
  function logout() {
    return signOut(auth);
  }

  // Monitoriza o estado do utilizador (se está logado ou não)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}