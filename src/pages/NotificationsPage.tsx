import { useApp } from "../context/AppContext";
import { colors, shadows, font, radius } from "../styles/theme";

const TYPE_CFG: Record<string, { icon: string; color: string; light: string; label: string }> = {
  Welcome:      { icon: "👋", color: colors.green,  light: colors.greenLight,  label: "Welcome" },
  OrderConfirm: { icon: "✅", color: colors.blue,   light: colors.blueLight,   label: "Order Confirmed" },
  Cancellation: { icon: "❌", color: colors.red,    light: colors.redLight,    label: "Cancellation" },
};

export default function NotificationsPage() {
  const { notifications, readIds, unreadCount, markRead, markAllRead, deleteNotification, notifLoading } = useApp();

  const shown = notifications.slice(0, 10);

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div>
            <h1 style={s.pageTitle}>Notifications</h1>
            <p style={s.pageSub}>
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"} · {shown.length} total
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={s.markAllBtn}>
              ✓ Mark all as read
            </button>
          )}
        </div>
      </div>

      <div style={s.content}>
        {notifLoading ? (
          <div style={s.empty}>
            <div style={{ fontSize: 40 }}>...</div>
            <h3 style={s.emptyTitle}>Loading notifications</h3>
          </div>
        ) : shown.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 60 }}>🔔</div>
            <h3 style={s.emptyTitle}>No notifications</h3>
            <p style={s.emptySub}>You're all caught up!</p>
          </div>
        ) : (
          <div style={s.list}>
            {shown.map((notif) => {
              const cfg = TYPE_CFG[notif.type] || TYPE_CFG.Welcome;
              const isRead = readIds.has(notif._id);
              return (
                <div
                  key={notif._id}
                  style={{
                    ...s.card,
                    borderLeft: `4px solid ${isRead ? "#cbd5e1" : cfg.color}`,
                    opacity: isRead ? 0.7 : 1,
                  }}
                >
                  {/* Unread dot */}
                  {!isRead && <div style={{ ...s.unreadDot, background: cfg.color }} />}

                  <div style={s.body}>
                    <div style={s.topRow}>
                      <span style={{
                        ...s.typePill,
                        background: isRead ? "#f1f5f9" : cfg.light,
                        color: isRead ? colors.textSub : cfg.color,
                      }}>
                        {cfg.label}
                      </span>
                      <span style={{
                        ...s.statusPill,
                        background: notif.status === "sent" ? colors.greenLight : colors.redLight,
                        color: notif.status === "sent" ? colors.green : colors.red,
                      }}>
                        {notif.status === "sent" ? "✓ Sent" : "✗ Failed"}
                      </span>
                    </div>
                    <p style={{ ...s.message, fontWeight: isRead ? 400 : 500 }}>{notif.message}</p>
                    <p style={s.time}>{fmtTime(notif.timestamp)}</p>
                  </div>

                  <div style={s.actions}>
                    {/* Mark as Read button */}
                    {!isRead ? (
                      <button
                        onClick={() => markRead(notif._id)}
                        style={s.readBtn}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = cfg.light;
                          e.currentTarget.style.color = cfg.color;
                          e.currentTarget.style.borderColor = cfg.color;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = colors.textSub;
                          e.currentTarget.style.borderColor = colors.border;
                        }}
                      >
                        Mark as Read
                      </button>
                    ) : (
                      <span style={s.readLabel}>✓ Read</span>
                    )}
                    {/* Delete button */}
                    <button
                      onClick={() => deleteNotification(notif._id)}
                      style={s.deleteBtn}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = colors.redLight;
                        e.currentTarget.style.color = colors.red;
                        e.currentTarget.style.borderColor = colors.red;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = colors.textSub;
                        e.currentTarget.style.borderColor = colors.border;
                      }}
                    >
                      Delete
                    </button>
                  </div>
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
  headerInner: {
    maxWidth: 860, margin: "0 auto", padding: "0 28px",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
  },
  pageTitle: { fontSize: 28, fontWeight: 800, color: "#f8fafc", margin: "0 0 4px" },
  pageSub: { fontSize: 14, color: "#94a3b8" },
  markAllBtn: {
    padding: "9px 18px", borderRadius: 8,
    background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
    color: colors.accent, fontSize: 13, fontWeight: 600,
    cursor: "pointer", fontFamily: font.sans, flexShrink: 0,
  },
  content: { maxWidth: 860, margin: "0 auto", padding: "28px" },
  legend: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  legendItem: { display: "flex", alignItems: "center", gap: 8 },
  legendDot: {
    width: 32, height: 32, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  legendLabel: { fontSize: 13, fontWeight: 600 },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  card: {
    background: colors.card, borderRadius: radius.lg,
    border: `1px solid ${colors.border}`, boxShadow: shadows.sm,
    padding: "18px 20px", display: "flex", alignItems: "center", gap: 14,
    position: "relative", transition: "opacity 0.2s",
  },
  unreadDot: {
    position: "absolute", top: 16, right: 16,
    width: 8, height: 8, borderRadius: "50%",
  },
  iconWrap: {
    width: 44, height: 44, borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "background 0.2s",
  },
  body: { flex: 1, minWidth: 0 },
  topRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" },
  typePill: { fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, transition: "all 0.2s" },
  statusPill: { fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999 },
  message: { fontSize: 14, color: colors.text, lineHeight: 1.6, margin: "0 0 5px" },
  time: { fontSize: 11, color: colors.textMuted },
  readBtn: {
    flexShrink: 0, padding: "8px 14px",
    border: `1.5px solid ${colors.border}`, borderRadius: 8,
    background: "transparent", color: colors.textSub,
    fontSize: 12, fontWeight: 600, cursor: "pointer",
    fontFamily: font.sans, whiteSpace: "nowrap",
    transition: "all 0.15s",
  },
  readLabel: {
    flexShrink: 0, fontSize: 12, fontWeight: 600,
    color: colors.green, whiteSpace: "nowrap",
  },
  actions: {
    display: "flex", flexDirection: "column", gap: 6, flexShrink: 0,
  },
  deleteBtn: {
    padding: "8px 14px",
    border: `1.5px solid ${colors.border}`, borderRadius: 8,
    background: "transparent", color: colors.textSub,
    fontSize: 12, fontWeight: 600, cursor: "pointer",
    fontFamily: font.sans, whiteSpace: "nowrap",
    transition: "all 0.15s",
  },
  empty: {
    background: colors.card, borderRadius: radius.xl,
    border: `1px solid ${colors.border}`, padding: "80px 0",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
    boxShadow: shadows.sm, textAlign: "center",
  },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: colors.text, margin: 0 },
  emptySub: { fontSize: 14, color: colors.textSub },
};
