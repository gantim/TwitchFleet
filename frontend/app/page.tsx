"use client";

import Image from "next/image";
import { useState } from "react";

export default function MainPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [channel, setChannel] = useState("sontce3");
  const [streamKey, setStreamKey] = useState("sontce3");

  const handleConnectStream = () => {
    setStreamKey(channel);
  };

  const handleConnectBots = () => {
    alert(`Боты подключены к каналу: ${channel}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Image src="/tf.ico" alt="TF Logo" width={36} height={36} />
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-neutral-100 text-sm px-4 py-1.5 rounded hover:bg-neutral-200">
            Панель управления
          </button>
          <button className="text-sm px-4 py-1.5 rounded hover:underline">
            Админ панель
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-400 hover:opacity-80 overflow-hidden"
          ></button>
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
      <main className="flex-1 bg-[#2d2d2d] grid grid-cols-[300px_1fr_1fr] grid-rows-[auto_1fr_auto] gap-4 p-4 text-white">
        {/* Левая панель */}
        <div className="col-start-1 row-span-3 flex flex-col gap-4 overflow-hidden">
          <textarea
            placeholder="Введите сообщение..."
            className="bg-[#1f1f1f] p-4 rounded resize-none h-24 text-sm"
          ></textarea>

          <div className="bg-[#1f1f1f] p-4 rounded">
            <button className="text-sm mb-2 border-b border-purple-500 w-full text-left">
              Скрипты
            </button>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {Array.from({ length: 16 }).map((_, i) => (
                <button key={i} className="bg-black p-2 rounded">
                  {i === 0 ? "ХАХА" : `C${i}`}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#1f1f1f] p-4 rounded flex-1 overflow-auto">
            <button className="text-sm mb-2 border-b border-lime-400 w-full text-left">
              История подключений
            </button>
            {[...Array(20)].map((_, i) => (
              <div key={i} className="mb-1 text-sm">
                Канал {i + 1}<br />Боты: бот1, бот2, бот3
              </div>
            ))}
          </div>
        </div>

        {/* Центр: подключенные аккаунты */}
        <div className="col-start-2 row-span-2 flex flex-col gap-4 overflow-hidden">
          <div className="bg-[#1f1f1f] p-4 rounded flex-1 overflow-auto">
            <button className="text-sm mb-2 border-b border-cyan-400 w-full text-left">
              Подключенные аккаунты
            </button>
            {[...Array(40)].map((_, i) => (
              <div key={i} className="py-0.5 text-sm">Бот {i + 1}</div>
            ))}
          </div>
        </div>

        <div className="col-start-2 row-start-3">
          <div className="bg-[#1f1f1f] p-4 rounded h-[240px] overflow-auto">
            <button className="text-sm mb-2 border-b border-green-400 w-full text-left">
              Подключение аккаунтов
            </button>
            <div className="text-xs mb-2 flex items-center gap-2">
              Канал:
              <input
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="bg-neutral-800 px-2 py-1 rounded text-white text-xs w-32"
              />
              <button
                onClick={handleConnectStream}
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded"
              >
                Подключиться
              </button>
              <button
                onClick={handleConnectBots}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
              >
                Подключить ботов
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[...Array(60)].map((_, i) => (
                <div key={i} className="text-center p-1 bg-black rounded">Бот {i + 1}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Стрим */}
        <div className="col-start-3 row-start-1 row-span-2 flex flex-col">
          <div className="bg-black rounded overflow-hidden aspect-video w-full">
            <iframe
              src={`https://player.twitch.tv/?muted=true&parent=localhost&channel=${streamKey}`}
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          {/* История чатов ботов */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[#1f1f1f] p-3 rounded text-xs text-center h-40">
                История чата {i + 1} бота
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
