import React, { useEffect, useRef, useState } from "react";
import { useInterview } from "../hook/useInterview";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/hook/useAuth";
import { toast } from "react-toastify";
import { getAllInterviewReportByTitle } from "../services/interviewApi";

function DashboardPage() {
  const [selfDes, setSelfDes] = useState("");
  const [jobfDes, setJobfDes] = useState("");
  const [resume, setResume] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const { users } = useAuth();

  const {
    loading,
    setLoading,
    report,
    setReport,
    handleGenerateReport,
    setReportTitle,
    reportTitle,
  } = useInterview();

  useEffect(() => {
    const getInterviewReportTitle = async () => {
      try {
        const res = await getAllInterviewReportByTitle();

        // FIX (simple explanation): we don't know for 100% sure what key
        // the backend puts the list of reports under. Before, this line
        // assumed it was always `res.interviewReport`. If that key doesn't
        // exist, `setReportTitle` would get `undefined`, and later
        // `reportTitle.map(...)` in the JSX would crash the whole page.
        //
        // Fix: check a couple of likely key names, and if none match,
        // fall back to an empty array `[]` instead of `undefined`.
        // An empty array is always safe to `.map()` over.
        const reportsList = res?.interviewReport || res?.interviewReports || [];

        setReportTitle(reportsList);
      } catch (error) {
        console.log(error);
        // FIX: even if the request fails, still set an empty array so the
        // page doesn't break.
        setReportTitle([]);
      }
    };

    getInterviewReportTitle();
  }, []);

  // Function to get user initials
  // FIX: the backend didn't used to send back firstname/lastname from
  // /get-me, so `users.name` (which never even existed) was always
  // falsy and this silently fell back to email initials every time.
  // Now that the backend returns firstname/lastname, we use those first.
  const getUserInitials = () => {
    if (!users) return "JD";

    if (users.firstname && users.lastname) {
      return `${users.firstname[0]}${users.lastname[0]}`.toUpperCase();
    }

    if (users.username) {
      return users.username.substring(0, 2).toUpperCase();
    }

    if (users.email) {
      return users.email.substring(0, 2).toUpperCase();
    }

    return "JD";
  };

  const handleFileChange = () => {
    const file = fileInputRef.current?.files[0];
    if (file) {
      setResume(file);
      console.log("Stored file:", file.name);
    }
  };

  const handleGenerateReportBtn = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selfDes || !jobfDes || !resume) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await handleGenerateReport({
        resume,
        selfDescription: selfDes,
        jobDescription: jobfDes,
      });

      // FIX: use `?.` (optional chaining) so that if `interviewReport` is
      // ever missing from the response, this doesn't crash the whole app —
      // it just becomes `undefined` instead, and we handle that below.
      const newReportId = response?.interviewReport?._id;

      if (!newReportId) {
        console.log("Unexpected response shape:", response);
        toast.error("Something went wrong generating your report.");
        setLoading(false);
        return;
      }

      setReport(response);
      navigate(`/interview/${newReportId}`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#10b981";
      case "In Progress":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  // Function to get status background
  const getStatusBg = (status) => {
    switch (status) {
      case "Completed":
        return "rgba(16, 185, 129, 0.08)";
      case "In Progress":
        return "rgba(245, 158, 11, 0.08)";
      default:
        return "rgba(107, 114, 128, 0.08)";
    }
  };

  // FIX: this is the simplest, safest fix for the crash. `reportTitle`
  // starts out as `undefined` (or whatever the context's default is) until
  // the useEffect above finishes fetching. Calling `.map()` directly on
  // `undefined` crashes immediately. So we make a safe version here that is
  // always an array, and use THIS everywhere below instead of `reportTitle`.
  const safeReportTitle = reportTitle || [];

  return (
    <main className="dashboard-container">
      <div className="dashboard-card">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">🎯 Interview Preparation</h1>
            <p className="dashboard-subtitle">
              Upload your resume, add self-description, and job description to
              get AI-powered interview questions
            </p>
          </div>
          <div className="header-right">
            <div className="user-avatar">
              <span>{getUserInitials()}</span>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form className="dashboard-form">
          {/* Resume Upload Section */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <svg
                  className="icon-svg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="section-title">Upload Resume</h2>
                <p className="section-subtitle">
                  Upload your resume in PDF format
                </p>
              </div>
            </div>

            <div className="upload-area">
              <input
                type="file"
                id="resume"
                accept=".pdf"
                className="file-input"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <label htmlFor="resume" className="upload-label">
                <div className="upload-content">
                  <svg
                    className="upload-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div className="upload-text">
                    <span className="upload-main-text">
                      {resume
                        ? resume.name
                        : "Drop your resume here or click to browse"}
                    </span>
                    <span className="upload-sub-text">
                      {resume
                        ? `${(resume.size / 1024).toFixed(0)} KB`
                        : "Supports PDF files (Max 5MB)"}
                    </span>
                  </div>
                  {resume && (
                    <button
                      type="button"
                      className="remove-file"
                      onClick={(e) => {
                        e.stopPropagation();
                        setResume(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <svg
                        className="remove-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </label>
              {resume && (
                <div className="upload-success">
                  <svg
                    className="success-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Resume uploaded successfully</span>
                </div>
              )}
            </div>
          </div>

          {/* Self Description Section */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <svg
                  className="icon-svg"
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
              </div>
              <div>
                <h2 className="section-title">Self Description</h2>
                <p className="section-subtitle">
                  Tell us about yourself, your experience, and career goals
                </p>
              </div>
            </div>

            <div className="textarea-wrapper">
              <textarea
                value={selfDes}
                onChange={(e) => setSelfDes(e.target.value)}
                id="selfDescription"
                placeholder="Describe yourself, your skills, experience, and what you're looking for in your career..."
                className="job-textarea"
                rows="6"
              />
              <div className="textarea-footer">
                <span className="char-count">{selfDes.length} characters</span>
                <span className="textarea-hint">
                  Tip: Be specific about your achievements and goals
                </span>
              </div>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <svg
                  className="icon-svg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h2 className="section-title">Job Description</h2>
                <p className="section-subtitle">
                  Paste the job description you're applying for
                </p>
              </div>
            </div>

            <div className="textarea-wrapper">
              <textarea
                value={jobfDes}
                onChange={(e) => setJobfDes(e.target.value)}
                id="jobDescription"
                placeholder="Paste the complete job description here..."
                className="job-textarea"
                rows="6"
              />
              <div className="textarea-footer">
                <span className="char-count">{jobfDes.length} characters</span>
                <span className="textarea-hint">
                  Tip: Include as much detail as possible for better AI
                  responses
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              type="submit"
              onClick={handleGenerateReportBtn}
              className={`btn-primary ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Generating Questions...</span>
                </>
              ) : (
                <>
                  <svg
                    className="btn-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate Report & Interview Questions
                </>
              )}
            </button>
          </div>
        </form>

        {/* User Reports Section */}
        <div className="user-reports-section">
          <div className="reports-header">
            <div className="reports-header-left">
              <svg
                className="reports-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              </svg>
              <div>
                <h2 className="reports-title">Your Interview Reports</h2>
                <p className="reports-subtitle">
                  View all your generated interview analysis reports
                </p>
              </div>
            </div>
          </div>

          <div className="reports-grid">
            {safeReportTitle.map((report) => {
              const jobTitle =
                report.jobDescription?.match(/Position:\s*(.*)/)?.[1] ||
                "Unknown Position";

              const company =
                report.jobDescription?.match(/Company:\s*(.*)/)?.[1] ||
                "Unknown Company";

              return (
                <div key={report._id} className="report-card">
                  <div className="report-card-header">
                    <div>
                      <h3 className="report-job-title">{jobTitle}</h3>
                      <p className="report-company">{company}</p>
                    </div>

                    <div className="report-match-score">
                      <span className="match-percentage">
                        {report.matchScore}%
                      </span>
                      <span className="match-label">Match</span>
                    </div>
                  </div>

                  <div className="report-card-footer">
                    <button
                      className="view-report-btn"
                      onClick={() => navigate(`/interview/${report._id}`)}
                    >
                      View Report
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {safeReportTitle.length === 0 && (
            <div className="no-reports">
              <svg
                className="no-reports-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3>No Reports Yet</h3>
              <p>
                Generate your first interview report to see the results here
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;
