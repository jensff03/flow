"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 10) return "God morgen 🌅";
  if (hour < 14) return "God formiddag ☀️";
  if (hour < 18) return "God ettermiddag 💪";
  return "God kveld 🌙";
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-24">

      <div className="px-6 pt-14 pb-6">
        <p className="text-gray-400 text-sm mb-1">Fredag 17. april</p>
        <h1 className="text-3xl font-black">{getGreeting()}</h1>
        <p className="text-gray-500 text-sm mt-1">Her er hvordan du ligger an i dag</p>
      </div>

      <div className="px-6">
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <p className="text-gray-400 text-xs mb-1">Kalorier</p>
                <p className="text-2xl font-bold text-blue-400">1 840</p>
                <div className="mt-2 h-1.5 bg-gray-800 rounded-full">
                  <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: "76%" }} />
                </div>
                <p className="text-gray-600 text-xs mt-1">av 2 400 kcal</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <p className="text-gray-400 text-xs mb-1">Søvn</p>
                <p className="text-2xl font-bold text-purple-400">7t 20m</p>
                <div className="mt-2 h-1.5 bg-gray-800 rounded-full">
                  <div className="h-1.5 bg-purple-500 rounded-full" style={{ width: "82%" }} />
                </div>
                <p className="text-gray-600 text-xs mt-1">God natt ✓</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <p className="text-gray-400 text-xs mb-1">Skritt</p>
                <p className="text-2xl font-bold text-green-400">8 240</p>
                <div className="mt-2 h-1.5 bg-gray-800 rounded-full">
                  <div className="h-1.5 bg-green-500 rounded-full" style={{ width: "82%" }} />
                </div>
                <p className="text-gray-600 text-xs mt-1">av 10 000</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <p className="text-gray-400 text-xs mb-1">HRV</p>
                <p className="text-2xl font-bold text-orange-400">62</p>
                <div className="mt-2 h-1.5 bg-gray-800 rounded-full">
                  <div className="h-1.5 bg-orange-500 rounded-full" style={{ width: "68%" }} />
                </div>
                <p className="text-gray-600 text-xs mt-1">Over snitt ↑</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <p className="text-gray-400 text-xs mb-3">DAGENS ØKT</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">Overkropp 💪</p>
                  <p className="text-gray-500 text-sm">Benkpress · Skulder · Triceps</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                  Start
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-800/40 rounded-2xl p-4">
              <p className="text-gray-400 text-xs mb-2">🤖 AI COACH SIER</p>
              <p className="text-sm text-gray-200">
                HRV-en din er over gjennomsnittet i dag – kroppen er klar. Perfekt dag for progressiv overload på benkpress.
              </p>
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 w-full bg-gray-950 border-t border-gray-800">
        <ul className="flex justify-around">
          {[
            { id: "dashboard", label: "Dashboard", emoji: "🏠", path: "/dashboard" },
            { id: "trening", label: "Trening", emoji: "💪", path: "/dashboard/trening" },
            { id: "mat", label: "Mat", emoji: "🥗", path: "/dashboard/mat" },
            { id: "sovn", label: "Søvn", emoji: "😴", path: "/dashboard/sovn" },
            { id: "ai", label: "AI Coach", emoji: "🤖", path: "/dashboard/ai" },
          ].map((tab) => (
            <li key={tab.id} className="flex-1">
              <button
                onClick={() => {
                  setActiveTab(tab.id);
                  router.push(tab.path);
                }}
                className={`flex flex-col items-center justify-center py-3 w-full transition-colors ${
                  activeTab === tab.id ? "text-blue-500" : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="text-2xl">{tab.emoji}</span>
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

    </main>
  );
}