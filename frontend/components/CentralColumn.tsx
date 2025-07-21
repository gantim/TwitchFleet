'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/utils/api';

type Props = {
  message: string;
  onMessageChange: (msg: string) => void;
  onChannelSubmit: (channel: string) => void;
  onConnectedChange: (bots: Bot[]) => void;
  onMessageSent?: () => void; // ← добавить
};

type Bot = {
  id: number;
  name: string;
  connected: boolean;
};

export default function CentralColumn({ message, onChannelSubmit, onMessageChange, onConnectedChange, onMessageSent }: Props) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [connectedBots, setConnectedBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [channelInput, setChannelInput] = useState('');

  useEffect(() => {
    const loadBots = async () => {
      try {
        // 1. Получаем текущего пользователя
        const token = localStorage.getItem('token');
        const meRes = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const meData = await meRes.json();
        const userId = meData?.id;
        if (!userId) throw new Error('Не удалось получить пользователя');

        // 2. Получаем аккаунты пользователя
        const accountsRes = await fetch(`${API_URL}/users/${userId}/accounts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const accountsData = await accountsRes.json();

        // Проверим, что это массив
        if (!Array.isArray(accountsData)) {
        console.error('Неверный формат accountsData:', accountsData);
        return;
        }

        const mappedBots = accountsData.map((account: any) => ({
        id: account.id,
        name: account.username || `Бот ${account.id}`,
        connected: false,
        }));
        setBots(mappedBots);
      } catch (err) {
        console.error('Ошибка при загрузке аккаунтов:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBots();
  }, []);

  const handleSendMessage = async (botId: number) => {
    try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/accounts/message/${botId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: message }),
        });

        console.log(`Сообщение отправлено от бота ${botId}`);
        onMessageChange('');
        onMessageSent?.();
    } catch (err) {
        console.error('Ошибка при отправке сообщения:', err);
    }
    };

    const toggleBot = async (botId: number, channel: string) => {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;

    const endpoint = bot.connected ? 'disconnect' : 'connect';

    try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/accounts/${endpoint}/${botId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ channel }),
        });

        const updatedBots = bots.map(b =>
        b.id === botId ? { ...b, connected: !b.connected } : b
        );
        setBots(updatedBots);

        let updatedConnected: Bot[];
        if (!bot.connected) {
        const newBot = { ...bot, connected: true };
        const newConnected = [...connectedBots, newBot];
        setConnectedBots(newConnected);
        updatedConnected = newConnected;
        } else {
        const filtered = connectedBots.filter(b => b.id !== botId);
        setConnectedBots(filtered);
        updatedConnected = filtered;
        }

        // 🔥 Важно: пробрасываем обновление наверх
        onConnectedChange(updatedConnected);
    } catch (err) {
        console.error('Ошибка подключения/отключения:', err);
    }
    };

  return (
    <div className="flex flex-col h-full w-full gap-3">
      {/* ===== Блок 1: Подключенные аккаунты ===== */}
      <div className="h-[33%] bg-transparent flex flex-col gap-2">
        <div className="bg-[#222222] rounded-xl p-3 flex flex-col h-full">
          <p className="text-sm font-semibold text-white mb-2">Подключенные аккаунты</p>
          <div className="h-[5px] rounded-full bg-cyan-400 mb-3 w-full" />
          <div className="overflow-y-auto flex-1 custom-scroll flex flex-col gap-2 pr-2">
            {connectedBots.map(bot => (
            <button
                key={bot.id}
                onClick={() => handleSendMessage(bot.id)}
                className="bg-[#2a2a2a] text-white text-center rounded-md py-2 hover:bg-[#3a3a3a] transition"
            >
                {bot.name}
            </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Блок 2: Подключение аккаунтов ===== */}
      <div className="h-[33%] bg-transparent flex flex-col gap-2">
        <div className="bg-[#222222] rounded-xl p-3 flex flex-col h-full">
          <p className="text-sm font-semibold text-white mb-2">Подключение аккаунтов</p>
          <div className="h-[5px] rounded-full bg-green-500 mb-3 w-full" />

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Канал"
              value={channelInput}
              onChange={e => setChannelInput(e.target.value)}
              className="flex-1 bg-[#333] text-white px-2 py-1 rounded-md outline-none"
            />
            <button
            onClick={() => {
            onChannelSubmit(channelInput);
            bots.forEach(bot => {
                if (bot.connected) toggleBot(bot.id, channelInput); // 👈 тоже передаём
            });
            }}
            className="bg-green-600 hover:bg-green-500 text-white px-3 rounded-md transition"
            >
            Подключить
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scroll grid grid-cols-3 gap-2">
            {bots.map(bot => (
            <button
                key={bot.id}
                onClick={() => toggleBot(bot.id, channelInput)} // 👈 передаём канал
                className="flex items-center justify-start gap-2 px-2 py-1 rounded-md bg-[#2a2a2a] hover:bg-neutral-700 text-white text-sm transition"
            >
                <div
                className={`w-3 h-3 rounded-sm ${
                    bot.connected ? 'bg-green-500' : 'bg-red-500'
                }`}
                />
                {bot.name}
            </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Блок 3: Пустой ===== */}
      <div className="h-[34%] bg-[#222222] rounded-xl " />
    </div>
  );
}