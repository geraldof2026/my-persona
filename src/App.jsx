import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Importando as Páginas
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Onboarding from './pages/auth/Onboarding';
import Dashboard from './pages/admin/Dashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import LandingPage from './pages/public/LandingPage'; 

// Componente para Proteger as Rotas (Redireciona para o login se não estiver autenticado)
function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div className="h-screen bg-slate-950 text-white flex items-center justify-center">Carregando...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  
  return children;
}

export default function App() {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Carregando sistema...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* ROTAS PÚBLICAS */}
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={currentUser ? <Navigate to="/dashboard" /> : <Register />} />
        
        {/* ROTAS PRIVADAS (Requer Login) */}
        <Route path="/onboarding" element={
          <PrivateRoute>
             {userProfile?.role ? <Navigate to="/dashboard" /> : <Onboarding />}
          </PrivateRoute>
        } />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            {!userProfile ? (
               <Navigate to="/onboarding" />
            ) : userProfile.role === 'trainer' ? ( // <-- CORRIGIDO AQUI! De 'personal' para 'trainer'
               <Dashboard />
            ) : (
               <StudentDashboard />
            )}
          </PrivateRoute>
        } />

        {/* Captura qualquer rota inválida e manda para a Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}