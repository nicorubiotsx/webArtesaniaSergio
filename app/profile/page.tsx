"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaPlus, FaEdit, FaSignOutAlt, FaUser, FaTrash, FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";

type Product = {
  id: number;
  title: string;
  description: string;
  price: string;
  image_urls: string[] | null;
  status: boolean;
  user_id: string;
  created_at: string;
  category: "Madera" | "Metal" | "Madera+Metal" | "Cerámica" | "Vidrio" | "Otros";
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
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) return console.error(error);
    setAvailable(data.filter(p => p.status));
    setUnavailable(data.filter(p => !p.status));
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
    if (error) toast.error("Error cambiando estado: " + error.message);
    else {
      toast.success("Estado actualizado correctamente");
      setReload(prev => !prev);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!user) return;
    const confirmDelete = confirm("¿Seguro que quieres eliminar este producto?");
    if (!confirmDelete) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Error eliminando producto: " + error.message);
    else {
      toast.success("Producto eliminado correctamente");
      setReload(prev => !prev);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 px-4">
        <p className="text-2xl font-bold mb-6 text-amber-700 text-center">
          Debes iniciar sesión para acceder a tu perfil
        </p>
        <button
          type="button"
          className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-2xl font-semibold shadow-md transition"
          onClick={() => router.push("/login")}
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  const ProductImage = ({ images }: { images: string[] | null }) => {
    const [index, setIndex] = useState(0);
    const imgs = images ?? [];
    if (imgs.length === 0) {
      return (
        <div className="w-full h-48 flex items-center justify-center bg-stone-200 text-stone-500 rounded-2xl">
          Sin imagen
        </div>
      );
    }
    if (imgs.length === 1) {
      return (
        <Image
          src={imgs[0]}
          alt="Producto"
          width={400}
          height={250}
          className="w-full h-48 object-cover rounded-2xl"
        />
      );
    }
    const prev = () => setIndex(i => (i === 0 ? imgs.length - 1 : i - 1));
    const next = () => setIndex(i => (i === imgs.length - 1 ? 0 : i + 1));
    return (
      <div className="relative w-full h-48 rounded-2xl overflow-hidden">
        <Image
          src={imgs[index]}
          alt={`Imagen ${index + 1}`}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
        />
        <button
          type="button"
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          ▶
        </button>
      </div>
    );
  };

  return (
    <main className="bg-stone-100 min-h-screen py-16 px-4 sm:px-6 md:px-12 font-sans">
      {/* Botón Inicio */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-semibold shadow-md transition text-sm sm:text-base"
        >
          <FaHome /> Inicio
        </button>
      </div>

      {/* Header Usuario */}
      <section className="bg-white rounded-3xl shadow-xl border border-stone-200 p-6 sm:p-8 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full md:w-auto">
          <div className="p-3 rounded-full bg-amber-100 flex-shrink-0">
            <FaUser className="text-amber-700 text-3xl" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-lg sm:text-xl font-bold text-stone-800 break-words">{user.email}</p>
            <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 justify-center sm:justify-start">
              <span className="text-sm font-medium text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Disponibles: {available.length}
              </span>
              <span className="text-sm font-medium text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                No disponibles: {unavailable.length}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-end w-full md:w-auto">
          <button
            type="button"
            className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl shadow-md font-medium transition-transform transform hover:scale-105 text-sm sm:text-base"
            onClick={() => router.push("/dashboard")}
          >
          Ventas
          </button>
          <button
            type="button"
            className="flex items-center gap-1 sm:gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl shadow-md font-medium transition-transform transform hover:scale-105 text-sm sm:text-base"
            onClick={() => router.push("/upload")}
          >
            <FaPlus /> Añadir Producto
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 sm:gap-2 bg-stone-700 hover:bg-stone-800 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl shadow-md font-medium transition-transform transform hover:scale-105 text-sm sm:text-base"
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </section>

      {/* Productos Disponibles */}
      <section className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-700 mb-6 text-center md:text-left">
          Productos Disponibles
        </h2>
        {available.length === 0 ? (
          <p className="text-stone-600 text-center">Aún no tienes productos disponibles.</p>
        ) : (
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {available.map(product => (
              <motion.div
                key={product.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-stone-300 flex flex-col"
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
              >
                <ProductImage images={product.image_urls} />
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-stone-800">{product.title}</h3>
                    <p className="mt-2 text-stone-600 text-sm sm:text-base">{product.description}</p>
                    <p className="mt-2 font-bold text-amber-700 text-base sm:text-lg">${product.price}</p>
                    <p className="mt-1 text-stone-500 font-medium text-sm">{product.category}</p>
                  </div>
                  <div className="mt-4 flex gap-2 sm:gap-3 flex-wrap">
                    <button
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold transition text-xs sm:text-sm"
                      onClick={() => toggleStatus(product.id, product.status)}
                    >
                      Marcar no disponible
                    </button>
                    <button
                      className="bg-amber-700 hover:bg-amber-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold transition flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      onClick={() => router.push(`/modified/${product.id}`)}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      className="bg-stone-700 hover:bg-stone-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold transition flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
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

      {/* Productos No Disponibles */}
      <section className="mb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-600 mb-4 text-center md:text-left">
          Productos No Disponibles
        </h2>
        {unavailable.length === 0 ? (
          <p className="text-stone-500 text-center">Todos tus productos están activos.</p>
        ) : (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {unavailable.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col justify-between border border-stone-300 shadow-md"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {product.image_urls && product.image_urls[0] ? (
                    <Image
                      src={product.image_urls[0]}
                      alt={product.title}
                      width={80}
                      height={80}
                      className="rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-400 flex items-center justify-center text-white rounded-xl text-xs sm:text-sm">
                      Sin Imagen
                    </div>
                  )}
                  <div className="flex-1 text-sm sm:text-base">
                    <h4 className="font-semibold text-stone-800 break-words">{product.title}</h4>
                    <p className="text-stone-600">${product.price}</p>
                    <p className="text-stone-500 text-xs sm:text-sm">{product.category}</p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex gap-2 flex-wrap">
                  <button
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition"
                    onClick={() => toggleStatus(product.id, product.status)}
                  >
                    Marcar disponible
                  </button>
                  <button
                    className="bg-stone-700 hover:bg-stone-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
