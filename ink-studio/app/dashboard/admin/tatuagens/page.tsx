"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function TatuagensAdminPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [tatuadores, setTatuadores] = useState<any[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [tatuadorId, setTatuadorId] = useState("");
  const [tatuadorNome, setTatuadorNome] = useState("");

  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  const [mensagem, setMensagem] = useState("");
  const [imagemStatus, setImagemStatus] = useState<"vazio" | "carregado">("vazio");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return (window.location.href = "/login");

      const snap = await getDoc(doc(db, "users", u.uid));
      if (!snap.exists() || snap.data().role !== "admin") {
        window.location.href = "/dashboard";
      }
    });

    return () => unsub();
  }, []);

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

  useEffect(() => {
    const carregarTatuadores = async () => {
      const q = query(collection(db, "tatuadores"));
      const snap = await getDocs(q);
      const lista: any[] = [];
      snap.forEach((d) => lista.push({ id: d.id, ...d.data() }));
      setTatuadores(lista);
    };
    carregarTatuadores();
  }, []);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "tatuagens");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dgsv7nafp/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");

    if (!foto) {
      setMensagem("Envie a foto da tatuagem.");
      return;
    }

    try {
      const fotoUrl = await uploadToCloudinary(foto);

      await addDoc(collection(db, "tatuagens"), {
        clienteId,
        tatuadorId,
        tatuadorNome,
        titulo,
        data,
        descricao,
        fotoUrl,
        createdAt: new Date(),
      });

      setMensagem("Tatuagem cadastrada com sucesso! ✔");

      setClienteId("");
      setTatuadorId("");
      setTatuadorNome("");
      setTitulo("");
      setData("");
      setDescricao("");
      setFoto(null);
      setImagemStatus("vazio");

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

        <form
          onSubmit={handleSave}
          className="space-y-4 bg-neutral-900 border border-neutral-800 p-6 rounded-xl"
        >
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg hover:border-orange-500 transition"
            required
          >
            <option value="">Selecione o cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} — {c.email}
              </option>
            ))}
          </select>

          <select
            value={tatuadorId}
            onChange={(e) => {
              const id = e.target.value;
              setTatuadorId(id);
              const selecionado = tatuadores.find((t) => t.id === id);
              if (selecionado) setTatuadorNome(selecionado.nome);
            }}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg hover:border-orange-500 transition"
            required
          >
            <option value="">Selecione o tatuador</option>
            {tatuadores.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Título da tatuagem"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg hover:border-orange-500 transition"
            required
          />

          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg hover:border-orange-500 transition"
            required
          />

          <textarea
            placeholder="Descrição / observações"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg hover:border-orange-500 transition"
          />

          <label className="block cursor-pointer">
            <div className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg text-center hover:border-orange-500 transition">
              {imagemStatus === "carregado"
                ? "Trampo carregado ✔"
                : "📸 Carregue a imagem do seu trampo aqui"}
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFoto(file);
                if (file) setImagemStatus("carregado");
              }}
              required
            />
          </label>

          {mensagem && (
            <p className="text-center text-sm text-orange-400 font-medium">
              {mensagem}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-600 hover:shadow-[0_0_15px_rgba(255,165,0,0.6)] transition font-bold text-black"
          >
            Salvar tatuagem
          </button>
        </form>
      </div>
    </main>
  );
}