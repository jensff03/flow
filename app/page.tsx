"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Landing() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center relative overflow-hidden px-6">
      
      {/* Bakgrunnsglød */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 opacity-20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-600 opacity-10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div
        className={`transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="text-7xl font-black tracking-tight mb-2 text-center">
          flow
        </h1>
        <div className="h-1 w-16 bg-blue-500 rounded-full mx-auto mb-8" />
      </div>

      {/* Tagline */}
      <div
        className={`transition-all duration-700 delay-200 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-xl text-gray-300 text-center mb-4 font-medium">
          Din personlige treningsassistent
        </p>
        <p className="text-gray-500 text-center text-sm max-w-xs mx-auto mb-12">
          Samler alt fra Garmin, Whoop, Apple Health og Strong – og gir deg én oversikt med AI som forstår kroppen din.
        </p>
      </div>

      {/* Features */}
      <div
        className={`transition-all duration-700 delay-300 grid grid-cols-3 gap-4 mb-12 w-full max-w-sm ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {[
          { emoji: "📊", label: "Alt på ett sted" },
          { emoji: "🤖", label: "AI Coach" },
          { emoji: "😴", label: "Søvn & restitusjon" },
        ].map((f) => (
          <div key={f.label} className="bg-gray-800 rounded-2xl p-4 flex flex-col items-center gap-2">
            <span className="text-2xl">{f.emoji}</span>
            <span className="text-xs text-gray-400 text-center">{f.label}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className={`transition-all duration-700 delay-500 w-full max-w-sm ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-blue-900/40"
        >
          Kom i gang →
        </button>
        <p className="text-gray-600 text-xs text-center mt-4">
          Gratis å prøve. Ingen kredittkort.
        </p>
      </div>

    </main>
  );
}
