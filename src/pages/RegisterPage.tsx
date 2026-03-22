import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useForm } from "react-hook-form";
import { colors, font } from "../styles/theme";
import { registerUser } from "../services/authService";

type FormValues = {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin" | string;
};

export default function RegisterPage() {
  //const { register } = useApp();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const [success, setSuccess] = useState(false);
  const [username, setUserName] = useState("");

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("form data:", data);

      const res = await registerUser(data);

      alert(`Rgistration successful. please login`);
      if (res) {
        setUserName(data.username);
        setSuccess(true);
      }
      navigate("/login");
      setSuccess(false);
    } catch (error: any) {
      console.error("Login failed:", error);

      alert(
        error?.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <div style={s.page}>
      {/* Left panel */}
      <div style={s.leftPanel}>
        <div style={s.leftContent}>
          <div style={s.logo}>
            <span style={{ fontSize: 36 }}>📚</span>
            <span style={s.logoText}>BookStore</span>
          </div>
          <h2 style={s.heroTitle}>
            Join thousands of
            <br />
            book lovers today.
          </h2>
          <p style={s.heroSub}>
            Create your free account and get access to our complete catalog,
            order tracking, and personalized notifications.
          </p>
          <div style={s.perks}>
            {[
              { icon: "📖", text: "Access 8,000+ titles" },
              { icon: "📦", text: "Real-time order tracking" },
              { icon: "🔔", text: "Personalized notifications" },
              { icon: "🔒", text: "Secure & private" },
            ].map((p) => (
              <div key={p.text} style={s.perk}>
                <span style={s.perkIcon}>{p.icon}</span>
                <span style={s.perkText}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={s.rightPanel}>
        <div style={s.card}>
          {success ? (
            <div style={s.successBox}>
              <div style={s.successIcon}>🎉</div>
              <h2 style={s.successTitle}>Account Created!</h2>
              <p style={s.successSub}>
                Welcome to BookStore, {username}!<br />
                Redirecting you to sign in...
              </p>
              <div style={s.successBar}>
                <div style={s.successBarFill} />
              </div>
            </div>
          ) : (
            <>
              <h1 style={s.cardTitle}>Create Account</h1>
              <p style={s.cardSub}>Fill in the details below to get started.</p>

              <form onSubmit={handleSubmit(onSubmit)} style={s.form}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column" as const,
                    gap: 6,
                  }}
                >
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      fontFamily: font.sans,
                    }}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    {...register("username", {
                      required: "username is required",
                    })}
                    placeholder="Enter the UserName"
                    style={{
                      border: "1.5px solid #d1d5db",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 14,
                      color: "#111827",
                      outline: "none",
                      background: "#fafafa",
                      fontFamily: font.sans,
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = colors.accent)
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                  {errors.username && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "0.8rem",
                      }}
                    >
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column" as const,
                    gap: 6,
                  }}
                >
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      fontFamily: font.sans,
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email format",
                      },
                    })}
                    placeholder="Enter the UserName"
                    style={{
                      border: "1.5px solid #d1d5db",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 14,
                      color: "#111827",
                      outline: "none",
                      background: "#fafafa",
                      fontFamily: font.sans,
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = colors.accent)
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                  {errors.email && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "0.8rem",
                      }}
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column" as const,
                    gap: 6,
                  }}
                >
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      fontFamily: font.sans,
                    }}
                  >
                    Password
                  </label>
                  <input
                    type="text"
                    {...register("password", {
                      required: "Password is required"
                    })}
                    placeholder="Enter the Password"
                    style={{
                      border: "1.5px solid #d1d5db",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 14,
                      color: "#111827",
                      outline: "none",
                      background: "#fafafa",
                      fontFamily: font.sans,
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = colors.accent)
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                  {errors.password && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "0.8rem",
                      }}
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <button type="submit" style={s.submitBtn}>
                  Create Free Account →
                </button>
              </form>

              <p style={s.loginText}>
                Already have an account?{" "}
                <Link to="/login" style={s.link}>
                  Sign in here
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  ...rest
}: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
      <label
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#374151",
          fontFamily: font.sans,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          border: "1.5px solid #d1d5db",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 14,
          color: "#111827",
          outline: "none",
          background: "#fafafa",
          fontFamily: font.sans,
        }}
        onFocus={(e) => (e.target.style.borderColor = colors.accent)}
        onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
        {...rest}
      />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { display: "flex", minHeight: "100vh", fontFamily: font.sans },
  leftPanel: {
    flex: 1,
    background:
      "linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, #1e293b 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 40px",
  },
  leftContent: { maxWidth: 400 },
  logo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 36 },
  logoText: {
    fontSize: 26,
    fontWeight: 800,
    color: colors.accent,
    fontFamily: font.sans,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: 800,
    color: "#f8fafc",
    lineHeight: 1.25,
    margin: "0 0 14px",
  },
  heroSub: {
    fontSize: 15,
    color: "#94a3b8",
    lineHeight: 1.7,
    margin: "0 0 32px",
  },
  perks: { display: "flex", flexDirection: "column", gap: 14 },
  perk: { display: "flex", alignItems: "center", gap: 12 },
  perkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "rgba(245,158,11,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    flexShrink: 0,
  },
  perkText: { fontSize: 14, color: "#cbd5e1", fontWeight: 500 },
  rightPanel: {
    width: 480,
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 32px",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#fff",
    borderRadius: 16,
    padding: "36px 32px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    border: "1px solid #e5e7eb",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 6px",
  },
  cardSub: { fontSize: 14, color: "#6b7280", margin: "0 0 26px" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  submitBtn: {
    padding: "12px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#0f172a",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: font.sans,
    marginTop: 4,
  },
  loginText: {
    textAlign: "center",
    fontSize: 14,
    color: "#6b7280",
    marginTop: 18,
  },
  link: { color: colors.accent, fontWeight: 600, textDecoration: "none" },
  successBox: { textAlign: "center", padding: "20px 0" },
  successIcon: { fontSize: 56, marginBottom: 12 },
  successTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: "#111827",
    margin: "0 0 8px",
  },
  successSub: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.6,
    margin: "0 0 24px",
  },
  successBar: {
    height: 4,
    background: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  successBarFill: {
    height: "100%",
    borderRadius: 4,
    background: "linear-gradient(90deg, #f59e0b, #d97706)",
    animation: "fillBar 2s linear forwards",
    width: "100%",
  },
};
