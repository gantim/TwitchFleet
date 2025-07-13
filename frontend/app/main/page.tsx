"use client";

import Image from "next/image";
import { useState } from "react";

export default function MainPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/tf.ico" alt="TF Logo" width={36} height={36} />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button className="bg-neutral-100 text-sm px-4 py-1.5 rounded hover:bg-neutral-200">
            Панель управления
          </button>
          <button className="text-sm px-4 py-1.5 rounded hover:underline">
            Админ панель
          </button>
        </div>

        {/* Avatar */}
        <div className="relative">
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-400 hover:opacity-80 overflow-hidden"
            >
            </button>

            {menuOpen && (
                <div className="absolute right-0 mt-6 w-40 bg-white rounded-md shadow-md py-2 z-10">
                <button className="block w-full px-4 py-2 text-sm hover:bg-neutral-100 text-left">
                    Выйти
                </button>
                </div>
            )}
            </div>
      </header>

      {/* Content */}
      <main className="flex-1 bg-[#2d2d2d] flex items-center justify-center">
      </main>
    </div>
  );
}