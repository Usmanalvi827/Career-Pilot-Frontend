// RegisterPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { loading, setLoading, handleRegister } = useAuth();

  const submitBtnHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    let firstname = e.target.firstname.value.trim();
    let lastname = e.target.lastname.value.trim();
    let username = e.target.username.value.trim();
    let email = e.target.email.value.trim();
    let password = e.target.password.value;

    if (!firstname || !lastname || !username || !email || !password) {
      toast.error("Please fill in all required fields.");
      setLoading(false); // Reset loading state
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const data = await handleRegister({
        firstname,
        lastname,
        username,
        email,
        password,
      });
      toast.success(data.message || "Registration successful!");
      navigate("/");
    } catch (error) {
      // Safely extract professional backend messages
      const backendMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-container">
      <div className="register-card">
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
          <p className="brand-subtitle">
            Start your AI-powered interview journey
          </p>
        </div>

        {/* Welcome Text */}
        <div className="welcome-area">
          <h2 className="welcome-title">Create Account 🚀</h2>
          <p className="welcome-subtitle">
            Join thousands of successful candidates
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={(e) => submitBtnHandler(e)} className="register-form">
          {/* Full Name Field */}
          <div className="form-group">
            <label htmlFor="firstname" className="form-label">
              First Name
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <input
                name="firstname"
                type="text"
                id="firstname"
                placeholder="John"
                className="form-input"
              />
            </div>
          </div>

          {/* Last Name Field */}
          <div className="form-group">
            <label htmlFor="lastname" className="form-label">
              Last Name
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <input
                name="lastname"
                type="text"
                id="lastname"
                placeholder="Doe"
                className="form-input"
              />
            </div>
          </div>

          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
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
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"
                />
              </svg>
              <input
                name="username"
                type="text"
                id="username"
                placeholder="johndoe123"
                className="form-input"
              />
            </div>
          </div>

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
            <label htmlFor="password" className="form-label">
              Password
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                name="password"
                type="password"
                id="password"
                placeholder="Create a strong password"
                className="form-input"
              />
            </div>
            <div className="password-hint">
              <span>Must be at least 8 characters</span>
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
                <span className="button-text">Creating Account...</span>
              </>
            ) : (
              <span className="button-text">Create Account</span>
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="signin-text">
          Already have an account?{" "}
          <Link to={"/login"} className="signin-link">
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
}
