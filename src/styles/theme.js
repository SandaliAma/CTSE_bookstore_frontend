// Design system — all pages import from here for consistency
export const colors = {
  navBg: "#0f172a",
  navText: "#cbd5e1",
  navActive: "#f59e0b",
  accent: "#f59e0b",        // amber
  accentDark: "#d97706",
  accentLight: "#fef3c7",
  blue: "#3b82f6",
  blueLight: "#eff6ff",
  green: "#10b981",
  greenLight: "#ecfdf5",
  red: "#ef4444",
  redLight: "#fef2f2",
  purple: "#8b5cf6",
  purpleLight: "#f5f3ff",
  pageBg: "#f1f5f9",
  card: "#ffffff",
  border: "#e2e8f0",
  text: "#0f172a",
  textSub: "#64748b",
  textMuted: "#94a3b8",
};

export const shadows = {
  sm: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  md: "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
  lg: "0 10px 30px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)",
  xl: "0 20px 60px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)",
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const font = {
  sans: "'Segoe UI', system-ui, -apple-system, sans-serif",
};

export const card = {
  background: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.lg,
  boxShadow: shadows.md,
  padding: "24px",
};
