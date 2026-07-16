import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      
      {/* Navegação de Topo */}
      <nav className="flex justify-between items-center p-6 lg:px-12 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-black tracking-tighter text-orange-500">
          MY<span className="text-white">PERSONA</span>
        </h1>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/login')} 
            className="px-4 py-2 text-slate-300 hover:text-white font-semibold transition-colors hidden sm:block"
          >
            Entrar
          </button>
          <button 
            onClick={() => navigate('/register')} 
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            Começar Grátis
          </button>
        </div>
      </nav>

      {/* Hero Section (Área Principal) */}
      <main className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-24 md:pt-32 md:pb-40 relative">
        {/* Efeito de brilho ao fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

        <span className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-4">Plataforma Premium</span>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight max-w-4xl text-slate-100">
          A Evolução do seu negócio de <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Personal Training</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl">
          Gerencie alunos, monte planos de treino e aumente a sua retenção numa plataforma com o seu estilo. Sem papel, sem complicação.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/register')} 
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Criar a minha conta
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </main>

      {/* Secção de Benefícios */}
      <section className="bg-slate-900/50 py-24 px-6 lg:px-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">💪</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Gestão Centralizada</h3>
            <p className="text-slate-400">Tenha todos os seus alunos organizados, com planos e contactos acessíveis à distância de um clique.</p>
          </div>
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Área do Aluno Premium</h3>
            <p className="text-slate-400">O seu aluno tem uma app dedicada para visualizar os treinos com clareza e interatividade (gamificação).</p>
          </div>
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-bold mb-3">WhatsApp Integrado</h3>
            <p className="text-slate-400">Avise os seus alunos instantaneamente quando um novo treino estiver disponível na plataforma.</p>
          </div>
        </div>
      </section>

      {/* Footer Simples */}
      <footer className="py-8 text-center border-t border-slate-800 text-slate-500 text-sm bg-slate-950">
        &copy; {new Date().getFullYear()} MyPersona. Todos os direitos reservados.
      </footer>
    </div>
  );
}