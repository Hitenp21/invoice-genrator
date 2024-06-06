import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigator = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/login", { formData });
      const { token } = response.data;
      const expiryTime = new Date().getTime() + 3600 * 1000;

      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiry", expiryTime);

      console.log(response);
      toast.success("Login successful!");

      navigator("/user/dashboard");
    } catch (error) {
      toast.error("Login failed. Please try again.");

      console.error("Login failed:", error);
    }
  };

  return (
    <div className="back w-full">
      <div className="container">
        <div className="form-container">
          <div className="logo flex justify-center">
            <img
              className="mx-auto w-auto h-20"
              src="/images/logo1.png"
              alt="Company Logo"
            />
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">
                Password
                <div className="flex justify-end">
                  <a
                    className="text-blue-500 hover:underline"
                    onClick={()=>navigator('/forgot-password')}
                  >
                    Forgot Password?
                  </a>
                </div>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="btn">
              <button type="submit">Login</button>
            </div>
          </form>
          <div className="signup-link">
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
