import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import userStore from "../store/userStore";
import GlobalLoader from "../components/ui/GlobalLoader";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthChecking, token } = userStore();
  const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const expiry = typeof window !== "undefined" ? localStorage.getItem("tokenExpiry") : null;
  const isExpired = expiry ? Date.now() > Number(expiry) : false;
  const activeToken = token || localToken;

  if (isAuthChecking && activeToken && !isExpired) {
    return <GlobalLoader show fullScreen message="Verifying session..." />;
  }

  if (!activeToken || isExpired) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
