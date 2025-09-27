"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !description || !price) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
   
   
    // Aquí se puede hacer fetch a una API route para almacenar los productos
    // Ejemplo: await fetch('/api/upload', { method: 'POST', body: formData });

    alert("Producto listo para subir (implementa la lógica real).");
    // Reset del formulario
    setFile(null);
    setTitle("");
    setDescription("");
    setPrice("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 p-6">
      <h1 className="text-4xl font-bold text-amber-700 mb-8">Agregar Nuevo Producto</h1>
      <form
        onSubmit={handleSubmit}
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
