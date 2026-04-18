"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type Melding = {
  rolle: "ai" | "bruker";
  tekst: string;
};

type VektEntry = {
  vekt: number;
  dato: string;
};

const forslag = [
  "Er jeg klar for progressiv overload i dag?",
  "Hva bør jeg spise før trening?",
  "Hvordan påvirker søvnen min prestasjonen?",
  "Analyser vektutviklingen min",
  "Hva er beste restitusjonsstrategi for meg?",
  "Lag en treningsplan for neste uke",
];

export default function AICoach() {
  const [meldinger, setMeldinger] = useState<Melding[]>([
    {
      rolle: "ai",
      tekst: "Hei! Jeg er Flow AI Coach 🤖\n\nJeg analyserer søvnen din, treningsøktene, vekten og kostholdet ditt for å gi deg skreddersydde råd.\n\nHva vil du vite i dag?",
    },
  ]);
  const [input, setInput] = useState("");
  const [laster, setLaster] = useState(false);
  const [vektData, setVektData] = useState<VektEntry[]>([]);
  const bunnenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hentKontekst();
  }, []);

  useEffect(() => {
    bunnenRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [meldinger]);

  async function hentKontekst() {
    const { data } = await supabase
      .from("vekt")
      .select("*")
      .order("dato", { ascending: false })
      .limit(5);
    if (data) setVektData(data);
  }

  function byggKontekst() {
    const vektInfo = vektData.length > 0
      ? `Brukerens siste vektdata: ${vektData.map(d => `${d.vekt}kg (${new Date(d.dato).toLocaleDateString("no-NO")})`).join(", ")}.`
      : "Ingen vektdata registrert ennå.";

    return `Du er Flow AI Coach – en personlig treningsassistent. Du er direkte, motiverende og kunnskapsrik innen styrketrening, ernæring, søvn og restitusjon. Du snakker norsk og gir konkrete, handlingsrettede råd.

Brukerdata:
- ${vektInfo}
- Søvn i natt: 7t 20min, HRV: 62 (over snitt)
- Dagens kalorier: 1840 av 2400 kcal
- Mål: Benkpress fra 80kg til 110kg
- Siste økt: Overkropp, Benkpress 85kg x 4x8

Svar alltid på norsk. Vær konkret og direkte. Maks 3-4 setninger om ikke annet er bedt om.`;
  }

  async function sendMelding(tekst: string) {
    if (!tekst.trim() || laster) return;

    const nyMelding: Melding = { rolle: "bruker", tekst };
    const oppdaterteMeldinger = [...meldinger, nyMelding];
    setMeldinger(oppdaterteMeldinger);
    setInput("");
    setLaster(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meldinger: oppdaterteMeldinger,
          kontekst: byggKontekst(),
        }),
      });

      const data = await response.json();
      setMeldinger((prev) => [...prev, { rolle: "ai", tekst: data.svar }]);
    } catch {
      setMeldinger((prev) => [...prev, {
        rolle: "ai",
        tekst: "Beklager, noe gikk galt. Sjekk at API-nøkkelen er satt opp riktig.",
      }]);
    } finally {
      setLaster(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col pb-24">

      {/* Header */}
      <div className="px-6 pt-14 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <h1 className="text-xl font-black">Flow AI Coach</h1>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-green-400 text-xs">Online – kjenner dine data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Meldinger */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {meldinger.map((m, i) => (
          <div key={i} className={`flex ${m.rolle === "bruker" ? "justify-end" : "justify-start"}`}>
            {m.rolle === "ai" && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                🤖
              </div>
            )}
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.rolle === "bruker"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-800 text-gray-200 rounded-bl-sm"
              }`}
            >
              {m.tekst}
            </div>
          </div>
        ))}

        {laster && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-sm mr-2 flex-shrink-0">
              🤖
            </div>
            <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Forslag */}
        {meldinger.length === 1 && !laster && (
          <div className="space-y-2 mt-2">
            <p className="text-gray-600 text-xs">FORSLAG</p>
            {forslag.map((f, i) => (
              <button
                key={i}
                onClick={() => sendMelding(f)}
                className="w-full text-left bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300 hover:border-blue-600 hover:text-white transition-all"
              >
                {f}
              </button>
            ))}
          </div>
        )}

        <div ref={bunnenRef} />
      </div>

      {/* Input */}
      <div className="px-6 pb-4 pt-3 border-t border-gray-800 bg-gray-950">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMelding(input);
              }
            }}
            placeholder="Spør AI Coach..."
            rows={1}
            className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 resize-none"
          />
          <button
            onClick={() => sendMelding(input)}
            disabled={laster || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white w-12 h-12 rounded-2xl font-bold flex items-center justify-center flex-shrink-0"
          >
            →
          </button>
        </div>
      </div>

    </main>
  );
}