import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { colors, shadows, font, radius } from "../styles/theme";

export default function DashboardPage() {
  const { currentUser, books, orders, notifications } = useApp();
  const navigate = useNavigate();

  const userOrders = orders.filter((o) => o.userId === currentUser.id);
  const pending = userOrders.filter((o) => o.status === "pending").length;
  const featured = books.slice(0, 4);
  const recentOrders = userOrders.slice(0, 3);

  const stats = [
    { label: "Books Available", value: books.length,         icon: "📚", color: colors.accent, light: colors.accentLight, action: () => navigate("/books") },
    { label: "Your Borrows",    value: userOrders.length,    icon: "📖", color: colors.blue,   light: colors.blueLight,   action: () => navigate("/orders") },
    { label: "Pending Returns", value: pending,              icon: "⏳", color: colors.purple, light: colors.purpleLight, action: () => navigate("/orders") },
    { label: "Notifications",   value: notifications.length, icon: "🔔", color: colors.green,  light: colors.greenLight,  action: () => navigate("/notifications") },
  ];

  const statusColor = { pending: colors.accent, completed: colors.green, cancelled: colors.red };
  const statusBg    = { pending: colors.accentLight, completed: colors.greenLight, cancelled: colors.redLight };

  return (
    <div style={s.page}>
      {/* Welcome banner */}
      <div style={s.banner}>
        <div style={s.bannerInner}>
          <div>
            <p style={s.bannerGreeting}>Good day, {currentUser.username} 👋</p>
            <h1 style={s.bannerTitle}>Welcome to your Dashboard</h1>
            <p style={s.bannerSub}>Browse thousands of books, track your orders, and manage your library all in one place.</p>
            <div style={s.bannerActions}>
              <button onClick={() => navigate("/books")} style={s.primaryBtn}>Browse Books</button>
              <button onClick={() => navigate("/orders")} style={s.ghostBtn}>My Orders</button>
            </div>
          </div>
          <div style={s.bannerIllustration}>
            <div style={s.bookStack}>
              {["#f59e0b","#3b82f6","#10b981","#8b5cf6"].map((c, i) => (
                <div key={i} style={{ ...s.bookSpine, background: c, transform: `rotate(${(i-1.5)*5}deg)` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={s.content}>
        {/* Stats row */}
        <div style={s.statsGrid}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{ ...s.statCard, cursor: stat.action ? "pointer" : "default" }}
              onClick={stat.action}
              onMouseEnter={(e) => stat.action && (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => stat.action && (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{ ...s.statIcon, background: stat.light, color: stat.color }}>
                {stat.icon}
              </div>
              <div>
                <p style={s.statValue}>{stat.value}</p>
                <p style={s.statLabel}>{stat.label}</p>
              </div>
              {stat.action && <div style={s.statArrow}>→</div>}
            </div>
          ))}
        </div>

        <div style={s.twoCol}>
          {/* Featured Books */}
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <div>
                <h2 style={s.sectionTitle}>Featured Books</h2>
                <p style={s.sectionSub}>Handpicked titles just for you</p>
              </div>
              <button onClick={() => navigate("/books")} style={s.seeAllBtn}>See all →</button>
            </div>
            <div style={s.featuredGrid}>
              {featured.map((book) => (
                <div
                  key={book.id}
                  style={s.featuredCard}
                  onClick={() => navigate(`/books/${book.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = shadows.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = shadows.sm;
                  }}
                >
                  <div style={{ ...s.featuredCover, background: bookGradient(book.color) }}>
                    <span style={{ fontSize: 28 }}>📖</span>
                  </div>
                  <div style={s.featuredInfo}>
                    <p style={s.featuredTitle}>{book.title}</p>
                    <p style={s.featuredAuthor}>{book.author}</p>
                    <p style={s.featuredPrice}>{book.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Recent Orders */}
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <div>
                  <h2 style={s.sectionTitle}>Recent Orders</h2>
                  <p style={s.sectionSub}>{recentOrders.length} most recent</p>
                </div>
                <button onClick={() => navigate("/orders")} style={s.seeAllBtn}>All orders →</button>
              </div>
              {recentOrders.length === 0 ? (
                <div style={s.empty}>
                  <span style={{ fontSize: 32 }}>📭</span>
                  <p>No orders yet</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {recentOrders.map((order) => (
                    <div key={order.id} style={s.orderRow}>
                      <div style={s.orderIcon}>📦</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={s.orderTitle}>{order.bookTitle}</p>
                        <p style={s.orderMeta}>Qty {order.quantity}</p>
                      </div>
                      <span style={{ ...s.statusPill, background: statusBg[order.status], color: statusColor[order.status] }}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications preview */}
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <div>
                  <h2 style={s.sectionTitle}>Notifications</h2>
                  <p style={s.sectionSub}>{notifications.length} alerts</p>
                </div>
                <button onClick={() => navigate("/notifications")} style={s.seeAllBtn}>View all →</button>
              </div>
              {notifications.length === 0 ? (
                <div style={s.empty}><span>🔔</span><p>No notifications</p></div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {notifications.slice(0, 3).map((n) => {
                    const cfg = notifConfig[n.type] || notifConfig.Welcome;
                    return (
                      <div key={n.id} style={s.notifRow}>
                        <div style={{ ...s.notifDot, background: cfg.color }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={s.notifMsg}>{n.message}</p>
                          <span style={{ ...s.notifType, background: cfg.light, color: cfg.color }}>{n.type}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick actions */}
            {currentUser.role === "admin" && (
              <div style={{ ...s.section, background: "linear-gradient(135deg, #1e293b, #0f172a)", border: "none" }}>
                <h2 style={{ ...s.sectionTitle, color: "#f1f5f9", marginBottom: 4 }}>Admin Panel</h2>
                <p style={{ ...s.sectionSub, color: "#64748b", marginBottom: 16 }}>Manage your catalog</p>
                <button onClick={() => navigate("/admin")} style={s.primaryBtn}>Go to Admin ⚙</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const notifConfig = {
  Welcome:      { color: "#10b981", light: "#ecfdf5" },
  OrderConfirm: { color: "#3b82f6", light: "#eff6ff" },
  Cancellation: { color: "#ef4444", light: "#fef2f2" },
};

function bookGradient(colorClass) {
  const map = {
    "bg-yellow-400": "linear-gradient(135deg, #fbbf24, #f59e0b)",
    "bg-blue-500":   "linear-gradient(135deg, #60a5fa, #3b82f6)",
    "bg-green-500":  "linear-gradient(135deg, #34d399, #10b981)",
    "bg-gray-700":   "linear-gradient(135deg, #9ca3af, #4b5563)",
    "bg-orange-400": "linear-gradient(135deg, #fb923c, #f97316)",
    "bg-purple-500": "linear-gradient(135deg, #a78bfa, #8b5cf6)",
    "bg-amber-600":  "linear-gradient(135deg, #fbbf24, #d97706)",
    "bg-teal-500":   "linear-gradient(135deg, #2dd4bf, #14b8a6)",
    "bg-indigo-500": "linear-gradient(135deg, #818cf8, #6366f1)",
  };
  return map[colorClass] || "linear-gradient(135deg, #94a3b8, #64748b)";
}

const s = {
  page: { minHeight: "100vh", background: colors.pageBg, fontFamily: font.sans },
  banner: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1e293b 100%)",
    padding: "0",
  },
  bannerInner: {
    maxWidth: 1280, margin: "0 auto", padding: "48px 28px",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40,
  },
  bannerGreeting: { fontSize: 14, color: colors.accent, fontWeight: 600, marginBottom: 8 },
  bannerTitle: { fontSize: 34, fontWeight: 800, color: "#f8fafc", margin: "0 0 12px", lineHeight: 1.2 },
  bannerSub: { fontSize: 15, color: "#94a3b8", maxWidth: 480, lineHeight: 1.6, margin: "0 0 28px" },
  bannerActions: { display: "flex", gap: 12 },
  primaryBtn: {
    padding: "11px 24px", borderRadius: 10,
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#0f172a", fontWeight: 700, fontSize: 14, border: "none",
    cursor: "pointer", fontFamily: font.sans,
  },
  ghostBtn: {
    padding: "11px 24px", borderRadius: 10,
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
    color: "#e2e8f0", fontWeight: 600, fontSize: 14,
    cursor: "pointer", fontFamily: font.sans,
  },
  bannerIllustration: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 160, height: 120, flexShrink: 0,
  },
  bookStack: { display: "flex", alignItems: "flex-end", gap: 6, height: 100 },
  bookSpine: { width: 28, height: 90, borderRadius: 4, opacity: 0.85 },
  content: { maxWidth: 1280, margin: "0 auto", padding: "28px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  statCard: {
    background: colors.card, border: `1px solid ${colors.border}`,
    borderRadius: radius.lg, padding: "20px 22px",
    boxShadow: shadows.sm,
    display: "flex", alignItems: "center", gap: 14,
    transition: "transform 0.2s, box-shadow 0.2s",
    position: "relative",
  },
  statIcon: {
    width: 46, height: 46, borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
  },
  statValue: { fontSize: 24, fontWeight: 800, color: colors.text, margin: "0 0 2px" },
  statLabel: { fontSize: 12, color: colors.textSub, fontWeight: 500 },
  statArrow: { marginLeft: "auto", color: colors.textMuted, fontSize: 18 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start" },
  section: {
    background: colors.card, border: `1px solid ${colors.border}`,
    borderRadius: radius.lg, padding: "22px",
    boxShadow: shadows.sm,
  },
  sectionHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: colors.text, margin: "0 0 2px" },
  sectionSub: { fontSize: 12, color: colors.textSub },
  seeAllBtn: {
    background: "none", border: `1px solid ${colors.border}`, borderRadius: 8,
    padding: "6px 12px", fontSize: 12, color: colors.textSub,
    cursor: "pointer", fontFamily: font.sans, fontWeight: 600,
  },
  featuredGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 },
  featuredCard: {
    borderRadius: radius.md, overflow: "hidden",
    border: `1px solid ${colors.border}`, cursor: "pointer",
    boxShadow: shadows.sm, transition: "transform 0.2s, box-shadow 0.2s",
  },
  featuredCover: {
    height: 110, display: "flex", alignItems: "center", justifyContent: "center",
  },
  featuredInfo: { padding: "10px 12px" },
  featuredTitle: { fontSize: 12, fontWeight: 700, color: colors.text, margin: "0 0 3px", lineHeight: 1.3,
    overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" },
  featuredAuthor: { fontSize: 11, color: colors.textSub, margin: "0 0 6px" },
  featuredPrice: { fontSize: 13, fontWeight: 800, color: colors.accent },
  orderRow: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px", background: "#f8fafc",
    borderRadius: 10, border: `1px solid ${colors.border}`,
  },
  orderIcon: { fontSize: 20, flexShrink: 0 },
  orderTitle: { fontSize: 13, fontWeight: 600, color: colors.text, margin: "0 0 2px",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  orderMeta: { fontSize: 11, color: colors.textSub },
  statusPill: { fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, flexShrink: 0, textTransform: "capitalize" },
  notifRow: { display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: `1px solid ${colors.border}` },
  notifDot: { width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0 },
  notifMsg: { fontSize: 12, color: colors.text, margin: "0 0 4px", lineHeight: 1.4,
    overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" },
  notifType: { fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999 },
  empty: {
    textAlign: "center", padding: "24px 0", color: colors.textMuted,
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    fontSize: 13,
  },
};
