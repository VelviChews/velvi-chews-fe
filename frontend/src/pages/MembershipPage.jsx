import React, { useEffect, useState } from 'react';
import { IoScan, IoTicketOutline, IoCartOutline } from 'react-icons/io5'; 
import TopShape from '../assets/uppermembership.png'; 
import BottomWave from '../assets/bottomwave.png'; 
import Navbar from '../components/Navbar';
import { NavLink, useNavigate } from 'react-router-dom'; // FIX: Tambah useNavigate

const MembershipPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);
  const [redeemHistory, setRedeemHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // FIX: Inisialisasi navigate

  // === Ambil data profil + riwayat redeem ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // FIX: Gunakan navigate replace agar tidak looping saat klik Back
        if (!token) {
          navigate('/login', { replace: true });
          return;
        }

        // Ambil data profil
        const profileRes = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Cek jika token expired atau invalid dari server
        if (profileRes.status === 401) {
            localStorage.removeItem("token");
            navigate('/login', { replace: true });
            return;
        }

        const profileData = await profileRes.json();
        setUser(profileData);

        // Ambil data riwayat redeem
        const historyRes = await fetch(`${API_URL}/redeem-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const historyData = await historyRes.json();
        
        setRedeemHistory(historyData);
      } catch (err) {
        console.error("Gagal memuat data:", err);
        // Opsional: Jika error parah, bisa redirect juga
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, navigate]); // FIX: Tambahkan navigate ke dependency array

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  // Guard clause: Jika user null (misal error fetch), jangan render konten
  if (!user) return null;

  return (
    <div className="relative min-h-screen w-full bg-gray-50 pb-24">
      <Navbar />
      <img 
        src={TopShape} 
        alt="Top background shape" 
        className="absolute top-0 left-0 w-full -z-0"
      />
      
      {/* === POINT SECTION === */}
      <header className="relative z-10 flex justify-center pt-12">
        <div className="flex h-56 w-56 items-center justify-center rounded-full bg-[#EAF7FF] shadow-xl"> 
          <div className="flex h-48 w-48 items-center justify-center rounded-full bg-white/40 shadow-xl">
            <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white shadow-[inset_0_0_8px_rgba(0,0,0,0.08)]">
              <span className="text-base text-[#B4E2F2]">Your Point</span>
              <span className="text-6xl font-bold text-[#B4E2F2]">
                {user?.total_points ?? 0}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* === MENU === */}
      <main className="relative z-10 -mt-10 flex flex-col items-center gap-8 px-6">
        <div className="flex w-full max-w-xs justify-around rounded-2xl bg-[#FCAFC1] mt-15 p-3 shadow-lg">
          <div className="flex flex-col items-center gap-2">
            <button className="flex h-14 w-14 items-center justify-center rounded-xl bg-white">
              <IoScan className="h-7 w-7 text-[#FCAFC1]" />
            </button>
            <span className="text-sm font-medium text-white">Scan</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <NavLink to="/redeem" className="flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white">
                <IoTicketOutline className="h-7 w-7 text-[#FCAFC1]" />
              </div>
              <span className="text-sm font-medium text-white">Redeem</span>
            </NavLink>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button className="flex h-14 w-14 items-center justify-center rounded-xl bg-white">
              <IoCartOutline className="h-7 w-7 text-[#FCAFC1]" />
            </button>
            <span className="text-sm font-medium text-white">Shop</span>
          </div>
        </div>

        {/* === REDEEM HISTORY === */}
        <div className="w-full max-w-xs self-center">
          <h2 className="mb-3 text-lg font-bold text-[#FCAFC1]">Redeem History</h2>

          {redeemHistory.length === 0 ? (
            <p className="text-sm text-gray-400 text-center">Belum ada riwayat redeem</p>
          ) : (
            redeemHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-md mb-2"
              >
                <div>
                  <p className="font-semibold text-gray-800">{item.item?.name || '-'}</p>
                  <p className="text-xs text-gray-400">
                    {item.created_at
                      ? new Date(item.created_at.replace(" ", "T")).toLocaleDateString(
                          "id-ID",
                          { year: "numeric", month: "short", day: "numeric" }
                        )
                      : "-"}
                  </p>
                </div>
                <p className="text-xl font-bold text-gray-700">
                  -{item.points_spent ?? 0}
                </p>
              </div>
            ))
          )}

        </div>
      </main>

      <img 
        src={BottomWave} 
        alt="Bottom background wave" 
        className="absolute bottom-0 left-0 w-full -z-0"
      />
    </div>
  );
};

export default MembershipPage;