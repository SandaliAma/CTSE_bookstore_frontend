import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { colors, font } from "../styles/theme";

interface NavLink {
  to: string;
  label: string;
  icon: string;
  admin?: boolean;
  badge?: number;
}

export default function Navbar() {
  const { currentUser, logout, unreadCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleLogout = () => { logout(); navigate("/login"); };
  console.log("current User", currentUser)
  const isAdmin = currentUser?.role === "admin";

  const navLinks: NavLink[] = isAdmin
    ? [
        { to: "/books",  label: "Books",       icon: "📚" },
        { to: "/admin",  label: "Admin Panel",  icon: "⚙", admin: true },
      ]
    : [
        { to: "/dashboard", label: "Dashboard",    icon: "⊞" },
        { to: "/books",     label: "Books",        icon: "📚" },
        { to: "/orders",    label: "Orders",       icon: "📦" },
        { to: "/notifications", label: "Alerts",   icon: "🔔", badge: unreadCount },
      ];

  const isActive = (to: string) =>
    to === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(to);

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        {/* Brand */}
        <Link to="/dashboard" style={s.brand}>
          <div style={s.brandIcon}>📚</div>
          <div>
            <div style={s.brandName}>BookStore</div>
            <div style={s.brandTagline}>Read. Discover. Grow.</div>
          </div>
        </Link>

        {/* Nav links */}
        {currentUser && (
          <div style={s.links}>
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    ...s.link,
                    ...(active ? s.linkActive : {}),
                    ...(link.admin ? s.linkAdmin : {}),
                    ...(hovered === link.to && !active ? s.linkHover : {}),
                  }}
                  onMouseEnter={() => setHovered(link.to)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span style={s.linkIcon}>{link.icon}</span>
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span style={s.badge}>{link.badge > 9 ? "9+" : link.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right */}
        <div style={s.right}>
          {currentUser ? (
            <>
              <div style={s.userChip}>
                <div style={s.avatar}>{currentUser?.username.toUpperCase()}</div>
                <div style={s.userInfo}>
                  <span style={s.userGreeting}>Hello,</span>
                  <span style={s.userName}>{currentUser.username}</span>
                </div>
                {currentUser.role === "admin" && <span style={s.rolePill}>Admin</span>}
              </div>
              <button onClick={handleLogout} style={s.signOutBtn}>Sign Out</button>
            </>
          ) : (
            <Link to="/login" style={s.signInBtn}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const s: Record<string, React.CSSProperties> = {
  nav: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    position: "sticky", top: 0, zIndex: 200,
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    fontFamily: font.sans,
  },
  inner: {
    maxWidth: 1280, margin: "0 auto", padding: "0 28px",
    height: 68, display: "flex", alignItems: "center", gap: 20,
  },
  brand: {
    display: "flex", alignItems: "center", gap: 10,
    textDecoration: "none", flexShrink: 0,
  },
  brandIcon: { fontSize: 28 },
  brandName: {
    fontSize: 18, fontWeight: 800, color: colors.accent,
    letterSpacing: "-0.3px", lineHeight: 1.1, fontFamily: font.sans,
  },
  brandTagline: {
    fontSize: 10, color: "#64748b", letterSpacing: "0.5px",
    fontFamily: font.sans,
  },
  links: { display: "flex", alignItems: "center", gap: 2, flex: 1 },
  link: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "7px 14px", borderRadius: 8,
    textDecoration: "none", fontSize: 13.5, fontWeight: 500,
    color: "#94a3b8", transition: "all 0.15s",
    fontFamily: font.sans, position: "relative",
  },
  linkHover: { color: "#e2e8f0", background: "rgba(255,255,255,0.07)" },
  linkActive: {
    color: colors.accent, background: "rgba(245,158,11,0.15)",
    fontWeight: 600,
  },
  linkAdmin: { color: "#c4b5fd" },
  linkIcon: { fontSize: 15 },
  badge: {
    background: colors.accent, color: "#0f172a",
    fontSize: 10, fontWeight: 700, borderRadius: 999,
    padding: "1px 6px", lineHeight: 1.5,
  },
  right: { display: "flex", alignItems: "center", gap: 12, marginLeft: "auto", flexShrink: 0 },
  userChip: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, padding: "6px 12px",
  },
  avatar: {
    width: 30, height: 30, borderRadius: "50%",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#0f172a", fontWeight: 800, fontSize: 13,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: font.sans,
  },
  userInfo: { display: "flex", flexDirection: "column", lineHeight: 1.2 },
  userGreeting: { fontSize: 10, color: "#64748b", fontFamily: font.sans },
  userName: { fontSize: 13, fontWeight: 600, color: "#f1f5f9", fontFamily: font.sans },
  rolePill: {
    fontSize: 10, fontWeight: 700, background: "rgba(139,92,246,0.2)",
    color: "#c4b5fd", borderRadius: 6, padding: "2px 7px",
    fontFamily: font.sans,
  },
  signOutBtn: {
    padding: "8px 16px", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8, background: "transparent", color: "#94a3b8",
    fontSize: 13, fontWeight: 500, cursor: "pointer",
    fontFamily: font.sans,
  },
  signInBtn: {
    padding: "9px 20px", borderRadius: 8,
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#0f172a", fontWeight: 700, fontSize: 13,
    textDecoration: "none", fontFamily: font.sans,
  },
};
