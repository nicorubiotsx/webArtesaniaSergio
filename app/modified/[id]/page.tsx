"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { supabase } from "../../lib/supabaseClient";

type Product = {
  id: string;
  title: string;
  description: string;
  price: string;
  status: boolean;
  image_urls: string;
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al obtener producto:", error.message);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!product) return;
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product) return;
    setProduct({ ...product, status: e.target.checked });
  };

  const handleSave = async () => {
    if (!product) return;
    setSaving(true);

    const { error } = await supabase
      .from("products")
      .update({
        title: product.title,
        description: product.description,
        price: product.price,
        status: product.status,
      })
      .eq("id", product.id);

    if (error) {
      console.error("Error al guardar cambios:", error.message);
      alert("Error al guardar cambios: " + error.message);
    } else {
      alert("Producto actualizado con éxito ✅");
      router.back();
    }

    setSaving(false);
  };

  if (loading) return <p className="text-center mt-10">Cargando producto...</p>;
  if (!product) return <p className="text-center mt-10">Producto no encontrado.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 px-4 py-10">
      <h1 className="text-4xl font-bold text-amber-700 mb-8 text-center">
        Editar Producto
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="bg-white rounded-2xl shadow-md p-6 sm:p-8 w-full max-w-md flex flex-col gap-6"
      >
        {/* Imagen (vista previa) */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Imagen actual</label>
          <img
            src={product.image_urls[0]}
            alt={product.title}
            className="w-full h-48 object-cover rounded"
          />
        </div>

        {/* Título */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Título</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            className="border border-stone-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Descripción</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="border border-stone-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            rows={3}
          ></textarea>
        </div>

        {/* Precio */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Precio</label>
          <input
            type="text"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="border border-stone-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Disponible */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={product.status}
            onChange={handleCheckboxChange}
          />
          <label className="text-stone-700 font-medium">Disponible</label>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-stone-300 hover:bg-stone-400 text-stone-800 px-6 py-2 rounded-full font-semibold transition"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-full font-semibold transition disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
