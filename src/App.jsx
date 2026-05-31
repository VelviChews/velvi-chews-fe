import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SplashScreen from "./components/SplashScreen";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import HomePage from "./pages/HomePage";
import MembershipPage from "./pages/MembershipPage";
import RedeemPage from "./pages/RedeemPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import AccountInfoPage from "./pages/AccountInfoPage";
import AddItemPage from "./pages/AddItemPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import { useTracker } from "./hooks/useTracker";

function AppRoutes({ user, onLogin }) {
  useTracker(user);
  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={onLogin} />} />
      <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/membership" element={<MembershipPage />} />
      <Route path="/redeem" element={<RedeemPage />} />
      <Route path="redeem/:itemId" element={<ItemDetailPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/account-info" element={<AccountInfoPage />} />
      <Route path="/profile/add-item" element={<AddItemPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
    </Routes>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [user, setUser] = useState(() => localStorage.getItem("analyticsUser") || null);

  useEffect(() => {
    const splashShown = localStorage.getItem("splashShown");
    if (!splashShown) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        localStorage.setItem("splashShown", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogin = (username) => {
    const name = username || "anonymous";
    setUser(name);
    localStorage.setItem("analyticsUser", name);
  };

  if (showSplash) {
    return (
      <div className="mx-auto min-h-screen max-w-md border shadow-lg">
        <SplashScreen />
      </div>
    );
  }

  return (
    <Router>
      <div className="mx-auto min-h-screen max-w-md border shadow-lg">
        <AppRoutes user={user} onLogin={handleLogin} />
      </div>
    </Router>
  );
}

export default App;
