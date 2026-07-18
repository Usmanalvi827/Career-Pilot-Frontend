import { createContext, useState } from "react";

export const InterviewContext = createContext();

export function InterviewProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [loadReport, setLoadReport] = useState(null);
  const [reportTitle, setReportTitle] = useState(null);

  return (
    <InterviewContext.Provider
      value={{
        loading,
        setLoading,
        report,
        setReport,
        loadReport,
        setLoadReport,
        reportTitle,
        setReportTitle,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}
