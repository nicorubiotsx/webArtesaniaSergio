"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { 
  FaWhatsapp, FaLeaf, FaGem, FaHammer, FaTree, FaRegGem, FaCubes, FaCheckCircle, FaHome 
} from "react-icons/fa";

type Producto = {
  id: number;
  title: string;
  description: string;
  price: string;
  image_urls: string[] | null;
  status: boolean;
  category: "Madera" | "Fierro" | "Mixto" | "Cerámica" | "Vidrio" | "Otros";
};

// Formatear precio
const formatPrice = (price: string) => Number(price).toLocaleString("es-CL");

// Iconos por categoría
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Madera": return <FaTree className="text-amber-700 w-6 h-6" />;
    case "Fierro": return <FaHammer className="text-gray-700 w-6 h-6" />;
    case "Mixto": return <FaCubes className="text-amber-700 w-6 h-6" />;
    case "Cerámica": return <FaRegGem className="text-rose-600 w-6 h-6" />;
    case "Vidrio": return <FaGem className="text-sky-400 w-6 h-6" />;
    default: return <FaLeaf className="text-green-600 w-6 h-6" />;
  }
};

// Componente de imagen con miniaturas tipo Mercado Libre
const ProductImage = ({ images }: { images: string[] | null }) => {
  const imgs = images?.filter(Boolean) ?? [];
  const [mainIndex, setMainIndex] = useState(0);

  if (imgs.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-stone-200 text-stone-500 rounded-2xl">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Imagen principal */}
      <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
        <Image
          src={imgs[mainIndex] || "/placeholder.png"}
          alt={`Imagen ${mainIndex + 1}`}
          width={800}
          height={500}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Miniaturas */}
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto mt-2">
          {imgs.map((img, idx) => (
            <div
              key={idx}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition ${
                idx === mainIndex ? "border-amber-700" : "border-stone-300"
              }`}
              onMouseEnter={() => setMainIndex(idx)}
              onClick={() => setMainIndex(idx)}
            >
              <Image
                src={img || "/placeholder.png"}
                alt={`Miniatura ${idx + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProducto = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.error("Error cargando producto:", error.message);
      else setProducto(data as Producto);
    };

    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };

    fetchProducto();
    fetchUser();
  }, [id]);

  if (!producto) return <div className="text-center mt-20">Cargando producto...</div>;

  const whatsappNumber = "56934640426";
  const message = encodeURIComponent(`Hola! Quisiera consultar sobre este producto: ${producto.title}`);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}%0A${url}`;

  const markAsSold = async () => {
    if (!producto) return;
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from("sales").insert([
        { product_id: producto.id, title: producto.title, price: producto.price, sold_at: new Date().toISOString() }
      ]);
      if (insertError) throw insertError;

      const { error: updateError } = await supabase
        .from("products")
        .update({ status: false })
        .eq("id", producto.id);
      if (updateError) throw updateError;

      setProducto({ ...producto, status: false });
      alert("Producto marcado como vendido ✅");
    } catch (err) {
      console.error(err);
      alert("Error al marcar producto como vendido");
    }

    setLoading(false);
  };

  return (
    <main className="max-w-4xl mx-auto py-16 px-6">
      {/* Botón Inicio */}
      <button
        onClick={() => router.push("/")}
        className="mb-6 flex items-center gap-2 bg-stone-300 hover:bg-stone-400 text-stone-800 px-5 py-2.5 rounded-full shadow-md font-medium transition-transform transform hover:scale-105"
      >
        <FaHome /> Inicio
      </button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-300 hover:shadow-2xl transition-all duration-300">
        <ProductImage images={producto.image_urls} />

        <div className="p-6 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            {getCategoryIcon(producto.category)} {producto.title}
          </h1>
          <p className="text-2xl font-extrabold text-amber-700">${formatPrice(producto.price)}</p>
          <p className="text-gray-600">{producto.description}</p>

          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-stone-800 font-semibold text-sm">
            {getCategoryIcon(producto.category)} <span>{producto.category}</span>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FaWhatsapp className="text-2xl" /> Consultar WhatsApp
          </a>

          {user && producto.status && (
            <button
              onClick={markAsSold}
              disabled={loading}
              className="mt-4 flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaCheckCircle /> {loading ? "Procesando..." : "Marcar como Vendido"}
            </button>
          )}

          {!producto.status && (
            <div className="mt-4 flex items-center gap-2 text-white font-bold text-lg">
              <FaCheckCircle className="text-green-500" /> Producto no disponible
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
