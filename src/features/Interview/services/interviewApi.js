import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});


export async function generateInterviewReport({
  resumeFile,
  selfDescription,
  jobDescription,
}) {
  const formData = new FormData();
  formData.append("resumeFile", resumeFile);
  formData.append("selfDescription", selfDescription);
  formData.append("jobDescription", jobDescription);

  const response = await api.post("/api/interview-report/", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

  // console.log(response);
  return response.data;
}

export async function getInterviewReportById({interviewId}) {
  // console.log(interviewId)
  const response = await api.get(`/api/interview-report/${interviewId}`);
  // console.log(response.data);
  return response.data
}

export async function getAllInterviewReportByTitle() {
  const response = await api.get("/api/interview-report/");
  // console.log(response);
  return response.data
}

export async function getResumePdf({ interviewId }) {
  const response = await api.get(
    `/api/interview-report/generate-pdf/${interviewId}`,
    { responseType: "blob" }
  );
  return response.data; 
}
