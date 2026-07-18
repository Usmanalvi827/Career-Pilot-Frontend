import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { toast } from "react-toastify";

export default function LoginPage() {
 const navigate = useNavigate()
  const { users, loading, setLoading, handleLogin } = useAuth();

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    setLoading(true);

    let email = e.target.email.value;
    let password = e.target.password.value;

    if (email === "" || password === "") {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const data = await handleLogin({
        email,
        password,
      });

      toast.success(data.message || "Login Successfully!");
      navigate("/")
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "An Unexpected Error!";
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
      <div className="login-card">
        {/* Brand / Logo Area */}
        <div className="brand-area">
          <div className="logo-wrapper">
            <svg
              className="logo-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h1 className="brand-title">InterviewAI</h1>
          <p className="brand-subtitle">Ace your next interview with AI</p>
        </div>

        {/* Welcome Text */}
        <div className="welcome-area">
          <h2 className="welcome-title">Welcome Back 👋</h2>
          <p className="welcome-subtitle">
            Sign in to continue your interview preparation
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={(e) => handleSubmitForm(e)} className="login-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
              <input
                name="email"
                type="email"
                id="email"
                placeholder="you@example.com"
                className="form-input"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div className="password-header">
              <label htmlFor="password" className="form-label">
                Password
              </label>
            </div>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                name="password"
                type="password"
                id="password"
                placeholder="••••••••"
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`register-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span className="button-text">Logging in...</span>
              </>
            ) : (
              <span className="button-text">Log In</span>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="signup-text">
          Don't have an account?{" "}
          <Link to={"/register"} className="signup-link">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
