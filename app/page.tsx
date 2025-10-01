"use client";

import Image from "next/image";
import { FaMapMarkerAlt, FaFacebook, FaPhone } from "react-icons/fa";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { motion } from "framer-motion";

type Producto = {
  id: number;
  title: string;
  description: string;
  price: string;
  image_url: string;
  status: boolean;
  material: "Madera" | "Fierro" | "Mixto"; // agregamos material para filtros
};

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filter, setFilter] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", true);

      if (error) {
        console.error("Error cargando productos:", error.message);
      } else {
        setProductos(data as Producto[]);
      }
    };

    fetchProductos();
  }, []);

  // Filtrar productos según categoría y búsqueda
  const filteredProducts = productos.filter((p) => {
    const matchesCategory = filter === "Todos" || p.material === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="bg-stone-100 text-stone-900">
      {/* Hero Section */}
      <section
        className="relative h-[80vh] md:h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/fondo2.png')" }}
      >
        <div className="absolute inset-0 bg-stone-900/70"></div>
        <div className="relative z-10 text-center text-stone-100 px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-amber-700">
            Artesanía Sergio Silva
          </h1>
          <p className="mt-4 text-lg md:text-2xl lg:text-3xl max-w-3xl mx-auto text-stone-100">
            Creaciones únicas en fierro, madera y más
          </p>
        </div>
      </section>

      {/* Sobre la artesanía */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center md:text-left md:flex md:items-center md:gap-10">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-amber-700">
              Artesanía en Fierro y Madera
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-stone-700">
              Trabajo con{" "}
              <span className="font-semibold text-amber-800">
                fierros, madera de roble
              </span>{" "}
              y distintos materiales nobles, dando vida a piezas artesanales que
              combinan tradición, resistencia y belleza. Cada obra está hecha a
              mano, con dedicación y detalle, pensada para perdurar en el tiempo.
            </p>
          </div>
          <div className="flex-1 mt-10 md:mt-0">
            <Image
              src="/aboutme.png"
              alt="Artesanía de madera y fierro"
              width={500}
              height={400}
              className="rounded-xl shadow-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="py-16 bg-stone-200 px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-amber-700">
          Venta de Nuestra Colección Artesanal
        </h2>
        <p className="text-center text-lg md:text-xl text-amber-600 mb-6 max-w-3xl mx-auto">
          Más que objetos: piezas que reflejan tradición, oficio y carácter propio.
        </p>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-6 max-w-6xl mx-auto">
          {/* Búsqueda */}
          <input
            type="text"
            placeholder="Buscar producto..."
            className="px-4 py-2 rounded-full border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full md:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Filtros */}
          <div className="flex gap-2">
            {["Todos", "Madera", "Fierro", "Mixto"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  filter === cat
                    ? "bg-amber-700 text-white"
                    : "bg-white text-amber-700 border border-amber-700 hover:bg-amber-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de productos con animación */}
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {filteredProducts.map((p) => {
            const whatsappNumber = "56939123751";
            const message = encodeURIComponent(
              `Hola! Quisiera consultar sobre el producto: ${p.title}`
            );
            const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

            return (
              <motion.a
                key={p.id}
                href={whatsappLink}
                target="_blank"
                className="relative block bg-white rounded-2xl shadow-md overflow-hidden border border-stone-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.06,
                  y: -5,
                  boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
                }}
              >
                {/* Badge de disponibilidad */}
                <div
                  className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold text-white ${
                    p.status ? "bg-amber-700" : "bg-gray-500"
                  }`}
                >
                  {p.status ? "Disponible" : "No disponible"}
                </div>

                {/* Imagen del producto */}
                <Image
                  src={p.image_url}
                  alt={p.title}
                  width={400}
                  height={250}
                  className="w-full h-56 object-cover"
                />

                {/* Overlay de info al hover */}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white p-4 text-center rounded-2xl">
                  <p>{p.description}</p>
                  <p className="mt-2 font-bold">{p.material}</p>
                </div>

                {/* Contenido de la card */}
                <div className="p-6 flex flex-col justify-between h-[200px]">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-stone-900">
                      {p.title}
                    </h3>
                    <p className="mt-2 font-bold text-amber-800 text-lg">
                      $:{p.price}
                    </p>
                  </div>
                  <p className="mt-1 inline-flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-full font-semibold text-center transition">
                    Consultar en WhatsApp
                  </p>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </section>

      {/* Testimonios */}
      <section className="py-16 px-6 md:px-12 bg-stone-100">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-amber-700">
          Lo que dicen nuestros clientes
        </h2>
        <p className="text-center text-lg md:text-xl text-stone-700 mb-10 max-w-3xl mx-auto">
          Opiniones reales de quienes confían en nuestras creaciones artesanales.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              name: "María López",
              comment:
                "La mesa de roble es increíble, superó mis expectativas. ¡Se nota el trabajo artesanal!",
              img: "/client1.jpg",
            },
            {
              name: "José Martínez",
              comment:
                "Compré un jarrón y es perfecto, elegante y resistente. Totalmente recomendable.",
              img: "/client2.jpg",
            },
            {
              name: "Camila Rojas",
              comment:
                "El banco de jardín quedó precioso en mi terraza. Calidad y diseño excelentes.",
              img: "/client3.jpg",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition hover:shadow-xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                scale: 1.03,
                y: -3,
                boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
              }}
            >
              <img
                src={t.img}
                alt={t.name}
                className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-amber-700"
              />
              <p className="text-stone-700 mb-4">"{t.comment}"</p>
              <p className="font-semibold text-amber-700">{t.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section className="py-16 px-6 md:px-12 bg-stone-800 text-stone-100 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-amber-400">
          Contacto
        </h2>
        <div className="flex flex-col items-center gap-4 md:gap-6">
          <p className="flex items-center gap-2 text-lg md:text-xl">
            <FaPhone />
            <a
              href="tel:+56912345678"
              className="text-amber-700 font-semibold hover:underline"
            >
              +56 9 1234 5678
            </a>
          </p>

          <a
            href="https://facebook.com"
            target="_blank"
            className="flex items-center gap-2 text-lg md:text-xl hover:text-amber-400"
          >
            <FaFacebook /> Sergio Silva Artesanía
          </a>
          <a
            href="https://www.google.com/maps?q=-33.4489,-70.6693"
            target="_blank"
            className="mt-4 flex items-center gap-2 bg-amber-700 hover:bg-amber-800 px-6 py-3 rounded-full text-lg md:text-xl font-semibold transition"
          >
            <FaMapMarkerAlt /> Ver Ubicación
          </a>
        </div>
      </section>
    </main>
  );
}
