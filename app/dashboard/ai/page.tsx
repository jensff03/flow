
"use client";
import { useState } from "react";

const forslag = [
  "Hva bør jeg spise før trening i dag?",
  "Er jeg klar for progressiv overload?",
  "Hvordan påvirker søvnen min prestasjonen?",
];

export default function AICoach() {
  const [meldinger, setMeldinger] = useState([
    {
      rolle: "ai",
      tekst: "Hei! Jeg er Flow AI Coach 🤖 Jeg ser på søvnen din, treningsøktene og kostholdet ditt. Hva vil du vite?",
    },
  ]);
  const [input, setInput] = useState("");

  function sendMelding(tekst: string) {
    if (!tekst.trim()) return;
    setMeldinger((prev) => [
      ...prev,
      { rolle: "bruker", tekst },
      {
        rolle: "ai",
        tekst: "Dette er en demo – snart kobler vi til ekte AI som kjenner alle dataene dine! 🚀",
      },
    ]);
    setInput("");
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col pb-24">

      {/* Header */}
      <div className="px-6 pt-14 pb-4 border-b border-gray-800">
        <h1 className="text-3xl font-black">AI Coach 🤖</h1>
        <p className="text-gray-500 text-sm mt-1">Din personlige treningsassistent</p>
      </div>

      {/* Meldinger */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {meldinger.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.rolle === "bruker" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                m.rolle === "bruker"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-800 text-gray-200 rounded-bl-sm"
              }`}
            >
              {m.tekst}
            </div>
          </div>
        ))}

        {/* Forslag */}
        {meldinger.length === 1 && (
          <div className="space-y-2 mt-4">
            <p className="text-gray-600 text-xs">FORSLAG</p>
            {forslag.map((f, i) => (
              <button
                key={i}
                onClick={() => sendMelding(f)}
                className="w-full text-left bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300 hover:border-blue-600 transition-colors"
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 pb-4 border-t border-gray-800 pt-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMelding(input)}
            placeholder="Spør AI Coach..."
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={() => sendMelding(input)}
            className="bg-blue-600 hover:bg-blue-500 transition-colors text-white px-4 py-3 rounded-xl font-bold"
          >
            →
          </button>
        </div>
      </div>

    </main>
  );
}
