import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import api from "../api";
import { toast } from "react-toastify";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/signup", { formData })
      .then((res)=>{
        toast.success("Account created successfully");
      }).catch((err)=>{
        toast.error(`Error! ${err.response.data.message}`);
      }); 

      navigate("/login");
    } catch (error) {
      toast.error("Sign up failed. Please try again.");
      console.error("Sign up failed:", error);
    }
  };

  return (
    <div className="back w-full">
      <div className="container ">
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="logo flex justify-center">
            <img
              className="mx-auto w-auto h-20"
              src="/images/logo1.png"
              alt="Company Logo"
            />
          </div>
          <h2>Sign Up</h2>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
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
            <label htmlFor="password">Password</label>
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
            <button type="submit">Sign Up</button>
          </div>
          <div className="login-link">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
