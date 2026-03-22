import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useForm } from "react-hook-form";
import { login } from "../services/authService";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();

  const [error, setError] = useState("");
  const { showToast } = useApp();

  const onSubmit = async (data: FormValues) => {
    setError("");
    try {
      const res = await login(data);

      const username = res.username || data.email.split("@")[0];

      const newUser = {
        id: res.id,
        role: res.role,
        email: data.email,
        username,
      };

      setCurrentUser(newUser);

      localStorage.setItem("bookstore_user", JSON.stringify(newUser));
      localStorage.setItem("token", res.token);

      showToast(`Welcome back, ${username}!`, "success");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      console.error(err);
      const raw = err?.response?.data?.msg || err?.response?.data?.message || "";
      const msg = raw === "Invalid Credentials"
        ? "Incorrect email or password. Please try again."
        : raw || "Login failed. Please check your credentials.";
      setError(msg);
      showToast(msg, "error");
    }
  };

  return (
    <div style={styles.page}>
      {/* Hero section left */}
      <div style={styles.heroPanel}>
        <div style={styles.heroContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>📚</span>
            <span style={styles.logoText}>BookStore</span>
          </div>
          <h2 style={styles.heroTitle}>
            Your next great read
            <br />
            is waiting for you.
          </h2>
          <p style={styles.heroSub}>
            Thousands of books across every genre. Order in seconds, track
            everything in one place.
          </p>
          <div style={styles.heroBadges}>
            {["📖 8,000+ Titles", "🚀 Fast Delivery", "🔒 Secure Checkout"].map(
              (b) => (
                <span key={b} style={styles.badge}>
                  {b}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Form right */}
      <div style={styles.formPanel}>
        <div style={styles.card}>
          <h1 style={styles.cardTitle}>Sign In</h1>
          <p style={styles.cardSub}>Welcome back! Please enter your details.</p>

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
                placeholder="you@example.com"
                style={styles.input}
                onFocus={(e) => (e.target.style.borderColor = "#FF9900")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
              {errors.email && (
                <p style={styles.error}>{errors.email.message}</p>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                style={styles.input}
                onFocus={(e) => (e.target.style.borderColor = "#FF9900")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
              {errors.password && (
                <p style={styles.error}>{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              style={styles.submitBtn}
              disabled={isSubmitting}
              onMouseOver={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  "#e68a00")
              }
              onMouseOut={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  "#FF9900")
              }
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <p style={styles.registerText}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.link}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  heroPanel: {
    flex: 1,
    background:
      "linear-gradient(135deg, #131921 0%, #1a2332 60%, #232f3e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 40px",
    position: "relative",
    overflow: "hidden",
  },
  heroContent: {
    maxWidth: 420,
    position: "relative",
    zIndex: 1,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 40,
  },
  logoIcon: {
    fontSize: 36,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 800,
    color: "#FF9900",
    letterSpacing: "-0.5px",
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: 700,
    color: "#ffffff",
    lineHeight: 1.25,
    marginBottom: 16,
    margin: "0 0 16px",
  },
  heroSub: {
    fontSize: 16,
    color: "#9ca3af",
    lineHeight: 1.6,
    marginBottom: 32,
    margin: "0 0 32px",
  },
  heroBadges: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#d1d5db",
    fontSize: 14,
    fontWeight: 500,
  },
  formPanel: {
    width: 460,
    minWidth: 360,
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 32px",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#ffffff",
    borderRadius: 16,
    padding: "36px 32px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 6px",
  },
  cardSub: {
    fontSize: 14,
    color: "#6b7280",
    margin: "0 0 28px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    border: "1.5px solid #d1d5db",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    color: "#111827",
    outline: "none",
    transition: "border-color 0.2s",
    background: "#fafafa",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#dc2626",
    fontSize: 13,
    fontWeight: 500,
  },
  submitBtn: {
    padding: "12px",
    borderRadius: 8,
    border: "none",
    background: "#FF9900",
    color: "#131921",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: 4,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "20px 0",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "#e5e7eb",
    display: "block",
  },
  dividerText: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: 500,
  },
  registerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#6b7280",
    margin: 0,
  },
  link: {
    color: "#FF9900",
    fontWeight: 600,
    textDecoration: "none",
  },
  demoBox: {
    marginTop: 20,
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: 10,
    padding: "14px 16px",
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#92400e",
    margin: "0 0 8px",
  },
  demoRow: {
    display: "flex",
    gap: 8,
    alignItems: "flex-start",
    marginBottom: 4,
  },
  demoLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#b45309",
    background: "#fef3c7",
    padding: "1px 6px",
    borderRadius: 4,
    whiteSpace: "nowrap",
    minWidth: 36,
    textAlign: "center",
  },
  demoValue: {
    fontSize: 11,
    color: "#78350f",
    fontFamily: "monospace",
  },
  error: {
    color: "red",
    fontSize: "0.8rem",
  },
};
