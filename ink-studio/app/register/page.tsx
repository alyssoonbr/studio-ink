"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, senha);

      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        nome,
        telefone,
        nascimento,
        email,
        role: "cliente",
        createdAt: new Date(),
      });

      router.push("/login");

    } catch (err: any) {

      if (err.code === "auth/email-already-in-use") {
        setErro("Este e-mail já está cadastrado. Faça login ou recupere a senha.");
      } else if (err.code === "auth/weak-password") {
        setErro("A senha precisa ter pelo menos 6 caracteres.");
      } else {
        setErro("Não foi possível criar a conta. Tente novamente.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6">

        <h1 className="text-2xl font-bold text-orange-400 mb-4">
          Criar conta
        </h1>

        <form onSubmit={handleRegister} className="space-y-3">

          <input type="text" placeholder="Nome completo" value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-neutral-700 rounded-lg" required />

          <input type="tel" placeholder="Telefone" value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-neutral-700 rounded-lg" required />

          <input type="date" value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-neutral-700 rounded-lg" required />

          <input type="email" placeholder="E-mail" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-neutral-700 rounded-lg" required />

          <input type="password" placeholder="Senha" value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-neutral-700 rounded-lg" required />

          {erro && (
            <p className="text-red-400 text-sm text-center">{erro}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-600 font-bold text-black transition disabled:opacity-60">
            {loading ? "Criando conta..." : "Registrar"}
          </button>
        </form>

        <p className="mt-4 text-sm text-neutral-400 text-center">
          Já tem conta? <a href="/login" className="text-orange-400">Entrar</a>
        </p>
      </div>
    </main>
  );
}