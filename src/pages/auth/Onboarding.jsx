import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { createUserProfile } from "../../services/firestore";

export default function Onboarding() {
  const { currentUser, setUserProfile } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCompleteSetup(e) {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      setLoading(true);
      
      // Monta os dados que vamos salvar no banco
      const profileData = {
        role: selectedRole,
        email: currentUser.email,
        name: currentUser.displayName || "",
        createdAt: new Date().toISOString()
      };

      // 1. Salva no Firebase de verdade!
      await createUserProfile(currentUser.uid, profileData);

      // 2. Atualiza o sistema local para ele te jogar direto pro Dashboard
      setUserProfile(profileData);
      
    } catch (error) {
      console.error("Erro ao configurar conta:", error);
      alert("Erro ao salvar o perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 font-sans text-white">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo ao MyPersona!</h1>
          <p className="text-slate-400">
            Falta muito pouco. Como você deseja utilizar a plataforma?
          </p>
        </div>

        <form onSubmit={handleCompleteSetup} className="space-y-8">
          
          {/* ÁREA DOS CARTÕES DE SELEÇÃO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Opção: Personal Trainer */}
            <label 
              className={`cursor-pointer relative flex flex-col p-6 border-2 rounded-2xl transition-all ${
                selectedRole === "trainer" 
                  ? "border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]" 
                  : "border-slate-800 bg-slate-950 hover:border-slate-700"
              }`}
            >
              <input 
                type="radio" 
                name="role" 
                value="trainer" 
                className="sr-only"
                onChange={(e) => setSelectedRole(e.target.value)}
              />
              <div className="mb-4 text-orange-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sou Personal Trainer</h3>
              <p className="text-slate-400 text-sm">Quero criar treinos, gerenciar meus alunos e acompanhar resultados.</p>
            </label>

            {/* Opção: Aluno */}
            <label 
              className={`cursor-pointer relative flex flex-col p-6 border-2 rounded-2xl transition-all ${
                selectedRole === "student" 
                  ? "border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]" 
                  : "border-slate-800 bg-slate-950 hover:border-slate-700"
              }`}
            >
              <input 
                type="radio" 
                name="role" 
                value="student" 
                className="sr-only"
                onChange={(e) => setSelectedRole(e.target.value)}
              />
              <div className="mb-4 text-orange-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sou Aluno</h3>
              <p className="text-slate-400 text-sm">Quero acessar meus treinos, visualizar minha evolução e falar com meu Personal.</p>
            </label>

          </div>

          {/* BOTÃO DE CONFIRMAÇÃO */}
          <button 
            type="submit"
            disabled={!selectedRole || loading}
            className={`w-full py-4 font-bold rounded-xl transition-all ${
              selectedRole 
                ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20" 
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {loading ? "A preparar o ambiente..." : "Concluir Configuração"}
          </button>

        </form>
      </div>
    </div>
  );
}