'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleRegister = async () => {
    setErrors([]);

    try {
      const res = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.error) return setErrors([data.error]);
        if (data.errors) return setErrors(data.errors);
        return setErrors(['Неизвестная ошибка']);
      }

      console.log('Успешная регистрация:', data);
      router.push('/login');
    } catch {
      setErrors(['Ошибка подключения к серверу']);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 transition-opacity duration-500 animate-fade-in">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md text-center">
        <img src="/tf.ico" alt="TF Logo" className="w-16 h-16 mx-auto mb-4" />

        {errors.length > 0 && (
          <div className="mb-1 text-red-500 space-y-1">
            {errors.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
        )}

        
        <form
          onSubmit={e => {
            e.preventDefault();
            handleRegister();
          }}
          className="space-y-4"
        >
          <div>
            <p className="py-1 flex items-baseline font-medium">Username</p>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <p className="py-1 pt- -mt-2 flex items-baseline font-medium">Password</p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-neutral-800 text-white py-2 rounded-md hover:bg-neutral-700 transition-colors duration-200"
          >
            Зарегистрироваться
          </button>

          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full bg-neutral-200 text-black py-2 rounded-md hover:bg-neutral-300 transition-colors duration-200"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
