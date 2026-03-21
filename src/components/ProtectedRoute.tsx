import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import type { ReactNode } from "react";

const ADMIN_BLOCKED = ["/dashboard", "/orders", "/notifications"];

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (adminOnly && currentUser.role !== "admin") return <Navigate to="/dashboard" replace />;
  if (currentUser.role === "admin" && ADMIN_BLOCKED.some((p) => location.pathname.startsWith(p))) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
