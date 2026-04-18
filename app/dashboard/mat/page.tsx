"use client";
import { useState } from "react";

const måltider = [
  {
    navn: "Frokost",
    tid: "08:15",
    kalorier: 520,
    matvarer: ["Havregrøt", "Banan", "Proteinpulver"],
  },
  {
    navn: "Lunsj",
    tid: "12:30",
    kalorier: 680,
    matvarer: ["Kyllingbryst", "Ris", "Brokkoli"],
  },
  {
    navn: "Mellommåltid",
    tid: "15:45",
    kalorier: 280,
    matvarer: ["Cottage cheese", "Eple"],
  },
];

const dagsMål = {
  kalorier: 2400,
  protein: 180,
  karbo: 250,
  fett: 70,
};

const dagsTotalt = {
  kalorier: 1480,
  protein: 112,
  karbo: 145,
  fett: 38,
};

export default function Mat() {
  const [valgtMåltid, setValgtMåltid] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-24">

      {/* Header */}
      <div className="px-6 pt-14 pb-6">
        <h1 className="text-3xl font-black">Mat 🥗</h1>
        <p className="text-gray-500 text-sm mt-1">Fredag 17. april</p>
      </div>

      <div className="px-6 space-y-4">

        {/* Kalorier ring */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-xs mb-1">KALORIER I DAG</p>
              <p className="text-4xl font-black text-white">{dagsTotalt.kalorier}</p>
              <p className="text-gray-500 text-sm">av {dagsMål.kalorier} kcal</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-bold text-lg">{dagsMål.kalorier - dagsTotalt.kalorier}</p>
              <p className="text-gray-500 text-xs">igjen</p>
            </div>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div
              className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all"
              style={{ width: `${(dagsTotalt.kalorier / dagsMål.kalorier) * 100}%` }}
            />
          </div>
        </div>

        {/* Makro */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { navn: "Protein", totalt: dagsTotalt.protein, mål: dagsMål.protein, farge: "text-blue-400", bg: "bg-blue-500", enhet: "g" },
            { navn: "Karbo", totalt: dagsTotalt.karbo, mål: dagsMål.karbo, farge: "text-yellow-400", bg: "bg-yellow-500", enhet: "g" },
            { navn: "Fett", totalt: dagsTotalt.fett, mål: dagsMål.fett, farge: "text-orange-400", bg: "bg-orange-500", enhet: "g" },
          ].map((m) => (
            <div key={m.navn} className="bg-gray-900 border border-gray-800 rounded-2xl p-3">
              <p className="text-gray-400 text-xs">{m.navn}</p>
              <p className={`text-xl font-bold ${m.farge}`}>{m.totalt}{m.enhet}</p>
              <div className="mt-1 h-1 bg-gray-800 rounded-full">
                <div className={`h-1 ${m.bg} rounded-full`} style={{ width: `${(m.totalt / m.mål) * 100}%` }} />
              </div>
              <p className="text-gray-600 text-xs mt-1">av {m.mål}{m.enhet}</p>
            </div>
          ))}
        </div>

        {/* Legg til måltid */}
        <button className="w-full bg-blue-600 hover:bg-blue-500 transition-colors text-white font-bold py-3 rounded-2xl">
          + Legg til måltid
        </button>

        {/* Måltider */}
        <p className="text-gray-400 text-xs pt-2">DAGENS MÅLTIDER</p>
        {måltider.map((måltid, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-4 cursor-pointer"
            onClick={() => setValgtMåltid(valgtMåltid === i ? null : i)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{måltid.navn}</p>
                <p className="text-gray-500 text-xs">{måltid.tid}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{måltid.kalorier} kcal</p>
                <span className="text-gray-600 text-xs">{valgtMåltid === i ? "▲" : "▼"}</span>
              </div>
            </div>
            {valgtMåltid === i && (
              <div className="mt-3 border-t border-gray-800 pt-3 space-y-1">
                {måltid.matvarer.map((mat, j) => (
                  <p key={j} className="text-sm text-gray-400">· {mat}</p>
                ))}
              </div>
            )}
          </div>
        ))}

      </div>
    </main>
  );
}
