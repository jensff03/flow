"use client";

const søvnData = [
  { dag: "Man", timer: 6.5, kvalitet: 72 },
  { dag: "Tir", timer: 7.8, kvalitet: 85 },
  { dag: "Ons", timer: 5.9, kvalitet: 61 },
  { dag: "Tor", timer: 8.1, kvalitet: 91 },
  { dag: "Fre", timer: 7.3, kvalitet: 82 },
  { dag: "Lør", timer: 9.0, kvalitet: 94 },
  { dag: "Søn", timer: 7.5, kvalitet: 79 },
];

export default function Sovn() {
  const iNatt = søvnData[søvnData.length - 1];
  const snitt = (søvnData.reduce((a, b) => a + b.timer, 0) / søvnData.length).toFixed(1);

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-24">

      {/* Header */}
      <div className="px-6 pt-14 pb-6">
        <h1 className="text-3xl font-black">Søvn 😴</h1>
        <p className="text-gray-500 text-sm mt-1">Siste 7 netter</p>
      </div>

      <div className="px-6 space-y-4">

        {/* I natt */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <p className="text-gray-400 text-xs mb-1">I NATT</p>
          <div className="flex items-end gap-3">
            <p className="text-5xl font-black text-purple-400">{iNatt.timer}t</p>
            <p className="text-gray-400 mb-1">søvn</p>
          </div>
          <div className="mt-3 h-2 bg-gray-800 rounded-full">
            <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${iNatt.kvalitet}%` }} />
          </div>
          <p className="text-gray-500 text-xs mt-1">Kvalitet: {iNatt.kvalitet}/100</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center">
            <p className="text-gray-400 text-xs mb-1">Snitt</p>
            <p className="text-xl font-bold text-purple-400">{snitt}t</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center">
            <p className="text-gray-400 text-xs mb-1">HRV</p>
            <p className="text-xl font-bold text-blue-400">62</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center">
            <p className="text-gray-400 text-xs mb-1">Restitusjon</p>
            <p className="text-xl font-bold text-green-400">84%</p>
          </div>
        </div>

        {/* Ukesgraf */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <p className="text-gray-400 text-xs mb-4">SISTE 7 NETTER</p>
          <div className="flex items-end justify-between gap-2 h-24">
            {søvnData.map((d) => (
              <div key={d.dag} className="flex flex-col items-center flex-1 gap-1">
                <div
                  className="w-full bg-purple-500/80 rounded-t-lg transition-all"
                  style={{ height: `${(d.timer / 10) * 100}%` }}
                />
                <p className="text-gray-500 text-xs">{d.dag}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI innsikt */}
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-800/40 rounded-2xl p-4">
          <p className="text-gray-400 text-xs mb-2">🤖 AI COACH SIER</p>
          <p className="text-sm text-gray-200">
            Du sover best når du legger deg før 23:00. De siste 3 dagene med 7t+ søvn har gitt deg 15% bedre HRV – fortsett sånn før tunge økter.
          </p>
        </div>

      </div>
    </main>
  );
}