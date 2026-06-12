import React, { useState } from 'react';
import Logo from '../assets/Logo.png';
import BubblixLogo from '../assets/bubblixlogo.png';
import WaveTop from '../assets/upperwave.png';
import WaveBottom from '../assets/bottomwave.png';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('✅ Registration successful! Please check your email to verify your account.');
        setFormData({ name: '', email: '', password: '' });

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        const errorData = await response.json();
        setMessage(`❌ Registration failed. Please complete all required fields.`);
      }
    } catch (error) {
      setMessage(`❌ Error connecting to server: ${error.message}`);
    } finally {
      setLoading(false);
    }  
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-start overflow-hidden bg-white">
      <img src={WaveTop} alt="Top wave" className="absolute top-0 left-0 w-full" />

      <form
        onSubmit={handleSubmit}
        className="z-10 mt-12 flex w-full max-w-xs flex-col items-center p-4 sm:max-w-sm md:mt-16"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <img
            src={BubblixLogo}
            alt="Bubblix Logo"
            className="h-18 w-auto object-contain"
          />
          <img src={Logo} alt="Velvi Chews Logo" className="w-28" />
          
        </div>


        <div className="w-full rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-[#FCAFC1]">Sign Up</h2>

          <input
            type="text"
            name="name"
            placeholder="Input your name here"
            value={formData.name}
            onChange={handleChange}
            className="mb-4 w-full rounded-xl border-0 bg-[#FCAFC1]/50 p-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#FF89AC]"
          />

          <input
            type="email"
            name="email"
            placeholder="Input your email here"
            value={formData.email}
            onChange={handleChange}
            className="mb-4 w-full rounded-xl border-0 bg-[#FCAFC1]/50 p-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#FF89AC]"
          />

          <input
            type="password"
            name="password"
            placeholder="Input your password here"
            value={formData.password}
            onChange={handleChange}
            className="mb-6 w-full rounded-xl border-0 bg-[#FCAFC1]/50 p-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#FF89AC]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-full bg-[#FF89AC] py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-[#FCAFC1] disabled:opacity-50"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm font-semibold text-gray-600">
            {message}
          </p>
        )}

        <p className="mt-4 text-center text-sm">
          <span className="text-gray-500 font-semibold">Already have an account? </span>
          <a href="/login" className="font-semibold text-[#FF89AC] hover:underline">
            Sign in here
          </a>
        </p>
      </form>

      <img src={WaveBottom} alt="Bottom wave" className="absolute bottom-0 left-0 w-full" />
    </div>
  );
};

export default SignUpPage;