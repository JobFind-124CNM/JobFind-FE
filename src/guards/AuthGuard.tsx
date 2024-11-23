import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthGuard = () => {
  const accessToken = localStorage.getItem("access_token");
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
