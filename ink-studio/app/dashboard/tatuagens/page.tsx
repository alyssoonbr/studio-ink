export default function TatuagensPage() {
  const tatuagens = [
    { titulo: "Dragão Japonês", cliente: "Lucas", data: "12/11/2024" },
    { titulo: "Rosa Realista", cliente: "Amanda", data: "05/10/2024" },
    { titulo: "Lobo Tribal", cliente: "Eduardo", data: "28/09/2024" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-400 mb-4">
        Minhas Tatuagens 🖋️
      </h1>

      <p className="text-white/60 mb-6">
        Histórico de tatuagens realizadas.
      </p>

      <div className="space-y-4">
        {tatuagens.map((t, i) => (
          <div
            key={i}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-orange-500 transition"
          >
            <h2 className="text-lg font-semibold text-orange-300">{t.titulo}</h2>
            <p className="text-white/70 mt-1">👤 Cliente: {t.cliente}</p>
            <p className="text-white/70 mt-1">📅 Data: {t.data}</p>
          </div>
        ))}
      </div>
    </div>
  );
}