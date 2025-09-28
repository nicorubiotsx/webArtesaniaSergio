"use client";

import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/authContext";


export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const { user } = useAuth();


const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!file || !title || !description || !price) {
    alert("Completa todos los campos");
    return;
  }
  if (!user) {
  alert("Debes iniciar sesión para añadir un producto.");
  return;
}

  // Subir imagen a Supabase Storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from("APPS")
    .upload(`public/${Date.now()}-${file.name}`, file);

  if (storageError) {
    alert("Error al subir imagen: " + storageError.message);
    return;
  }

  // Obtener la URL pública de la imagen
  const uel = supabase.storage.from("APPS").getPublicUrl(file.name.).data.publicUrl
console.log(uel)
const disponible="disponible"
  // Guardar producto en la DB
  const { data, error } = await supabase
    .from("products")
    .insert([{ title, description, price, image_url: uel,user_id:user.id,status:disponible }]);

  if (error) {
    alert("Error guardando producto: " + error.message);
  } else {
    alert("Producto guardado con éxito!");
    setFile(null);
    setTitle("");
    setDescription("");
    setPrice("");
  }
};



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 p-6">
      <h1 className="text-4xl font-bold text-amber-700 mb-8">Agregar Nuevo Producto</h1>
      <form
      onSubmit={handleUpload}
      
     
        className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md flex flex-col gap-6"
      >
        {/* Imagen */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-stone-700">Imagen del producto</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
            }}
            className="border border-stone-300 rounded-lg p-2"
          />
          {file && <p className="mt-2 text-stone-600">Archivo seleccionado: {file.name}</p>}
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
          <label className="mb-2 font-semibold text-stone-700">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-stone-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            placeholder="Ej: Mesa rústica trabajada en madera de roble y fierro forjado."
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
        <button 
          type="submit"
          className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-full font-semibold transition"
        >
          Subir Producto
        </button>
      </form>
    </div>
  );
}
