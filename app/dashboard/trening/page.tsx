"use client";
import { useState, useEffect } from "react";

type Sett = { reps: number; vekt: number; ferdig: boolean };
type Øvelse = { navn: string; sett: Sett[] };

const øvelseAlternativer = [
  "Benkpress", "Skulderpress", "Bicepscurl", "Triceps pushdown",
  "Knebøy", "Leg press", "Romanian deadlift", "Markløft",
  "Pull-ups", "Sittende roing", "Lat pulldown", "Planke",
  "Incline benkpress", "Dips", "Face pulls", "Hammer curl",
];

const tidligereØkter = [
  { dato: "Mandag 14. april", navn: "Overkropp", sett: 12, topp: "Benkpress 85kg" },
  { dato: "Onsdag 16. april", navn: "Bein", sett: 15, topp: "Knebøy 100kg" },
];

function Tidtaker({ aktiv }: { aktiv: boolean }) {
  const [sekunder, setSekunder] = useState(0);

  useEffect(() => {
    if (!aktiv) return;
    const id = setInterval(() => setSekunder((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [aktiv]);

  const min = String(Math.floor(sekunder / 60)).padStart(2, "0");
  const sek = String(sekunder % 60).padStart(2, "0");

  return (
    <span className="text-blue-400 font-mono font-bold">{min}:{sek}</span>
  );
}

function HvileTimer({ onFerdig }: { onFerdig: () => void }) {
  const [sekunder, setSekunder] = useState(90);

  useEffect(() => {
    if (sekunder <= 0) { onFerdig(); return; }
    const id = setInterval(() => setSekunder((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [sekunder]);

  const prosent = (sekunder / 90) * 100;

  return (
    <div className="bg-orange-900/30 border border-orange-700/40 rounded-2xl p-4 my-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-orange-400 text-sm font-semibold">😮‍💨 Hvile</p>
        <p className="text-orange-300 font-mono font-bold text-lg">{sekunder}s</p>
      </div>
      <div className="h-2 bg-gray-800 rounded-full">
        <div
          className="h-2 bg-orange-500 rounded-full transition-all duration-1000"
          style={{ width: `${prosent}%` }}
        />
      </div>
      <button onClick={onFerdig} className="mt-2 text-orange-400 text-xs">
        Hopp over →
      </button>
    </div>
  );
}

export default function Trening() {
  const [fase, setFase] = useState<"oversikt" | "aktiv" | "ferdig">("oversikt");
  const [øvelser, setØvelser] = useState<Øvelse[]>([]);
  const [valgtØvelse, setValgtØvelse] = useState("");
  const [hvileAktiv, setHvileAktiv] = useState<string | null>(null);
  const [notat, setNotat] = useState("");

  function leggTilØvelse() {
    if (!valgtØvelse) return;
    setØvelser((prev) => [...prev, { navn: valgtØvelse, sett: [] }]);
    setValgtØvelse("");
  }

  function leggTilSett(øi: number) {
    const forrigeSett = øvelser[øi].sett.at(-1);
    setØvelser((prev) =>
      prev.map((ø, i) =>
        i === øi
          ? { ...ø, sett: [...ø.sett, { reps: forrigeSett?.reps ?? 8, vekt: forrigeSett?.vekt ?? 60, ferdig: false }] }
          : ø
      )
    );
  }

  function markerFerdig(øi: number, si: number) {
    setØvelser((prev) =>
      prev.map((ø, i) =>
        i === øi
          ? { ...ø, sett: ø.sett.map((s, j) => j === si ? { ...s, ferdig: !s.ferdig } : s) }
          : ø
      )
    );
    if (!øvelser[øi].sett[si].ferdig) {
      setHvileAktiv(`${øi}-${si}`);
    }
  }

  function oppdaterSett(øi: number, si: number, felt: "reps" | "vekt", verdi: number) {
    if (isNaN(verdi)) return;
    setØvelser((prev) =>
      prev.map((ø, i) =>
        i === øi
          ? { ...ø, sett: ø.sett.map((s, j) => j === si ? { ...s, [felt]: verdi } : s) }
          : ø
      )
    );
  }

  function slettØvelse(øi: number) {
    setØvelser((prev) => prev.filter((_, i) => i !== øi));
  }

  const totalSett = øvelser.reduce((a, ø) => a + ø.sett.filter(s => s.ferdig).length, 0);
  const totalTonn = øvelser.reduce((a, ø) => a + ø.sett.filter(s => s.ferdig).reduce((b, s) => b + s.vekt * s.reps, 0), 0);

  if (fase === "ferdig") {
    return (
      <main className="min-h-screen bg-gray-950 text-white pb-24 px-6 pt-14">
        <div className="text-center mt-8">
          <p className="text-6xl mb-4">🎉</p>
          <h1 className="text-3xl font-black mb-1">Økt fullført!</h1>
          <p className="text-gray-400 mb-6">Du er en legende 💪</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-900 rounded-2xl p-3">
              <p className="text-gray-400 text-xs">Øvelser</p>
              <p className="text-2xl font-bold text-blue-400">{øvelser.length}</p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-3">
              <p className="text-gray-400 text-xs">Sett</p>
              <p className="text-2xl font-bold text-green-400">{totalSett}</p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-3">
              <p className="text-gray-400 text-xs">Tonn løftet</p>
              <p className="text-2xl font-bold text-purple-400">{(totalTonn / 1000).toFixed(1)}t</p>
            </div>
          </div>

          {øvelser.map((ø, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-4 mb-3 text-left">
              <p className="font-bold mb-2">{ø.navn}</p>
              {ø.sett.map((s, j) => (
                <div key={j} className="flex justify-between text-sm">
                  <p className="text-gray-500">Sett {j + 1}</p>
                  <p className={s.ferdig ? "text-green-400" : "text-gray-600"}>{s.vekt}kg × {s.reps} reps {s.ferdig ? "✓" : ""}</p>
                </div>
              ))}
            </div>
          ))}

          {notat && (
            <div className="bg-gray-900 rounded-2xl p-4 mb-4 text-left">
              <p className="text-gray-400 text-xs mb-1">NOTAT</p>
              <p className="text-sm text-gray-300">{notat}</p>
            </div>
          )}

          <button
            onClick={() => { setFase("oversikt"); setØvelser([]); setNotat(""); }}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl"
          >
            Tilbake til oversikt
          </button>
        </div>
      </main>
    );
  }

  if (fase === "aktiv") {
    return (
      <main className="min-h-screen bg-gray-950 text-white pb-32 pt-14">

        {/* Header */}
        <div className="px-6 pb-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black">Aktiv økt 💪</h1>
            <Tidtaker aktiv={true} />
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs">{totalSett} sett fullført</p>
            <p className="text-gray-500 text-xs">{(totalTonn / 1000).toFixed(1)}t løftet</p>
          </div>
        </div>

        <div className="px-6 pt-4 space-y-4">

          {øvelser.map((ø, øi) => (
            <div key={øi} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold">{ø.navn}</p>
                <button onClick={() => slettØvelse(øi)} className="text-gray-600 text-xs hover:text-red-400">slett</button>
              </div>

              {/* Sett header */}
              <div className="flex gap-2 mb-2 text-gray-600 text-xs">
                <span className="w-10">SETT</span>
                <span className="flex-1 text-center">VEKT</span>
                <span className="flex-1 text-center">REPS</span>
                <span className="w-8"></span>
              </div>

              {ø.sett.map((s, si) => (
                <div key={si}>
                  <div className={`flex items-center gap-2 mb-2 rounded-xl p-1 transition-colors ${s.ferdig ? "bg-green-900/20" : ""}`}>
                    <span className="text-gray-500 text-xs w-10 text-center">{si + 1}</span>

                    <div className="flex items-center bg-gray-800 rounded-xl flex-1">
                      <button onClick={() => oppdaterSett(øi, si, "vekt", Math.max(0, s.vekt - 2.5))} className="text-white px-2 py-1.5 text-sm hover:bg-gray-700 rounded-l-xl">-</button>
                      <input
                        type="number"
                        value={s.vekt}
                        onChange={(e) => oppdaterSett(øi, si, "vekt", parseFloat(e.target.value))}
                        className="bg-transparent text-white font-bold text-center w-full text-sm focus:outline-none"
                      />
                      <span className="text-gray-500 text-xs">kg</span>
                      <button onClick={() => oppdaterSett(øi, si, "vekt", s.vekt + 2.5)} className="text-white px-2 py-1.5 text-sm hover:bg-gray-700 rounded-r-xl">+</button>
                    </div>

                    <div className="flex items-center bg-gray-800 rounded-xl flex-1">
                      <button onClick={() => oppdaterSett(øi, si, "reps", Math.max(1, s.reps - 1))} className="text-white px-2 py-1.5 text-sm hover:bg-gray-700 rounded-l-xl">-</button>
                      <input
                        type="number"
                        value={s.reps}
                        onChange={(e) => oppdaterSett(øi, si, "reps", parseInt(e.target.value))}
                        className="bg-transparent text-white font-bold text-center w-full text-sm focus:outline-none"
                      />
                      <button onClick={() => oppdaterSett(øi, si, "reps", s.reps + 1)} className="text-white px-2 py-1.5 text-sm hover:bg-gray-700 rounded-r-xl">+</button>
                    </div>

                    <button
                      onClick={() => markerFerdig(øi, si)}
                      className={`w-8 h-8 rounded-xl text-sm font-bold transition-colors ${s.ferdig ? "bg-green-600 text-white" : "bg-gray-800 text-gray-500"}`}
                    >
                      ✓
                    </button>
                  </div>

                  {hvileAktiv === `${øi}-${si}` && (
                    <HvileTimer onFerdig={() => setHvileAktiv(null)} />
                  )}
                </div>
              ))}

              <button onClick={() => leggTilSett(øi)} className="mt-2 text-blue-400 text-sm font-semibold">
                + Legg til sett
              </button>
            </div>
          ))}

          {/* Legg til øvelse */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-gray-400 text-xs mb-2">LEGG TIL ØVELSE</p>
            <select
              value={valgtØvelse}
              onChange={(e) => setValgtØvelse(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-xl px-3 py-2 mb-3 text-sm"
            >
              <option value="">Velg øvelse...</option>
              {øvelseAlternativer.map((ø) => (
                <option key={ø} value={ø}>{ø}</option>
              ))}
            </select>
            <button onClick={leggTilØvelse} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-sm">
              + Legg til
            </button>
          </div>

          {/* Notat */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-gray-400 text-xs mb-2">📝 NOTAT</p>
            <textarea
              value={notat}
              onChange={(e) => setNotat(e.target.value)}
              placeholder="Hvordan føltes økten? Noe å merke seg..."
              className="w-full bg-gray-800 text-white text-sm rounded-xl px-3 py-2 focus:outline-none resize-none"
              rows={3}
            />
          </div>

        </div>

        {/* Sticky fullfør-knapp */}
        <div className="fixed bottom-20 left-0 right-0 px-6">
          <button
            onClick={() => setFase("ferdig")}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-900/40"
          >
            ✅ Fullfør økt
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-24 pt-14">
      <div className="px-6 pb-6">
        <h1 className="text-3xl font-black">Trening 💪</h1>
        <p className="text-gray-500 text-sm mt-1">Logg dagens økt</p>
      </div>

      <div className="px-6 space-y-4">
        <button
          onClick={() => setFase("aktiv")}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-blue-900/40"
        >
          🏋️ Start ny økt
        </button>

        <div className="bg-blue-600/20 border border-blue-600/40 rounded-2xl p-4">
          <p className="text-blue-400 text-xs mb-2">🤖 AI FORSLAG I DAG</p>
          <p className="font-bold text-lg">Overkropp</p>
          <p className="text-gray-400 text-sm mb-2">Benkpress · Skulder · Triceps</p>
          <p className="text-blue-300 text-xs">HRV er over snitt – kroppen er klar for tung økt. Prøv 87.5 kg på benkpress.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <p className="text-gray-400 text-xs mb-3">🎯 DITT MÅL</p>
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold">Benkpress 80 → 110 kg</p>
            <p className="text-green-400 font-bold">85 kg</p>
          </div>
          <div className="h-2 bg-gray-800 rounded-full mb-1">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full" style={{ width: "17%" }} />
          </div>
          <p className="text-gray-600 text-xs">17% av veien – ca. 14 uker igjen 🔥</p>
        </div>

        <p className="text-gray-500 text-xs pt-2">TIDLIGERE ØKTER</p>
        {tidligereØkter.map((økt, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{økt.navn}</p>
                <p className="text-gray-500 text-xs">{økt.dato}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">{økt.sett} sett</p>
                <p className="text-blue-400 text-xs">{økt.topp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}