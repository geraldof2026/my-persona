import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getClientsByTrainer, addClient } from "../../services/firestore";
import WorkoutBuilder from "./WorkoutBuilder";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para o formulário de novo aluno
  const [showModal, setShowModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  // Carrega os alunos do Firestore ao entrar na página
  async function loadClients() {
    try {
      setLoading(true);
      const data = await getClientsByTrainer(currentUser.uid);
      setClients(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, [currentUser.uid]);

  // Função para lidar com o registo de um novo aluno
  async function handleAddClientSubmit(e) {
    e.preventDefault();
    try {
      await addClient(currentUser.uid, {
        name: newClientName,
        email: newClientEmail,
        active: true,
      });
      
      // Limpa os campos, fecha o modal e recarrega a lista
      setNewClientName("");
      setNewClientEmail("");
      setShowModal(false);
      loadClients();
    } catch (error) {
      alert("Erro ao adicionar aluno. Verifique os dados.");
    }
  }

  return (

    if (selectedClient) {
  return (
    <WorkoutBuilder 
      client={selectedClient} 
      onBack={() => setSelectedClient(null)} 
    />
  );
}

    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 mb-8">
            My Persona
          </h2>
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-orange-400 font-medium rounded-xl transition-all">
              <span>👥</span> Alunos
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 rounded-xl transition-all">
              <span>🏋️‍♂️</span> Exercícios
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 rounded-xl transition-all">
              <span>📈</span> Finanças
            </a>
          </nav>
        </div>
        <button onClick={logout} className="w-full py-3 bg-red-950/40 hover:bg-red-900/40 text-red-400 font-medium rounded-xl border border-red-900/30 transition-all">
          Sair
        </button>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Painel de Controlo</h1>
            <p className="text-slate-400 text-sm mt-1">Gerencie os seus alunos e planos de treino.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/10 transition-all"
          >
            + Novo Aluno
          </button>
        </header>

        {/* CARDS DE MÉTRICAS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total de Alunos</span>
            <p className="text-4xl font-extrabold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
              {clients.length}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Treinos Ativos</span>
            <p className="text-4xl font-extrabold mt-2 text-slate-100">0</p>
          </div>
        </section>

        {/* TABELA DE ALUNOS */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-bold">Lista de Alunos</h3>
          </div>
          {loading ? (
            <div className="p-10 text-center text-slate-500">A carregar alunos...</div>
          ) : clients.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              Ainda não adicionou nenhum aluno. Clique em "+ Novo Aluno" para começar!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">E-mail</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-850 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-200">{client.name}</td>
                      <td className="px-6 py-4 text-slate-400">{client.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
                          Ativo
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedClient(client)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-all"
                        >
                                     Montar Treino
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* MODAL DE ADICIONAR ALUNO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Adicionar Novo Aluno</h3>
            <form onSubmit={handleAddClientSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Nome do Aluno</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="Nome Completo"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">E-mail do Aluno</label>
                <input
                  type="email"
                  required
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="aluno@email.com"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/10 transition-all"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}