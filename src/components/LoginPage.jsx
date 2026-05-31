import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png'; 
import WaveTop from '../assets/upperwave.png'; 
import WaveBottom from '../assets/bottomwave.png'; 

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');

  const handleLogin = () => {
    if (onLogin) onLogin(username || 'anonymous');
    navigate('/home');
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-start overflow-hidden bg-white">
      
      <img
        src={WaveTop}
        alt="Top wave decoration"
        className="absolute top-0 left-0 w-full"
      />

      <div className="z-10 mt-16 flex w-full max-w-xs flex-col items-center p-4 sm:max-w-sm md:mt-20">
        <img
          src={Logo}
          alt="Velvi Chews Logo"
          className="mb-3 w-32"
        />

        <div className="w-full rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-[#FCAFC1]">Login</h2>
          
          <input
            type="text"
            placeholder="Input your username here"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 w-full rounded-xl border-0 bg-[#FCAFC1]/50 p-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#FF89AC]"
          />
          
          <input
            type="password"
            placeholder="Input your password here"
            className="mb-6 w-full rounded-xl border-0 bg-[#FCAFC1]/50 p-4 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#FF89AC]"
          />
        </div>

        <button
          onClick={handleLogin}
          className="mt-6 w-full rounded-full bg-[#FF89AC] py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-[#FCAFC1]"
        >
          Login
        </button>

        <p className="mt-6 text-center text-sm">
          <span className="text-gray-500 font-semibold">Don't have an account? </span>
          <a href="/signup" className="font-semibold text-[#FF89AC] hover:underline">
            Sign up here
          </a>
        </p>
      </div>

      <img
        src={WaveBottom}
        alt="Bottom wave decoration"
        className="absolute bottom-0 left-0 w-full"
      />
    </div>
  );
};

export default LoginPage;
