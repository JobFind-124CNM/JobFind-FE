import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import api from "@/utils/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const AuthGuard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const currentUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await api.post(
          "/auth/check-token",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200 && response.data.valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  if (
    location.pathname.startsWith("/admin") &&
    !currentUser?.roles?.some(
      (role) =>
        role.name.toUpperCase() === "ADMIN" || role.name.toUpperCase() === "HR"
    )
  ) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
