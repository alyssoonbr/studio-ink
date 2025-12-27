"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-50
          w-64 h-full bg-neutral-900 border-r border-neutral-800 p-6
          transform transition-transform
          ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <h2 className="text-2xl font-bold text-orange-400 mb-8">
          Ink Studio
        </h2>

        <nav className="flex flex-col gap-4">
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-orange-400">
              Início🏠
              </Link>

            <Link
              href="/dashboard/tatuadores"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-orange-400">
               Tatuadores 🧑‍🎨
              </Link>

            <Link
              href="/dashboard/tatuagens"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-orange-400">
              Minhas Tatuagens 🖋️
             </Link>

            <Link
              href="/dashboard/agendamentos"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-orange-400">
              Agendamentos   📅 
             </Link>

            <Link
              href="/dashboard/chat"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-orange-400">
              Chat 💬
             </Link>
             <button
              onClick={handleLogout}
              className="mt-8 text-red-400 hover:text-red-500">
             Sair
            </button>
          </nav>
      </aside>

      {/* Overlay mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {/* Header mobile */}
      <header className="md:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setMenuOpen(true)}
          className="px-3 py-2 border border-neutral-700 rounded-lg hover:border-orange-500 transition">
          Menu 🧾
        </button>
     </header>

        {children}
      </main>
    </div>
  );
}