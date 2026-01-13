"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErro("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.log("LOGIN ERROR:", err.code); // debug

      if (err.code === "auth/user-not-found") {
        setErro(
          "Usuário não encontrado. Verifique o e-mail ou crie uma conta."
        );
      } else if (err.code === "auth/wrong-password") {
        setErro("Senha incorreta. Tente novamente.");
      } else if (err.code === "auth/invalid-credential") {
        setErro("E-mail ou senha incorretos.");
      } else if (err.code === "auth/invalid-email") {
        setErro("E-mail inválido.");
      } else {
        setErro("Não foi possível fazer login. Tente novamente.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 🔎 verifica se já existe no Firestore
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      // 🟢 se não existir → cria como CLIENTE
      if (!snap.exists()) {
        await setDoc(ref, {
          uid: user.uid,
          nome: user.displayName ?? "",
          email: user.email ?? "",
          telefone: "",
          nascimento: "",
          role: "cliente",
          createdAt: new Date(),
        });
      }

      router.push("/dashboard");
    } catch (error) {
      alert("Erro ao entrar com Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen flex items-center justify-center text-white px-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/banner-tattoo.png')" }}
    >
      <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-black/60 to-black/80 border border-orange-500 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,165,0,0.6)]">
        <img
          src="/logo.png"
          alt="Ink Studio"
          className="mx-auto mb-4 h-20 w-20 rounded-full shadow-[0_0_20px_rgba(255,165,0,0.8)]"
        />

        <h1 className="text-2xl font-bold text-center mb-6 text-orange-400">
          Ink Studio Curitiba{" "}
        </h1>

        <p className="text-center text-xs uppercase tracking-widest text-white/60 mb-6">
          Estúdio de Tatuagem
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg"
          />

          {erro && <p className="text-red-400 text-sm text-center">{erro}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-600 font-bold text-black transition"
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-12 rounded-lg border border-neutral-700 text-white hover:bg-neutral-800 transition mt-4 flex items-center justify-center gap-3"
          >
            <img src="/google.png" alt="Google" className="h-5 w-5" />
            <span className="font-medium">Entrar com Google</span>
          </button>
        </form>

        <div className="mt-6 text-sm flex justify-between text-neutral-400">
          <Link href="/esqueci-senha" className="hover:text-orange-400">
            Esqueci a senha
          </Link>
          <Link href="/register" className="hover:text-orange-400">
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}
