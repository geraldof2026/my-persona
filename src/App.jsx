import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Importações das páginas
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Onboarding from "./pages/auth/Onboarding";
import Dashboard from "./pages/admin/Dashboard";
import StudentDashboard from "./pages/student/StudentDashboard";

export default function App() {
  const { currentUser, userProfile } = useAuth();

  // Função para proteger rotas e redirecionar conforme o cargo
  function ProtectedRoute({ children }) {
    if (!currentUser) return <Navigate to="/login" />;
    if (!userProfile) return <Onboarding />; // Força o onboarding se o perfil não existir
    return children;
  }

  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/" />} />

        {/* Rota Raiz: Redireciona dependendo do perfil */}
        <Route path="/" element={
          <ProtectedRoute>
            {userProfile?.role === "trainer" ? <Dashboard /> : <StudentDashboard />}
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}