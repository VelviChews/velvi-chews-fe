// src/components/SplashScreen.jsx

import React from 'react';
import Logo from '../assets/Logo.png'; // Sesuaikan nama file logomu
import WaveTop from '../assets/upperwave.png'; // Sesuaikan nama file hiasan atas
import WaveBottom from '../assets/bottomwave.png'; // Sesuaikan nama file hiasan bawah

const SplashScreen = () => {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white">
      
      <img
        src={WaveTop}
        alt="Top wave decoration"
        className="absolute top-0 left-0 w-full"
      />

      <div className="z-10">
        <img
          src={Logo}
          alt="Velvi Chews Logo"
          className="w-48 animate-pulse" 
        />
      </div>

      <img
        src={WaveBottom}
        alt="Bottom wave decoration"
        className="absolute bottom-0 left-0 w-full"
      />

    </div>
  );
};

export default SplashScreen;