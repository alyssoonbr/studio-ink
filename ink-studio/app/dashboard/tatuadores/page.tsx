export default function TatuadoresPage() {
  const tatuadores = [
    { nome: "Rafael", estilo: "Realismo", experiencia: "6 anos" },
    { nome: "Bianca", estilo: "Fineline", experiencia: "3 anos" },
    { nome: "Murilo", estilo: "Old School", experiencia: "4 anos" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-400 mb-4">
        Tatuadores 🧑‍🎨
      </h1>

      <p className="text-white/60 mb-6">
        Conheça os artistas do Ink Studio.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tatuadores.map((t, i) => (
          <div
            key={i}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-orange-500 transition"
          >
            <h2 className="text-lg font-bold text-orange-400">{t.nome}</h2>
            <p className="text-white/70 mt-2">🎨 Estilo: {t.estilo}</p>
            <p className="text-white/70 mt-1">⌛ Experiência: {t.experiencia}</p>
          </div>
        ))}
      </div>
    </div>
  );
}