"use client";

import Image from "next/image";
import { FaPlus, FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/authContext";

type Product = {
  id: number;
  title: string;
  description: string;
  price: string;
  image_url: string;
  status: string;
};

export default function Perfil() {
  const router = useRouter();
  const [available, setAvailable] = useState<Product[]>([]);
  const [unavailable, setUnavailable] = useState<Product[]>([]);
    const {user} = useAuth()
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) return console.error(error);

    setAvailable(data.filter((p) => p.status === "disponible"));
    setUnavailable(data.filter((p) => p.status === "no disponible"));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "disponible" ? "no disponible" : "disponible";
    const { error } = await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("user_id", user?.id);

    if (error) return alert("Error cambiando estado: " + error.message);
    fetchProducts();
  };

  return (
    <main className="bg-stone-100 min-h-screen p-6">
      {/* Header con botón Añadir */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-amber-700">Gestión de Productos</h1>
        <button
          onClick={() => router.push("/upload")}
          className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
        >
          <FaPlus /> Añadir Producto
        </button>
      </div>

      {/* Productos disponibles */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-amber-700 mb-6">Productos Disponibles</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-stone-300 hover:shadow-xl transition flex flex-col"
            >
              <Image
                src={p.image_url}
                alt={p.title}
                width={400}
                height={250}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-stone-900">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-stone-600">{p.description}</p>
                  <p className="mt-2 font-bold text-amber-800 text-lg">{p.price}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => toggleStatus(p.id, p.status)}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    Marcar no disponible
                  </button>
                  <button
                    onClick={() => router.push(`/modified/${p.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    <FaEdit /> Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Productos no disponibles */}
      <section>
        <h2 className="text-2xl font-semibold text-amber-700 mb-6">Productos No Disponibles</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {unavailable.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-stone-300 opacity-70 hover:opacity-100 transition flex flex-col"
            >
              <Image
                src={p.image_url}
                alt={p.title}
                width={400}
                height={250}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-stone-900">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-stone-600">{p.description}</p>
                  <p className="mt-2 font-bold text-amber-800 text-lg">{p.price}</p>
                </div>
                <button
                  onClick={() => toggleStatus(p.id, p.status)}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
                >
                  Marcar disponible
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
