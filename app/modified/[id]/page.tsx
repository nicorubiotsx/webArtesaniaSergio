"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useSearchParams, useRouter } from "next/navigation";

type Product = {
  id: number;
  title: string;
  description: string;
  price: string;
  image_url: string;
  status: string;
};

export default function EditProduct() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get("id");
  const productId = idParam ? Number(idParam) : null;

  const [product, setProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Traer el producto desde la DB
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", 5)
        .single();

      if (error) {
        alert("Error al cargar producto: " + error.message);
        return;
      }

      setProduct(data);
      setTitle(data.title);
      setDescription(data.description);
      setPrice(data.price);
    };

    fetchProduct();
  }, [productId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    const { error } = await supabase
      .from("products")
      .update({ title, description, price })
      .eq("id", productId);

    if (error) {
      alert("Error actualizando producto: " + error.message);
    } else {
      alert("Producto actualizado con éxito!");
      router.push("/perfil"); // volver al perfil
    }
  };

  if (!product) return <p className="text-center mt-10">Cargando producto...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 p-6">
      <h1 className="text-4xl font-bold text-amber-700 mb-8">Editar Producto</h1>
      <form
        onSubmit={handleUpdate}
        className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md flex flex-col gap-6"
      >
        {/* Título */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-stone-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-stone-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            rows={3}
          ></textarea>
        </div>

        {/* Precio */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Precio</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-stone-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
