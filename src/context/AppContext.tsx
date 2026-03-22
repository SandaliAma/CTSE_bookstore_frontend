import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { notificationAPI } from "../services/notificationService";
import { bookAPI } from "../services/bookService";
import { orderAPI } from "../services/orderService";
import type { User, Book, Order, Notification, Toast, BookFormData, AppContextType } from "../types";
import { USERS } from "../data/mockData";

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

  // Fetch books from Catalog Service
  const fetchBooks = useCallback(async () => {
    try {
      const data = await bookAPI.getAll();
      const mapped = (Array.isArray(data) ? data : []).map((b: any) => ({
        ...b,
        id: b._id || b.id,
      }));
      setBooks(mapped);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  }, []);

  // Fetch orders from Order Service
  const fetchOrders = useCallback(async (userId: string) => {
    try {
      const res = await orderAPI.getByUser(userId);
      const data = res.data || res;
      const mapped = (Array.isArray(data) ? data : []).map((o: any) => ({
        id: o.orderId || o._id || o.id,
        userId: o.userId,
        bookId: o.bookId,
        bookTitle: o.bookTitle || "",
        quantity: o.quantity,
        status: o.status,
        orderDate: o.orderDate || o.createdAt,
      }));
      setOrders(mapped);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchBooks();
      fetchOrders(currentUser.id);
    }
  }, [currentUser, fetchBooks, fetchOrders]);

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

    try {
      const res = await orderAPI.create({
        userId: currentUser!.id,
        bookId,
        quantity,
      });

      // Optimistically add to local state
      const newOrder: Order = {
        id: res.data?.orderId || res.data?._id || `o${Date.now()}`,
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

      // Send OrderConfirm notification
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
    } catch (err) {
      console.error("Failed to place order:", err);
      showToast("Failed to place order", "error");
      return false;
    }
  };

  const cancelOrder = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status !== "pending") return;

    try {
      await orderAPI.cancel(orderId);

      // Optimistically update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" as const } : o))
      );
      setBooks((prev) =>
        prev.map((b) =>
          b.id === order.bookId ? { ...b, stockCount: b.stockCount + order.quantity } : b
        )
      );

      // Send Cancellation notification
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
    } catch (err) {
      console.error("Failed to cancel order:", err);
      showToast("Failed to cancel order", "error");
    }
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

  const addBook = async (bookData: BookFormData, image?: File) => {
    try {
      const res = await bookAPI.create({
        title: bookData.title,
        author: bookData.author,
        category: bookData.category,
        price: Number(bookData.price) || 0,
        stockCount: parseInt(String(bookData.stockCount)),
        createdBy: currentUser?.id || "",
        image,
      });
      // Optimistically add to local state while background refresh happens
      const newBook = {
        id: res.bookId || `temp_${Date.now()}`,
        title: bookData.title,
        author: bookData.author,
        category: bookData.category,
        price: Number(bookData.price) || 0,
        stockCount: parseInt(String(bookData.stockCount)),
      };
      setBooks((prev) => [...prev, newBook]);
      showToast(`"${bookData.title}" added successfully!`);
    } catch (err) {
      console.error("Failed to add book:", err);
      showToast("Failed to add book", "error");
    }
  };

  const updateBook = async (bookId: string, bookData: BookFormData, image?: File) => {
    try {
      await bookAPI.update(bookId, {
        title: bookData.title,
        author: bookData.author,
        category: bookData.category,
        price: Number(bookData.price) || 0,
        stockCount: parseInt(String(bookData.stockCount)),
        image,
      });
      // Optimistically update local state
      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId
            ? { ...b, ...bookData, price: Number(bookData.price) || 0, stockCount: parseInt(String(bookData.stockCount)) }
            : b
        )
      );
      showToast("Book updated successfully!");
    } catch (err) {
      console.error("Failed to update book:", err);
      showToast("Failed to update book", "error");
    }
  };

  const deleteBook = async (bookId: string) => {
    try {
      await bookAPI.delete(bookId);
      await fetchBooks();
      showToast("Book deleted.", "info");
    } catch (err) {
      console.error("Failed to delete book:", err);
      showToast("Failed to delete book", "error");
    }
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
