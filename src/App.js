import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import api from "./api";
import SendEmail from "./pages/sendEmail";
import ResetPassword from "./pages/resetpassword";
// require('dotenv').config()
const verifyToken = async (token) => {
  try {
    const response = await api.post("/verify-token", { token });
    return response.data.valid;
  } catch (error) {
    return false;
  }
};

const isTokenExpired = () => {
  const expiryTime = localStorage.getItem("tokenExpiry");
  if (!expiryTime) return true;
  return new Date().getTime() > expiryTime;
};

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkToken = async () => {
      const currentPath = window.location.pathname;

      if (currentPath === "/signup" || currentPath === "/forgot-password" || currentPath === "/verify-otp") return;
  
      if (!token || isTokenExpired()) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        navigate("/login");
      } else {
        const isValid = await verifyToken(token);
        if (!isValid) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          navigate("/login");
        }
      }
    };
  
    checkToken();
  
    const intervalId = setInterval(() => {
      if (isTokenExpired()) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        navigate("/login");
      }
    }, 60000); // Check every minute
  
    return () => clearInterval(intervalId);
  }, [token, navigate]);

  return (
    <>
      <ToastContainer
        position="top-right"
        closeButton={false}
        autoClose={3000}
      />
     
      <Routes>
        <Route path="/user/*" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<SendEmail />} />
        <Route path="/verify-otp" element={<ResetPassword />} />


        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
