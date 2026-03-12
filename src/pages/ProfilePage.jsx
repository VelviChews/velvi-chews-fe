import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaQuestionCircle,
  FaCoins,
  FaPencilAlt,
} from "react-icons/fa";
import {
  IoLogOutOutline,
  IoAddCircleOutline,
  IoScan,
  IoQrCode,
} from "react-icons/io5";
import ProfileWave from "../assets/profilewave.png";
import DefaultAvatar from "../assets/default-avatar.png";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [imagePreview, setImagePreview] = useState(DefaultAvatar);
  const [newName, setNewName] = useState("");
  const [uploading, setUploading] = useState(false);

  // === Ambil profil user dari backend ===
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setNewName(data.name || "");
          if (data.profile_picture) setImagePreview(data.profile_picture);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchScanCount = async () => {
      try {
        const res = await fetch(`${API_URL}/scan/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setScanCount(data.length);
        }
      } catch {
        /* */
      }
    };

    fetchUser();
    fetchScanCount();
  }, []);

  // === Upload foto atau update nama ===
  const handleUpdateProfile = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      if (newName) formData.append("name", newName);
      if (file) formData.append("file", file);

      const res = await fetch(`${API_URL}/users/me`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal memperbarui profil");

      const updated = await res.json();
      setUser(updated);
      if (updated.profile_picture) {
        setImagePreview(`${API_URL}/${updated.profile_picture}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      handleUpdateProfile(file);
    }
  };

  const handleEditClick = () => fileInputRef.current.click();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const MenuItem = ({ icon, text, onClick, isLogout = false }) => (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-4 py-4 text-left text-sm font-semibold ${
        !isLogout ? "border-b" : ""
      } ${isLogout ? "text-red-500" : "text-gray-700"}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF89AC] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-gray-50 pb-24 overflow-x-hidden font-sans">
      <Navbar />
      <img
        src={ProfileWave}
        alt="Profile background wave"
        className="absolute top-0 left-0 -z-0 w-full h-full object-cover"
      />

      <div className="relative z-10 flex flex-col items-center px-6">
        <header className="flex flex-col items-center pt-12 text-center text-white">
          <div className="relative mb-4">
            <img
              src={imagePreview}
              alt="Profile"
              className="h-28 w-28 rounded-full object-cover shadow-md border-4 border-white"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/png, image/jpeg"
            />
            <button
              onClick={handleEditClick}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#FF89AC] shadow-md transition-transform hover:scale-110"
              aria-label="Change profile photo"
            >
              <FaPencilAlt size={14} />
            </button>
          </div>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={() => handleUpdateProfile()}
            className="text-2xl font-bold text-center bg-transparent border-none focus:outline-none text-white placeholder-white/80"
          />
          <p className="text-sm font-light text-white/90">{user.email}</p>
        </header>

        {/* Points & Scanned stats */}
        <div className="mt-6 flex w-full max-w-xs items-center justify-around rounded-2xl bg-white p-4 shadow-lg">
          <div className="flex w-1/2 items-center justify-center gap-3">
            <FaCoins className="h-7 w-7 flex-shrink-0 text-[#B4E2F2]" />
            <div className="text-left">
              <p className="text-4xl font-bold text-[#B4E2F2]">
                {user.total_points}
              </p>
              <p className="text-sm text-gray-400 -mt-1">Point</p>
            </div>
          </div>
          <div className="h-12 border-l border-gray-200"></div>
          <div className="flex w-1/2 items-center justify-center gap-3">
            <IoScan className="h-7 w-7 flex-shrink-0 text-[#B4E2F2]" />
            <div className="text-left">
              <p className="text-4xl font-bold text-[#B4E2F2]">{scanCount}</p>
              <p className="text-sm text-gray-400 -mt-1">Scanned</p>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="mt-8 w-full max-w-xs rounded-2xl bg-white p-4 pt-0 shadow-lg">
          <MenuItem
            icon={<FaUserCircle size={20} />}
            text="Account Information"
            onClick={() => navigate("/profile/account-info")}
          />
          <MenuItem
            icon={<FaQuestionCircle size={20} />}
            text="Frequently Ask Question"
          />
          {user.role === "admin" && (
            <>
              <MenuItem
                icon={<IoAddCircleOutline size={22} />}
                text="List Item Redeem"
                onClick={() => navigate("/profile/redeem-items")}
              />
              <MenuItem
                icon={<IoQrCode size={22} />}
                text="Manage QR Cards"
                onClick={() => navigate("/admin/qr")}
              />
            </>
          )}
          <MenuItem
            icon={<IoLogOutOutline size={22} />}
            text="Log Out"
            isLogout
            onClick={handleLogout}
          />
        </div>
      </div>

      {uploading && (
        <p className="fixed bottom-4 text-center w-full text-sm text-gray-500">
          Uploading...
        </p>
      )}
    </div>
  );
};

export default ProfilePage;
