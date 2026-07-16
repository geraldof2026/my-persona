import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PublicTrainerProfile() {
  const { id } = useParams(); // Pega o ID do personal na URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trainer, setTrainer] = useState(null);

  // Simulando a busca no banco de dados (Vamos integrar na próxima etapa)
  useEffect(() => {
    setTimeout(() => {
      setTrainer({
        nome: "Marcão Personal",
        especialidade: "Especialista em Treinamento de Força e Condicionamento",
        preco: "150",
        foto: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sobre: "Profissional de Educação Física com foco na promoção da saúde, qualidade de vida e desenvolvimento físico. Especialista no treinamento de força para atletas profissionais e amadores. Comprometido com atendimento humanizado e resultados contínuos.",
        metodologia: "O meu acompanhamento vai além da academia. A nossa metodologia é baseada em biomecânica e periodização. Terá acesso 100% digital à minha plataforma, onde envio os seus treinos estruturados, com vídeos demonstrativos de execução e avaliações periódicas."
      });
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">A preparar vitrine...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-orange-500/30">
      
      {/* HEADER DA PLATAFORMA */}
      <nav className="p-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center">
        <h1 className="text-xl font-black text-orange-500 cursor-pointer" onClick={() => navigate('/')}>
          MY<span className="text-white">PERSONA</span>
        </h1>
        <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-400 hover:text-white">Sou Personal</button>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 mt-4">
        
        {/* COLUNA ESQUERDA (CARD FOTO E PREÇO - FIXO NA TELA) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl lg:sticky lg:top-28">
            <div className="w-full h-72 rounded-2xl overflow-hidden mb-6 border border-slate-700/50">
              <img src={trainer.foto} alt={trainer.nome} className="w-full h-full object-cover" />
            </div>
            
            <h2 className="text-2xl font-bold mb-1">{trainer.nome}</h2>
            <div className="flex items-center gap-2 text-orange-500 font-semibold mb-6">
              <span>⭐ 5.0</span>
              <span className="text-slate-500 text-sm font-normal">(Avaliado por alunos reais)</span>
            </div>
            
            <div className="bg-slate-950/60 rounded-2xl p-5 mb-6 border border-slate-800/50 flex justify-between items-center">
              <span className="text-slate-400 font-medium">Plano Mensal</span>
              <span className="text-2xl font-black text-white">R$ {trainer.preco}</span>
            </div>

            <button 
              onClick={() => alert(`Isto levará o aluno para o Registo, já vinculado ao personal: ${id}`)}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-lg"
            >
              Começar a Treinar
            </button>
            
            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">🔒 <span className="flex-1">Pagamento seguro pela plataforma</span></div>
              <div className="flex items-center gap-2">⚡ <span className="flex-1">Acesso imediato aos treinos</span></div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA (TEXTOS DE VENDA) */}
        <div className="lg:col-span-8 space-y-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-slate-100">{trainer.especialidade}</h1>
            <div className="flex flex-wrap gap-3">
              <span className="bg-orange-500/10 text-orange-500 px-4 py-2 rounded-lg text-sm font-bold border border-orange-500/20">Presencial ou Online</span>
              <span className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium">Tempo de resposta: 1h</span>
              <span className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium">App Exclusivo</span>
            </div>
          </div>

          <hr className="border-slate-800/60" />

          <section>
            <h3 className="text-2xl font-bold mb-4 text-white">O perfil do profissional</h3>
            <p className="text-slate-300 leading-relaxed text-lg">{trainer.sobre}</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-white">Como funciona o treino?</h3>
            <div className="bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-800/80 shadow-xl">
              <p className="text-slate-300 leading-relaxed mb-6">{trainer.metodologia}</p>
              
              <h4 className="font-bold text-white mb-4">O que está incluído:</h4>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start text-slate-300">
                  <span className="text-orange-500 bg-orange-500/10 p-1.5 rounded-lg">📱</span> 
                  <div><strong className="text-white block">Área do Aluno</strong> Acesso pelo celular para ver os treinos e marcar conclusão.</div>
                </li>
                <li className="flex gap-4 items-start text-slate-300">
                  <span className="text-orange-500 bg-orange-500/10 p-1.5 rounded-lg">🎥</span> 
                  <div><strong className="text-white block">Vídeos Demonstrativos</strong> Não sabe fazer um exercício? Veja fotos ou GIFs diretamente no treino.</div>
                </li>
                <li className="flex gap-4 items-start text-slate-300">
                  <span className="text-orange-500 bg-orange-500/10 p-1.5 rounded-lg">💬</span> 
                  <div><strong className="text-white block">Suporte WhatsApp</strong> Contato direto para tirar dúvidas sobre execuções ou dores.</div>
                </li>
              </ul>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}