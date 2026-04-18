"use client";
import { useState } from "react";

const øktHistorikk = [
  {
    dato: "Mandag 14. april",
    navn: "Overkropp",
    øvelser: [
      { navn: "Benkpress", sett: "4x8", vekt: "85 kg" },
      { navn: "Skulderpress", sett: "3x10", vekt: "60 kg" },
      { navn: "Triceps pushdown", sett: "3x12", vekt: "35 kg" },
    ],
  },
  {
    dato: "Onsdag 16. april",
    navn: "Bein",
    øvelser: [
      { navn: "Knebøy", sett: "4x8", vekt: "100 kg" },
      { navn: "Leg press", sett: "3x12", vekt: "160 kg" },
      { navn: "Romanian deadlift", sett: "3x10", vekt: "80 kg" },
    ],
  },
];

export default function Trening() {
  const [valgtØkt, setValgtØkt] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-24">
      
      {/* Header */}
      <div className="px-6 pt-14 pb-6">
        <h1 className="text-3xl font-black">Trening 💪</h1>
        <p className="text-gray-500 text-sm mt-1">Dine siste økter</p>
      </div>

      <div className="px-6 space-y-4">

        {/* Neste økt */}
        <div className="bg-blue-600/20 border border-blue-600/40 rounded-2xl p-4">
          <p className="text-blue-400 text-xs mb-2">NESTE ØKT</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">Overkropp</p>
              <p className="text-gray-400 text-sm">Benkpress · Skulder · Triceps</p>
              <p className="text-blue-400 text-xs mt-1">AI: Prøv 87.5 kg på benkpress i dag 🎯</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
              Start
            </button>
          </div>
        </div>

        {/* Mål */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <p className="text-gray-400 text-xs mb-3">DITT MÅL</p>
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold">Benkpress 80 → 110 kg</p>
            <p className="text-green-400 text-sm font-bold">85 kg</p>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full" style={{ width: "17%" }} />
          </div>
          <p className="text-gray-600 text-xs mt-1">17% av veien – fortsett sånn! 🔥</p>
        </div>

        {/* Historikk */}
        <p className="text-gray-400 text-xs pt-2">HISTORIKK</p>
        {øktHistorikk.map((økt, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-4 cursor-pointer"
            onClick={() => setValgtØkt(valgtØkt === i ? null : i)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{økt.navn}</p>
                <p className="text-gray-500 text-xs">{økt.dato}</p>
              </div>
              <span className="text-gray-600">{valgtØkt === i ? "▲" : "▼"}</span>
            </div>
            {valgtØkt === i && (
              <div className="mt-3 space-y-2 border-t border-gray-800 pt-3">
                {økt.øvelser.map((øvelse, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <p className="text-sm text-gray-300">{øvelse.navn}</p>
                    <p className="text-sm text-gray-400">{øvelse.sett} · {øvelse.vekt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

      </div>
    </main>
  );
}