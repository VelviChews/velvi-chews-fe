// src/components/SignUpPage.jsx
import React, { useState } from "react";
import Logo from "../assets/Logo.png";
import WaveTop from "../assets/upperwave.png";
import WaveBottom from "../assets/bottomwave.png";

const ForgetPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [email, setEmail] = useState("");

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
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage(
          "✅ If the email is registered, a password reset link has been sent."
        );
        setEmail("");
      } else {
        setMessage("❌ Failed to send reset email. Please try again.");
      }
    } catch (error) {
      setMessage(`❌ Error connecting to server: ${error.message}`);
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
            Forget Password
          </h2>

          <input
            type="email"
            name="email"
            placeholder="Input your email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-xl border-0 bg-[#FCAFC1]/50 p-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#FF89AC]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-full bg-[#FF89AC] py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-[#FCAFC1] disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm font-semibold text-gray-600">
            {message}
          </p>
        )}

        <p className="mt-4 text-center text-sm">
          <span className="text-gray-500 font-semibold">
            Already have an account?{" "}
          </span>
          <a href="/" className="font-semibold text-[#FF89AC] hover:underline">
            Sign in here
          </a>
        </p>
      </form>

      <img
        src={WaveBottom}
        alt="Bottom wave"
        className="absolute bottom-0 left-0 w-full"
      />
    </div>
  );
};

export default ForgetPasswordPage;
