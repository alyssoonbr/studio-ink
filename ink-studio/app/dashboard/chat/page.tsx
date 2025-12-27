"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { from: "studio", text: "Olá! Como posso ajudar com sua tatuagem?" },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-400 mb-4">
        Chat 💬
      </h1>

      <div className="w-full max-w-sm mx-auto bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex-1 min-h-[120px] overflow-y-auto rounded-lg bg-neutral-800 p-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg w-fit ${
                m.from === "user"
                  ? "bg-orange-500 text-black ml-auto"
                  : "bg-neutral-800 text-white"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2 w-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-black border border-neutral-700 rounded-lg min-w-0"
            placeholder="Digite sua mensagem..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-orange-500 rounded-lg font-bold"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}