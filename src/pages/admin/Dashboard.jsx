import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { addStudent, getStudentsByPersonal } from "../../services/firestore";

export default function Dashboard() {
  const { currentUser, userProfile, logout } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [loadingDados, setLoadingDados] = useState(true);

  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoPlano, setNovoPlano] = useState("Mensal");
  const [salvando, setSalvando] = useState(false);

  // 1. EFEITO QUE RODA AO ABRIR A TELA: Busca os alunos no Firebase
  useEffect(() => {
    async function carregarAlunos() {
      if (currentUser?.uid) {
        try {
          const listaAlunos = await getStudentsByPersonal(currentUser.uid);
          setAlunos(listaAlunos);
        } catch (error) {
          console.error("Erro ao buscar alunos:", error);
        } finally {
          setLoadingDados(false);
        }
      }
    }
    carregarAlunos();
  }, [currentUser]);

  // 2. FUNÇÃO QUE SALVA NO FIREBASE QUANDO CLICA NO BOTÃO
  async function handleAddStudent(e) {
    e.preventDefault();
    if (!novoNome || !novoEmail) return;

    try {
      setSalvando(true);
      
      const dadosDoAluno = {
        nome: novoNome,
        email: novoEmail,
        plano: novoPlano,
        status: "Ativo"
      };

      // Salva na nuvem
      const alunoSalvo = await addStudent(currentUser.uid, dadosDoAluno);

      // Atualiza a tela imediatamente com o novo aluno
      setAlunos([alunoSalvo, ...alunos]); 
      
      // Limpa tudo e fecha a janela
      setNovoNome("");
      setNovoEmail("");
      setNovoPlano("Mensal");
      setIsModalOpen(false);
      
    } catch (error) {
      console.error("Erro ao salvar o aluno:", error);
      alert("Houve um erro ao salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-white relative">
      
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-2xl font-black tracking-tighter text-orange-500">
            MY<span className="text-white">PERSONA</span>
          </h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-orange-500/10 text-orange-500 rounded-xl font-medium border border-orange-500/20">
            Visão Geral
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Visão Geral</h1>
            <p className="text-slate-400 mt-1">
              Bem-vindo de volta, <span className="text-orange-500 font-semibold">{userProfile?.name || "Personal"}</span>!
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-all"
          >
            + Novo Aluno
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-slate-400 text-sm font-medium">Alunos Ativos</h3>
            <p className="text-3xl font-bold text-white mt-2">
              {loadingDados ? "..." : alunos.filter(a => a.status === "Ativo").length}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-slate-400 text-sm font-medium">Treinos Montados</h3>
            <p className="text-3xl font-bold text-white mt-2">0</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 border border-orange-400 p-6 rounded-2xl shadow-lg shadow-orange-500/20">
            <h3 className="text-orange-100 text-sm font-medium font-semibold">Faturamento Estimado</h3>
            <p className="text-3xl font-bold text-white mt-2">R$ 0</p>
          </div>
        </div>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Seus Alunos</h2>
          
          {loadingDados ? (
            <div className="text-center py-8 text-slate-500">A carregar dados da nuvem...</div>
          ) : alunos.length === 0 ? (
            <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
              Você ainda não tem alunos cadastrados. Clique no botão acima para começar!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-sm">
                    <th className="py-3 px-4">Nome</th>
                    <th className="py-3 px-4">E-mail</th>
                    <th className="py-3 px-4">Plano</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {alunos.map((aluno) => (
                    <tr key={aluno.id} className="text-slate-300 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 font-semibold text-white">{aluno.nome}</td>
                      <td className="py-4 px-4 text-slate-400">{aluno.email}</td>
                      <td className="py-4 px-4">{aluno.plano}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {aluno.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Cadastrar Novo Aluno</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1">Nome Completo</label>
                <input type="text" required value={novoNome} onChange={(e) => setNovoNome(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1">E-mail</label>
                <input type="email" required value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1">Plano</label>
                <select value={novoPlano} onChange={(e) => setNovoPlano(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none">
                  <option value="Mensal">Mensal</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-xl">Cancelar</button>
                <button type="submit" disabled={salvando} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold">{salvando ? "A salvar..." : "Salvar Aluno"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}