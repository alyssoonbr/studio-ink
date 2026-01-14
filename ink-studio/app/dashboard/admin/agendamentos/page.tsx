"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  orderBy
} from "firebase/firestore";

export default function AdminAgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [tatuadores, setTatuadores] = useState<any[]>([]);
  const [tatuadorFiltro, setTatuadorFiltro] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        window.location.href = "/login";
        return;
      }

      const snap = await getDocs(query(collection(db, "users"), where("uid", "==", u.uid)));
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const carregar = async () => {
      const q = query(collection(db, "agendamentos"), orderBy("data"));
      const snap = await getDocs(q);
      const lista: any[] = [];
      snap.forEach((d) => lista.push({ id: d.id, ...d.data() }));
      setAgendamentos(lista);
    };

    carregar();
  }, []);

  useEffect(() => {
    const carregarTatuadores = async () => {
      const snap = await getDocs(collection(db, "tatuadores"));
      const lista: any[] = [];
      snap.forEach((d) => lista.push({ id: d.id, ...d.data() }));
      setTatuadores(lista);
    };

    carregarTatuadores();
  }, []);

  const alterarStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "agendamentos", id), { status });
    setAgendamentos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const filtrados = tatuadorFiltro
    ? agendamentos.filter((a) => a.tatuadorId === tatuadorFiltro)
    : agendamentos;

  return (
    <main className="min-h-screen px-6 py-8 text-white">
      <h1 className="text-2xl font-bold text-orange-400 mb-4">
        Agenda do Estúdio 📅
      </h1>

      <select
        value={tatuadorFiltro}
        onChange={(e) => setTatuadorFiltro(e.target.value)}
        className="mb-4 px-3 py-2 bg-black border border-neutral-700 rounded-lg"
      >
        <option value="">Todos os tatuadores</option>
        {tatuadores.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nome}
          </option>
        ))}
      </select>

      <div className="space-y-4">
        {filtrados.map((a) => (
          <div
            key={a.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
          >
            <p><b>Cliente:</b> {a.clienteNome}</p>
            <p><b>Tatuador:</b> {a.tatuadorNome}</p>
            <p><b>Data:</b> {a.data}</p>
            <p><b>Horário:</b> {a.horario}</p>
            <p><b>Status:</b> <span className="text-orange-400">{a.status}</span></p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => alterarStatus(a.id, "confirmado")}
                className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
              >
                Confirmar
              </button>

              <button
                onClick={() => alterarStatus(a.id, "reagendado")}
                className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-700"
              >
                Reagendar
              </button>

              <button
                onClick={() => alterarStatus(a.id, "cancelado")}
                className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}