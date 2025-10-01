"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaPlus, FaEdit, FaSignOutAlt, FaUser, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import { motion, Variants } from "framer-motion";

type Product = {
  id: number;
  title: string;
  description: string;
  price: string;
  image_url: string;
  status: boolean;
  user_id: string;
};

export default function Perfil() {
  const router = useRouter();
  const { user } = useAuth();
  const [available, setAvailable] = useState<Product[]>([]);
  const [unavailable, setUnavailable] = useState<Product[]>([]);
  const [reload, setReload] = useState(false);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const fetchProducts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user.id);

    if (error) return console.error(error);

    setAvailable(data.filter((p) => p.status === true));
    setUnavailable(data.filter((p) => p.status === false));
  };

  useEffect(() => {
    fetchProducts();
  }, [user, reload]);

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    if (!user) return;
    const newStatus = !currentStatus;

    const { error } = await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      alert("Error cambiando estado: " + error.message);
    } else {
      setReload((prev) => !prev);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!user) return;
    const confirmDelete = confirm("¿Estás seguro que quieres eliminar este producto?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      alert("Error eliminando producto: " + error.message);
    } else {
      alert("Producto eliminado correctamente");
      setReload((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-2xl font-bold mb-6 text-amber-800 text-center">
          Debes iniciar sesión para ver tu perfil.
        </p>
        <button
          type="button"
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-full font-semibold transition flex items-center gap-2"
          onClick={() => router.push("/login")}
        >
          <FaEdit /> Iniciar
        </button>
      </div>
    );
  }

  return (
    <main className="bg-stone-100 min-h-screen py-16 px-6 md:px-12">
      {/* Usuario */}
      <section className="bg-white rounded-2xl shadow-md border border-stone-300 p-6 mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <FaUser className="text-amber-800 text-3xl" />
          <div>
            <p className="text-lg font-semibold text-stone-800">Usuario: {user.email}</p>
            <p className="text-sm text-stone-600">ID: {user.id}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 bg-stone-700 hover:bg-stone-800 text-white px-4 py-2 rounded-full shadow transition"
        >
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </section>

      {/* Botón añadir */}
      <div className="flex justify-end mb-8">
        <button
          type="button"
          onClick={() => router.push("/upload")}
          className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-full shadow transition"
        >
          <FaPlus /> Añadir Producto
        </button>
      </div>

      {/* Disponibles */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center md:text-left">
          Productos Disponibles
        </h2>
        {available.length === 0 ? (
          <p className="text-stone-600 text-center">No hay productos disponibles.</p>
        ) : (
          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {available.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-stone-300 flex flex-col"
                variants={cardVariants}
                whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
              >
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-stone-800">{product.title}</h3>
                    <p className="mt-2 text-stone-600">{product.description}</p>
                    <p className="mt-2 font-bold text-amber-700 text-lg">{product.price}</p>
                  </div>
                  <div className="mt-4 flex gap-3 flex-wrap">
                    <button
                      type="button"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-full font-semibold transition"
                      onClick={() => toggleStatus(product.id, product.status)}
                    >
                      Marcar no disponible
                    </button>
                    <button
                      type="button"
                      className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-full font-semibold transition flex items-center gap-2"
                      onClick={() => router.push(`/modified/${product.id}`)}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      type="button"
                      className="bg-stone-700 hover:bg-stone-800 text-white px-4 py-2 rounded-full font-semibold transition flex items-center gap-2"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* No disponibles */}
      <section>
        <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center md:text-left">
          Productos No Disponibles
        </h2>
        {unavailable.length === 0 ? (
          <p className="text-stone-600 text-center">No hay productos no disponibles.</p>
        ) : (
          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {unavailable.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-stone-300 flex flex-col opacity-75"
                variants={cardVariants}
                whileHover={{
                  scale: 1.03,
                  rotate: 1,
                  transition: { type: "spring", stiffness: 200 },
                }}
              >
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-stone-800">{product.title}</h3>
                    <p className="mt-2 text-stone-600">{product.description}</p>
                    <p className="mt-2 font-bold text-amber-700 text-lg">{product.price}</p>
                  </div>
                  <button
                    type="button"
                    className="mt-4 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-full font-semibold transition"
                    onClick={() => toggleStatus(product.id, product.status)}
                  >
                    Marcar disponible
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}
