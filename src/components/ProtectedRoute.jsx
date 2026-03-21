import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

const ADMIN_BLOCKED = ["/dashboard", "/orders", "/notifications"];

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (adminOnly && currentUser.role !== "admin") return <Navigate to="/dashboard" replace />;
  if (currentUser.role === "admin" && ADMIN_BLOCKED.some((p) => location.pathname.startsWith(p))) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
