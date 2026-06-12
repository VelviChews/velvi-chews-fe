// src/components/SignUpPage.jsx
import React, { useState } from "react";
import Logo from "../assets/Logo.png";
import WaveTop from "../assets/upperwave.png";
import WaveBottom from "../assets/bottomwave.png";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !newPassword) {
      setMessage("❌ Token or password is missing");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Password updated successfully. Please login.");
        setNewPassword(""); // ✅ reset yang benar

        setTimeout(() => {
          navigate("/"); // atau '/login' sesuai routing kamu
        }, 1000);
      } else {
        setMessage(`❌ ${data.detail || "Reset password failed"}`);
      }
    } catch (error) {
      setMessage(`❌ Error connecting to server`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-start overflow-hidden bg-white">
      <img
        src={WaveTop}
        alt="Top wave"
        className="absolute top-0 left-0 w-full"
      />

      <form
        onSubmit={handleSubmit}
        className="z-10 mt-16 flex w-full max-w-xs flex-col items-center p-4 sm:max-w-sm md:mt-20"
      >
        <img src={Logo} alt="Velvi Chews Logo" className="mb-3 w-28" />

        <div className="w-full rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-[#FCAFC1]">
            Reset Password
          </h2>

          <input
            type="password"
            placeholder="Input new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-6 w-full rounded-xl border-0 bg-[#FCAFC1]/50 p-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#FF89AC]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-full bg-[#FF89AC] py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-[#FCAFC1] disabled:opacity-50"
        >
          {loading ? "Reset Password..." : "Reset Password"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm font-semibold text-gray-600">
            {message}
          </p>
        )}
      </form>

      <img
        src={WaveBottom}
        alt="Bottom wave"
        className="absolute bottom-0 left-0 w-full"
      />
    </div>
  );
};

export default ResetPasswordPage;
