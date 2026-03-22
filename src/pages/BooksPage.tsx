import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";
import { colors, shadows, font, radius } from "../styles/theme";
import type { Book } from "../types";
import api from "../services/api";

function useBookImage(imageLink?: string) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!imageLink) return;
    // Convert the catalog service URL to go through gateway
    const gatewayUrl = imageLink.replace(/http:\/\/localhost:\d+/, "");
    api.get(gatewayUrl, { responseType: "blob" })
      .then((res) => setSrc(URL.createObjectURL(res.data)))
      .catch(() => setSrc(null));
  }, [imageLink]);
  return src;
}

const categoryGradients: Record<string, string> = {
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

function bookGradient(category: string): string {
  return categoryGradients[category] || "linear-gradient(135deg, #818cf8, #6366f1)";
}

export default function BooksPage() {
  const { books } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = books.filter((b) => {
    const q = search.toLowerCase();
    return (
      (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) &&
      (category === "All" || b.category === category)
    );
  });

  return (
    <div style={s.page}>
      {/* Page header */}
      <div style={s.pageHeader}>
        <div style={s.pageHeaderInner}>
          <div>
            <h1 style={s.pageTitle}>Book Catalog</h1>
            <p style={s.pageSub}>{filtered.length} of {books.length} books</p>
          </div>
        </div>
      </div>

      <div style={s.content}>
        {/* Search + filter */}
        <div style={s.toolbar}>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>🔍</span>
            <input
              style={s.searchInput}
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} style={s.clearBtn}>✕</button>
            )}
          </div>

          <div style={s.catScroll}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                style={{ ...s.catBtn, ...(category === cat ? s.catBtnActive : {}) }}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 52 }}>🔍</div>
            <h3 style={s.emptyTitle}>No books found</h3>
            <p style={s.emptySub}>Try a different search term or category.</p>
          </div>
        ) : (
          <div style={s.grid}>
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} gradient={bookGradient(book.category)} onClick={() => navigate(`/books/${book.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface BookCardProps {
  book: Book;
  gradient: string;
  onClick: () => void;
}

function BookCard({ book, gradient, onClick }: BookCardProps) {
  const [hovered, setHovered] = useState(false);
  const imageSrc = useBookImage(book.imageLink);

  const stockStatus = book.stockCount === 0
    ? { text: "Out of Stock", bg: colors.redLight, color: colors.red }
    : book.stockCount <= 5
    ? { text: `Only ${book.stockCount} left`, bg: "#fffbeb", color: "#d97706" }
    : { text: "In Stock", bg: colors.greenLight, color: colors.green };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...s.card,
        boxShadow: hovered ? shadows.lg : shadows.sm,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* Cover */}
      <div style={{ ...s.cover, background: gradient }}>
        {imageSrc && (
          <img src={imageSrc} alt={book.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div style={s.coverOverlay}>
          {!imageSrc && <div style={s.bookIcon}>📖</div>}
          <div style={s.coverInfo}>
            <p style={s.coverTitle}>{book.title}</p>
          </div>
        </div>
        {hovered && (
          <div style={s.viewOverlay}>
            <span style={s.viewText}>View Details →</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={s.info}>
        <p style={s.catTag}>{book.category}</p>
        <p style={s.title}>{book.title}</p>
        <p style={s.author}>by {book.author}</p>
        <div style={s.footer}>
          <span style={{ ...s.stock, background: stockStatus.bg, color: stockStatus.color }}>
            {stockStatus.text}
          </span>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: colors.pageBg, fontFamily: font.sans },
  pageHeader: {
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    padding: "32px 0 28px",
  },
  pageHeaderInner: { maxWidth: 1280, margin: "0 auto", padding: "0 28px" },
  pageTitle: { fontSize: 28, fontWeight: 800, color: "#f8fafc", margin: "0 0 4px" },
  pageSub: { fontSize: 14, color: "#94a3b8" },
  content: { maxWidth: 1280, margin: "0 auto", padding: "24px 28px" },
  toolbar: {
    background: colors.card, borderRadius: radius.lg,
    border: `1px solid ${colors.border}`, padding: "18px 20px",
    marginBottom: 24, boxShadow: shadows.sm,
    display: "flex", flexDirection: "column", gap: 14,
  },
  searchWrap: {
    display: "flex", alignItems: "center", gap: 10,
    background: "#f8fafc", border: `1.5px solid ${colors.border}`,
    borderRadius: 10, padding: "0 14px",
  },
  searchIcon: { fontSize: 15, flexShrink: 0 },
  searchInput: {
    flex: 1, border: "none", background: "transparent",
    padding: "11px 0", fontSize: 14, color: colors.text,
    outline: "none", fontFamily: font.sans,
  },
  clearBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: colors.textMuted, fontSize: 12, padding: "4px",
  },
  catScroll: { display: "flex", gap: 8, flexWrap: "wrap" },
  catBtn: {
    padding: "7px 16px", borderRadius: 999, border: `1.5px solid ${colors.border}`,
    background: colors.card, color: colors.textSub, fontSize: 13, fontWeight: 500,
    cursor: "pointer", fontFamily: font.sans, transition: "all 0.15s",
  },
  catBtnActive: {
    background: colors.accent, borderColor: colors.accent,
    color: "#0f172a", fontWeight: 700,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 20,
  },
  card: {
    background: colors.card, borderRadius: radius.lg,
    border: `1px solid ${colors.border}`,
    overflow: "hidden", cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex", flexDirection: "column",
  },
  cover: {
    height: 160, position: "relative",
    display: "flex", alignItems: "flex-end",
  },
  coverOverlay: {
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column",
    justifyContent: "space-between", padding: 14,
  },
  bookIcon: { fontSize: 30, alignSelf: "flex-end" },
  coverInfo: {},
  coverTitle: {
    fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)",
    textShadow: "0 1px 3px rgba(0,0,0,0.4)", lineHeight: 1.3,
    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  viewOverlay: {
    position: "absolute", inset: 0,
    background: "rgba(0,0,0,0.45)", display: "flex",
    alignItems: "center", justifyContent: "center",
    borderRadius: "inherit",
  },
  viewText: { color: "#fff", fontWeight: 700, fontSize: 14 },
  info: { padding: "14px", flex: 1, display: "flex", flexDirection: "column", gap: 4 },
  catTag: {
    fontSize: 10, fontWeight: 700, color: colors.accent,
    textTransform: "uppercase", letterSpacing: "0.5px",
  },
  title: {
    fontSize: 13.5, fontWeight: 700, color: colors.text, lineHeight: 1.3,
    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  author: { fontSize: 11.5, color: colors.textSub, marginBottom: 8 },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" },
  stock: { fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999 },
  empty: {
    textAlign: "center", padding: "80px 0",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
  },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: colors.text },
  emptySub: { fontSize: 14, color: colors.textSub },
};
