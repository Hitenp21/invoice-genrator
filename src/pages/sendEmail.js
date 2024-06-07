// ForgotPassword.js
import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";

const SendEmail = () => {
  const [email, setEmail] = useState("");
  const sendResetEmail = (e) => {
    e.preventDefault();
    const otp = generateOTP(); // Generate a random OTP
    const otpGenerationTime = Date.now(); // Get the current timestamp

    // Store the OTP and generation time in localStorage
    localStorage.setItem('otp', otp);
    localStorage.setItem('otpGenerationTime', otpGenerationTime);
    const templateParams = {
      email: email,
      otp: otp,
      reset_link: `http://192.168.1.198:3000/verify-otp?otp=${otp}&email=${encodeURIComponent(email)}`,
    };

    emailjs
      .send(
        "service_cpdddmg",
        "template_5apwzso",
        templateParams,
        "RBNtkp8fGkxzUoUbx"
      )
      .then(
        (response) => {
          alert("Password reset email sent!");
        },
        (err) => {
          console.error("FAILED...", err);
          alert("Failed to send email.");
        }
      );
  };

 const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  return (
    <>
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
            <form className="login-form" onSubmit={sendResetEmail}>
              <h2>Login</h2>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="btn">
                <button type="submit">Send Email</button>
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
    </>
  );
};

export default SendEmail;
