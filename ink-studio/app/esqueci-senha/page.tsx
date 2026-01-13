"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setMensagem("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);

      setMensagem(
        "Enviamos um link de recuperação para seu e-mail. Verifique sua caixa de entrada e o spam."
      );
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setErro("Nenhuma conta encontrada com este e-mail.");
      } else if (err.code === "auth/invalid-email") {
        setErro("E-mail inválido.");
      } else {
        setErro("Não foi possível enviar o e-mail. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-orange-400 mb-4 text-center">
          Recuperar senha
        </h1>

        <p className="text-sm text-neutral-400 mb-4 text-center">
          Informe o e-mail da sua conta para receber o link de redefinição.
        </p>

        <form onSubmit={handleReset} className="space-y-3">
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-neutral-700 rounded-lg"
            required
          />

          {erro && <p className="text-red-400 text-sm text-center">{erro}</p>}
          {mensagem && (
            <p className="text-green-400 text-sm text-center">{mensagem}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-600 font-bold text-black transition disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar link de recuperação"}
          </button>
        </form>

        <p className="mt-4 text-sm text-neutral-400 text-center">
          Lembrou a senha?{" "}
          <a href="/login" className="text-orange-400">
            Voltar ao login
          </a>
        </p>
      </div>
    </main>
  );
}
