import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaCrown, FaHistory, FaUser } from 'react-icons/fa';
import { IoScan } from "react-icons/io5";

const Navbar = () => {
  const getLinkClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 transition-colors duration-200 ${isActive ? 'text-[#FF89AC]' : 'text-gray-300'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full h-24">
      {/* Background with shadow */}
      <div className="absolute -bottom-10 h-30 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-2xl"></div>

      {/* Navigation Links */}
      <div className="relative flex h-full items-center justify-around">

        {/* Left Links */}
        <NavLink to="/home" className={getLinkClass}>
          <FaHome className="h-6 w-6" />
          <span className="text-xs font-medium">Home</span>
        </NavLink>
        <NavLink to="/membership" className={getLinkClass}>
          <FaCrown className="h-6 w-6" />
          <span className="text-xs font-medium">Membership</span>
        </NavLink>

        {/* Spacer for the center button */}
        <div className="w-16"></div>

        {/* Right Links */}
        <NavLink to="/history" className={getLinkClass}>
          <FaHistory className="h-6 w-6" />
          <span className="text-xs font-medium">History</span>
        </NavLink>
        <NavLink to="/profile" className={getLinkClass}>
          <FaUser className="h-6 w-6" />
          <span className="text-xs font-medium">Profile</span>
        </NavLink>
      </div>

      {/* Center Scan Button — navigates to /scan */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
        <NavLink to="/scan">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#FF89AC] text-white shadow-md active:scale-95 transition-transform">
            <IoScan className="h-8 w-8" />
          </div>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;