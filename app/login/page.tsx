

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Aquí puedes reemplazar con fetch a tu API route real
    if (username === "admin" && password === "1234") {
      // Login exitoso
      router.push("/upload"); // redirige a la página de subida
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="text-3xl font-bold text-amber-700 text-center mb-4">
          Iniciar Sesión
        </h1>

        {error && <p className="text-red-600 text-center">{error}</p>}

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-stone-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Tu usuario"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-stone-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Tu contraseña"
          />
        </div>

        <button
          type="submit"
          className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-full font-semibold transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
