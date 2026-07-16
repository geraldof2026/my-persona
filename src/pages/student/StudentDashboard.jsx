import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getStudentWorkoutsByEmail } from "../../services/firestore";
import { toast } from "sonner";

export default function StudentDashboard() {
  const { currentUser, logout } = useAuth();
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [treinosConcluidos, setTreinosConcluidos] = useState([]);

  useEffect(() => {
    async function carregarTreinos() {
      if (currentUser?.email) {
        try {
          const dados = await getStudentWorkoutsByEmail(currentUser.email);
          setTreinos(dados);
        } catch (error) {
          toast.error("Erro ao carregar os teus treinos.");
        } finally {
          setLoading(false);
        }
      }
    }
    carregarTreinos();
  }, [currentUser]);

  function handleConcluirTreino(id, nome) {
    if (!treinosConcluidos.includes(id)) {
      setTreinosConcluidos([...treinosConcluidos, id]);
      toast.success(`Parabéns! Finalizaste o treino: ${nome} 💪🔥`);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans text-white">
      
      {/* CABEÇALHO MOBILE */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
        <h2 className="text-xl font-black text-orange-500">MY<span className="text-white">PERSONA</span></h2>
        <button onClick={logout} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium">Sair</button>
      </div>

      {/* SIDEBAR DESKTOP */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-2xl font-black tracking-tighter text-orange-500">MY<span className="text-white">PERSONA</span></h2>
        </div>
        <nav className="flex-1 px-4 mt-4">
          <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-orange-500/10 text-orange-500 border border-orange-500/20">
            Meus Treinos
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">Sair do Sistema</button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Área do Aluno</h1>
          <p className="text-slate-400 mt-1">Olá, <span className="text-orange-500 font-semibold">{currentUser?.displayName || "Atleta"}</span>! Aqui estão os teus treinos.</p>
        </header>

        {loading ? (
          <div className="text-center py-12 text-slate-400">A carregar os teus treinos...</div>
        ) : treinos.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl shadow-xl">
            <p className="text-slate-400 mb-2">Ainda não tens treinos atribuídos.</p>
            <p className="text-sm text-slate-500">O teu Personal vai enviar os treinos em breve.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treinos.map(treino => {
              const isConcluido = treinosConcluidos.includes(treino.id);
              return (
                <div key={treino.id} className={`relative overflow-hidden backdrop-blur-md border p-6 rounded-3xl shadow-xl transition-all duration-300 ${isConcluido ? 'bg-green-900/20 border-green-500/30' : 'bg-slate-900/40 border-slate-800/80 hover:border-orange-500/30'}`}>
                  
                  {isConcluido && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-lg">
                      CONCLUÍDO
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white mb-4 pr-16">{treino.nomeTreino}</h3>
                  
                  <div className="space-y-4 mb-6">
                    {treino.exercicios.map((ex, i) => (
                      <div key={i} className="flex flex-col gap-2.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/50">
                        <div className="flex justify-between text-sm text-slate-300">
                          <span className="font-semibold text-white">{ex.nome}</span>
                          <span className="text-slate-400 font-medium">{ex.series}x{ex.reps} {ex.carga && `— ${ex.carga}kg`}</span>
                        </div>
                        {/* SE O PERSONAL TIVER CARREGADO UMA IMAGEM, ELA É MOSTRADA AQUI */}
                        {ex.fotoUrl && (
                          <div className="relative rounded-xl overflow-hidden border border-slate-800/80 h-40">
                            <img src={ex.fotoUrl} alt={ex.nome} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => handleConcluirTreino(treino.id, treino.nomeTreino)}
                    disabled={isConcluido}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${isConcluido ? 'bg-green-500/10 text-green-500 cursor-not-allowed border border-green-500/20' : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95 shadow-lg shadow-orange-500/20'}`}
                  >
                    {isConcluido ? "Treino Finalizado ✔️" : "Marcar como Concluído"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}