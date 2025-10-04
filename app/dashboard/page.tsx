"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaTag, FaCube, FaMoneyBillWave, FaArrowLeft } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

type Sale = {
  id: number;
  product_id: number;
  title: string;
  price: string;
  category: string;
  sold_at: string;
};

const formatPrice = (price: string) => Number(price).toLocaleString("es-CL");
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-CL", { year: "numeric", month: "short", day: "numeric" });

export default function DashboardPro() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSales = async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("sold_at", { ascending: false });

      if (error) console.error("Error cargando ventas:", error);
      else setSales(data as Sale[]);
      setLoading(false);
    };
    fetchSales();
  }, []);

  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.sold_at);
    if (startDate && saleDate < startDate) return false;
    if (endDate && saleDate > endDate) return false;
    return true;
  });

  const salesByMonth = filteredSales.reduce((acc: Record<string, number>, sale) => {
    const month = new Date(sale.sold_at).toLocaleDateString("es-CL", { year: "numeric", month: "2-digit" });
    acc[month] = (acc[month] || 0) + Number(sale.price);
    return acc;
  }, {});

  return (
    <main className="bg-stone-100 text-stone-900 min-h-screen py-16 px-6 md:px-12 max-w-7xl mx-auto font-sans">
      {/* Botón Volver */}
      <button
        onClick={() => router.push("/profile")}
        className="mb-6 flex items-center gap-2 bg-stone-300 hover:bg-stone-400 text-stone-900 px-5 py-2.5 rounded-full shadow-md font-semibold transition-transform transform hover:scale-105"
      >
        <FaArrowLeft /> Volver
      </button>

      <h1 className="text-4xl md:text-5xl font-extrabold text-amber-700 mb-12 text-center drop-shadow-md">
        Dashboard de Ventas Pro
      </h1>

      {/* Selector de fechas */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-12">
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Fecha inicio"
          className="px-4 py-2 rounded-full border border-stone-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="Fecha fin"
          className="px-4 py-2 rounded-full border border-stone-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          onClick={() => {
            setStartDate(null);
            setEndDate(null);
          }}
          className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-full font-semibold transition"
        >
          Limpiar filtro
        </button>
      </div>

      {loading ? (
        <p className="text-center text-lg text-stone-600">Cargando ventas...</p>
      ) : filteredSales.length === 0 ? (
        <p className="text-center text-lg text-stone-600">No hay ventas para este rango de fechas.</p>
      ) : (
        <>
          {/* Totales por mes */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Object.entries(salesByMonth).map(([month, total]) => (
              <motion.div
                key={month}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center transition hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaCalendarAlt className="text-amber-500 w-8 h-8 mb-2" />
                <h2 className="text-xl font-bold text-stone-800">{month}</h2>
                <p className="text-2xl font-extrabold text-amber-700 mt-2">${formatPrice(total.toString())}</p>
              </motion.div>
            ))}
          </section>

          {/* Listado de ventas */}
          <section className="grid gap-6">
            {filteredSales.map(sale => (
              <motion.div
                key={sale.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:shadow-xl hover:scale-[1.02]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                    <FaTag className="text-amber-500" /> {sale.title}
                  </h3>
                  <p className="text-stone-600 flex items-center gap-2">
                    <FaCube className="text-stone-400" /> {sale.category}
                  </p>
                </div>
                <div className="flex flex-col md:items-end gap-1">
                  <p className="text-amber-700 font-extrabold text-lg flex items-center gap-2">
                    <FaMoneyBillWave /> ${formatPrice(sale.price)}
                  </p>
                  <p className="text-stone-500 text-sm flex items-center gap-2">
                    <FaCalendarAlt /> {formatDate(sale.sold_at)}
                  </p>
                </div>
              </motion.div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
