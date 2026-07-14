import React, { useState } from "react";
import { createWorkoutForClient } from "../../services/firestore";

export default function WorkoutBuilder({ client, onBack }) {
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: 4, reps: "10", restSeconds: 60 } // Exercício inicial vazio
  ]);
  const [loading, setLoading] = useState(false);

  // Adiciona uma nova linha de exercício ao formulário
  function handleAddExerciseRow() {
    setExercises([...exercises, { name: "", sets: 4, reps: "10", restSeconds: 60 }]);
  }

  // Remove uma linha de exercício
  function handleRemoveExerciseRow(index) {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
  }

  // Atualiza um campo específico de um exercício específico na lista
  function handleExerciseChange(index, field, value) {
    const updated = exercises.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setExercises(updated);
  }

  // Submete o treino completo para o Firestore
  async function handleSaveWorkout(e) {
    e.preventDefault();
    if (!workoutTitle.trim()) return alert("Por favor, dê um título ao treino.");
    
    // Validação básica
    const hasEmptyExercise = exercises.some(ex => !ex.name.trim());
    if (hasEmptyExercise) return alert("Por favor, preencha o nome de todos os exercícios.");

    try {
      setLoading(true);
      await createWorkoutForClient(client.id, {
        title: workoutTitle,
        exercises: exercises
      });
      alert("Treino criado e atribuído com sucesso!");
      onBack(); // Volta para o Dashboard
    } catch (error) {
      alert("Erro ao guardar o treino.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <button 
              onClick={onBack}
              className="text-orange-400 hover:text-orange-300 font-medium flex items-center gap-2 mb-2 transition-colors"
            >
              ← Voltar para Alunos
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Montar Treino para <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">{client.name}</span>
            </h1>
          </div>
        </header>

        <form onSubmit={handleSaveWorkout} className="space-y-6">
          {/* Título do Treino */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <label className="block text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
              Título do Treino (ex: Treino A - Peito e Tríceps)
            </label>
            <input
              type="text"
              required
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
              placeholder="Digite o título..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-lg font-bold"
            />
          </div>

          {/* Exercícios */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold mb-4">Exercícios do Treino</h3>
            
            {exercises.map((exercise, index) => (
              <div 
                key={index} 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800 relative group"
              >
                {/* Nome do Exercício */}
                <div className="md:col-span-5">
                  <label className="block text-slate-500 text-xs font-semibold uppercase mb-1">Exercício</label>
                  <input
                    type="text"
                    required
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                    placeholder="ex: Supino Reto"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500 transition-all text-sm"
                  />
                </div>

                {/* Séries */}
                <div className="md:col-span-2">
                  <label className="block text-slate-500 text-xs font-semibold uppercase mb-1">Séries</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={exercise.sets}
                    onChange={(e) => handleExerciseChange(index, "sets", parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500 transition-all text-sm text-center"
                  />
                </div>

                {/* Repetições */}
                <div className="md:col-span-2">
                  <label className="block text-slate-500 text-xs font-semibold uppercase mb-1">Repetições</label>
                  <input
                    type="text"
                    required
                    value={exercise.reps}
                    onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                    placeholder="10 ou 12-15"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500 transition-all text-sm text-center"
                  />
                </div>

                {/* Descanso */}
                <div className="md:col-span-2">
                  <label className="block text-slate-500 text-xs font-semibold uppercase mb-1">Descanso (s)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={exercise.restSeconds}
                    onChange={(e) => handleExerciseChange(index, "restSeconds", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500 transition-all text-sm text-center"
                  />
                </div>

                {/* Botão Remover Linha */}
                <div className="md:col-span-1 flex items-end justify-center pb-1">
                  <button
                    type="button"
                    onClick={() => handleRemoveExerciseRow(index)}
                    disabled={exercises.length === 1}
                    className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg disabled:opacity-30 transition-all"
                    title="Remover exercício"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddExerciseRow}
              className="w-full py-3 bg-slate-950 hover:bg-slate-850 border border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 font-semibold rounded-xl transition-all"
            >
              + Adicionar Exercício
            </button>
          </div>

          {/* Botões de Ação Final */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all disabled:opacity-50"
            >
              {loading ? "A guardar..." : "Guardar e Enviar Treino"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}