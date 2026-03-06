import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoQrCode, IoTrash } from "react-icons/io5";
import { FaPlus, FaDownload } from "react-icons/fa";

const API_BASE = "http://localhost:8000";

export default function AdminQRPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ label: "", points: "" });
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ── Fetch all cards ──────────────────────────────────────────────
    const fetchCards = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/cards`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setCards(await res.json());
            }
        } catch {/* */ }
        setLoading(false);
    };

    useEffect(() => {
        fetchCards();
    }, []);

    // ── Create card ──────────────────────────────────────────────────
    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!form.label.trim() || !form.points) {
            setError("Label dan poin wajib diisi.");
            return;
        }
        setCreating(true);
        try {
            const res = await fetch(`${API_BASE}/cards`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ label: form.label.trim(), points: parseInt(form.points) }),
            });
            if (res.ok) {
                setSuccess("QR Card berhasil dibuat! 🎉");
                setForm({ label: "", points: "" });
                fetchCards();
            } else {
                const d = await res.json();
                setError(d.detail || "Gagal membuat card.");
            }
        } catch {
            setError("Gagal terhubung ke server.");
        }
        setCreating(false);
    };

    // ── Download QR ──────────────────────────────────────────────────
    const handleDownloadQR = async (card) => {
        try {
            const res = await fetch(`${API_BASE}/cards/${card.card_code}/qr`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `QR-${card.label}.png`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {/* */ }
    };

    return (
        <div className="relative min-h-screen w-full bg-gray-50 pb-12">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
                <button
                    onClick={() => navigate("/profile")}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"
                >
                    <IoChevronBack size={20} />
                </button>
                <h1 className="text-lg font-bold text-gray-800">Manage QR Cards</h1>
            </div>

            <div className="mx-auto max-w-md px-4 pt-6">
                {/* ── Create Form ──────────────────────────────────────────── */}
                <div className="rounded-2xl bg-white p-5 shadow-md">
                    <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-700">
                        <IoQrCode className="text-[#FF89AC]" size={20} />
                        Buat QR Card Baru
                    </h2>

                    <form onSubmit={handleCreate} className="flex flex-col gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Label / Nama QR</label>
                            <input
                                type="text"
                                placeholder="Contoh: Gummy Bear Stroberi"
                                value={form.label}
                                onChange={(e) => setForm({ ...form, label: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#FF89AC] focus:ring-1 focus:ring-[#FF89AC]"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Poin yang diberikan</label>
                            <input
                                type="number"
                                min="1"
                                placeholder="Contoh: 10"
                                value={form.points}
                                onChange={(e) => setForm({ ...form, points: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#FF89AC] focus:ring-1 focus:ring-[#FF89AC]"
                            />
                        </div>

                        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">{error}</p>}
                        {success && <p className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-600">{success}</p>}

                        <button
                            type="submit"
                            disabled={creating}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#FF89AC] py-3 text-sm font-semibold text-white shadow-md disabled:opacity-60 active:scale-95 transition-transform"
                        >
                            <FaPlus size={14} />
                            {creating ? "Membuat..." : "Buat QR Card"}
                        </button>
                    </form>
                </div>

                {/* ── Cards List ───────────────────────────────────────────── */}
                <h2 className="mb-3 mt-6 text-sm font-bold text-gray-500 uppercase tracking-wide">
                    Semua QR Cards ({cards.length})
                </h2>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF89AC] border-t-transparent" />
                    </div>
                ) : cards.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-center text-gray-400">
                        <IoQrCode size={48} className="mb-2 opacity-30" />
                        <p className="text-sm">Belum ada QR card. Buat yang pertama!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {cards.map((card) => (
                            <div key={card.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                                {/* QR Preview */}
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                    <img
                                        src={`${API_BASE}${card.qr_image_path}`}
                                        alt="QR"
                                        className="h-full w-full object-contain"
                                        onError={(e) => { e.target.style.display = "none"; }}
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-800">{card.label}</p>
                                    <p className="text-xs text-[#FF89AC] font-bold">{card.points} poin</p>
                                    <p className="mt-0.5 truncate text-[10px] text-gray-400">{card.card_code}</p>
                                </div>

                                {/* Download button */}
                                <button
                                    onClick={() => handleDownloadQR(card)}
                                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#FF89AC]/10 text-[#FF89AC] active:scale-95 transition-transform"
                                    title="Download QR"
                                >
                                    <FaDownload size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
