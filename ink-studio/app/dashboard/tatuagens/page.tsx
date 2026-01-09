"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function MinhasTatuagensPage() {
  const [tatuagens, setTatuagens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const q = query(
        collection(db, "tatuagens"),
        where("clienteId", "==", user.uid)
      );

      const snap = await getDocs(q);
      const lista: any[] = [];

      snap.forEach((d) => lista.push({ id: d.id, ...d.data() }));
      setTatuagens(lista);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <p className="text-white">Carregando...</p>;

  return (
    <main className="min-h-screen px-6 py-8 text-white">
      <h1 className="text-2xl font-bold text-orange-400 mb-4">
        Minhas Tatuagens 🖋️
      </h1>

      {tatuagens.length === 0 && (
        <p className="text-neutral-400">
          Você ainda não possui tatuagens cadastradas.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tatuagens.map((tattoo) => (
          <div
            key={tattoo.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-3"
          >
            <img
              src={tattoo.fotoUrl}
              alt={tattoo.titulo}
              className="w-full h-52 object-cover rounded-lg mb-3"
            />

            <h2 className="text-lg font-bold text-orange-400">
              {tattoo.titulo}
            </h2>

            <p className="text-sm text-neutral-300">
              <b>Tatuador:</b> {tattoo.tatuador}
            </p>

            <p className="text-sm text-neutral-300">
              <b>Data:</b> {tattoo.data}
            </p>

            {tattoo.descricao && (
              <p className="text-sm text-neutral-400 mt-1">
                {tattoo.descricao}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}