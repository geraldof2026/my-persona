import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import { toast } from "sonner"; // <-- Nova importação

export default function ProfileSettings() {
  const { currentUser } = useAuth();
  const [name, setName] = useState(currentUser?.displayName || "");
  const [loading, setLoading] = useState(false);

  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(currentUser, { displayName: name });
      toast.success("Perfil atualizado com sucesso!"); // <-- Notificação premium
    } catch (error) {
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleUpdate} className="h-full flex flex-col justify-center">
      <h3 className="text-lg font-bold mb-4 text-white">Editar Perfil</h3>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        placeholder="O seu nome"
        className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 text-white outline-none focus:border-orange-500 transition-colors"
      />
      <button 
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-bold transition-colors w-full md:w-auto" 
        disabled={loading}
      >
        {loading ? "A guardar..." : "Salvar Alterações"}
      </button>
    </form>
  );
}