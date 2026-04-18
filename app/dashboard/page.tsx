"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 10) return "God morgen 🌅";
  if (hour < 14) return "God formiddag ☀️";
  if (hour < 18) return "God ettermiddag 💪";
  return "God kveld 🌙";
}

function getDato() {
  return new Date().toLocaleDateString("no-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function Dashboard() {
  const router = useRouter();
  const [sisteVekt, setSisteVekt] = useState<number | null>(null);
  const [vektEndring, setVektEndring] = useState<number | null>(null);

  useEffect(() => {
    hentVekt();
  }, []);

  async function hentVekt() {
    const { data } = await supabase
      .from("vekt")
      .select("*")
      .order("dato", { ascending: false })
      .limit(2);
    if (data && data.length > 0) {
      setSisteVekt(data[0].vekt);
      if (data.length > 1) {
        setVektEndring(data[0].vekt - data[1].vekt);
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-24">

      {/* Header */}
      <div className="px-6 pt-14 pb-6">
        <p className="text-gray-400 text-sm mb-1 capitalize">{getDato()}</p>
        <h1 className="text-3xl font-black">{getGreeting()}</h1>
        <p className="text-gray-500 text-sm mt-1">Her er hvordan du ligger an</p>
      </div>

      <div className="px-6 space-y-4">

        {/* Hoved-stats */}
        <div className="grid grid-cols-2 gap-3">

          {/* Vekt */}
          <div
            onClick={() => router.push("/dashboard/vekt")}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-4 cursor-pointer active:scale-95 transition-transform"
          >
            <p className="text-gray-400 text-xs mb-1">Vekt</p>
            {sisteVekt ? (
              <>
                <p className="text-2xl font-bold text-blue-400">{sisteVekt} kg</p>
                {vektEndring !== null && (
                  <div className="mt-1 flex items-center gap-1">
                    <span className={`text-xs font-bold ${vektEndring > 0 ? "text-green-400" : vektEndring < 0 ? "text-red-400" : "text-gray-500"}`}>
                      {vektEndring > 0 ? "↑" : vektEndring < 0 ? "↓" : "→"} {Math.abs(vektEndring).toFixed(1)} kg
                    </span>
                  </div>
                )}
                <div className="mt-2 h-1.5 bg-gray-800 rounded-full">
                  <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (sisteVekt / 85) * 100)}%` }} />
                </div>
                <p className="text-gray-600 text-xs mt-1">mål: 85 kg</p>
              </>
            ) : (
              <p className="text-gray-500 text-sm mt-1">Ingen data</p>
            )}
          </div>

          {/* Søvn */}
          <div
            onClick={() => router.push("/dashboard/sovn")}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-4 cursor-pointer active:scale-95 transition-transform"
          >
            <p className="text-gray-400 text-xs mb-1">Søvn</p>
            <p className="text-2xl font-bold text-purple-400">7t 20m</p>
            <div className="mt-2 h-1.5 bg-gray-800 rounded-full">
              <div className="h-1.5 bg-purple-500 rounded-full" style={{ width: "82%" }} />
            </div>
            <p className="text-gray-600 text-xs mt-1">God natt ✓</p>
          </div>

          {/* Kalorier */}
          <div
            onClick={() => router.push("/dashboard/mat")}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-4 cursor-pointer active:scale-95 transition-transform"
          >
            <p className="text-gray-400 text-xs mb-1">Kalorier</p>
            <p className="text-2xl font-bold text-orange-400">1 840</p>
            <div className="mt-2 h-1.5 bg-gray-800 rounded-full">
              <div className="h-1.5 bg-orange-500 rounded-full" style={{ width: "76%" }} />
            </div>
            <p className="text-gray-600 text-xs mt-1">av 2 400 kcal</p>
          </div>

          {/* HRV */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-gray-400 text-xs mb-1">HRV</p>
            <p className="text-2xl font-bold text-green-400">62</p>
            <div className="mt-2 h-1.5 bg-gray-800 rounded-full">
              <div className="h-1.5 bg-green-500 rounded-full" style={{ width: "68%" }} />
            </div>
            <p className="text-gray-600 text-xs mt-1">Over snitt ↑</p>
          </div>

        </div>

        {/* Dagens økt */}
        <div
          onClick={() => router.push("/dashboard/trening")}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-4 cursor-pointer active:scale-95 transition-transform"
        >
          <p className="text-gray-400 text-xs mb-3">DAGENS ØKT</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">Overkropp 💪</p>
              <p className="text-gray-500 text-sm">Benkpress · Skulder · Triceps</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); router.push("/dashboard/trening"); }}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              Start
            </button>
          </div>
        </div>

        {/* Skritt */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs">SKRITT I DAG</p>
            <p className="text-gray-400 text-xs">8 240 / 10 000</p>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-2 bg-teal-500 rounded-full" style={{ width: "82%" }} />
          </div>
          <p className="text-teal-400 text-xs mt-1">1 760 skritt igjen 🚶</p>
        </div>

        {/* AI-innsikt */}
        <div
          onClick={() => router.push("/dashboard/ai")}
          className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-800/40 rounded-2xl p-4 cursor-pointer active:scale-95 transition-transform"
        >
          <p className="text-gray-400 text-xs mb-2">🤖 AI COACH SIER</p>
          <p className="text-sm text-gray-200 leading-relaxed">
            HRV-en din er over gjennomsnittet i dag – kroppen er klar. Perfekt dag for progressiv overload på benkpress. Trykk for å spørre meg noe. →
          </p>
        </div>

      </div>
    </main>
  );
}