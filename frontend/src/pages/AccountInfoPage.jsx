import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { FaPencilAlt } from 'react-icons/fa';
import DefaultAvatar from '../assets/default-avatar.png';

const AccountInfoPage = () => {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [imagePreview, setImagePreview] = useState(DefaultAvatar);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // 🧠 Ambil token user dari localStorage
    const token = localStorage.getItem('token');

    // === GET /users/me ===
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch profile');
                const data = await res.json();

                setName(data.name || '');
                setEmail(data.email || '');
                setImagePreview(data.avatar_url || DefaultAvatar);
            } catch (err) {
                console.error(err);
                alert('Gagal memuat data profil.');
            }
        };

        if (token) fetchProfile();
    }, [API_URL, token]);

    // === Ubah foto preview ===
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditClick = () => {
        fileInputRef.current.click();
    };

    // === PUT /users/me ===
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', name);
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const res = await fetch(`${API_URL}/users/me`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to update profile');

            const data = await res.json();
            alert('Profile updated successfully!');
            setImagePreview(data.avatar_url || DefaultAvatar);
            navigate(-1);
        } catch (err) {
            console.error(err);
            alert('Gagal memperbarui profil.');
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-white pb-24">
            <header className="relative w-full px-4 pt-5 pb-16">
                <div className="relative flex items-center justify-center">
                    <button onClick={() => navigate(-1)} className="absolute left-0">
                        <IoChevronBack className="h-6 w-6 text-[#B4E2F2]" />
                    </button>
                    <h1 className="text-xl font-bold text-[#B4E2F2]">Account Information</h1>
                </div>
            </header>

            <div className="absolute bottom-15 left-0 -z-0 h-3/4 w-full rounded-t-[50px] bg-[#B4E2F2]"></div>

            <main className="relative z-10 -mt-12 flex flex-col items-center gap-6 px-6">
                {/* Foto Profil */}
                <div className="relative">
                    <img
                        src={imagePreview}
                        alt="Profile"
                        className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg"
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
                        className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#FF89AC] text-white shadow-md transition-transform hover:scale-110"
                        aria-label="Change profile photo"
                    >
                        <FaPencilAlt size={14} />
                    </button>
                </div>

                {/* Form Section */}
                <form onSubmit={handleUpdate} className="w-full max-w-sm">
                    <div className="w-full mb-4">
                        <label className="mb-1 block text-sm font-medium text-white">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border-0 bg-white p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF89AC]"
                        />
                    </div>

                    <div className="w-full">
                        <label className="mb-1 block text-sm font-medium text-white">Email</label>
                        <input
                            type="email"
                            value={email}
                            readOnly
                            className="w-full cursor-not-allowed rounded-xl border-0 bg-gray-200 p-4 text-gray-500 shadow-sm"
                        />
                    </div>

                    <div className="mt-8 flex w-full justify-center">
                        <button
                            type="submit"
                            className="w-full max-w-xs rounded-full bg-[#FF89AC] py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-[#FCAFC1]"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AccountInfoPage;
