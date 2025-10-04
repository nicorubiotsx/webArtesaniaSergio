"use client";

import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";

export default function UploadProduct() {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"Madera" | "Metal" | "Mixto" | "Cerámica" | "Vidrio" | "Otros">("Madera");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const removeBgAndUpload = async (file: File, userId: string): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("image_file", file);
      formData.append("bg_color", "ffffff");
      formData.append("size", "auto");

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.NEXT_PUBLIC_REMOVEBG_API_KEY || "",
        },
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error("RemoveBG error: " + errText);
      }

      const blob = await response.blob();
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const { error: storageError } = await supabase.storage
        .from("APPS")
        .upload(`private/${userId}/${fileName}`, blob, {
          contentType: "image/png",
        });

      if (storageError) throw storageError;

      const { data: publicUrlData } = supabase.storage
        .from("APPS")
        .getPublicUrl(`private/${userId}/${fileName}`);

      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error(error);
      alert("Error procesando imagen: " + error.message);
      return null;
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión para subir productos");
    if (files.length === 0) return alert("Debes seleccionar al menos una imagen");

    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const url = await removeBgAndUpload(file, user.id);
        if (url) uploadedUrls.push(url);
      }

      const { error } = await supabase.from("products").insert([
        {
          title,
          description,
          price,
          category,
          image_urls: uploadedUrls,
          user_id: user.id,
          status: true,
        },
      ]);

      if (error) {
        alert("Error guardando producto: " + error.message);
      } else {
        alert("Producto guardado con éxito!");
        setFiles([]);
        setTitle("");
        setDescription("");
        setPrice("");
        setCategory("Madera");
      }
    } catch (err: any) {
      console.error(err);
      alert("Ocurrió un error inesperado: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 px-4">
        <p className="text-2xl font-bold mb-6 text-amber-800 text-center">
          Debes iniciar sesión para ver tu perfil.
        </p>
        <button
          type="button"
          className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          onClick={() => router.push("/login")}
        >
          <FaEdit /> Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 px-4 py-10">
      <h1 className="text-4xl font-bold text-amber-700 mb-8 text-center">Agregar Nuevo Producto</h1>

      <form
        onSubmit={handleUpload}
        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 sm:p-8 w-full max-w-md flex flex-col gap-6"
      >
        {/* Imágenes */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Imágenes del producto</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))}
            className="border border-stone-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {files.length > 0 && (
            <ul className="mt-2 text-stone-600 list-disc list-inside">
              {files.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Título */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Mesa de Roble"
            className="border border-stone-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Mesa rústica trabajada en madera de roble."
            rows={3}
            className="border border-stone-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
        </div>

        {/* Categoría */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Categoría</label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value as "Madera" | "Metal" | "Mixto" | "Cerámica" | "Vidrio" | "Otros"
              )
            }
            className="border border-stone-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="Madera">Madera</option>
            <option value="Metal">Metal</option>
            <option value="Mixto">Mixto</option>
            <option value="Cerámica">Cerámica</option>
            <option value="Vidrio">Vidrio</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        {/* Precio */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Precio</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ej: $150.000"
            className="border border-stone-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-stone-300 hover:bg-stone-400 text-stone-800 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Procesando..." : "Subir Producto"}
          </button>
        </div>
      </form>
    </div>
  );
}
