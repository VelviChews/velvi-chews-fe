import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import DinoGummy from '../assets/dino-gummy.png';

const API_BASE_URL = import.meta.env.VITE_API_URL; // 🔥 otomatis ambil dari .env

const RedeemCard = ({ id, name, description, points_required, stock, image_url }) => (
  <div className="w-full max-w-sm rounded-2xl bg-white p-3 shadow-lg">
    <img
      src={image_url ? `${image_url}` : DinoGummy}
      alt={name}
      className="mb-3 w-full rounded-xl object-cover"
      />
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-bold text-gray-800">{name}</h3>
        <p className="text-xs text-gray-400">Stock: {stock}</p>
        <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
        <p className="text-sm font-semibold text-[#FF89AC] mt-1">
          {points_required} Points
        </p>
      </div>
      <Link
        to={`/redeem/${id}`}
        className="rounded-lg bg-[#FF89AC] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#FCAFC1]"
      >
        Redeem
      </Link>
    </div>
  </div>
);

const RedeemPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data dari backend FastAPI
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/redeem-items`);
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching redeem items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading items...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 pb-24">
      <header className="sticky top-0 z-20 w-full rounded-b-3xl bg-[#B4E2F2] px-4 py-5 shadow-md">
        <div className="relative flex items-center justify-center">
          <button onClick={() => navigate(-1)} className="absolute left-0">
            <IoChevronBack className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Redeem</h1>
        </div>
      </header>

      <main className="flex flex-col items-center gap-4 p-6">
        {items.length > 0 ? (
          items.map((item) => (
            <RedeemCard
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              points_required={item.points_required}
              stock={item.stock}
              image_url={item.image_url} // pastikan field ini sesuai schema backend
            />
          ))
        ) : (
          <p className="text-gray-500">Belum ada item redeem tersedia.</p>
        )}
      </main>
    </div>
  );
};

export default RedeemPage;
