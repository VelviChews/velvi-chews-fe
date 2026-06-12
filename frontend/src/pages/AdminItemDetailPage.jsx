import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoChevronBack, IoGiftOutline, IoPersonOutline, IoTimeOutline } from "react-icons/io5";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AdminItemDetailPage() {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [itemDetails, setItemDetails] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Item Details
                const itemRes = await fetch(`${API_BASE}/redeem-items/${itemId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!itemRes.ok) throw new Error("Gagal mengambil detail item");
                const itemData = await itemRes.json();
                setItemDetails(itemData);

                // Fetch History
                const historyRes = await fetch(`${API_BASE}/redeem-items/${itemId}/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!historyRes.ok) throw new Error("Gagal mengambil history item");
                const historyData = await historyRes.json();
                setHistory(historyData);
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [itemId, token]);

    return (
        <div className="relative min-h-screen w-full bg-gray-50 pb-12">
            <div className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
                <button
                    onClick={() => navigate("/profile/redeem-items")}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"
                >
                    <IoChevronBack size={20} />
                </button>
                <h1 className="text-lg font-bold text-gray-800">Detail Redeem Item</h1>
            </div>

            <div className="mx-auto max-w-md px-4 pt-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF89AC] border-t-transparent" />
                    </div>
                ) : error ? (
                    <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Item Info Card */}
                        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                            {itemDetails?.image_url && (
                                <img
                                    src={itemDetails.image_url}
                                    alt={itemDetails.name}
                                    className="h-48 w-full object-cover"
                                />
                            )}
                            <div className="p-5">
                                <h2 className="text-xl font-bold text-gray-800">{itemDetails?.name}</h2>
                                <p className="mt-1 text-sm font-semibold text-[#FF89AC]">Harga: {itemDetails?.points_required} Poin</p>
                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{itemDetails?.description}</p>
                                
                                <div className="mt-4 flex gap-4 border-t border-gray-100 pt-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Sisa Stok</p>
                                        <p className="text-lg font-bold text-gray-800">{itemDetails?.stock}</p>
                                    </div>
                                    <div className="border-l border-gray-200 pl-4">
                                        <p className="text-xs text-gray-500">Total Diredeem</p>
                                        <p className="text-lg font-bold text-gray-800">{history.length} kali</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* History List */}
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                            Riwayat Redeem ({history.length})
                        </h3>

                        {history.length === 0 ? (
                            <div className="rounded-2xl bg-white p-8 text-center text-gray-400 shadow-sm ring-1 ring-gray-100">
                                <IoGiftOutline size={48} className="mx-auto mb-3 opacity-20" />
                                <p className="text-sm">Belum ada user yang redeem item ini.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {history.map((record, index) => (
                                    <div key={record.id || index} className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FF89AC]/10 text-[#FF89AC]">
                                            <IoPersonOutline size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-bold text-gray-800">{record.user.name}</p>
                                            <p className="truncate text-xs text-gray-500">{record.user.email}</p>
                                            <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                                                <IoTimeOutline size={12} />
                                                <span>{new Date(record.created_at).toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block rounded-lg bg-red-50 px-2 py-1 text-xs font-bold text-red-500">
                                                -{record.points_spent} pts
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
