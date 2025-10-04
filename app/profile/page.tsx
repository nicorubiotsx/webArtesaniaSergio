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
  category: "Madera" | "Metal" | "Madera+Metal" | "ceramica" | "vidrio" | "Otros";
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
      toast.error("Error cambiando estado: " + error.message);
    } else {
      toast.success("Estado actualizado correctamente");
      setReload((prev) => !prev);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!user) return;
    const confirmDelete = confirm("¿Estás seguro que quieres eliminar este producto?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast.error("Error eliminando producto: " + error.message);
    } else {
      toast.success("Producto eliminado correctamente");
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
          <FaEdit /> Iniciar sesión
        </button>
      </div>
    );
  }

  const ProductImage = ({ images }: { images: string[] | null }) => {
    const [index, setIndex] = useState(0);
    const imgs = images ?? [];

    if (imgs.length === 0) {
      return (
        <div className="w-full h-48 flex items-center justify-center bg-stone-200 text-stone-500">
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

    const prev = () => setIndex((i) => (i === 0 ? imgs.length - 1 : i - 1));
    const next = () => setIndex((i) => (i === imgs.length - 1 ? 0 : i + 1));

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
    <main className="bg-stone-100 min-h-screen py-16 px-6 md:px-12">
      {/* Header de usuario y acciones */}
      <section className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8 mb-10 flex flex-col md:flex-row justify-between items-center gap-6 transition">
        {/* Botón Inicio */}
        <button
          type="button"
          className="flex items-center gap-2 bg-stone-300 hover:bg-stone-400 text-stone-800 px-5 py-2.5 rounded-full shadow-md font-medium transition-transform transform hover:scale-105"
          onClick={() => router.push("/")}
        >
          <FaHome /> Inicio
        </button>

        {/* Info de usuario */}
        <div className="flex items-center gap-5 md:order-2">
          <div className="p-3 rounded-full bg-amber-100">
            <FaUser className="text-amber-700 text-3xl" />
          </div>
          <div>
            <p className="text-xl font-bold text-stone-800">{user.email}</p>
            <div className="flex flex-wrap gap-4 mt-2">
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
        <div className="flex gap-4 md:order-3">
          <button
            type="button"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full shadow-md font-medium transition-transform transform hover:scale-105"
            onClick={() => router.push("/upload")}
          >
            <FaPlus /> Añadir Producto
          </button>

          <button
            type="button"
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-full shadow-md font-medium transition-transform transform hover:scale-105"
            onClick={() => router.push("/dashboard")}
          >
            🗓 Dashboard
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 bg-stone-700 hover:bg-stone-800 text-white px-5 py-2.5 rounded-full shadow-md font-medium transition-transform transform hover:scale-105"
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </section>

      {/* Productos Disponibles */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-amber-800 mb-10 text-center md:text-left">
          Productos Disponibles
        </h2>

        {available.length === 0 ? (
          <p className="text-stone-600 text-center">No hay productos disponibles.</p>
        ) : (
          <motion.div
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
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
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200 flex flex-col hover:shadow-xl transition-shadow duration-300"
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
              >
                <ProductImage images={product.image_urls} />

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-stone-800">{product.title}</h3>
                    <p className="mt-2 text-stone-600 line-clamp-3">{product.description}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-amber-700 font-bold text-lg">${product.price}</span>
                      <span className="text-xs font-medium bg-stone-100 text-stone-600 px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-medium transition-transform transform hover:scale-105"
                      onClick={() => toggleStatus(product.id, product.status)}
                    >
                      Marcar no disponible
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full font-medium transition-transform transform hover:scale-105"
                      onClick={() => router.push(`/modified/${product.id}`)}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 flex-1 bg-stone-700 hover:bg-stone-800 text-white px-4 py-2 rounded-full font-medium transition-transform transform hover:scale-105"
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
        <h2 className="text-2xl font-bold text-stone-600 mb-4 text-center md:text-left">
          Productos No Disponibles
        </h2>
        {unavailable.length === 0 ? (
          <p className="text-stone-500 text-center">No hay productos no disponibles.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unavailable.map((product) => (
              <div
                key={product.id}
                className="bg-stone-200 rounded-xl p-4 flex flex-col justify-between border border-stone-300"
              >
                <div className="flex items-center gap-3">
                  {product.image_urls && product.image_urls[0] ? (
                    <Image
                      src={product.image_urls[0]}
                      alt={product.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-stone-400 flex items-center justify-center text-white rounded-lg">
                      Sin Imagen
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-stone-700">{product.title}</h4>
                    <p className="text-stone-500 text-sm">${product.price}</p>
                    <p className="text-stone-500 text-xs">{product.category}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 rounded-full text-sm font-semibold"
                    onClick={() => toggleStatus(product.id, product.status)}
                  >
                    Marcar disponible
                  </button>
                  <button
                    className="bg-stone-700 hover:bg-stone-800 text-white px-3 py-1 rounded-full text-sm font-semibold"
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
