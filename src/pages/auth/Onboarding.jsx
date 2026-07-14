import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { createUserProfile } from "../../services/firestore";

export default function Onboarding() {
  const { currentUser, setUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleSelectRole(role) {
    setLoading(false);
    try {
      setLoading(true);
      const profileData = {
        name: currentUser.displayName || "",
        email: currentUser.email,
        role: role, // 'trainer' ou 'client'
        photoURL: currentUser.photoURL || ""
      };

      // Grava no Firestore
      await createUserProfile(currentUser.uid, profileData);
      
      // Atualiza o estado global para a aplicação reagir imediatamente
      setUserProfile(profileData);
    } catch (error) {
      alert("Erro ao salvar a tua escolha. Tenta novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
          Bem-vindo ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">My Persona</span>
        </h1>
        <p className="text-slate-400 text-lg mb-10">
          Para começarmos, diz-nos quem és na plataforma:
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card Personal Trainer */}
          <button
            onClick={() => handleSelectRole("trainer")}
            disabled={loading}
            className="flex flex-col items-center justify-center p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-orange-500/50 hover:bg-slate-900/80 active:scale-[0.98] transition-all text-left group"
          >
            <div className="w-16 h-16 bg-orange-500/10 text-orange-400 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              💪
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Sou Personal Trainer</h3>
            <p className="text-slate-400 text-sm text-center">
              Quero gerir os meus alunos, montar treinos personalizados de forma rápida e acompanhar a evolução de cargas.
            </p>
          </button>

          {/* Card Aluno */}
          <button
            onClick={() => handleSelectRole("client")}
            disabled={loading}
            className="flex flex-col items-center justify-center p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-amber-500/50 hover:bg-slate-900/80 active:scale-[0.98] transition-all text-left group"
          >
            <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              🏋️‍♂️
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Sou Aluno</h3>
            <p className="text-slate-400 text-sm text-center">
              Quero visualizar e registar os meus treinos diários, controlar as minhas cargas e receber o feedback do meu treinador.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}