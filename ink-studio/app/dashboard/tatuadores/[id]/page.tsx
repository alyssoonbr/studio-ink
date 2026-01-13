"use client";

import { deleteDoc } from "firebase/firestore";
import { auth } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function PerfilTatuador() {
  const params = useParams();
  const id = params.id as string;
  const [role, setRole] = useState<string | null>(null);
  const [tatuador, setTatuador] = useState<any>(null);
  const [tatuagens, setTatuagens] = useState<any[]>([]);

  const handleDelete = async (tatuagemId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta tatuagem?")) return;

    await deleteDoc(doc(db, "tatuagens", tatuagemId));
    setTatuagens((prev) => prev.filter((t) => t.id !== tatuagemId));
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const snapUser = await getDoc(doc(db, "users", user.uid));
      if (snapUser.exists()) {
        setRole(snapUser.data().role);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const carregar = async () => {
      const ref = doc(db, "tatuadores", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const dados = snap.data();
        setTatuador(dados);

        const q = query(
          collection(db, "tatuagens"),
          where("tatuador", "==", dados.nome)
        );

        const tSnap = await getDocs(q);
        const lista: any[] = [];
        tSnap.forEach((d) => lista.push({ id: d.id, ...d.data() }));
        setTatuagens(lista);
      }
    };

    carregar();
  }, [id]);

  if (!tatuador) return <p className="text-white">Carregando...</p>;

  return (
    <main className="min-h-screen px-6 py-8 text-white">
      <h1 className="text-2xl font-bold text-orange-400 mb-4">
        {tatuador.nome}
      </h1>

      {tatuador.foto && (
        <img src={tatuador.foto} className="w-full max-w-md rounded-xl mb-4" />
      )}

      <p className="text-neutral-300 mb-4">{tatuador.especialidade}</p>

      <h2 className="text-xl font-bold text-orange-400 mb-2">
        Trabalhos realizados 🎨
      </h2>

      {tatuagens.length === 0 && (
        <p className="text-neutral-400">Nenhuma tatuagem cadastrada ainda.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tatuagens.map((t) => (
          <div
            key={t.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-3"
          >
            <img
              src={t.fotoUrl}
              className="w-full h-48 object-cover rounded-lg mb-2"
            />

            <h3 className="text-lg text-orange-400 font-bold">{t.titulo}</h3>
            <p className="text-neutral-300 text-sm">{t.descricao}</p>

            {role === "admin" && (
              <button
                onClick={() => handleDelete(t.id)}
                className="mt-2 text-red-400 hover:text-red-600 text-sm"
              >
                Excluir 🗑
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
