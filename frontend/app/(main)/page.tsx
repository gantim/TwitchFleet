'use client';

import { useState } from 'react';
import { useMemo } from 'react';
import CentralColumn from '@/components/CentralColumn';
import MessageGrid from '@/components/MessageGrid';

type Bot = {
  id: number;
  name: string;
  connected: boolean;
};

export default function MainPage() {
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('');
  const [connectedBots, setConnectedBots] = useState<Bot[]>([]);
  const [messageUpdateTrigger, setMessageUpdateTrigger] = useState(0);

  const connectedBotsMapped = useMemo(
    () => connectedBots.map(bot => ({ id: bot.id, name: bot.name })),
    [connectedBots]
  );

  const handleChannelChange = (value: string) => {
    setChannel(value);
  };
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#3A3A3A] text-white flex">
      {/* Левый столбец */}
      <div className="w-[20%] p-[10px] flex flex-col gap-3">
        {/* Блок ввода сообщения */}
        <div className="h-[20%] bg-[#222222] rounded-xl p-3">
          <textarea
            className="w-full h-full resize-none bg-transparent text-white placeholder:text-gray-300 outline-none"
            placeholder="Введите сообщение..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </div>

        {/* Блок скриптов */}
        <div className="h-[20%] bg-[#222222] rounded-xl p-3 flex flex-col">
          <p className="text-sm font-semibold text-white mb-2">Скрипты</p>

          {/* Фиолетовая полоска */}
          <div className="h-[5px] rounded-full bg-purple-500 mb-3 w-full" />

          {/* Внешний scroll-контейнер */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
            {/* Внутренний фон и кнопки */}
            <div className="bg-[#363636] rounded-lg p-2 grid grid-cols-4 gap-2">
              {Array.from({ length: 50 }).map((_, i) => (
                <button
                  key={i}
                  className="bg-[#282828] hover:bg-neutral-700 rounded-md py-2 text-sm text-white transition-colors"
                >
                  {i < 4 ? ['ХАХА', 'ЯЯ', 'КУ', 'C3'][i] : `C${i}`}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Пустой нижний блок */}
        <div className="flex-1 bg-[#222222] rounded-xl" />
      </div>

      {/* Центральный столбец */}
      <div className="w-[30%] -ml-2 p-[10px] flex flex-col gap-3">
        <CentralColumn
          message={message}
          onMessageChange={setMessage}
          onChannelSubmit={setChannel}
          onConnectedChange={setConnectedBots}
          onMessageSent={() => setMessageUpdateTrigger(prev => prev + 1)} // ← добавлено
        />
      </div>

      {/* Правый столбец */}
      <div className="flex-1 flex flex-col -ml-1">
        <div className="aspect-video w-full h-[50%] bg-black">
          <iframe
            src={`https://player.twitch.tv/?muted=true&parent=213.176.65.26:3000&channel=${channel}`}
            height="100%"
            width="100%"
            allowFullScreen
          ></iframe>
        </div>
          <div className="flex-1 p-2 overflow-auto">
            <MessageGrid
              connectedBots={connectedBots.map(bot => ({ id: bot.id, name: bot.name }))}
              updateTrigger={messageUpdateTrigger}
              channel={channel} // ← обязательно!
            />
          </div>
      </div>
    </div>
  );
}