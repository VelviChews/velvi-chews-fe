import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import DinoGummy from '../assets/dino-gummy.png';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ItemDetailPage = () => {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil detail item
  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/redeem-items/${itemId}`);
        if (!response.ok) throw new Error('Gagal mengambil detail item');
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error('Error fetching item detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetail();
  }, [itemId]);

  // Fungsi Redeem
 const handleRedeem = async () => {
  try {
    // Ambil token user dari localStorage (kalau kamu pakai sistem login JWT)
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/redeem-history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // kirim token user
      },
      body: JSON.stringify({
        item_id: item.id,
        points_spent: item.points_required, // ✅ tambahkan ini
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || data.error || "Gagal melakukan redeem");
      return;
    }

    alert("🎉 Redeem berhasil!");
    // Kurangi stok di frontend juga
    setItem((prev) => ({ ...prev, stock: prev.stock - 1 }));

    // 🔹 Pindah ke halaman Home setelah 1 detik (biar user sempat lihat alert)
    setTimeout(() => {
      navigate("/home"); // ganti '/home' sesuai rute homepage kamu
    }, 1000);

  } catch (error) {
    console.error("Error saat redeem:", error);
    alert("Terjadi kesalahan saat redeem");
  }
};


  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading item detail...
      </div>
    );
  }

  // Item tidak ditemukan
  if (!item) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Item tidak ditemukan
      </div>
    );
  }

  // Tampilan utama
  return (
    <div className="min-h-screen w-full bg-[#B4E2F2]">
      {/* Header */}
      <header className="sticky top-0 z-20 w-full px-4 py-5 shadow-sm">
        <div className="relative flex items-center justify-center">
          <button onClick={() => navigate(-1)} className="absolute left-0">
            <IoChevronBack className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Item Detail</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <div className="flex flex-col rounded-3xl bg-white p-6 shadow-lg">
          {/* Gambar */}
          <div className="relative mb-4">
            <img
              src={item.image_url ? `${item.image_url}` : DinoGummy}
              alt={item.name}
              className="w-full rounded-xl object-cover"
            />
          </div>

          {/* Informasi Item */}
          <h2 className="text-xl font-bold text-[#FF89AC]">{item.name}</h2>
          <p className="mt-1 text-xs text-gray-400">Stock: {item.stock}</p>

          <div className="mt-6">
            <h3 className="font-semibold text-[#FF89AC]">Description</h3>
            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-[#FF89AC]">Points Required</h3>
            <p className="mt-1 text-sm text-gray-700 font-bold">
              {item.points_required} Points
            </p>
          </div>

          {/* Tombol Redeem */}
          <div className="mt-8 flex w-full justify-center">
            <button
              onClick={handleRedeem}
              disabled={item.stock <= 0}
              className={`w-full max-w-xs rounded-full py-4 text-lg font-bold text-white shadow-lg transition-colors 
                ${item.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF89AC] hover:bg-[#FCAFC1]'}`}
            >
              {item.stock <= 0 ? 'Stok Habis' : 'Redeem Sekarang'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ItemDetailPage;
