import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

function ProctedRoute() {
  const { authLoading, users } = useAuth();

  // console.log("authLoading:", authLoading);
  // console.log("users:", users);

  if (authLoading) {
    return (
      <div className="loader-container">
        <div className="loader-wrapper">
          {/* Main Spinner */}
          <div className="loader-spinner">
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
          </div>

          {/* Brand Logo */}
          <div className="loader-logo">
            <svg
              className="loader-icon"
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

          {/* Loading Text with Dots */}
          <div className="loader-text-wrapper">
            <span className="loader-text">Loading</span>
            <span className="loader-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="loader-progress-bar">
            <div className="loader-progress-fill"></div>
          </div>

          {/* Optional Subtitle */}
          <p className="loader-subtitle">Preparing your interview experience</p>
        </div>
      </div>
    );
  }

  // If no user, redirect away from private pages
  if (!users) {
    return <Navigate to="/login" replace />;
  }

  // Renders whatever child route the user is trying to visit
  return <Outlet />;
}

export default ProctedRoute;
