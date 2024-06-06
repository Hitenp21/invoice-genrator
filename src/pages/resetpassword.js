import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();
    const paramsOtp = searchParams.get('otp');
    const paramsEmail = decodeURIComponent(searchParams.get('email'));
    const storedOtp = localStorage.getItem('otp');
    const otpGenerationTime = parseInt(localStorage.getItem('otpGenerationTime'), 10);

    // Check if the OTP is valid and not expired
    if (otp === paramsOtp && otp === storedOtp && isOTPValid(otpGenerationTime)) {
     
        api.post(`api/update-password?email=${paramsEmail}&newPassword=${newPassword}`)
        .then((response) => {
        alert(response.data.message);
        navigate("/login");
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
    } else {
      alert("Invalid OTP");
    }
  };

  const isOTPValid = (otpGenerationTime) => {
    const expirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const currentTime = Date.now();
    return currentTime - otpGenerationTime <= expirationTime;
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
            <form className="login-form" onSubmit={handleResetPassword}>
              <h2>Confirm OTP & Reset Password</h2>
              <div className="input-group">
                <label htmlFor="email">OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                 type="password"
                 placeholder="Enter new password"
                 value={newPassword}
                 onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="btn">
                <button type="submit">Reset Password</button>
              </div>
            </form>
            {/* <div className="signup-link">
              <p>
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
