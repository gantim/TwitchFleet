import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [channel, setChannel] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    const res = await axios.get('/api/accounts');
    setAccounts(res.data.filter(a => a.type === 'chat'));
  };

  const joinChannel = async () => {
    if (!channel) return;
    await axios.post('/api/join-channel', { channel });
    fetchAccounts();
  };

  const sendHaha = async () => {
    await axios.post('/api/simulate/haha');
  };

  const sendMessage = async () => {
    if (!message) return;
    setLoading(true);
    await axios.post('/api/send-message', { message });
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="p-4 font-mono">
      <h1 className="text-xl mb-4 font-bold">TwitchFleet Панель</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border px-2 py-1 rounded"
          placeholder="Twitch-канал"
          value={channel}
          onChange={e => setChannel(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={joinChannel}>Подключить всех</button>
        <button className="bg-red-600 text-white px-4 py-1 rounded" onClick={sendHaha}>ХАХА</button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          className="border px-2 py-1 rounded w-96"
          placeholder="Сообщение"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-1 rounded"
          disabled={loading}
          onClick={sendMessage}
        >
          Отправить
        </button>
      </div>

      <table className="text-sm border">
        <thead>
          <tr>
            <th className="border px-2">Username</th>
            <th className="border px-2">Channel</th>
            <th className="border px-2">Заблокирован до</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(acc => (
            <tr key={acc.id} className="border">
              <td className="border px-2">{acc.username}</td>
              <td className="border px-2">{acc.current_channel || '-'}</td>
              <td className="border px-2 text-xs text-gray-500">
                {acc.locked_until ? new Date(acc.locked_until).toLocaleTimeString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
