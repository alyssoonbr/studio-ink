"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";

const horariosDisponiveis = [
  "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00",
  "16:00", "17:00",
];

export default function AgendamentosPage() {
  const [user, setUser] = useState<any>(null);
  const [tatuadores, setTatuadores] = useState<any[]>([]);
  const [tatuadorId, setTatuadorId] = useState("");
  const [tatuadorNome, setTatuadorNome] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    return () => unsub();
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

  // 🔍 Busca horários já ocupados
  useEffect(() => {
    const buscarHorariosOcupados = async () => {
      if (!tatuadorId || !data) return;

      const q = query(
        collection(db, "agendamentos"),
        where("tatuadorId", "==", tatuadorId),
        where("data", "==", data)
      );

      const snap = await getDocs(q);
      const ocupados: string[] = [];
      snap.forEach((d) => ocupados.push(d.data().horario));
      setHorariosOcupados(ocupados);
    };

    buscarHorariosOcupados();
  }, [tatuadorId, data]);

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");

    if (!user || !tatuadorId || !data || !horario) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    if (horariosOcupados.includes(horario)) {
      setMensagem("Este horário já está ocupado.");
      return;
    }

    await addDoc(collection(db, "agendamentos"), {
      clienteId: user.uid,
      clienteNome: user.displayName || "Cliente",
      tatuadorId,
      tatuadorNome,
      data,
      horario,
      status: "pendente",
      createdAt: new Date(),
    });

    setMensagem("Agendamento solicitado com sucesso! ⏳");
    setHorario("");
  };

  return (
    <main className="min-h-screen px-6 py-8 text-white">
      <h1 className="text-2xl font-bold text-orange-400 mb-4">
        Agendar Sessão 📅
      </h1>

      <form
        onSubmit={handleAgendar}
        className="max-w-md bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-3"
      >
        <select
          className="w-full p-2 bg-black border border-neutral-700 rounded-lg"
          value={tatuadorId}
          onChange={(e) => {
            const id = e.target.value;
            setTatuadorId(id);
            const t = tatuadores.find((t) => t.id === id);
            if (t) setTatuadorNome(t.nome);
          }}
          required
        >
          <option value="">Escolha o tatuador</option>
          {tatuadores.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-2 bg-black border border-neutral-700 rounded-lg"
          required
        />

        <select
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          className="w-full p-2 bg-black border border-neutral-700 rounded-lg"
          required
        >
          <option value="">Escolha o horário</option>
          {horariosDisponiveis.map((h) => (
            <option
              key={h}
              value={h}
              disabled={horariosOcupados.includes(h)}
            >
              {h} {horariosOcupados.includes(h) ? "⛔ Ocupado" : "✅ Livre"}
            </option>
          ))}
        </select>

        {mensagem && (
          <p className="text-sm text-orange-400 text-center">{mensagem}</p>
        )}

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 py-2 rounded-lg font-bold text-black transition"
        >
          Solicitar Agendamento
        </button>
      </form>
    </main>
  );
}