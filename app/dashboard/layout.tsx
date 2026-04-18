"use client";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: "dashboard", label: "Dashboard", emoji: "🏠", path: "/dashboard" },
    { id: "trening", label: "Trening", emoji: "💪", path: "/dashboard/trening" },
    { id: "mat", label: "Mat", emoji: "🥗", path: "/dashboard/mat" },
    { id: "sovn", label: "Søvn", emoji: "😴", path: "/dashboard/sovn" },
    { id: "ai", label: "AI Coach", emoji: "🤖", path: "/dashboard/ai" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {children}
      <nav className="fixed bottom-0 left-0 w-full bg-gray-950 border-t border-gray-800">
        <ul className="flex justify-around">
          {tabs.map((tab) => (
            <li key={tab.id} className="flex-1">
              <button
                onClick={() => router.push(tab.path)}
                className={`flex flex-col items-center justify-center py-3 w-full transition-colors ${
                  pathname === tab.path ? "text-blue-500" : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="text-2xl">{tab.emoji}</span>
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
