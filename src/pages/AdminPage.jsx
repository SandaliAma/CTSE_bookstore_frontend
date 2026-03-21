import { useState } from "react";
import { useApp } from "../context/AppContext";
import BookModal from "../components/BookModal";
import { colors, shadows, font, radius } from "../styles/theme";

const STOCK_STATUS = (n) =>
  n === 0     ? { text: "Out of Stock", bg: colors.redLight, color: colors.red }
  : n <= 5    ? { text: "Low Stock",    bg: "#fffbeb",       color: "#d97706" }
               : { text: "In Stock",    bg: colors.greenLight, color: colors.green };

export default function AdminPage() {
  const { books, addBook, updateBook, deleteBook } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (book) => { setEditBook(book); setModalOpen(true); };
  const handleAdd  = () => { setEditBook(null); setModalOpen(true); };
  const handleSave = (form) => { editBook ? updateBook(editBook.id, form) : addBook(form); };

  const stats = [
    { label: "Total Books",   value: books.length,                                  icon: "📚", color: colors.accent, light: colors.accentLight },
    { label: "In Stock",      value: books.filter(b => b.stockCount > 0).length,    icon: "✅", color: colors.green,  light: colors.greenLight },
    { label: "Low Stock",     value: books.filter(b => b.stockCount > 0 && b.stockCount <= 5).length, icon: "⚠️", color: "#d97706", light: "#fffbeb" },
    { label: "Out of Stock",  value: books.filter(b => b.stockCount === 0).length,  icon: "❌", color: colors.red,   light: colors.redLight },
  ];

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div>
            <h1 style={s.pageTitle}>Admin Panel</h1>
            <p style={s.pageSub}>Manage your book catalog</p>
          </div>
          <button onClick={handleAdd} style={s.addBtn}>+ Add New Book</button>
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

        {/* Table card */}
        <div style={s.tableCard}>
          <div style={s.tableHeader}>
            <h2 style={s.tableTitle}>All Books <span style={s.tableCount}>({filtered.length})</span></h2>
            <div style={s.searchWrap}>
              <span style={{ fontSize: 14, color: colors.textMuted }}>🔍</span>
              <input
                style={s.searchInput}
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={{ ...s.th, width: 300 }}>Book</th>
                  <th style={s.th}>Category</th>
                  <th style={s.th}>Stock</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book, i) => {
                  const st = STOCK_STATUS(book.stockCount);
                  return (
                    <tr key={book.id} style={{ ...s.tr, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={s.td}>
                        <div style={s.bookCell}>
                          <div style={{ ...s.bookThumb, background: bookGradient(book.color) }}>
                            📖
                          </div>
                          <div>
                            <p style={s.bookName}>{book.title}</p>
                            <p style={s.bookAuthor}>{book.author}</p>
                          </div>
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={s.catPill}>{book.category}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.stockPill, background: st.bg, color: st.color }}>
                          {book.stockCount > 0 ? book.stockCount : "—"} · {st.text}
                        </span>
                      </td>
                      <td style={{ ...s.td, textAlign: "right" }}>
                        <div style={s.actions}>
                          <button
                            onClick={() => handleEdit(book)}
                            style={s.editBtn}
                            onMouseOver={(e) => (e.currentTarget.style.background = colors.blueLight)}
                            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            ✏ Edit
                          </button>
                          <button
                            onClick={() => setConfirmDelete(book)}
                            style={s.deleteBtn}
                            onMouseOver={(e) => (e.currentTarget.style.background = colors.redLight)}
                            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div style={s.emptyTable}>No books match your search.</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <BookModal
          book={editBook}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditBook(null); }}
        />
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div style={s.overlay}>
          <div style={s.confirmCard}>
            <div style={s.confirmIcon}>🗑️</div>
            <h3 style={s.confirmTitle}>Delete this book?</h3>
            <p style={s.confirmMsg}>
              "<strong>{confirmDelete.title}</strong>" will be permanently removed from the catalog.
            </p>
            <div style={s.confirmBtns}>
              <button onClick={() => setConfirmDelete(null)} style={s.cancelBtn}>Keep It</button>
              <button onClick={() => { deleteBook(confirmDelete.id); setConfirmDelete(null); }} style={s.confirmDeleteBtn}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  header: { background: "linear-gradient(135deg, #0f172a, #1e293b)", padding: "32px 0 28px" },
  headerInner: {
    maxWidth: 1280, margin: "0 auto", padding: "0 28px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  pageTitle: { fontSize: 28, fontWeight: 800, color: "#f8fafc", margin: "0 0 4px" },
  pageSub: { fontSize: 14, color: "#94a3b8" },
  addBtn: {
    padding: "11px 22px", borderRadius: 10,
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#0f172a", fontWeight: 800, fontSize: 14, border: "none",
    cursor: "pointer", fontFamily: font.sans,
  },
  content: { maxWidth: 1280, margin: "0 auto", padding: "28px" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 },
  statCard: {
    background: colors.card, border: `1px solid ${colors.border}`,
    borderRadius: radius.lg, padding: "18px 20px",
    display: "flex", alignItems: "center", gap: 14, boxShadow: shadows.sm,
  },
  statIcon: {
    width: 44, height: 44, borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
  },
  statValue: { fontSize: 22, fontWeight: 800, color: colors.text, margin: "0 0 2px" },
  statLabel: { fontSize: 12, color: colors.textSub, fontWeight: 500 },
  tableCard: {
    background: colors.card, borderRadius: radius.xl,
    border: `1px solid ${colors.border}`, boxShadow: shadows.md,
    overflow: "hidden",
  },
  tableHeader: {
    padding: "20px 24px", borderBottom: `1px solid ${colors.border}`,
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
  },
  tableTitle: { fontSize: 16, fontWeight: 700, color: colors.text, margin: 0 },
  tableCount: { color: colors.textMuted, fontSize: 14, fontWeight: 500 },
  searchWrap: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#f8fafc", border: `1.5px solid ${colors.border}`,
    borderRadius: 8, padding: "7px 12px",
  },
  searchInput: {
    border: "none", background: "transparent", fontSize: 13,
    color: colors.text, outline: "none", fontFamily: font.sans, width: 200,
  },
  table: { width: "100%", borderCollapse: "collapse", fontFamily: font.sans },
  thead: { background: "#f8fafc", borderBottom: `2px solid ${colors.border}` },
  th: {
    padding: "12px 20px", textAlign: "left",
    fontSize: 12, fontWeight: 700, color: colors.textSub,
    textTransform: "uppercase", letterSpacing: "0.5px",
  },
  tr: { borderBottom: `1px solid ${colors.border}`, transition: "background 0.1s" },
  td: { padding: "14px 20px", fontSize: 14, color: colors.text },
  bookCell: { display: "flex", alignItems: "center", gap: 12 },
  bookThumb: {
    width: 38, height: 46, borderRadius: 6, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
  },
  bookName: { fontSize: 14, fontWeight: 700, color: colors.text, margin: "0 0 2px" },
  bookAuthor: { fontSize: 12, color: colors.textSub },
  catPill: {
    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
    background: colors.accentLight, color: colors.accentDark,
  },
  priceVal: { fontSize: 15, fontWeight: 800, color: colors.text },
  stockPill: { fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 999 },
  actions: { display: "flex", gap: 8, justifyContent: "flex-end" },
  editBtn: {
    padding: "7px 14px", border: `1.5px solid ${colors.blue}`, borderRadius: 8,
    background: "transparent", color: colors.blue, fontSize: 12, fontWeight: 600,
    cursor: "pointer", fontFamily: font.sans, transition: "background 0.15s",
  },
  deleteBtn: {
    padding: "7px 14px", border: `1.5px solid ${colors.red}`, borderRadius: 8,
    background: "transparent", color: colors.red, fontSize: 12, fontWeight: 600,
    cursor: "pointer", fontFamily: font.sans, transition: "background 0.15s",
  },
  emptyTable: { textAlign: "center", padding: "40px", color: colors.textSub, fontSize: 14 },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: 20,
  },
  confirmCard: {
    background: colors.card, borderRadius: radius.xl,
    padding: "32px", maxWidth: 380, width: "100%",
    boxShadow: shadows.xl, textAlign: "center",
  },
  confirmIcon: { fontSize: 44, marginBottom: 12 },
  confirmTitle: { fontSize: 18, fontWeight: 800, color: colors.text, margin: "0 0 8px" },
  confirmMsg: { fontSize: 14, color: colors.textSub, lineHeight: 1.6, margin: "0 0 24px" },
  confirmBtns: { display: "flex", gap: 12 },
  cancelBtn: {
    flex: 1, padding: "11px", border: `1.5px solid ${colors.border}`, borderRadius: 10,
    background: colors.card, color: colors.textSub, fontSize: 14, fontWeight: 600,
    cursor: "pointer", fontFamily: font.sans,
  },
  confirmDeleteBtn: {
    flex: 1, padding: "11px", border: "none", borderRadius: 10,
    background: colors.red, color: "#fff", fontSize: 14, fontWeight: 700,
    cursor: "pointer", fontFamily: font.sans,
  },
};
