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
import ResetPasswordPage from "./components/ResetPasswordPage";
import ForgetPasswordPage from "./components/ForgetPasswordPage";
import ScanPage from "./pages/ScanPage";
import AdminQRPage from "./pages/AdminQRPage";
import AdminRedeemItemsPage from "./pages/AdminRedeemItemsPage";

function App() {
  const [showSplash, setShowSplash] = useState(false);

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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/redeem" element={<RedeemPage />} />
          <Route path="redeem/:itemId" element={<ItemDetailPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/account-info" element={<AccountInfoPage />} />
          <Route path="/profile/add-item" element={<AddItemPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/admin/qr" element={<AdminQRPage />} />
          <Route
            path="/profile/redeem-items"
            element={<AdminRedeemItemsPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
