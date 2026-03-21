// Auth — keep until backend is connected
export const USERS = [
  { id: "u1", username: "john_doe",    email: "john@example.com", password: "password123", role: "user" },
  { id: "u2", username: "admin_sara",  email: "sara@example.com", password: "admin123",    role: "admin" },
];

// UI constant — category filter list (not from backend)
export const CATEGORIES = ["All", "Fiction", "Science", "History", "Technology", "Self-Help", "Sci-Fi", "Psychology"];

// Books, Orders, Notifications — will come from backend APIs
// Initialized as empty; populate via AppContext when backend is connected
