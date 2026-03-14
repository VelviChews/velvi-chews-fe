import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoChevronBack, IoQrCodeOutline, IoPersonOutline, IoTimeOutline, IoDownloadOutline, IoTrashOutline } from "react-icons/io5";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AdminQRDetailPage() {
    const { cardCode } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [cardDetails, setCardDetails] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCardDetails = async (cardsList) => {
        // cardsList is passed to find the specific card from the all cards payload, since there's no single detail API
        const card = cardsList.find(c => c.card_code === cardCode);
        if (card) {
            setCardDetails(card);
        } else {
            setError("Kartu QR tidak ditemukan");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch All Cards (Admin) to find specific card
                const cardsRes = await fetch(`${API_BASE}/cards`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!cardsRes.ok) throw new Error("Gagal mengambil data QR Cards");
                const cardsData = await cardsRes.json();
                fetchCardDetails(cardsData);

                // Fetch Scan History
                const historyRes = await fetch(`${API_BASE}/cards/${cardCode}/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!historyRes.ok) throw new Error("Gagal mengambil history scan");
                const historyData = await historyRes.json();
                setHistory(historyData);
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [cardCode, token]);

    const handleDownloadQR = async () => {
        try {
            const res = await fetch(`${API_BASE}/cards/${cardCode}/qr`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `QR-${cardDetails?.label || cardCode}.png`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {/* */}
    };

    return (
        <div className="relative min-h-screen w-full bg-gray-50 pb-12">
            <div className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
                <button
                    onClick={() => navigate("/admin/qr")}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"
                >
                    <IoChevronBack size={20} />
                </button>
                <h1 className="text-lg font-bold text-gray-800">Detail QR Card</h1>
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
                        {/* QR Info Card */}
                        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 flex gap-4">
                            <div className="flex-shrink-0 h-24 w-24 rounded-xl bg-gray-50 p-2 overflow-hidden border border-gray-100">
                                <img
                                    src={`${API_BASE}${cardDetails?.qr_image_path}`}
                                    alt="QR Code"
                                    className="h-full w-full object-contain"
                                    onError={(e) => { e.target.style.display = "none"; }}
                                />
                            </div>
                            <div className="flex flex-col py-1">
                                <h2 className="text-lg font-bold text-gray-800 line-clamp-2">{cardDetails?.label}</h2>
                                <p className="text-sm font-semibold text-[#FF89AC] mt-0.5">{cardDetails?.points} Poin</p>
                                
                                <button 
                                    onClick={handleDownloadQR}
                                    className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-[#FF89AC]/10 px-3 py-1.5 text-xs font-bold text-[#FF89AC] active:scale-95 transition-transform"
                                >
                                    <IoDownloadOutline size={14} /> Download QR
                                </button>
                            </div>
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 text-center">
                                <p className="text-xs text-gray-500 font-medium">Tanggal Dibuat</p>
                                <p className="mt-1 text-sm font-bold text-gray-800">
                                    {cardDetails?.created_at ? new Date(cardDetails.created_at).toLocaleDateString('id-ID') : '-'}
                                </p>
                            </div>
                            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 text-center">
                                <p className="text-xs text-gray-500 font-medium">Total Di-scan</p>
                                <p className="mt-1 text-sm font-bold text-gray-800">{history.length} kali</p>
                            </div>
                        </div>

                        {/* History List */}
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                            Riwayat Scan ({history.length})
                        </h3>

                        {history.length === 0 ? (
                            <div className="rounded-2xl bg-white p-8 text-center text-gray-400 shadow-sm ring-1 ring-gray-100">
                                <IoQrCodeOutline size={48} className="mx-auto mb-3 opacity-20" />
                                <p className="text-sm">Belum ada user yang men-scan QR ini.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {history.map((record, index) => (
                                    <div key={record.id || index} className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-50 text-green-500">
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
                                            <span className="inline-block rounded-lg bg-green-50 px-2 py-1 text-xs font-bold text-green-600">
                                                +{record.points_received} pts
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
