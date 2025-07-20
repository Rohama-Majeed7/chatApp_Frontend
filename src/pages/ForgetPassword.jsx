// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { axiosInstance } from "../lib/AxiosComp";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axiosInstance.post("/auth/forget-password", { email });
      setMessage(res.data.message || "Reset email sent!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center">Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Send Reset Link
            </button>
          </form>
          {message && (
            <div className="mt-4 text-center text-sm text-white">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
