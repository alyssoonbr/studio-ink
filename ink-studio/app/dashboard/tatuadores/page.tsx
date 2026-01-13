"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function TatuadoresPage() {
  const [tatuadores, setTatuadores] = useState<any[]>([]);

  useEffect(() => {
    const carregar = async () => {
      const snap = await getDocs(collection(db, "tatuadores"));
      const lista: any[] = [];
      snap.forEach((d) => lista.push({ id: d.id, ...d.data() }));
      setTatuadores(lista);
    };

    carregar();
  }, []);

  return (
    <main className="min-h-screen px-6 py-8 text-white">
      <h1 className="text-2xl font-bold text-orange-400 mb-4">
        Tatuadores do Estúdio 🧑‍🎨
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tatuadores.map((t) => (
          <Link
            key={t.id}
            href={`/dashboard/tatuadores/${t.id}`}
            className="block bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-orange-500 transition"
          >
            <h3 className="text-lg font-bold text-orange-400">{t.nome}</h3>
            <p className="text-neutral-400 text-sm">{t.especialidade}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
