"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // asegúrate de tener tu cliente de supabase configurado
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  title: string;
  desc: string;
  price: string;
  available: boolean;
  image_url: string;
};

export default function EditProduct({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Error fetching product:", error.message);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!product) return;
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product) return;
    setProduct({ ...product, available: e.target.checked });
  };

  const handleSave = async () => {
    if (!product) return;
    setSaving(true);

    const { error } = await supabase
      .from("products")
      .update({
        title: product.title,
        desc: product.desc,
        price: product.price,
        available: product.available,
      })
      .eq("id", product.id);

    if (error) {
      console.error("Error updating product:", error.message);
    } else {
      alert("Producto actualizado con éxito ✅");
      router.back(); // vuelve a la página anterior
    }

    setSaving(false);
  };

  if (loading) return <p className="text-center mt-10">Cargando producto...</p>;
  if (!product) return <p className="text-center mt-10">Producto no encontrado.</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-amber-700">Editar Producto</h2>

      {/* Imagen (solo mostrar, no editar) */}
      <img
        src={product.image_url}
        alt={product.title}
        className="w-full h-48 object-cover rounded mb-6"
      />

      {/* Título */}
      <label className="block mb-2 font-semibold">Título</label>
      <input
        type="text"
        name="title"
        value={product.title}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 mb-4"
      />

      {/* Descripción */}
      <label className="block mb-2 font-semibold">Descripción</label>
      <textarea
        name="desc"
        value={product.desc}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 mb-4"
      />

      {/* Precio */}
      <label className="block mb-2 font-semibold">Precio</label>
      <input
        type="text"
        name="price"
        value={product.price}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 mb-4"
      />

      {/* Disponible */}
      <label className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          checked={product.available}
          onChange={handleCheckboxChange}
        />
        Disponible
      </label>

      {/* Botones */}
      <div className="flex justify-between">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded bg-stone-300 hover:bg-stone-400 text-stone-800"
        >
          Volver
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded bg-amber-700 hover:bg-amber-800 text-white disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
}
