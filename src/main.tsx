import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import JobDetail from "@/components/Job/JobDetail.tsx";
import Register from "./components/Auth/Register/Register.tsx";
import Login from "./components/Auth/Login/Login.tsx";
import Otp from "./components/Auth/Register/Otp.tsx";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "posts/:id",
    element: <JobDetail />,
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify",
    element: <Otp />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={routers} />
  </StrictMode>
);
