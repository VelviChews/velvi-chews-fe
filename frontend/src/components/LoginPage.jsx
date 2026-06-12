import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
// FIX: Import logo Bubblix
import BubblixLogo from '../assets/bubblixlogo.png';
import WaveTop from '../assets/upperwave.png';
import WaveBottom from '../assets/bottomwave.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Baca body sebagai text dulu, lalu parse — aman jika body kosong
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.detail || `Login gagal (${response.status})`);
      }

      localStorage.setItem('token', data.access_token);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Gagal terhubung ke server.');
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-start overflow-hidden bg-white">
      <img src={WaveTop} alt="Top wave decoration" className="absolute top-0 left-0 w-full" />

      <div className="z-10 mt-16 flex w-full max-w-xs flex-col items-center p-4 sm:max-w-sm md:mt-20">

        <div className="flex items-center justify-center gap-4 mb-6">
          <img src={Logo} alt="Velvi Chews Logo" className="w-28" />

        </div>

        <form onSubmit={handleLogin} className="w-full rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-[#FCAFC1]">Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-xl border-0 bg-[#FCAFC1]/50 p-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#FF89AC]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 w-full rounded-xl border-0 bg-[#FCAFC1]/50 p-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#FF89AC]"
          />

          {error && <p className="text-red-500 text-center mb-3">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-[#FF89AC] py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-[#FCAFC1]"
          >
            Login
          </button>
          <p className="mt-6 text-center text-sm">
            <span className="text-gray-500 font-semibold">Forget Your Password? </span>
            <a href="/forget-password" className="font-semibold text-[#FF89AC] hover:underline">
              Forget Password
            </a>
          </p>
        </form>

        <p className="mt-6 text-center text-sm">
          <span className="text-gray-500 font-semibold">Don't have an account? </span>
          <a href="/signup" className="font-semibold text-[#FF89AC] hover:underline">
            Sign up here
          </a>
        </p>
      </div>

      <img src={WaveBottom} alt="Bottom wave decoration" className="absolute bottom-0 left-0 w-full" />
    </div>
  );
};

export default LoginPage;