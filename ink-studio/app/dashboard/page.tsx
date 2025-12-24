"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">
          Bem-vindo ao Ink Studio
        </h1>

        <p className="text-white/70 mb-8">
          Você está logado com <strong>{user.email}</strong>
        </p>

         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
         <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-500 transition cursor-pointer">
         <h2 className="text-xl font-semibold mb-2">🧑‍🎨 Tatuadores</h2>
         <p className="text-white/60 text-sm">
            Conheça nossos artistas e seus estilos.</p>
         </div>

         <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-500 transition cursor-pointer">
         <h2 className="text-xl font-semibold mb-2">🖋️ Minhas Tatuagens</h2>
         <p className="text-white/60 text-sm">
           Veja suas tattoos já realizadas.</p>
         </div>

 
         <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-500 transition cursor-pointer">
         <h2 className="text-xl font-semibold mb-2">📅 Agendamentos</h2>
         <p className="text-white/60 text-sm">
          Marque ou acompanhe sessões.</p>
         </div>


         <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-500 transition cursor-pointer">
         <h2 className="text-xl font-semibold mb-2">💬 Chat</h2>
         <p className="text-white/60 text-sm">
           Fale com nosso assistente de tatuagem.</p>
         </div>

         </div>

         <button
          onClick={handleLogout}
          className="mt-10 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition font-bold" >
          Sair
        </button>
      </div>
    </main>
  );
}