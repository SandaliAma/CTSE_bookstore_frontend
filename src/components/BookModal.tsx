import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { colors, font, radius, shadows } from "../styles/theme";
import type { Book, BookFormData } from "../types";

interface BookModalProps {
  book: Book | null;
  onSave: (form: BookFormData, image?: File) => void;
  onClose: () => void;
}

export default function BookModal({ book, onSave, onClose }: BookModalProps) {
  const [form, setForm] = useState<BookFormData>({ title: "", author: "", category: "", price: 0, stockCount: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (book) setForm({ title: book.title, author: book.author, category: book.category, price: book.price || 0, stockCount: book.stockCount, description: book.description || "" });
  }, [book]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form, imageFile || undefined); onClose(); };

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <div>
            <h2 style={s.title}>{book ? "Edit Book" : "Add New Book"}</h2>
            <p style={s.sub}>{book ? "Update the book details below." : "Fill in the details for the new book."}</p>
          </div>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          <Field label="Book Title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. The Great Gatsby" required />
          <Field label="Author" name="author" value={form.author} onChange={handleChange} placeholder="e.g. F. Scott Fitzgerald" required />

          <div style={s.field}>
            <label style={s.label}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} required style={s.select}>
              <option value="">Select a category...</option>
              {["Romance","Thriller","Fantasy","Science","Horror","Self-help","Health","Cookbooks","Poetry"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <Field label="Price" name="price" type="number" min="0" value={form.price || ""} onChange={handleChange} required />
          <Field label="Stock Count" name="stockCount" type="number" min="0" value={form.stockCount} onChange={handleChange} required />

          <div style={s.field}>
            <label style={s.label}>Book Cover Image {!book && "*"}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              required={!book}
              style={{
                border: `1.5px solid ${colors.border}`, borderRadius: 8,
                padding: "10px 13px", fontSize: 14, color: colors.text,
                background: "#fafafa", fontFamily: font.sans,
              }}
            />
          </div>

          <div style={s.footer}>
            <button type="button" onClick={onClose} style={s.cancelBtn}>Cancel</button>
            <button type="submit" style={s.submitBtn}>
              {book ? "Save Changes" : "Add Book"} →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
}

function Field({ label, name, value, onChange, type = "text", placeholder, ...rest }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: colors.textSub, textTransform: "uppercase" as const, letterSpacing: "0.4px", fontFamily: font.sans }}>
        {label}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          border: `1.5px solid ${colors.border}`, borderRadius: 8,
          padding: "10px 13px", fontSize: 14, color: colors.text,
          outline: "none", background: "#fafafa", fontFamily: font.sans,
        }}
        onFocus={(e) => (e.target.style.borderColor = colors.accent)}
        onBlur={(e) => (e.target.style.borderColor = colors.border)}
        {...rest}
      />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 500, padding: 20,
  },
  modal: {
    background: colors.card, borderRadius: radius.xl,
    boxShadow: shadows.xl, width: "100%", maxWidth: 500,
    maxHeight: "90vh", overflowY: "auto",
    fontFamily: font.sans,
  },
  header: {
    padding: "24px 28px", borderBottom: `1px solid ${colors.border}`,
    display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
    position: "sticky", top: 0, background: colors.card, zIndex: 1,
    borderRadius: `${radius.xl}px ${radius.xl}px 0 0`,
  },
  title: { fontSize: 18, fontWeight: 800, color: colors.text, margin: "0 0 3px" },
  sub: { fontSize: 13, color: colors.textSub },
  closeBtn: {
    width: 32, height: 32, borderRadius: 8, border: `1px solid ${colors.border}`,
    background: "transparent", cursor: "pointer", fontSize: 14,
    color: colors.textMuted, fontFamily: font.sans,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  form: { padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 700, color: colors.textSub, textTransform: "uppercase", letterSpacing: "0.4px" },
  select: {
    border: `1.5px solid ${colors.border}`, borderRadius: 8,
    padding: "10px 13px", fontSize: 14, color: colors.text,
    outline: "none", background: "#fafafa", fontFamily: font.sans,
  },
  textarea: {
    border: `1.5px solid ${colors.border}`, borderRadius: 8,
    padding: "10px 13px", fontSize: 14, color: colors.text,
    outline: "none", background: "#fafafa", fontFamily: font.sans,
    resize: "vertical",
  },
  footer: { display: "flex", gap: 12, paddingTop: 4 },
  cancelBtn: {
    flex: 1, padding: "11px", border: `1.5px solid ${colors.border}`, borderRadius: 10,
    background: "transparent", color: colors.textSub, fontSize: 14, fontWeight: 600,
    cursor: "pointer", fontFamily: font.sans,
  },
  submitBtn: {
    flex: 1, padding: "11px", border: "none", borderRadius: 10,
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#0f172a", fontSize: 14, fontWeight: 800,
    cursor: "pointer", fontFamily: font.sans,
  },
};
