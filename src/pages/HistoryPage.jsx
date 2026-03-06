import React, { useEffect, useState } from "react";
import UpperWave from "../assets/upper.png";
import BottomWave from "../assets/bottomwave.png";
import Navbar from "../components/Navbar";

const API_BASE = import.meta.env.VITE_API_URL;

// === Komponen Kartu Riwayat ===
const HistoryCard = ({ item }) => {
  const isPositive = item.points >= 0;
  const pointsColor = isPositive ? "text-[#B4E2F2]" : "text-[#FF89AC]";
  const pointsSign = isPositive ? "+" : "";

  const dateObject = item.created_at ? new Date(item.created_at) : null;
  const formattedDate = dateObject
    ? dateObject.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "-";
  const formattedTime = dateObject
    ? dateObject.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : "-";

  const badge =
    item.type === "scan" ? (
      <span className="rounded-full bg-[#B4E2F2]/20 px-2 py-0.5 text-[10px] font-semibold text-[#B4E2F2]">
        Scan
      </span>
    ) : (
      <span className="rounded-full bg-[#FF89AC]/20 px-2 py-0.5 text-[10px] font-semibold text-[#FF89AC]">
        Redeem
      </span>
    );

  return (
    <div className="flex w-full max-w-sm items-center justify-between rounded-2xl bg-white p-4 shadow-md gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">{badge}</div>
        <h3 className="truncate font-semibold text-gray-800 text-sm">{item.title}</h3>
        <p className="text-xs text-gray-400">
          {formattedDate}, {formattedTime}
        </p>
      </div>
      <p className={`text-xl font-bold flex-shrink-0 ${pointsColor}`}>
        {pointsSign}{item.points}
      </p>
    </div>
  );
};

// === Halaman Riwayat ===
const HistoryPage = () => {
  const token = localStorage.getItem("token");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        // Fetch scan history dan redeem history secara paralel
        const [scanRes, redeemRes] = await Promise.all([
          fetch(`${API_BASE}/scan/history`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/redeem-history/`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const scanData = scanRes.ok ? await scanRes.json() : [];
        const redeemData = redeemRes.ok ? await redeemRes.json() : [];

        // Normalisasi format redeem history
        const normalizedRedeem = redeemData.map((r) => ({
          id: `redeem-${r.id}`,
          title: r.item?.name || `Redeem Item #${r.item_id}`,
          points: -(r.points_spent || 0),
          created_at: r.created_at,
          type: "redeem",
        }));

        // Gabungkan dan urutkan berdasarkan tanggal terbaru
        const combined = [...scanData, ...normalizedRedeem].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setHistory(combined);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-white pb-24">
      {/* Background */}
      <img src={UpperWave} alt="Top wave background" className="absolute -top-20 left-0 w-full -z-0" />
      <img src={BottomWave} alt="Bottom wave background" className="absolute bottom-0 left-0 w-full -z-0" />

      <Navbar />

      <div className="relative z-10">
        <header className="px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-white">History</h1>
        </header>

        <main className="flex flex-col items-center gap-4 px-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-[#FF89AC]" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center text-white/60">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm">Belum ada riwayat transaksi.</p>
            </div>
          ) : (
            history.map((item) => <HistoryCard key={item.id} item={item} />)
          )}
        </main>
      </div>
    </div>
  );
};

export default HistoryPage;
