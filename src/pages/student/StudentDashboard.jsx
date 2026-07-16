import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getStudentWorkoutsByEmail } from "../../services/firestore";

export default function StudentDashboard() {
  const { currentUser, userProfile, logout } = useAuth();
  const [meusTreinos, setMeusTreinos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarTreinos() {
      if (currentUser?.email) {
        try {
          const treinos = await getStudentWorkoutsByEmail(currentUser.email);
          setMeusTreinos(treinos);
        } catch (error) {
          console.error("Erro ao carregar os treinos do aluno:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    carregarTreinos();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-white">
      
      {/* CABEÇALHO MOBILE-FRIENDLY */}
      <header className="bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-orange-500">
            MY<span className="text-white">PERSONA</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Olá, <span className="font-semibold text-slate-200">{userProfile?.name || "Aluno"}</span>!
          </p>
        </div>
        <button 
          onClick={logout}
          className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
          title="Sair"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </header>

      {/* ÁREA PRINCIPAL DOS TREINOS */}
      <main className="flex-1 p-4 md:p-8 max-w-4xl w-full mx-auto">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          Os Meus Treinos
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : meusTreinos.length === 0 ? (
          <div className="bg-slate-900 border-2 border-dashed border-slate-800 p-8 rounded-2xl text-center">
            <svg className="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum treino disponível</h3>
            <p className="text-slate-400">O seu Personal Trainer ainda não criou nenhum plano de treino para si.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {meusTreinos.map((treino) => (
              <div key={treino.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">{treino.nomeTreino}</h3>
                  <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full">
                    {treino.exercicios.length} exercícios
                  </span>
                </div>
                
                <div className="p-5 space-y-3">
                  {treino.exercicios.map((ex, index) => (
                    <div key={index} className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-slate-200">{ex.nome}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-orange-500 font-bold">{ex.series} <span className="text-slate-500 text-sm font-normal">séries</span></p>
                        <p className="text-slate-300 text-sm">{ex.reps} reps {ex.carga ? `• ${ex.carga}kg` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-slate-950/50 border-t border-slate-800">
                  <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors">
                    Iniciar Treino
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}