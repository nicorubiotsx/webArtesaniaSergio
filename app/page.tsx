"use client";

import Image from "next/image";
import { FaMapMarkerAlt, FaFacebook, FaPhone, FaUser, FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaTree, FaHammer, FaCubes, FaRegGem, FaGem, FaQuestionCircle } from "react-icons/fa";

const careInfo = [
  {
    material: "Madera",
    icon: <FaTree className="w-6 h-6 text-amber-700" />,
    description:
      "Evita la exposición directa al sol y la humedad. Limpia con paño seco o ligeramente humedecido. Aplica cera o aceite protector según necesidad.",
  },
  {
    material: "Metal",
    icon: <FaHammer className="w-6 h-6 text-gray-700" />,
    description:
      "Limpia con paño húmedo y, si es necesario, aplica aceite o cera para evitar oxidación. Evita dejarlo en contacto con agua por períodos prolongados.",
  },
  {
    material: "Mixto",
    icon: <FaCubes className="w-6 h-6 text-amber-700" />,
    description:
      "Combina los cuidados de los materiales que lo componen (ej. madera + metal: evita humedad, limpia cada superficie según corresponda).",
  },
  {
    material: "Cerámica",
    icon: <FaRegGem className="w-6 h-6 text-rose-600" />,
    description:
      "Evita golpes fuertes o caídas. Limpia con paño suave y productos no abrasivos para mantener el acabado.",
  },
  {
    material: "Vidrio",
    icon: <FaGem className="w-6 h-6 text-sky-400" />,
    description:
      "Evita golpes y cambios bruscos de temperatura. Limpia con paño suave y limpiadores específicos para vidrio.",
  },
  {
    material: "Otros",
    icon: <FaQuestionCircle className="w-6 h-6 text-green-600" />,
    description:
      "Sigue siempre las recomendaciones del fabricante o del tipo de material específico para su cuidado y mantenimiento.",
  },
];

type Producto = {
  id: number;
  title: string;
  description: string;
  price: string;
  image_urls: string[] | null;
  status: boolean;
  category: "Madera" | "Metal" | "Madera+Metal" | "Cerámica" | "Vidrio" | "Otros";
};

const formatPrice = (price: string | number) => {
  const number = typeof price === "string" ? parseInt(price, 10) : price;
  if (isNaN(number)) return price.toString();
  return new Intl.NumberFormat("es-CL").format(number);
};

const ProductImage = ({ images, showArrows = true }: { images: string[] | null; showArrows?: boolean }) => {
  const [index, setIndex] = useState(0);
  const imgs = images ?? [];

  if (imgs.length === 0) {
    return <div className="w-full h-56 flex items-center justify-center bg-stone-200 text-stone-500 rounded-2xl">Sin imagen</div>;
  }

  if (!showArrows || imgs.length === 1) {
    return <Image src={imgs[0]} alt="Producto" width={400} height={250} className="w-full h-56 object-cover rounded-2xl" loading="lazy" />;
  }

  const prev = () => setIndex((i) => (i === 0 ? imgs.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === imgs.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-full h-56 rounded-2xl overflow-hidden">
      <Image
        src={imgs[index]}
        alt={`Imagen ${index + 1}`}
        width={400}
        height={250}
        className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
      <button type="button" onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition">
        ‹
      </button>
      <button type="button" onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition">
        ›
      </button>
    </div>
  );
};

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filter, setFilter] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase.from("products").select("*").eq("status", true);
      if (!error) setProductos(data as Producto[]);
    };
    fetchProductos();
  }, []);

  const filteredProducts = productos.filter((p) => {
    const matchesCategory = filter === "Todos" || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const availableCategories = Array.from(new Set(productos.map((p) => p.category))).sort();

  return (
    <main className="bg-stone-100 text-stone-900">
      {/* Botón perfil */}
      <div className="fixed top-4 right-4 z-50">
        {user ? (
          <Link href="/profile" className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-full font-semibold shadow-md transition">
            <FaUser /> Perfil
          </Link>
        ) : (
          <button onClick={() => router.push("/login")} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full font-semibold shadow-md transition">
            <FaUser /> Admin / Login
          </button>
        )}
      </div>

      {/* Hero */}
      <section className="relative h-[80vh] md:h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/fondo2.png')" }}>
        <div className="absolute inset-0 bg-stone-900/70"></div>
        <div className="relative z-10 text-center text-stone-100 px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-amber-700">Artesanía Sergio Silva</h1>
          <p className="mt-4 text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">Creaciones únicas en fierro, madera y más</p>
        </div>
      </section>

      {/* Sobre artesanía */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center md:text-left md:flex md:items-center md:gap-10">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-amber-700">Artesanía en Fierro y Madera</h2>
            <p className="text-base md:text-lg leading-relaxed text-stone-700">
              Trabajo con <span className="font-semibold text-amber-800">fierros, madera de roble</span> y distintos materiales nobles, dando vida a piezas artesanales que combinan tradición, resistencia y belleza.
            </p>
          </div>
          <div className="flex-1 mt-10 md:mt-0">
            <Image src="/aboutme.png" alt="Artesanía" width={500} height={400} className="rounded-xl shadow-lg object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Filtros y productos */}
      <section className="py-20 bg-stone-200 px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-amber-700">Venta de Nuestra Colección Artesanal</h2>
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-10 max-w-7xl mx-auto">
          <input type="text" placeholder="Buscar producto..." className="px-4 py-2 rounded-full border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full md:w-1/3 shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilter("Todos")} className={`px-5 py-2 rounded-full font-medium transition ${filter === "Todos" ? "bg-amber-700 text-white shadow" : "bg-white text-amber-700 border border-amber-700 hover:bg-amber-100"}`}>
              Todos
            </button>
            {availableCategories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-5 py-2 rounded-full font-medium transition ${filter === cat ? "bg-amber-700 text-white shadow" : "bg-white text-amber-700 border border-amber-700 hover:bg-amber-100"}`}>
                {cat === "Madera+Metal" ? "Madera + Metal" : cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {filteredProducts.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} className="relative block bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200 hover:shadow-xl hover:scale-105 transition-transform">
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${p.status ? "bg-emerald-600" : "bg-gray-500"}`}>{p.status ? "Disponible" : "No disponible"}</div>
              <ProductImage images={p.image_urls ?? null} showArrows={false} />
              <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm opacity-0 hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white p-6 text-center rounded-2xl">
                <p className="text-base md:text-lg leading-relaxed">{p.description}</p>
                <p className="mt-2 font-semibold text-amber-300">{p.category}</p>
              </div>
              <div className="p-6 flex flex-col justify-between h-[200px]">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-stone-900">{p.title}</h3>
                  <p className="mt-2 font-bold text-amber-800 text-lg">${formatPrice(p.price)}</p>
                </div>
                <span className="mt-3 inline-flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-5 py-2 rounded-full font-semibold transition">Ver Detalle</span>
              </div>
            </Link>
          ))}
        </motion.div>
      </section>

<section className="py-16 px-6 md:px-12 bg-stone-100">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-amber-700">
    Lo que dicen nuestros clientes
  </h2>
  <p className="text-center text-base md:text-lg leading-relaxed text-stone-700 mb-10 max-w-3xl mx-auto">
    Opiniones reales de quienes confían en nuestras creaciones artesanales.
  </p>
  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
    {[
      { name: "María López", comment: "La mesa de roble es increíble, superó mis expectativas." },
      { name: "José Martínez", comment: "Compré un jarrón y es perfecto, elegante y resistente." },
      { name: "Camila Rojas", comment: "El banco de jardín quedó precioso. Calidad y diseño excelentes." }
    ].map((t, i) => (
      <motion.div
        key={i}
        className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition hover:shadow-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
      >
        <div className="w-24 h-24 mb-4 flex items-center justify-center bg-amber-100 rounded-full text-amber-700 text-6xl border-2 border-amber-700">
          <FaUserCircle />
        </div>
        <p className="text-base md:text-lg leading-relaxed text-stone-700 mb-4">"{t.comment}"</p>
        <p className="font-semibold text-amber-700">{t.name}</p>
      </motion.div>
    ))}
  </div>
</section>

      {/* Cuidado materiales */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-amber-700 text-center mb-12">Cuidado de Materiales</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {careInfo.map((item) => (
            <div key={item.material} className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 flex flex-col gap-4 hover:shadow-2xl transition">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-stone-100">{item.icon}</div>
                <h3 className="text-xl md:text-2xl font-semibold text-stone-800">{item.material}</h3>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-stone-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section className="py-20 px-6 md:px-12 bg-stone-800 text-stone-100 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-amber-400">Contacto</h2>
        <div className="flex flex-col items-center gap-6">
          <p className="flex items-center gap-3 text-base md:text-lg">
            <FaPhone />{" "}
            <a href="tel:+56939123751" className="text-amber-400 font-semibold hover:underline">
              +56939123751
            </a>
          </p>
        
          <a href="https://www.google.com/maps?q=-33.4489,-70.6693" target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center gap-3 bg-amber-600 hover:bg-amber-700 px-8 py-3 rounded-full text-base md:text-lg font-semibold transition">
            <FaMapMarkerAlt /> Ver Ubicación
          </a>
        </div>
      </section>
    </main>
  );
}
