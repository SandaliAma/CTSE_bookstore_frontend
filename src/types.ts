export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

export interface UserWithPassword extends User {
  password: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  stockCount: number;
  description: string;
  color: string;
}

export interface BookFormData {
  title: string;
  author: string;
  category: string;
  stockCount: string | number;
  description: string;
}

export interface Order {
  id: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  quantity: number;
  status: "pending" | "completed" | "cancelled";
  orderDate: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: "Welcome" | "OrderConfirm" | "Cancellation";
  message: string;
  status: string;
  timestamp: string;
}

export interface Toast {
  message: string;
  type: "success" | "info" | "error";
}

export interface AppContextType {
  currentUser: User | null;
  books: Book[];
  orders: Order[];
  notifications: Notification[];
  readIds: Set<string>;
  unreadCount: number;
  toast: Toast | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  placeOrder: (bookId: string, quantity: number) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<void>;
  deleteNotification: (notifId: string) => Promise<void>;
  markRead: (notifId: string) => void;
  markAllRead: () => void;
  notifLoading: boolean;
  fetchNotifications: (userId: string) => Promise<void>;
  addBook: (bookData: BookFormData) => void;
  updateBook: (bookId: string, bookData: BookFormData) => void;
  deleteBook: (bookId: string) => void;
  showToast: (message: string, type?: "success" | "info" | "error") => void;
}
