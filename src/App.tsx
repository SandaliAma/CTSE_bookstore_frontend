import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BooksPage from "./pages/BooksPage";
import BookDetailPage from "./pages/BookDetailPage";
import OrdersPage from "./pages/OrdersPage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminPage from "./pages/AdminPage";
import type { ReactNode } from "react";

const AUTH_ROUTES = ["/login", "/register"];

function GuestRoute({ children }: { children: ReactNode }) {
  const { currentUser } = useApp();
  if (currentUser) {
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }
  return <>{children}</>;
}

function Layout() {
  const location = useLocation();
  const hideNav = AUTH_ROUTES.includes(location.pathname);

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/dashboard"      element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/books"          element={<ProtectedRoute><BooksPage /></ProtectedRoute>} />
        <Route path="/books/:id"      element={<ProtectedRoute><BookDetailPage /></ProtectedRoute>} />
        <Route path="/orders"         element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/notifications"  element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/admin"          element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AppProvider>
  );
}
