"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../../lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function TatuagensAdminPage() {

  const [user, setUser] = useState<any>(null);
  const [clientes, setClientes] = useState<any[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [tatuador, setTatuador] = useState("");
  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mensagem, setMensagem] = useState("");

  // 🔐 Garante que só usuário logado acesse
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) return;
      setUser(u);
    });
    return () => unsub();
  }, []);

  // 📌 Carrega lista de clientes da coleção "users"
  useEffect(() => {
    const carregarClientes = async () => {
      const q = query(collection(db, "users"), where("role", "==", "cliente"));
      const snap = await getDocs(q);

      const lista: any[] = [];
      snap.forEach((d) => lista.push({ id: d.id, ...d.data() }));
      setClientes(lista);
    };

    carregarClientes();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");

    try {
      await addDoc(collection(db, "tatuagens"), {
        clienteId,
        titulo,
        tatuador,
        data,
        descricao,
        createdAt: new Date()
      });

      setMensagem("Tatuagem cadastrada com sucesso!");
      
      setTitulo("");
      setTatuador("");
      setData("");
      setDescricao("");
      setClienteId("");

    } catch (err) {
      setMensagem("Erro ao salvar tatuagem.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-2xl font-bold text-orange-400 mb-4">
          Cadastrar Tatuagem para Cliente
        </h1>

        <form onSubmit={handleSave} className="space-y-3 bg-neutral-900 border border-neutral-800 p-4 rounded-xl">

          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg"
            required
          >
            <option value="">Selecione o cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} — {c.email}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Título da tatuagem"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg"
            required
          />

          <input
            type="text"
            placeholder="Nome do tatuador"
            value={tatuador}
            onChange={(e) => setTatuador(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg"
            required
          />

          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg"
            required
          />

          <textarea
            placeholder="Descrição / observações"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg"
          />

          {mensagem && (
            <p className="text-center text-green-400 text-sm">{mensagem}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 font-bold text-black"
          >
            Salvar tatuagem
          </button>
        </form>
      </div>
    </main>
  );
}