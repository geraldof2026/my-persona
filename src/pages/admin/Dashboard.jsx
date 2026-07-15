import React from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const { currentUser, userProfile, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-white">
      
      {/* MENU LATERAL (SIDEBAR) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-2xl font-black tracking-tighter text-orange-500">
            MY<span className="text-white">PERSONA</span>
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-orange-500/10 text-orange-500 rounded-xl font-medium border border-orange-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Visão Geral
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Meus Alunos
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            Treinos
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Visão Geral</h1>
          <p className="text-slate-400 mt-1">
            Bem-vindo de volta, <span className="text-orange-500 font-semibold">{userProfile?.name || "Personal"}</span>! Veja o resumo do seu dia.
          </p>
        </header>

        {/* CARTÕES DE ESTATÍSTICAS (CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-slate-400 text-sm font-medium">Alunos Ativos</h3>
            <p className="text-3xl font-bold text-white mt-2">24</p>
            <p className="text-emerald-500 text-sm font-medium mt-2">+3 este mês</p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-slate-400 text-sm font-medium">Treinos Montados</h3>
            <p className="text-3xl font-bold text-white mt-2">156</p>
            <p className="text-slate-500 text-sm font-medium mt-2">Atualizado hoje</p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 border border-orange-400 p-6 rounded-2xl shadow-lg shadow-orange-500/20">
            <h3 className="text-orange-100 text-sm font-medium">Faturamento Estimado</h3>
            <p className="text-3xl font-bold text-white mt-2">R$ 3.450</p>
            <p className="text-orange-200 text-sm font-medium mt-2">Referente a Julho</p>
          </div>
        </div>

        {/* ÁREA DE AÇÕES RÁPIDAS */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
          <div className="flex gap-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              + Novo Aluno
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              Criar Treino
            </button>
          </div>
        </section>
      </main>

    </div>
  );
}