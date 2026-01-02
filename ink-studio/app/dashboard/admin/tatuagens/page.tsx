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
  getDoc
} from "firebase/firestore";
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
  const [foto, setFoto] = useState<File | null>(null);

  // 🔐 Verifica se é admin
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        window.location.href = "/login";
        return;
      }

      const snap = await getDoc(doc(db, "users", u.uid));

      if (!snap.exists() || snap.data().role !== "admin") {
        window.location.href = "/dashboard";
        return;
      }

      setUser(u);
    });

    return () => unsub();
  }, []);

  // 👤 Carrega lista de clientes
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

  // ☁️ Upload Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "tatuagens");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dgsv7nafp/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url as string;
  };

  // 💾 Salvar tatuagem
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");

    if (!foto) {
      setMensagem("Envie uma foto da tatuagem antes de salvar.");
      return;
    }

    try {
      const fotoUrl = await uploadToCloudinary(foto);

      await addDoc(collection(db, "tatuagens"), {
        clienteId,
        titulo,
        tatuador,
        data,
        descricao,
        fotoUrl,
        createdAt: new Date(),
      });

      setMensagem("Tatuagem cadastrada com sucesso!");

      setClienteId("");
      setTitulo("");
      setTatuador("");
      setData("");
      setDescricao("");
      setFoto(null);

    } catch (err) {
      console.error(err);
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
          className="space-y-3 bg-neutral-900 border border-neutral-800 p-4 rounded-xl"
        >

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

          <label className="block">
            <span className="text-sm text-neutral-400">Foto da tatuagem</span>

          <div
           className="
            mt-1 flex items-center justify-between gap-3
            bg-black border border-neutral-700 rounded-lg
            px-3 py-2 cursor-pointer
            hover:border-orange-500 focus-within:border-orange-500
            transition
            "
            >
           <input
             type="file"
             accept="image/*"
             required
             id="fotoUpload"
             className="hidden"
             onChange={(e) => setFoto(e.target.files?.[0] || null)}
             />

           <label
             htmlFor="fotoUpload"
             className="px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600
             text-black font-bold transition cursor-pointer"
             >
             Escolher arquivo
             </label>

           <span className="text-white/70 text-sm truncate">
            {foto ? foto.name : "Nenhum arquivo selecionado"}
           </span>
        </div>
      </label>

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