import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfile } from "firebase/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signup, loginWithGoogle } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    // Validação simples
    if (password !== confirmPassword) {
      return setError("As palavras-passe não coincidem.");
    }
    if (password.length < 6) {
      return setError("A palavra-passe deve ter pelo menos 6 caracteres.");
    }

    try {
      setError("");
      setLoading(true);
      
      // 1. Cria a conta no Firebase Auth
      const credenciais = await signup(email, password);
      
      // 2. Salva o nome que ele digitou no perfil do Firebase
      await updateProfile(credenciais.user, {
        displayName: name
      });

      // Se der tudo certo, o sistema vai logar automaticamente
      // e jogar o usuário para a tela de Onboarding!

    } catch (err) {
      // Tratamento de erros comuns do Firebase
      if (err.code === 'auth/email-already-in-use') {
        setError("Este e-mail já está cadastrado.");
      } else {
        setError("Falha ao criar conta. Tente novamente.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
    } catch (err) {
      setError("Falha ao autenticar com o Google.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl animate-in fade-in zoom-in-95 duration-300">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 tracking-tight">
            Criar Conta
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Junte-se ao MyPersona e transforme seus resultados
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Nome Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              placeholder="exemplo@email.com"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Palavra-passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Confirmar Palavra-passe</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              placeholder="Repita a palavra-passe"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 mt-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all"
          >
            {loading ? "A criar conta..." : "Registar"}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-wider">Ou</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
          className="w-full py-3 px-4 mb-6 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-200 font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.772 5.772 0 0 1 8.2 12.74a5.772 5.772 0 0 1 5.79-5.773c1.55 0 2.95.538 4.05 1.59l3.07-3.07C19.25 3.737 16.84 2.75 14 2.75c-5.1 0-9.25 4.15-9.25 9.25s4.15 9.25 9.25 9.25c5.54 0 9.25-3.9 9.25-9.42 0-.58-.05-1.12-.16-1.545H12.24z" />
          </svg>
          Registar com o Google
        </button>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Já tem uma conta?{" "}
            {/* Aqui você vai trocar pelo <Link> do React Router depois */}
            <a href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Iniciar Sessão
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}