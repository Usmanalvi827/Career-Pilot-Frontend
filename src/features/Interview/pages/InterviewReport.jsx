// InterviewPage.jsx
import React, { useEffect, useState } from "react";
import { useInterview } from "../hook/useInterview";
import { useParams } from "react-router-dom";
import { getInterviewReportById, getResumePdf } from "../services/interviewApi";

function InterviewPage() {
  const [activeTab, setActiveTab] = useState("technical");
  const { report, loadReport, setLoadReport } = useInterview();
  const { interviewId } = useParams();

  // FIX: compute interviewid safely, BEFORE it's used anywhere, and guard
  // against interviewId being undefined on first render.
  const interviewid = interviewId ? interviewId.replace(/:/g, "") : "";

  // Simple loading flag so the page can show "Loading..." instead of a
  // confusing flash of 0s/empty sections while the fetch is in progress.
  const [isFetching, setIsFetching] = useState(true);

  // Tracks whether the tailored resume PDF is currently being generated/downloaded.
  const [isDownloadingResume, setIsDownloadingResume] = useState(false);

  // Calls the backend to generate a tailored resume PDF for this report,
  // then triggers a normal browser file download.
  const handleDownloadResume = async () => {
    if (!interviewid) return;

    setIsDownloadingResume(true);
    try {
      const pdfBlob = await getResumePdf({ interviewId: interviewid });

      // Turn the blob into a temporary URL the browser can download from
      const blobUrl = window.URL.createObjectURL(pdfBlob);

      // Create an invisible link, "click" it to start the download, then clean up
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download tailored resume:", err);
    } finally {
      setIsDownloadingResume(false);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      if (!interviewid) {
        setIsFetching(false);
        return;
      }

      setIsFetching(true);
      try {
        const res = await getInterviewReportById({ interviewId: interviewid });
        setLoadReport(res);
      } catch (err) {
        console.error("Failed to load interview report:", err);
      } finally {
        setIsFetching(false);
      }
    };

    // FIX (the important one): this used to be
    //   if (!interviewid || loadReport) return;
    // which meant: "once we have ANY data in loadReport, never fetch again."
    // That breaks the case where you go from viewing Report A straight to
    // viewing Report B (different id in the URL) — it would just keep
    // showing Report A's old data forever, because `loadReport` was already
    // truthy from the last visit.
    //
    // Fix: always fetch again whenever `interviewid` changes. This one
    // dependency change covers all three of your scenarios:
    //   1) Redirected here right after generating a report -> fetches it.
    //   2) User refreshes the page -> context resets, but the id is still
    //      in the URL, so it fetches fresh from the API again.
    //   3) User clicks "View Report" for a different, specific report ->
    //      interviewid changes -> this effect re-runs -> fetches the new one.
    fetchReport();
  }, [interviewid]);

  // Extract the actual report data from whatever shape we were handed.
  // Backend can return the report under `interviewSingleReport` (GET by id)
  // or `interviewReport` (POST generate), or already unwrapped depending on
  // where it came from. This helper handles all of those safely.
  const unwrapReport = (payload) => {
    if (!payload) return null;
    if (payload.interviewSingleReport) return payload.interviewSingleReport;
    if (payload.interviewReport) return payload.interviewReport;
    if (payload.data?.interviewSingleReport) return payload.data.interviewSingleReport;
    if (payload.data?.interviewReport) return payload.data.interviewReport;
    if (
      payload.technicalQuestionSchema ||
      payload.behavioralQuestionSchema ||
      payload.matchScore !== undefined ||
      payload.title
    ) {
      return payload;
    }
    return null;
  };

  const unwrappedLoad = unwrapReport(loadReport);
  const unwrappedContextReport = unwrapReport(report);

  // FIX: prefer whichever unwrapped source actually matches the report
  // we're currently viewing (its `_id` matches the URL's interviewid).
  // This stops the page from briefly showing a DIFFERENT report's data
  // (e.g. leftover from context) while switching between reports.
  const interviewData =
    (unwrappedLoad && unwrappedLoad._id === interviewid ? unwrappedLoad : null) ||
    (unwrappedContextReport && unwrappedContextReport._id === interviewid
      ? unwrappedContextReport
      : null) ||
    unwrappedLoad ||
    unwrappedContextReport ||
    {};

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  // Get severity background
  const getSeverityBg = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "rgba(239, 68, 68, 0.08)";
      case "medium":
        return "rgba(245, 158, 11, 0.08)";
      case "low":
        return "rgba(16, 185, 129, 0.08)";
      default:
        return "rgba(107, 114, 128, 0.08)";
    }
  };

  // Show a simple loading state instead of flashing empty/0 content while
  // the fetch is still in progress.
  if (isFetching && !interviewData._id) {
    return (
      <main className="interview-container">
        <div className="interview-card">
          <p>Loading interview report...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="interview-container">
      <div className="interview-card">
        {/* Header */}
        <div className="interview-header">
          <div className="header-left">
            <h1 className="interview-title">🎯 Interview Analysis</h1>
            <p className="interview-subtitle">
              {interviewData.title || "Interview"} • Review questions, skill
              gaps, and preparation plan
            </p>
          </div>
          <div className="header-right">
            <div className="match-score-badge">
              <span className="score-number">
                {interviewData.matchScore || 0}%
              </span>
              <span className="score-label">Match Score</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === "technical" ? "active" : ""}`}
            onClick={() => setActiveTab("technical")}
          >
            <svg
              className="tab-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            Technical Questions
            <span className="tab-count">
              {interviewData.technicalQuestionSchema?.length || 0}
            </span>
          </button>
          <button
            className={`tab-btn ${activeTab === "behavioral" ? "active" : ""}`}
            onClick={() => setActiveTab("behavioral")}
          >
            <svg
              className="tab-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Behavioral Questions
            <span className="tab-count">
              {interviewData.behavioralQuestionSchema?.length || 0}
            </span>
          </button>
        </div>

        {/* Questions Section */}
        <div className="questions-section">
          {activeTab === "technical" && (
            <div className="questions-list">
              {interviewData.technicalQuestionSchema?.map((q, index) => (
                <div key={index} className="question-card">
                  <div className="question-header">
                    <span className="question-number">Q{index + 1}</span>
                    <h3 className="question-title">{q.Question}</h3>
                  </div>
                  <div className="question-details">
                    <div className="detail-item intention">
                      <div className="detail-label">
                        <svg
                          className="detail-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        <span>Intention</span>
                      </div>
                      <p className="detail-text">{q.intention}</p>
                    </div>
                    <div className="detail-item answer">
                      <div className="detail-label">
                        <svg
                          className="detail-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <span>Model Answer</span>
                      </div>
                      <p className="detail-text answer-text">{q.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "behavioral" && (
            <div className="questions-list">
              {interviewData.behavioralQuestionSchema?.map((q, index) => (
                <div key={index} className="question-card">
                  <div className="question-header">
                    <span className="question-number">Q{index + 1}</span>
                    <h3 className="question-title">{q.Question}</h3>
                  </div>
                  <div className="question-details">
                    <div className="detail-item intention">
                      <div className="detail-label">
                        <svg
                          className="detail-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        <span>Intention</span>
                      </div>
                      <p className="detail-text">{q.intention}</p>
                    </div>
                    <div className="detail-item answer">
                      <div className="detail-label">
                        <svg
                          className="detail-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <span>Model Answer</span>
                      </div>
                      <p className="detail-text answer-text">{q.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skill Gaps & Preparation Plan */}
        <div className="bottom-grid">
          {/* Skill Gaps */}
          <div className="skill-gaps-card">
            <div className="card-header">
              <svg
                className="card-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3>Skill Gaps</h3>
            </div>
            <div className="skill-gaps-list">
              {interviewData.skillGap?.map((gap, index) => (
                <div key={index} className="skill-gap-item">
                  <div className="gap-info">
                    <span
                      className="gap-dot"
                      style={{ background: getSeverityColor(gap.severity) }}
                    ></span>
                    <span className="gap-text">{gap.skills}</span>
                  </div>
                  <span
                    className="gap-severity"
                    style={{
                      background: getSeverityBg(gap.severity),
                      color: getSeverityColor(gap.severity),
                    }}
                  >
                    {gap.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation Plan */}
          <div className="preparation-plan-card">
            <div className="card-header">
              <svg
                className="card-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3>Preparation Plan</h3>
            </div>
            <div className="plan-list">
              {interviewData.preparationPlan?.map((plan) => (
                <div key={plan.day} className="plan-item">
                  <div className="plan-header">
                    <span className="plan-day">Day {plan.day}</span>
                    <h4 className="plan-focus">{plan.foucus}</h4>
                  </div>
                  <ul className="plan-tasks">
                    {plan.task?.map((task, idx) => (
                      <li key={idx} className="plan-task">
                        <span className="task-bullet"></span>
                        <span className="task-text">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>


          <button
              onClick={handleDownloadResume}
              disabled={isDownloadingResume}
              style={{
                padding: '10px 20px',
                background: isDownloadingResume ? '#9CA3AF' : '#4F46E5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isDownloadingResume ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (isDownloadingResume) return;
                e.target.style.background = '#4338CA';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(79, 70, 229, 0.3)';
              }}
              onMouseLeave={(e) => {
                if (isDownloadingResume) return;
                e.target.style.background = '#4F46E5';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(79, 70, 229, 0.2)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              {isDownloadingResume ? "Generating PDF..." : "Download Tailored Resume"}
            </button>



        </div>
      </div>
    </main>
  );
}

export default InterviewPage;
