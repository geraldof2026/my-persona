import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";
import Onboarding from "./pages/auth/Onboarding";

// Componente de controle que decide a rota
function NavigationController() {
  const { currentUser, userProfile, logout } = useAuth();

  // 1. Se não estiver logado, vai para o Login
  if (!currentUser) {
    return <Login />;
  }

  // 2. Se estiver logado, mas ainda não escolheu o papel no Firestore, vai para o Onboarding
  if (!userProfile) {
    return <Onboarding />;
  }

  // 3. Se for Personal Trainer
  if (userProfile.role === "trainer") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Dashboard do Personal Trainer</h1>
        <p className="text-slate-400 mb-6">Bem-vindo, {userProfile.name || currentUser.email}!</p>
        <button onClick={logout} className="px-6 py-2 bg-red-600 rounded-lg">Sair</button>
      </div>
    );
  }

  // 4. Se for Aluno
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Área do Aluno</h1>
      <p className="text-slate-400 mb-6">Bons treinos, {userProfile.name || currentUser.email}!</p>
      <button onClick={logout} className="px-6 py-2 bg-red-600 rounded-lg">Sair</button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NavigationController />
    </AuthProvider>
  );
}

export default App;