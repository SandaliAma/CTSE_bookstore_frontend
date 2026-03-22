import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import BookImage from "../components/BookImage";
import { colors, shadows, font, radius } from "../styles/theme";

function bookGradient(category: string): string {
  const map: Record<string, string> = {
    "Romance":   "linear-gradient(135deg, #f472b6, #ec4899)",
    "Thriller":  "linear-gradient(135deg, #64748b, #334155)",
    "Fantasy":   "linear-gradient(135deg, #a78bfa, #7c3aed)",
    "Science":   "linear-gradient(135deg, #60a5fa, #2563eb)",
    "Horror":    "linear-gradient(135deg, #ef4444, #991b1b)",
    "Self-help": "linear-gradient(135deg, #fbbf24, #d97706)",
    "Health":    "linear-gradient(135deg, #34d399, #059669)",
    "Cookbooks": "linear-gradient(135deg, #fb923c, #ea580c)",
    "Poetry":    "linear-gradient(135deg, #c084fc, #9333ea)",
  };
  return map[category] || "linear-gradient(135deg, #818cf8, #6366f1)";
}

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { books, placeOrder } = useApp();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const book = books.find((b) => b.id === id);

  if (!book) return (
    <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 60 }}>📭</div>
        <h2 style={{ fontSize: 20, color: colors.text, margin: "12px 0 8px" }}>Book not found</h2>
        <button onClick={() => navigate("/books")} style={s.primaryBtn}>Back to Books</button>
      </div>
    </div>
  );

  const stockStatus = book.stockCount === 0
    ? { text: "Out of Stock", bg: colors.redLight, color: colors.red }
    : book.stockCount <= 5
    ? { text: `Only ${book.stockCount} left — order soon!`, bg: "#fffbeb", color: "#d97706" }
    : { text: `In Stock (${book.stockCount} available)`, bg: colors.greenLight, color: colors.green };

  const handleOrder = () => {
    const ok = placeOrder(book.id, quantity);
    if (!ok) alert("Not enough stock available.");
  };


  return (
    <div style={s.page}>
      {/* Back */}
      <div style={s.breadcrumb}>
        <div style={s.breadcrumbInner}>
          <button onClick={() => navigate("/books")} style={s.backBtn}>← Book Catalog</button>
          <span style={s.breadcrumbSep}>/</span>
          <span style={s.breadcrumbCurrent}>{book.title}</span>
        </div>
      </div>

      <div style={s.content}>
        <div style={s.card}>
          <div style={s.grid}>
            {/* Cover */}
            <div style={{ ...s.cover, background: bookGradient(book.category), position: "relative", overflow: "hidden" }}>
              <BookImage imageLink={book.imageLink} alt={book.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              {!book.imageLink && (
                <>
                  <div style={s.coverIcon}>📖</div>
                  <div style={s.coverText}>{book.title}</div>
                </>
              )}
            </div>

            {/* Details */}
            <div style={s.details}>
              {/* Category + stock */}
              <div style={s.tags}>
                <span style={s.catTag}>{book.category}</span>
                <span style={{ ...s.stockTag, background: stockStatus.bg, color: stockStatus.color }}>
                  {stockStatus.text}
                </span>
              </div>

              <h1 style={s.title}>{book.title}</h1>
              <p style={s.author}>by <span style={s.authorName}>{book.author}</span></p>

              {/* Rating mock */}
              <div style={s.ratingRow}>
                {"★★★★☆".split("").map((star, i) => (
                  <span key={i} style={{ color: i < 4 ? colors.accent : "#cbd5e1", fontSize: 18 }}>{star}</span>
                ))}
                <span style={s.ratingText}>4.0 / 5.0</span>
              </div>

              <div style={s.divider} />

              <p style={s.description}>{book.description}</p>

              <div style={s.divider} />

              {/* Order section */}
              {book.stockCount > 0 ? (
                <div style={s.orderSection}>
                  <div style={s.qtyLabel}>Quantity</div>
                  <div style={s.qtyRow}>
                    <div style={s.qtyControl}>
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        style={s.qtyBtn}
                      >−</button>
                      <span style={s.qtyNum}>{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(book.stockCount, q + 1))}
                        style={s.qtyBtn}
                      >+</button>
                    </div>

                    <button onClick={handleOrder} style={s.primaryBtn}>
                      Borrow Book
                    </button>
                  </div>

                  <div style={s.orderNote}>
                    <span>📋</span>
                    <span>Borrow request · Return within the due date</span>
                  </div>
                </div>
              ) : (
                <div style={{ ...s.stockTag, background: colors.redLight, color: colors.red, fontSize: 14, padding: "12px 16px" }}>
                  ❌ This book is currently out of stock.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: colors.pageBg, fontFamily: font.sans },
  breadcrumb: {
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    padding: "16px 0",
  },
  breadcrumbInner: {
    maxWidth: 1280, margin: "0 auto", padding: "0 28px",
    display: "flex", alignItems: "center", gap: 10,
  },
  backBtn: {
    background: "none", border: "none", color: colors.accent,
    fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: font.sans,
    padding: 0,
  },
  breadcrumbSep: { color: "#475569", fontSize: 14 },
  breadcrumbCurrent: { color: "#94a3b8", fontSize: 14,
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  content: { maxWidth: 1280, margin: "0 auto", padding: "28px" },
  card: {
    background: colors.card, borderRadius: radius.xl,
    border: `1px solid ${colors.border}`, boxShadow: shadows.lg,
    overflow: "hidden",
  },
  grid: { display: "grid", gridTemplateColumns: "280px 1fr" },
  cover: {
    height: "100%", minHeight: 380,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", padding: 28,
  },
  coverIcon: { fontSize: 60, marginBottom: 16 },
  coverText: {
    fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)",
    textAlign: "center", textShadow: "0 2px 4px rgba(0,0,0,0.3)", lineHeight: 1.4,
  },
  details: { padding: "36px 40px" },
  tags: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  catTag: {
    fontSize: 12, fontWeight: 700, color: colors.accent,
    background: colors.accentLight, padding: "4px 12px", borderRadius: 999,
  },
  stockTag: {
    fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 999,
  },
  title: { fontSize: 30, fontWeight: 800, color: colors.text, margin: "0 0 8px", lineHeight: 1.2 },
  author: { fontSize: 15, color: colors.textSub, margin: "0 0 14px" },
  authorName: { color: colors.text, fontWeight: 600 },
  ratingRow: { display: "flex", alignItems: "center", gap: 4, marginBottom: 4 },
  ratingText: { fontSize: 13, color: colors.textSub, marginLeft: 6, fontWeight: 500 },
  divider: { height: 1, background: colors.border, margin: "20px 0" },
  description: { fontSize: 15, color: colors.textSub, lineHeight: 1.7, margin: 0 },
  orderSection: { display: "flex", flexDirection: "column", gap: 14 },
  qtyLabel: { fontSize: 13, fontWeight: 600, color: colors.textSub },
  qtyRow: { display: "flex", alignItems: "center", gap: 14 },
  qtyControl: {
    display: "flex", alignItems: "center",
    border: `2px solid ${colors.border}`, borderRadius: 10, overflow: "hidden",
  },
  qtyBtn: {
    width: 40, height: 40, border: "none", background: "#f8fafc",
    fontSize: 18, fontWeight: 700, cursor: "pointer", color: colors.text,
    fontFamily: font.sans,
  },
  qtyNum: {
    width: 44, textAlign: "center", fontSize: 16,
    fontWeight: 700, color: colors.text,
  },
  primaryBtn: {
    padding: "12px 28px", borderRadius: 12,
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#0f172a", fontWeight: 800, fontSize: 15, border: "none",
    cursor: "pointer", fontFamily: font.sans,
  },
  orderNote: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 12, color: colors.textMuted,
  },
};
