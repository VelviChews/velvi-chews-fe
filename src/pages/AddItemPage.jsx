import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { FaImage } from "react-icons/fa";

const AddItemPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // State untuk form
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Klik box upload → buka file dialog
  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  // Preview gambar saat dipilih
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File terlalu besar! Maksimal 5MB.");
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit form → kirim ke backend FastAPI
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: token tidak ditemukan.");
      return;
    }

    const formData = new FormData();
    formData.append("name", title);
    formData.append("points_required", points);
    formData.append("stock", stock);
    formData.append("description", description);
    if (fileInputRef.current.files[0]) {
      formData.append("file", fileInputRef.current.files[0]);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/redeem-items/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 403) {
        alert("Akses ditolak: hanya admin yang bisa menambahkan item.");
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Gagal:", errorText);
        alert("Gagal menambahkan item. Cek console untuk detail.");
        return;
      }

      const data = await res.json();
      console.log("✅ Item berhasil ditambahkan:", data);
      alert("Item berhasil ditambahkan!");
      navigate("/profile/redeem-items");
    } catch (err) {
      console.error("Error saat upload:", err);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white pb-24">
      {/* Header */}
      <header className="relative w-full rounded-b-[40px] bg-[#B4E2F2] px-4 py-5 shadow-md">
        <div className="relative flex items-center justify-center">
          <button onClick={() => navigate(-1)} className="absolute left-0">
            <IoChevronBack className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Add Item Redeem</h1>
        </div>
      </header>

      {/* Form */}
      <main className="flex flex-col items-center gap-4 p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          {/* Title */}
          <div className="w-full mb-4">
            <label className="mb-1 block text-sm font-semibold text-[#B4E2F2]">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B4E2F2]"
              required
            />
          </div>

          {/* Points */}
          <div className="w-full mb-4">
            <label className="mb-1 block text-sm font-semibold text-[#B4E2F2]">
              Point
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B4E2F2]"
              required
            />
          </div>

          {/* Stock */}
          <div className="w-full mb-4">
            <label className="mb-1 block text-sm font-semibold text-[#B4E2F2]">
              Stock
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B4E2F2]"
              required
            />
          </div>

          {/* Description */}
          <div className="w-full mb-4">
            <label className="mb-1 block text-sm font-semibold text-[#B4E2F2]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 rounded-xl border border-gray-200 bg-white p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B4E2F2]"
              rows="3"
              required
            />
          </div>

          {/* Upload Image */}
          <div className="w-full mb-4">
            <label className="mb-1 block text-sm font-semibold text-[#B4E2F2]">
              Upload Image
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/jpeg, image/png"
            />
            <div
              onClick={handleImageUploadClick}
              className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#B4E2F2] bg-gray-50 text-center"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <>
                  <FaImage className="h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-xs text-gray-400">
                    Format: .jpg / .png (Max 5MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="mt-6 flex w-full justify-center">
            <button
              type="submit"
              className="w-full max-w-xs rounded-full bg-[#FF89AC] py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-[#FCAFC1]"
            >
              Add
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddItemPage;
