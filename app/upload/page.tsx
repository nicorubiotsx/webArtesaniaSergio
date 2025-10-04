"use client";

import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function UploadProduct() {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<
    "Madera" | "Metal" | "Mixto" | "Cerámica" | "Vidrio" | "Otros"
  >("Madera");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const removeBgAndUpload = async (
    file: File,
    userId: string
  ): Promise<string | null> => {
    try {
      const reader = new FileReader();
      const base64: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch("/api/removebg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      if (!response.ok) throw new Error(await response.text());

      const blob = await response.blob();
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

      const { error: storageError } = await supabase.storage
        .from("APPS")
        .upload(`private/${userId}/${fileName}`, blob, { contentType: "image/png" });

      if (storageError) throw storageError;

      const { data: publicUrlData } = supabase.storage
        .from("APPS")
        .getPublicUrl(`private/${userId}/${fileName}`);

      return publicUrlData.publicUrl;
    } catch (err: any) {
      console.error(err);
      toast.error("Error procesando imagen: " + err.message);
      return null;
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Debes iniciar sesión");
    if (files.length === 0) return toast.error("Selecciona al menos una imagen");

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

      if (error) toast.error("Error guardando producto: " + error.message);
      else {
        toast.success("Producto guardado!");
        // Resetear campos
        setFiles([]);
        setTitle("");
        setDescription("");
        setPrice("");
        setCategory("Madera");
      }
    } catch (err: any) {
      toast.error("Error inesperado: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 px-4">
        <p className="text-2xl font-bold mb-6 text-amber-800 text-center">
          Debes iniciar sesión
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-amber-700 text-white px-6 py-3 rounded-2xl shadow-md hover:bg-amber-800 transition"
        >
          Iniciar Sesión
        </button>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-stone-100 px-4 py-10">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-bold text-amber-700 mb-8 text-center">
        Agregar Nuevo Producto
      </h1>

      <motion.form
        onSubmit={handleUpload}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-3xl flex flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Imágenes */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-stone-700">Imágenes</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))}
            className="border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:border-amber-400 transition"
          />
          {files.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {files.map((f, i) => (
                <motion.div
                  key={i}
                  className="bg-stone-200 text-stone-700 px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-sm"
                  whileHover={{ scale: 1.05, backgroundColor: "#fbbf24" }}
                >
                  {f.name}
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((_, index) => index !== i))}
                    className="text-red-500 font-bold hover:text-red-700 transition"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Título */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-stone-700">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:border-amber-400 transition"
            placeholder="Nombre del producto"
            required
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-stone-700">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none hover:border-amber-400 transition"
            rows={4}
            placeholder="Descripción del producto"
            required
          />
        </div>

        {/* Categoría */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-stone-700">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:border-amber-400 transition"
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
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-stone-700">Precio</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:border-amber-400 transition"
            placeholder="Precio en CLP"
            required
          />
        </div>

        {/* Botones */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <motion.button
            type="submit"
            disabled={loading}
            className="flex-1 bg-amber-700 hover:bg-amber-800 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Procesando..." : "Subir Producto"}
          </motion.button>

          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="flex-1 bg-stone-700 hover:bg-stone-800 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition"
          >
            Volver a Perfil
          </button>
        </div>
      </motion.form>
    </div>
  );
}
