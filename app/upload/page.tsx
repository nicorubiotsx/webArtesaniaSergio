"use client";

import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
export default function UploadProduct() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const router = useRouter()

  const handleUpload = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!user) return alert("Debes iniciar sesión para subir productos");
    if (!file) return alert("Debes seleccionar un archivo");

    try {
      const fileName = `${Date.now()}-${file.name}`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from("APPS")
        .upload(`private/${user.id}/${fileName}`, file);

      if (storageError) {
        alert("Error al subir imagen: " + storageError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("APPS")
        .getPublicUrl(`private/${user.id}/${fileName}`);

      const imageUrl = publicUrlData.publicUrl;

      const { data, error } = await supabase.from("products").insert([
        {
          title,
          description,
          price,
          image_url: imageUrl,
          user_id: user.id,
          status: true,
        },
      ]);

      if (error) {
        alert("Error guardando producto: " + error.message);
      } else {
        alert("Producto guardado con éxito!");
        setFile(null);
        setTitle("");
        setDescription("");
        setPrice("");
      }
    } catch (err: any) {
      console.error(err);
      alert("Ocurrió un error inesperado: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 px-4 py-10">
      <h1 className="text-4xl font-bold text-amber-700 mb-8 text-center">
        Agregar Nuevo Producto
      </h1>

      <form
        onSubmit={handleUpload}
        className="bg-white rounded-2xl shadow-md p-6 sm:p-8 w-full max-w-md flex flex-col gap-6"
      >
        {/* Imagen */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">
            Imagen del producto
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0)
                setFile(e.target.files[0]);
            }}
            className="border border-stone-300 rounded-lg p-2"
          />
          {file && (
            <p className="mt-2 text-stone-600">
              Archivo seleccionado: {file.name}
            </p>
          )}
        </div>

        {/* Título */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-stone-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Ej: Mesa de Roble"
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-stone-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            placeholder="Ej: Mesa rústica trabajada en madera de roble."
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
            placeholder="Ej: $150.000"
          />
        </div>

        {/* Botón */}
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
          className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-full font-semibold transition"
        >
          Subir Producto
        </button>

        </div>

      </form>
    </div>
  );
}
