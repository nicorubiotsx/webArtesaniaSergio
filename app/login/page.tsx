// app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Si ya hay usuario, redirige al perfil
  useEffect(() => {
    if (!loading && user) {
      router.push("/profile");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      router.push("/profile"); // Redirigir al perfil
    } catch (err: any) {
      setError(err.message || "Error iniciando sesión");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-100">
        <p className="text-lg text-stone-700">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-stone-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md transition-transform transform hover:scale-[1.02]"
      >
        <h1 className="text-3xl font-extrabold mb-8 text-amber-700 text-center drop-shadow-md">
          Iniciar Sesión
        </h1>

        {error && (
          <p className="mb-4 text-red-600 text-center font-semibold">{error}</p>
        )}

        <label className="block mb-6">
          <span className="text-stone-700 font-semibold">Correo electrónico</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="mt-2 block w-full rounded-xl border border-stone-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
          />
        </label>

        <label className="block mb-8">
          <span className="text-stone-700 font-semibold">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="mt-2 block w-full rounded-xl border border-stone-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 rounded-2xl shadow-md transition-transform transform hover:scale-105"
        >
          {submitting ? "Iniciando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}
