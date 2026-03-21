import { useApp } from "../context/AppContext";
import { colors, shadows, font, radius } from "../styles/theme";

const STATUS: Record<string, { bg: string; color: string; border: string; dot: string; label: string }> = {
  pending:   { bg: "#fffbeb", color: "#d97706", border: "#fde68a", dot: "#f59e0b", label: "Pending" },
  completed: { bg: colors.greenLight, color: colors.green, border: "#a7f3d0", dot: colors.green, label: "Completed" },
  cancelled: { bg: colors.redLight, color: colors.red, border: "#fecaca", dot: colors.red, label: "Cancelled" },
};

export default function OrdersPage() {
  const { orders, cancelOrder, currentUser } = useApp();
  const userOrders = orders.filter((o) => o.userId === currentUser!.id);

  const stats = [
    { label: "Total Borrows", value: userOrders.length,                                                  color: colors.blue,   light: colors.blueLight,   icon: "📖" },
    { label: "Pending",       value: userOrders.filter(o => o.status === "pending").length,              color: "#d97706",     light: "#fffbeb",           icon: "⏳" },
    { label: "Completed",     value: userOrders.filter(o => o.status === "completed").length,            color: colors.green,  light: colors.greenLight,   icon: "✅" },
    { label: "Cancelled",     value: userOrders.filter(o => o.status === "cancelled").length,            color: colors.red,    light: colors.redLight,     icon: "❌" },
  ];

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <h1 style={s.pageTitle}>My Borrows</h1>
          <p style={s.pageSub}>{userOrders.length} borrow{userOrders.length !== 1 ? "s" : ""} total</p>
        </div>
      </div>

      <div style={s.content}>
        {/* Stats */}
        <div style={s.statsRow}>
          {stats.map((stat) => (
            <div key={stat.label} style={s.statCard}>
              <div style={{ ...s.statIcon, background: stat.light, color: stat.color }}>{stat.icon}</div>
              <div>
                <p style={s.statValue}>{stat.value}</p>
                <p style={s.statLabel}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Orders list */}
        {userOrders.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 60 }}>📭</div>
            <h3 style={s.emptyTitle}>No orders yet</h3>
            <p style={s.emptySub}>Browse our catalog and place your first order!</p>
          </div>
        ) : (
          <div style={s.ordersList}>
            {userOrders.map((order) => {
              const st = STATUS[order.status];
              return (
                <div key={order.id} style={s.orderCard}>
                  <div style={s.orderLeft}>
                    <div style={s.orderIconWrap}>📦</div>
                  </div>

                  <div style={s.orderBody}>
                    <div style={s.orderTop}>
                      <div>
                        <p style={s.orderTitle}>{order.bookTitle}</p>
                        <p style={s.orderMeta}>Order #{order.id.slice(-6).toUpperCase()} · {fmtDate(order.orderDate)}</p>
                      </div>
                      <div style={{ ...s.statusBadge, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                        <div style={{ ...s.statusDot, background: st.dot }} />
                        {st.label}
                      </div>
                    </div>

                    <div style={s.orderDetails}>
                      <div style={s.detailItem}>
                        <span style={s.detailLabel}>Quantity</span>
                        <span style={s.detailValue}>{order.quantity} book{order.quantity > 1 ? "s" : ""}</span>
                      </div>
                      <div style={s.detailItem}>
                        <span style={s.detailLabel}>Date Placed</span>
                        <span style={s.detailValue}>{fmtDate(order.orderDate)}</span>
                      </div>
                    </div>
                  </div>

                  {order.status === "pending" && (
                    <div style={s.cancelWrap}>
                      <button
                        onClick={() => cancelOrder(order.id)}
                        style={s.cancelBtn}
                        onMouseOver={(e) => (e.currentTarget.style.background = colors.redLight)}
                        onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: colors.pageBg, fontFamily: font.sans },
  header: { background: "linear-gradient(135deg, #0f172a, #1e293b)", padding: "32px 0 28px" },
  headerInner: { maxWidth: 1280, margin: "0 auto", padding: "0 28px" },
  pageTitle: { fontSize: 28, fontWeight: 800, color: "#f8fafc", margin: "0 0 4px" },
  pageSub: { fontSize: 14, color: "#94a3b8" },
  content: { maxWidth: 1280, margin: "0 auto", padding: "28px" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 },
  statCard: {
    background: colors.card, border: `1px solid ${colors.border}`,
    borderRadius: radius.lg, padding: "18px 20px",
    display: "flex", alignItems: "center", gap: 14,
    boxShadow: shadows.sm,
  },
  statIcon: {
    width: 44, height: 44, borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, flexShrink: 0,
  },
  statValue: { fontSize: 22, fontWeight: 800, color: colors.text, margin: "0 0 2px" },
  statLabel: { fontSize: 12, color: colors.textSub, fontWeight: 500 },
  ordersList: { display: "flex", flexDirection: "column", gap: 14 },
  orderCard: {
    background: colors.card, borderRadius: radius.lg,
    border: `1px solid ${colors.border}`, boxShadow: shadows.sm,
    padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 16,
  },
  orderLeft: { flexShrink: 0 },
  orderIconWrap: {
    width: 48, height: 48, borderRadius: 12, background: "#f1f5f9",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
  },
  orderBody: { flex: 1, minWidth: 0 },
  orderTop: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 },
  orderTitle: { fontSize: 15, fontWeight: 700, color: colors.text, margin: "0 0 4px" },
  orderMeta: { fontSize: 12, color: colors.textSub },
  statusBadge: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700,
    whiteSpace: "nowrap", flexShrink: 0,
  },
  statusDot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  orderDetails: {
    display: "flex", gap: 28, flexWrap: "wrap",
    background: "#f8fafc", borderRadius: 10, padding: "12px 16px",
  },
  detailItem: { display: "flex", flexDirection: "column", gap: 3 },
  detailLabel: { fontSize: 11, color: colors.textMuted, fontWeight: 500 },
  detailValue: { fontSize: 14, fontWeight: 600, color: colors.textSub },
  cancelWrap: { flexShrink: 0, alignSelf: "center" },
  cancelBtn: {
    padding: "9px 18px", borderRadius: 8,
    border: `1.5px solid ${colors.red}`, background: "transparent",
    color: colors.red, fontSize: 13, fontWeight: 600, cursor: "pointer",
    fontFamily: font.sans, transition: "background 0.15s",
  },
  empty: {
    background: colors.card, borderRadius: radius.xl,
    border: `1px solid ${colors.border}`, padding: "80px 0",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
    boxShadow: shadows.sm,
  },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: colors.text, margin: 0 },
  emptySub: { fontSize: 14, color: colors.textSub },
};
