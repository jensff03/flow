"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type VektEntry = {
  id: string;
  dato: string;
  vekt: number;
};

const målVekt = 85;

export default function Vekt() {
  const [vektData, setVektData] = useState<VektEntry[]>([]);
  const [visInnveiing, setVisInnveiing] = useState(false);
  const [nyVekt, setNyVekt] = useState("");
  const [nyDato, setNyDato] = useState(new Date().toISOString().split("T")[0]);
  const [laster, setLaster] = useState(true);
  const [slettId, setSlettId] = useState<string | null>(null);

  useEffect(() => {
    hentVekt();
  }, []);

  async function hentVekt() {
    const { data } = await supabase
      .from("vekt")
      .select("*")
      .order("dato", { ascending: true });
    if (data) setVektData(data);
    setLaster(false);
  }

  async function lagreVekt() {
    if (!nyVekt) return;
    const { error } = await supabase
      .from("vekt")
      .insert([{ vekt: parseFloat(nyVekt), dato: new Date(nyDato).toISOString() }]);
    if (!error) {
      setNyVekt("");
      setNyDato(new Date().toISOString().split("T")[0]);
      setVisInnveiing(false);
      hentVekt();
    }
  }

  async function slettVekt(id: string) {
    await supabase.from("vekt").delete().eq("id", id);
    setSlettId(null);
    hentVekt();
  }

  const sisteVekt = vektData.at(-1)?.vekt ?? 0;
  const nestSiste = vektData.at(-2)?.vekt ?? sisteVekt;
  const startVekt = vektData.at(0)?.vekt ?? sisteVekt;
  const endring = sisteVekt - nestSiste;
  const totalEndring = sisteVekt - startVekt;

  const maxVekt = Math.max(...vektData.map((d) => d.vekt), sisteVekt + 1);
  const minVekt = Math.min(...vektData.map((d) => d.vekt), sisteVekt - 1);
  const range = maxVekt - minVekt || 1;

  const getY = (vekt: number) => 100 - ((vekt - minVekt) / range) * 80;

  const points = vektData
    .map((d, i) => {
      const x = (i / Math.max(vektData.length - 1, 1)) * 100;
      const y = getY(d.vekt);
      return `${x},${y}`;
    })
    .join(" ");

  function formatDato(dato: string) {
    return new Date(dato).toLocaleDateString("no-NO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (laster) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Laster...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-24 pt-14">

      <div className="px-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Vekt ⚖️</h1>
          <p className="text-gray-500 text-sm mt-1">{vektData.length} innveiinger</p>
        </div>
        <button
          onClick={() => setVisInnveiing(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm"
        >
          + Legg inn
        </button>
      </div>

      <div className="px-6 space-y-4">

        {vektData.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">⚖️</p>
            <p className="text-white font-bold mb-1">Ingen innveiinger ennå</p>
            <p className="text-gray-500 text-sm mb-4">Legg inn din første vekt for å se grafen</p>
            <button onClick={() => setVisInnveiing(true)} className="bg-blue-600 text-white font-bold px-6 py-2 rounded-xl">
              + Legg inn nå
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-xs mb-1">NÅVÆRENDE VEKT</p>
                  <p className="text-5xl font-black text-white">{sisteVekt}</p>
                  <p className="text-gray-400 text-sm">kg</p>
                </div>
                {vektData.length > 1 && (
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold mb-1 ${endring > 0 ? "bg-green-900/40 text-green-400" : endring < 0 ? "bg-red-900/40 text-red-400" : "bg-gray-800 text-gray-400"}`}>
                      {endring > 0 ? "↑" : endring < 0 ? "↓" : "→"} {Math.abs(endring).toFixed(1)} kg
                    </div>
                    <p className="text-gray-500 text-xs">siden sist</p>
                  </div>
                )}
              </div>

              {vektData.length > 1 && (
                <>
                  <div className="relative h-32 w-full mt-2">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                      <defs>
                        <linearGradient id="vektGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" />
                      <polygon fill="url(#vektGradient)" points={`0,100 ${points} 100,100`} />
                      {vektData.map((d, i) => {
                        const x = (i / Math.max(vektData.length - 1, 1)) * 100;
                        const y = getY(d.vekt);
                        const erSiste = i === vektData.length - 1;
                        return <circle key={i} cx={x} cy={y} r={erSiste ? "2.5" : "1.5"} fill={erSiste ? "#ffffff" : "#3b82f6"} vectorEffect="non-scaling-stroke" />;
                      })}
                    </svg>
                    <div className="absolute top-0 right-0 flex flex-col justify-between h-full text-right">
                      <p className="text-gray-600 text-xs">{maxVekt.toFixed(1)}</p>
                      <p className="text-gray-600 text-xs">{minVekt.toFixed(1)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-gray-600 text-xs">{formatDato(vektData[0].dato)}</p>
                    <p className="text-gray-600 text-xs">{formatDato(vektData.at(-1)!.dato)}</p>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center">
                <p className="text-gray-400 text-xs mb-1">Start</p>
                <p className="text-lg font-bold">{startVekt}</p>
                <p className="text-gray-600 text-xs">kg</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center">
                <p className="text-gray-400 text-xs mb-1">Endring</p>
                <p className={`text-lg font-bold ${totalEndring > 0 ? "text-green-400" : totalEndring < 0 ? "text-red-400" : "text-white"}`}>
                  {totalEndring > 0 ? "+" : ""}{totalEndring.toFixed(1)}
                </p>
                <p className="text-gray-600 text-xs">kg</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center">
                <p className="text-gray-400 text-xs mb-1">Mål</p>
                <p className="text-lg font-bold text-blue-400">{målVekt}</p>
                <p className="text-gray-600 text-xs">kg</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-gray-400 text-xs">FREMGANG MOT MÅL</p>
                <p className="text-blue-400 text-xs font-bold">{Math.abs(målVekt - sisteVekt).toFixed(1)} kg igjen</p>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-blue-600 to-green-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.abs((sisteVekt - startVekt) / (målVekt - startVekt)) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-gray-600 text-xs">{startVekt} kg</p>
                <p className="text-gray-600 text-xs">{målVekt} kg</p>
              </div>
            </div>

            <p className="text-gray-500 text-xs pt-2">ALLE INNVEIINGER</p>
            {[...vektData].reverse().map((d, i, arr) => {
              const prev = arr[i + 1];
              const diff = prev ? d.vekt - prev.vekt : 0;
              return (
                <div key={d.id}>
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 flex items-center justify-between">
                    <p className="text-gray-400 text-sm">{formatDato(d.dato)}</p>
                    <div className="flex items-center gap-3">
                      <p className="font-bold">{d.vekt} kg</p>
                      {prev && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${diff < 0 ? "bg-red-900/40 text-red-400" : diff > 0 ? "bg-green-900/40 text-green-400" : "bg-gray-800 text-gray-500"}`}>
                          {diff > 0 ? "+" : ""}{diff.toFixed(1)}
                        </span>
                      )}
                      <button
                        onClick={() => setSlettId(d.id)}
                        className="text-gray-600 hover:text-red-400 text-xs transition-colors"
                      >
                        slett
                      </button>
                    </div>
                  </div>

                  {/* Slett bekreftelse */}
                  {slettId === d.id && (
                    <div className="bg-red-900/20 border border-red-800/40 rounded-2xl px-4 py-3 flex items-center justify-between mt-1">
                      <p className="text-red-400 text-sm">Sikker på at du vil slette?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setSlettId(null)} className="text-gray-400 text-sm px-3 py-1 bg-gray-800 rounded-lg">Nei</button>
                        <button onClick={() => slettVekt(d.id)} className="text-white text-sm px-3 py-1 bg-red-600 rounded-lg font-bold">Slett</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Modal */}
      {visInnveiing && (
        <div className="fixed inset-0 bg-black/80 flex items-end z-50">
          <div className="bg-gray-900 border-t border-gray-800 w-full rounded-t-3xl p-6">
            <h2 className="text-xl font-black mb-4">Ny innveiing ⚖️</h2>

            <p className="text-gray-400 text-xs mb-1">DATO</p>
            <input
              type="date"
              value={nyDato}
              onChange={(e) => setNyDato(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 mb-4 text-sm focus:outline-none"
            />

            <p className="text-gray-400 text-xs mb-1">VEKT</p>
            <div className="flex items-center bg-gray-800 rounded-2xl px-4 py-3 mb-4">
              <input
                type="number"
                step="0.1"
                placeholder="80.5"
                value={nyVekt}
                onChange={(e) => setNyVekt(e.target.value)}
                className="bg-transparent text-white text-3xl font-black w-full focus:outline-none"
                autoFocus
              />
              <span className="text-gray-400 font-bold text-xl">kg</span>
            </div>

            <p className="text-gray-500 text-xs mb-4">💡 Tips: Vei deg om morgenen, etter toalettbesøk, før mat.</p>

            <button onClick={lagreVekt} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl mb-3">
              Lagre
            </button>
            <button onClick={() => setVisInnveiing(false)} className="w-full text-gray-500 py-2">
              Avbryt
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
