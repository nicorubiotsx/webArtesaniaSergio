// app/page.tsx
"use client";

import Image from "next/image";
import { FaMapMarkerAlt, FaFacebook, FaPhone } from "react-icons/fa";

export default function Home() {
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
        <p className="text-center text-lg md:text-xl text-amber-600 mb-10 max-w-3xl mx-auto">
          Más que objetos: piezas que reflejan tradición, oficio y carácter propio.
        </p>



        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              title: "Mesa de Roble",
              desc: "Mesa rústica trabajada en madera de roble y fierro forjado.",
              price: "$150.000",
              img: "/mesa.webp",
            },
            {
              title: "Candelador",
              desc: "Candelabro trabajado en madera de roble y fierro forjado.",
              price: "$150.000",
              img: "/candelabro.avif",
            },
            {
              title: "Jarrón de Greda",
              desc: "Jarrón artesanal trabajado en greda y madera.",
              price: "$150.000",
              img: "/jarron.webp",
            },
            {
              title: "Lámpara de Fierro",
              desc: "Diseño artesanal con fierro trabajado a mano.",
              price: "$45.000",
              img: "/lampara.webp",
            },
            {
              title: "Banco de Jardín",
              desc: "Banco en madera y fierro, ideal para exteriores.",
              price: "$80.000",
              img: "/banco.jpg",
            },
          ].map((p, i) => {
            const whatsappNumber = "56939123751"; // tu número de WhatsApp sin +
            const message = encodeURIComponent(
              `Hola! Quisiera consultar sobre el producto: ${p.title}`
            );
            const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

            return (
              <a
                key={i}
                href={whatsappLink}
                target="_blank"
                className="block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition border border-stone-300"
              >
                <Image
                  src={p.img}
                  alt={p.title}
                  width={400}
                  height={250}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6 flex flex-col justify-between h-[200px]">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-stone-900">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-stone-600">{p.desc}</p>
                    <p className="mt-2 font-bold text-amber-800 text-lg">{p.price}</p>
                  </div>
                  <p className="mt-1 inline-flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-full font-semibold text-center transition">
                    Consultar en WhatsApp
                  </p>
                </div>
              </a>
            );
          })}
        </div>
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
              comment: "La mesa de roble es increíble, superó mis expectativas. ¡Se nota el trabajo artesanal!",
              img: "/client1.jpg",
            },
            {
              name: "José Martínez",
              comment: "Compré un jarrón y es perfecto, elegante y resistente. Totalmente recomendable.",
              img: "/client2.jpg",
            },
            {
              name: "Camila Rojas",
              comment: "El banco de jardín quedó precioso en mi terraza. Calidad y diseño excelentes.",
              img: "/client3.jpg",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition hover:shadow-xl"
            >
              <img
                src={t.img}
                alt={t.name}
                className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-amber-700"
              />
              <p className="text-stone-700 mb-4">"{t.comment}"</p>
              <p className="font-semibold text-amber-700">{t.name}</p>
            </div>
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
            <a href="tel:+56912345678" className="text-amber-700 font-semibold hover:underline">
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
