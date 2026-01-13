export default function AgendamentosPage() {
  const agendamentos = [
    { cliente: "João", data: "20/02/2025", hora: "14:00", tatuador: "Rafael" },
    {
      cliente: "Larissa",
      data: "22/02/2025",
      hora: "10:00",
      tatuador: "Bianca",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-400 mb-4">
        Agendamentos 📅
      </h1>

      <p className="text-white/60 mb-6">Próximas sessões marcadas.</p>

      <div className="space-y-4">
        {agendamentos.map((a, i) => (
          <div
            key={i}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-orange-500 transition"
          >
            <p className="text-white/80">
              👤 Cliente: <strong>{a.cliente}</strong>
            </p>
            <p className="text-white/70">
              📅 {a.data} — 🕒 {a.hora}
            </p>
            <p className="text-white/70">🧑‍🎨 Tatuador: {a.tatuador}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
