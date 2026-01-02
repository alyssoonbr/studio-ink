"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function MinhasTatuagensPage() {

  const [user, setUser] = useState<any>(null);
  const [tatuagens, setTatuagens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Verifica usuário logado
  useEffect(() => {
  const unsub = onAuthStateChanged(auth, (u) => {
    if (!u) {
      // Se não estiver logado, volta para login
      window.location.href = "/login";
      return;
    }

    setUser(u);
  });

  return () => unsub();
}, []);

  // 🎯 Carrega SOMENTE tatuagens do usuário logado
 useEffect(() => {
  if (!user) return;

  const carregarTatuagens = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "tatuagens"),
        where("clienteId", "==", user.uid)
      );

      const snap = await getDocs(q);

      const lista: any[] = [];
      snap.forEach((doc) => lista.push({ id: doc.id, ...doc.data() }));

      setTatuagens(lista);
    } catch (e) {
      console.error("Erro ao carregar tatuagens:", e);
    } finally {
      setLoading(false);
    }
  };

  carregarTatuagens();
}, [user]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <h1 className="text-2xl font-bold text-orange-400 mb-4">
        Minhas Tatuagens 🖋️
      </h1>

      {tatuagens.length === 0 && (
        <p className="text-white/60">Você ainda não possui tatuagens cadastradas.</p>
      )}

      <div className="space-y-4">
        {tatuagens.map((t) => (
          <div
            key={t.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-orange-500 transition"
          >
            <h2 className="text-lg font-semibold text-orange-300">{t.titulo}</h2>
            <p className="text-white/70 mt-1">🧑‍🎨 Tatuador: {t.tatuador}</p>
            <p className="text-white/70 mt-1">📅 Data: {t.data}</p>
            {t.descricao && (
              <p className="text-white/60 mt-1">📝 {t.descricao}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}