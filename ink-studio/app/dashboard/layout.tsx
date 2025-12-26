"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-orange-400 mb-8">
          Ink Studio
        </h2>

        <nav className="space-y-4">
          <Link href="/dashboard" className="block hover:text-orange-400">
               Dashboard 🏠
          </Link>
          <Link href="/dashboard/tatuadores" className="block hover:text-orange-400">
               Tatuadores🧑‍🎨
          </Link>
          <Link href="/dashboard/tatuagens" className="block hover:text-orange-400">
               Minhas Tatuagens🖋️
          </Link>
          <Link href="/dashboard/agendamentos" className="block hover:text-orange-400">
               Agendamentos 📅
          </Link>
          <Link href="/dashboard/chat" className="block hover:text-orange-400">
               Chat💬
          </Link>

          <button
            onClick={handleLogout}
            className="mt-10 text-red-400 hover:text-red-500"
          >
            Sair
          </button>
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}