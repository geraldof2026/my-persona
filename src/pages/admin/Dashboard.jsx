import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { addStudent, getStudentsByPersonal, deleteStudent, addWorkout, getWorkoutsByPersonal } from "../../services/firestore";
import ProfileSettings from "../../components/ProfileSettings";
import { toast } from "sonner";

export default function Dashboard() {
  const { currentUser, userProfile, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState("geral");

  // Estados dos Alunos
  const [isAlunoModalOpen, setIsAlunoModalOpen] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [loadingAlunos, setLoadingAlunos] = useState(true);
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novoPlano, setNovoPlano] = useState("Mensal");
  const [salvandoAluno, setSalvandoAluno] = useState(false);

  // Estados dos Treinos
  const [isTreinoModalOpen, setIsTreinoModalOpen] = useState(false);
  const [treinos, setTreinos] = useState([]);
  const [loadingTreinos, setLoadingTreinos] = useState(true);
  const [salvandoTreino, setSalvandoTreino] = useState(false);

  const [treinoNome, setTreinoNome] = useState("");
  const [alunoSelecionado, setAlunoSelecionado] = useState("");
  const [exercicios, setExercicios] = useState([{ nome: "", series: "4", reps: "12", carga: "" }]);

  useEffect(() => {
    async function carregarDados() {
      if (currentUser?.uid) {
        try {
          const listaAlunos = await getStudentsByPersonal(currentUser.uid);
          setAlunos(listaAlunos);
          setLoadingAlunos(false);

          const listaTreinos = await getWorkoutsByPersonal(currentUser.uid);
          setTreinos(listaTreinos);
          setLoadingTreinos(false);
        } catch (error) {
          toast.error("Erro ao carregar dados do servidor.");
        }
      }
    }
    carregarDados();
  }, [currentUser]);

  async function handleAddStudent(e) {
    e.preventDefault();
    if (!novoNome || !novoEmail) return;

    try {
      setSalvandoAluno(true);
      const dadosDoAluno = { 
        nome: novoNome, 
        email: novoEmail, 
        telefone: novoTelefone, 
        plano: novoPlano, 
        status: "Ativo" 
      };
      const alunoSalvo = await addStudent(currentUser.uid, dadosDoAluno);
      setAlunos([alunoSalvo, ...alunos]); 
      setNovoNome(""); setNovoEmail(""); setNovoTelefone(""); setNovoPlano("Mensal");
      setIsAlunoModalOpen(false);
      toast.success("Aluno registado com sucesso!");
    } catch (error) {
      toast.error("Falha ao registar o aluno.");
    } finally {
      setSalvandoAluno(false);
    }
  }

  async function handleDeleteStudent(idDoAluno) {
    if (!window.confirm("Deseja mesmo eliminar este aluno?")) return;
    try {
      await deleteStudent(idDoAluno);
      setAlunos(alunos.filter(aluno => aluno.id !== idDoAluno));
      toast.success("Aluno eliminado permanentemente.");
    } catch (error) {
      toast.error("Erro ao eliminar aluno.");
    }
  }

  function handleAddExercicioField() {
    setExercicios([...exercicios, { nome: "", series: "4", reps: "12", carga: "" }]);
  }

  function handleExercicioChange(index, field, value) {
    const novosExercicios = [...exercicios];
    novosExercicios[index][field] = value;
    setExercicios(novosExercicios);
  }

  async function handleAddWorkout(e) {
    e.preventDefault();
    if (!treinoNome || !alunoSelecionado) {
      toast.warning("Selecione um aluno e dê um nome ao treino.");
      return;
    }

    try {
      setSalvandoTreino(true);
      const alunoObj = alunos.find(a => a.id === alunoSelecionado);
      const dadosDoTreino = {
        nomeTreino: treinoNome,
        alunoId: alunoSelecionado,
        alunoNome: alunoObj ? alunoObj.nome : "Aluno Desconhecido",
        exercicios: exercicios.filter(ex => ex.nome !== "")
      };

      const treinoSalvo = await addWorkout(currentUser.uid, dadosDoTreino);
      setTreinos([treinoSalvo, ...treinos]);

      setTreinoNome(""); setAlunoSelecionado("");
      setExercicios([{ nome: "", series: "4", reps: "12", carga: "" }]);
      setIsTreinoModalOpen(false);
      toast.success("Treino guardado e enviado para o aluno!");
    } catch (error) {
      toast.error("Erro ao guardar o treino.");
    } finally {
      setSalvandoTreino(false);
    }
  }

  function getWhatsAppLink(aluno) {
    const numeroLimpo = aluno.telefone?.replace(/\D/g, '') || "";
    const mensagem = encodeURIComponent(`Olá ${aluno.nome}, o teu novo treino já está no sistema! Acesse o teu painel aqui: https://my-persona-2026.web.app`);
    return `https://wa.me/55${numeroLimpo}?text=${mensagem}`;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans text-white">
      
      {/* CABEÇALHO MOBILE (SÓ APARECE NO CELULAR) */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
        <h2 className="text-xl font-black text-orange-500">MY<span className="text-white">PERSONA</span></h2>
        <button onClick={logout} className="text-slate-400 hover:text-white flex items-center gap-2">
          Sair do Sistema
        </button>
      </div>

      {/* MENU DE ABAS MOBILE */}
      <div className="md:hidden flex overflow-x-auto bg-slate-950 border-b border-slate-800 p-3 gap-3 hide-scrollbar">
        <button onClick={() => setActiveTab("geral")} className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium ${activeTab === "geral" ? "bg-orange-500/20 text-orange-500 border border-orange-500/30" : "bg-slate-900 text-slate-400"}`}>Visão Geral</button>
        <button onClick={() => setActiveTab("alunos")} className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium ${activeTab === "alunos" ? "bg-orange-500/20 text-orange-500 border border-orange-500/30" : "bg-slate-900 text-slate-400"}`}>Meus Alunos</button>
        <button onClick={() => setActiveTab("treinos")} className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium ${activeTab === "treinos" ? "bg-orange-500/20 text-orange-500 border border-orange-500/30" : "bg-slate-900 text-slate-400"}`}>Treinos</button>
      </div>

      {/* SIDEBAR DESKTOP */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-2xl font-black tracking-tighter text-orange-500">MY<span className="text-white">PERSONA</span></h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab("geral")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "geral" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>Visão Geral</button>
          <button onClick={() => setActiveTab("alunos")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "alunos" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>Meus Alunos</button>
          <button onClick={() => setActiveTab("treinos")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "treinos" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>Treinos</button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">Sair do Sistema</button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL (Manteve-se igual) */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {activeTab === "geral" && (
          <div>
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Visão Geral</h1>
                <p className="text-slate-400 mt-1">Bem-vindo, <span className="text-orange-500 font-semibold">{currentUser?.displayName || userProfile?.name || "Personal"}</span>!</p>
              </div>
              <button onClick={() => setIsAlunoModalOpen(true)} className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/20 active:scale-95 transition-all">+ Novo Aluno</button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-6 rounded-3xl shadow-xl">
                <h3 className="text-slate-400 text-sm">Alunos Ativos</h3>
                <p className="text-3xl font-bold mt-2">{loadingAlunos ? "..." : alunos.length}</p>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-6 rounded-3xl shadow-xl">
                <h3 className="text-slate-400 text-sm">Treinos Ativos</h3>
                <p className="text-3xl font-bold mt-2">{loadingTreinos ? "..." : treinos.length}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-3xl shadow-xl shadow-orange-500/10">
                <h3 className="text-orange-100 text-sm">Faturamento</h3>
                <p className="text-3xl font-bold mt-2">R$ {alunos.length * 150}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-6 rounded-3xl shadow-xl">
                <ProfileSettings />
              </div>
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-6 rounded-3xl shadow-xl">
                <h3 className="text-lg font-bold mb-4 text-white">Dicas Rápidas</h3>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li className="flex gap-2">💡 Mantenha os planos dos alunos atualizados.</li>
                  <li className="flex gap-2">📱 O site agora pode ser instalado no celular!</li>
                  <li className="flex gap-2">🔗 O seu site oficial: <a href="https://my-persona-2026.web.app" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">my-persona-2026.web.app</a></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "alunos" && (
          <div>
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">Gestão de Alunos</h1>
              <button onClick={() => setIsAlunoModalOpen(true)} className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/20 active:scale-95 transition-all">+ Adicionar Aluno</button>
            </header>

            <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-4 md:p-6 shadow-xl overflow-hidden">
              {loadingAlunos ? (
                <div className="text-center py-8">A carregar alunos...</div>
              ) : alunos.length === 0 ? (
                <div className="text-center py-8 text-slate-500">Nenhum aluno registado.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-sm">
                        <th className="py-3 px-4">Nome</th>
                        <th className="py-3 px-4">Contacto</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alunos.map(aluno => (
                        <tr key={aluno.id} className="border-b border-slate-800/30 text-slate-300 hover:bg-slate-800/20 transition-colors">
                          <td className="py-4 px-4 font-semibold text-white">{aluno.nome}</td>
                          <td className="py-4 px-4">
                            <div className="text-sm">{aluno.email}</div>
                            {aluno.telefone && <div className="text-xs text-slate-500">{aluno.telefone}</div>}
                          </td>
                          <td className="py-4 px-4 text-right flex justify-end gap-2">
                            <a href={getWhatsAppLink(aluno)} target="_blank" rel="noreferrer" className="text-green-500 hover:bg-green-500/10 px-3 py-2 rounded-lg transition-colors text-sm font-semibold">WhatsApp</a>
                            <button onClick={() => handleDeleteStudent(aluno.id)} className="text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors text-sm">Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "treinos" && (
          <div>
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">Planos de Treino</h1>
              <button onClick={() => setIsTreinoModalOpen(true)} disabled={alunos.length === 0} className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 disabled:bg-slate-800 disabled:text-slate-500 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/20 active:scale-95 transition-all">+ Criar Treino</button>
            </header>

            {alunos.length === 0 && <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl">Precisa de registar pelo menos um aluno antes de poder criar treinos.</div>}

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loadingTreinos ? (
                <div className="col-span-2 text-center py-8">A carregar treinos...</div>
              ) : treinos.length === 0 ? (
                <div className="col-span-2 text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500">Nenhum treino criado ainda.</div>
              ) : (
                treinos.map(treino => (
                  <div key={treino.id} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-6 rounded-3xl shadow-xl hover:border-orange-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{treino.nomeTreino}</h3>
                        <p className="text-sm text-orange-500 font-semibold mt-1">Aluno: {treino.alunoNome}</p>
                      </div>
                    </div>
                    <div className="space-y-2 border-t border-slate-800/50 pt-4">
                      {treino.exercicios.map((ex, i) => (
                        <div key={i} className="flex justify-between text-sm text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/50">
                          <span className="font-medium text-white">{ex.nome}</span>
                          <span className="text-slate-400">{ex.series}x{ex.reps} {ex.carga && `— ${ex.carga}kg`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </section>
          </div>
        )}

      </main>

      {/* MODAL NOVO ALUNO */}
      {isAlunoModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Registar Novo Aluno</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input type="text" placeholder="Nome Completo" required value={novoNome} onChange={(e) => setNovoNome(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-orange-500" />
              <input type="email" placeholder="E-mail do Aluno" required value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-orange-500" />
              <input type="text" placeholder="WhatsApp (Ex: 11999998888)" value={novoTelefone} onChange={(e) => setNovoTelefone(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-orange-500" />
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsAlunoModalOpen(false)} className="flex-1 py-3 bg-slate-800 rounded-xl">Cancelar</button>
                <button type="submit" disabled={salvandoAluno} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold">{salvandoAluno ? "..." : "Salvar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO TREINO */}
      {isTreinoModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Criar Novo Treino</h2>
            <form onSubmit={handleAddWorkout} className="space-y-4">
              <select required value={alunoSelecionado} onChange={(e) => setAlunoSelecionado(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none">
                <option value="">-- Escolha o aluno --</option>
                {alunos.map(a => (<option key={a.id} value={a.id}>{a.nome}</option>))}
              </select>
              <input type="text" required placeholder="Nome do Treino" value={treinoNome} onChange={(e) => setTreinoNome(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" />
              
              <div className="border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Exercícios</h3>
                  <button type="button" onClick={handleAddExercicioField} className="text-orange-500 font-bold">+ Adicionar</button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {exercicios.map((ex, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="col-span-12 md:col-span-6"><input type="text" placeholder="Nome" required value={ex.nome} onChange={(e) => handleExercicioChange(index, "nome", e.target.value)} className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-sm outline-none" /></div>
                      <div className="col-span-4 md:col-span-2"><input type="number" placeholder="Séries" required value={ex.series} onChange={(e) => handleExercicioChange(index, "series", e.target.value)} className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-sm text-center outline-none" /></div>
                      <div className="col-span-4 md:col-span-2"><input type="text" placeholder="Reps" required value={ex.reps} onChange={(e) => handleExercicioChange(index, "reps", e.target.value)} className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-sm text-center outline-none" /></div>
                      <div className="col-span-4 md:col-span-2"><input type="number" placeholder="Kg" value={ex.carga} onChange={(e) => handleExercicioChange(index, "carga", e.target.value)} className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-sm text-center outline-none" /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsTreinoModalOpen(false)} className="flex-1 py-3 bg-slate-800 rounded-xl">Cancelar</button>
                <button type="submit" disabled={salvandoTreino} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold">{salvandoTreino ? "..." : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}