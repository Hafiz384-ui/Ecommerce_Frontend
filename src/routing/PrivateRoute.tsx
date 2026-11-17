import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import userStore from "../store/userStore";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthChecking } = userStore();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const expiry = typeof window !== "undefined" ? localStorage.getItem("tokenExpiry") : null;
  const isExpired = expiry ? Date.now() > Number(expiry) : false;

  if (isAuthChecking && token && !isExpired) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token || isExpired) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
