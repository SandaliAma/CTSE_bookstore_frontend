import { useApp } from "../context/AppContext";
import { font } from "../styles/theme";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const config = {
    success: { bg: "#10b981", icon: "✓", label: "Success" },
    info:    { bg: "#3b82f6", icon: "ℹ", label: "Info" },
    error:   { bg: "#ef4444", icon: "✗", label: "Error" },
  }[toast.type] || { bg: "#10b981", icon: "✓", label: "Done" };

  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: config.bg,
      color: "#fff",
      padding: "14px 20px",
      borderRadius: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      display: "flex", alignItems: "center", gap: 10,
      maxWidth: 360,
      fontFamily: font.sans,
      animation: "slideUp 0.3s ease",
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: "rgba(255,255,255,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 700, flexShrink: 0,
      }}>
        {config.icon}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, marginBottom: 1 }}>{config.label}</div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{toast.message}</div>
      </div>
    </div>
  );
}
