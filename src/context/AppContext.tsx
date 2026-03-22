import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { USERS } from "../data/mockData";
import { notificationAPI } from "../services/notificationService";
import type { User, Book, Order, Notification, Toast, BookFormData, AppContextType } from "../types";

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<Toast | null>(null);
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("bookstore_user");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  // Fetch notifications from backend whenever user changes
  const fetchNotifications = useCallback(async (userId: string) => {
    if (!userId) return;
    setNotifLoading(true);
    try {
      const data = await notificationAPI.getByUser(userId);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setNotifLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      fetchNotifications(currentUser.id);
    } else {
      setNotifications([]);
    }
  }, [currentUser, fetchNotifications]);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const login = (email: string, password: string): string | null => {
    const user = USERS.find((u) => u.email === email && u.password === password);
    if (!user) return null;
    const { password: _, ...safeUser } = user;
    setCurrentUser(safeUser);
    localStorage.setItem("bookstore_user", JSON.stringify(safeUser));
    return safeUser.role;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("bookstore_user");
  };

  const register = async (username: string, email: string, _password: string): Promise<boolean> => {
    // After registration, send a Welcome notification via backend
    try {
      const userId = `u${Date.now()}`;
      await notificationAPI.send({
        userId,
        type: "Welcome",
        message: `Welcome to BookStore, ${username}! We're glad to have you.`,
      });
    } catch (err) {
      console.error("Failed to send welcome notification:", err);
    }
    return true;
  };

  const placeOrder = async (bookId: string, quantity: number): Promise<boolean> => {
    const book = books.find((b) => b.id === bookId);
    if (!book || book.stockCount < quantity) return false;

    const newOrder: Order = {
      id: `o${Date.now()}`,
      userId: currentUser!.id,
      bookId,
      bookTitle: book.title,
      quantity,
      status: "pending",
      orderDate: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, stockCount: b.stockCount - quantity } : b))
    );

    // Send OrderConfirm notification via backend
    try {
      await notificationAPI.send({
        userId: currentUser!.id,
        type: "OrderConfirm",
        message: `Your borrow request for '${book.title}' (x${quantity}) has been confirmed.`,
      });
      await fetchNotifications(currentUser!.id);
    } catch (err) {
      console.error("Failed to send order notification:", err);
    }
    showToast(`Order placed for "${book.title}"!`);
    return true;
  };

  const cancelOrder = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status !== "pending") return;

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" as const } : o))
    );
    setBooks((prev) =>
      prev.map((b) =>
        b.id === order.bookId ? { ...b, stockCount: b.stockCount + order.quantity } : b
      )
    );

    // Send Cancellation notification via backend
    try {
      await notificationAPI.send({
        userId: currentUser!.id,
        type: "Cancellation",
        message: `Your order for '${order.bookTitle}' has been cancelled.`,
      });
      await fetchNotifications(currentUser!.id);
    } catch (err) {
      console.error("Failed to send cancellation notification:", err);
    }
    showToast("Order cancelled.", "info");
  };

  const deleteNotification = async (notifId: string) => {
    try {
      await notificationAPI.remove(notifId);
      setNotifications((prev) => prev.filter((n) => n._id !== notifId));
    } catch (err) {
      console.error("Failed to delete notification:", err);
      showToast("Failed to delete notification", "error");
    }
  };

  const markRead = (notifId: string) => {
    setReadIds((prev) => new Set([...prev, notifId]));
  };

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n._id)));
  };

  const unreadCount = notifications.filter((n) => !readIds.has(n._id)).length;

  const addBook = (bookData: BookFormData) => {
    const newBook: Book = {
      id: `b${Date.now()}`,
      ...bookData,
      stockCount: parseInt(String(bookData.stockCount)),
      color: "bg-indigo-500",
    };
    setBooks((prev) => [...prev, newBook]);
    showToast(`"${newBook.title}" added successfully!`);
  };

  const updateBook = (bookId: string, bookData: BookFormData) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? { ...b, ...bookData, stockCount: parseInt(String(bookData.stockCount)) }
          : b
      )
    );
    showToast("Book updated successfully!");
  };

  const deleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    showToast("Book deleted.", "info");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        books,
        orders,
        notifications,
        readIds,
        unreadCount,
        toast,
        login,
        logout,
        register,
        placeOrder,
        cancelOrder,
        deleteNotification,
        markRead,
        markAllRead,
        notifLoading,
        fetchNotifications,
        addBook,
        updateBook,
        deleteBook,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
