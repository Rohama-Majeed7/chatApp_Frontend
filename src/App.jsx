import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingPage from "./pages/SettingPage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import { useThemeStore } from "./store/useThemeStore";
import ForgetPassword from "./pages/ForgetPassword";
import ResetForgetPassword from "./pages/ResetForgetPassword";
const App = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  console.log("onlineUsers", onlineUsers);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log("authUser", authUser);
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/settings"
          element={authUser ? <SettingPage /> : <Navigate to={"/login"} />}
        />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route
          path="/reset-password/:token"
          element={<ResetForgetPassword />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
