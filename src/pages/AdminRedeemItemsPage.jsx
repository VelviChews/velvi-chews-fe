import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoAddCircle, IoTrash, IoInformationCircleOutline } from "react-icons/io5";
import DinoGummy from "../assets/dino-gummy.png";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AdminRedeemItemsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/redeem-items/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.status === 403) {
        setError("Akses ditolak. Halaman ini khusus admin.");
        return;
      }

      if (!res.ok) {
        throw new Error("Gagal mengambil data item redeem");
      }

      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchItems();
  }, [token, navigate, fetchItems]);

  const handleDeleteItem = async (itemId, itemName) => {
    const confirmed = window.confirm(`Hapus item "${itemName}"?`);
    if (!confirmed) {
      return;
    }

    setDeletingId(itemId);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/redeem-items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.status === 403) {
        setError("Akses ditolak. Hanya admin yang bisa menghapus item.");
        return;
      }

      if (!res.ok) {
        let detail = "Gagal menghapus item redeem";
        try {
          const errorData = await res.json();
          detail = errorData.detail || detail;
        } catch {
          // Keep default message when backend response is not JSON.
        }
        throw new Error(detail);
      }

      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menghapus item.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gray-50 pb-12">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
        <button
          onClick={() => navigate("/profile")}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"
        >
          <IoChevronBack size={20} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">List Item Redeem</h1>
      </header>

      <div className="mx-auto max-w-md px-4 pt-6">
        <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Kelola item redeem
              </p>
              <p className="text-xs text-gray-500">
                Lihat item yang sudah ada sebelum menambah item baru.
              </p>
            </div>
            <button
              onClick={() => navigate("/profile/add-item")}
              className="flex items-center gap-2 rounded-xl bg-[#FF89AC] px-3 py-2 text-xs font-semibold text-white shadow-sm active:scale-95 transition-transform"
            >
              <IoAddCircle size={16} />
              Tambah
            </button>
          </div>
        </div>

        <h2 className="mb-3 text-sm font-bold text-gray-500 uppercase tracking-wide">
          Semua Item ({items.length})
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-14">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF89AC] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
            Belum ada item redeem.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm"
              >
                <img
                  src={item.image_url || DinoGummy}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-[#FF89AC] font-bold">
                    {item.points_required} poin
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Stok: {item.stock}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 self-start">
                  <button
                    onClick={() => navigate(`/admin/redeem-items/${item.id}`)}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500 active:scale-95 transition-transform"
                    title="Detail item"
                  >
                    <IoInformationCircleOutline size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id, item.name)}
                    disabled={deletingId === item.id}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500 active:scale-95 transition-transform disabled:opacity-60"
                    title="Hapus item"
                  >
                    {deletingId === item.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                    ) : (
                      <IoTrash size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
