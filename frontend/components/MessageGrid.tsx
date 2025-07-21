'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/utils/api';

type Message = {
  id: number;
  account_id: number;
  message: string;
  timestamp: string;
  channel: string;
};

type ConnectedBot = {
  id: number;
  name: string;
};
type Props = {
  connectedBots?: ConnectedBot[];
  updateTrigger?: number;
  channel: string;
};

export default function MessageGrid({ connectedBots = [], updateTrigger, channel }: Props) {
  const [logs, setLogs] = useState<Record<number, Message[]>>({});

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token');
      const newLogs: Record<number, Message[]> = {};

      await Promise.all(
        connectedBots.map(async bot => {
          try {
            const res = await fetch(`${API_URL}/logs/messages/${bot.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json();
            newLogs[bot.id] = Array.isArray(data) ? data : [];
          } catch (err) {
            console.error(`Ошибка при загрузке логов для бота ${bot.id}`, err);
            newLogs[bot.id] = [];
          }
        })
      );

      setLogs(newLogs);
    };

    if (connectedBots.length > 0) {
      fetchLogs();
    }
  }, [connectedBots, updateTrigger]); // следим за updateTrigger

  if (connectedBots.length === 0) {
    return <p className="text-white flex items-center justify-center h-full w-full font-bold text-3xl">Ни один из аккаунтов не подключён</p>;
  }

  return (
<div className="flex h-full gap-3">
  {/* Twitch чат слева */}
    <div className="w-[35%] h-full bg-[#222] rounded-xl overflow-hidden">
    {channel && (
        <iframe
        src={`https://www.twitch.tv/embed/${channel}/chat?parent=nv-server.online`}
        height="100%"
        width="100%"
        ></iframe>
    )}
    </div>

  {/* Сетка логов справа */}
  <div className="flex-1 grid grid-cols-2 gap-3 h-full">
    {connectedBots.map(bot => (
      <div key={bot.id} className="bg-[#1f1f1f] rounded-xl p-2 text-sm text-white custom-scroll overflow-y-auto">
        <p className="font-semibold text-cyan-400 mb-2 text-center">{bot.name}</p>
        <div className="space-y-1 max-h-full">
          {(logs[bot.id] || [])
            .filter(log => log.channel === channel)
            .map((log, i) => (
              <div key={i} className="bg-[#2a2a2a] px-2 py-1 rounded">
                <span className="block text-gray-300 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span>{log.message}</span>
              </div>
            ))}
        </div>
      </div>
    ))}
  </div>
</div>
  );
}
