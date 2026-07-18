import { useContext } from "react";
import { InterviewContext } from "../interviewcontext/interview.context";
import { generateInterviewReport } from "../services/interviewApi";

export function useInterview() {
  const {
    loading,
    setLoading,
    report,
    setReport,
    loadReport,
    setLoadReport,
    reportTitle,
    setReportTitle,
  } = useContext(InterviewContext);

  const handleGenerateReport = async ({
    resume,
    selfDescription,
    jobDescription,
  }) => {
    return await generateInterviewReport({
      resumeFile: resume,
      selfDescription,
      jobDescription,
    });
  };

  return {
    loading,
    setLoading,
    report,
    setReport,
    handleGenerateReport,
    loadReport,
    setLoadReport,
    reportTitle,
    setReportTitle,
  };
}
