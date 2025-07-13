"use client";

import Image from "next/image";
import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // TODO: реализовать регистрацию
    console.log("Register", { username, password });
  };

  const handleLoginRedirect = () => {
    // TODO: заменить на переход через useRouter или Link
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      {/* Логотип */}
      <Image src="/tf.ico" alt="TF Logo" width={80} height={80} className="mb-10" />

      {/* Форма */}
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 dark:border-neutral-700 rounded px-3 py-2 text-sm bg-white dark:bg-neutral-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-neutral-700 rounded px-3 py-2 text-sm bg-white dark:bg-neutral-800"
          />
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
        >
          Register
        </button>

        <button
          onClick={handleLoginRedirect}
          className="w-full bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white py-2 rounded border border-gray-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
}