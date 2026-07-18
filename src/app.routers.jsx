import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./features/Auth/pages/LoginPage";
import RegisterPage from "./features/Auth/pages/RegisterPage";
import ProctedRoute from "./features/Auth/components/ProctedRoute";
import DashboardPage from "./features/Interview/pages/DashboardPage";
import InterviewPage from "./features/Interview/pages/InterviewReport";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <ProctedRoute />,
    children: [
      { 
        index: true, // Matches exactly "/"
        element: <DashboardPage /> 
      },
      { 
         path: "interview/:interviewId", // Matches "/interview"
        element: <InterviewPage /> 
      },
    ],
  },
]);
