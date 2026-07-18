import { RouterProvider } from "react-router-dom";
import { router } from "./app.routers.jsx";
import "./App.css";
import { AuthProvider } from "./features/Auth/context/auth.context.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InterviewProvider } from "./features/Interview/interviewcontext/interview.context";

function App() {
  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <InterviewProvider>
          <RouterProvider router={router} />
        </InterviewProvider>
      </AuthProvider>
    </>
  );
}

export default App;
