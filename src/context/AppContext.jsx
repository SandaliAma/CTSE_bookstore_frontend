import { createContext, useContext, useState, useEffect } from "react";
import { USERS } from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(new Set());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("bookstore_user");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const login = (email, password) => {
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

  const register = (username, email, password) => {
    const welcomeNotif = {
      id: `n${Date.now()}`,
      userId: `u${Date.now()}`,
      message: `Welcome to BookStore, ${username}! We're glad to have you.`,
      type: "Welcome",
      status: "sent",
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);
    return true;
  };

  const placeOrder = (bookId, quantity) => {
    const book = books.find((b) => b.id === bookId);
    if (!book || book.stockCount < quantity) return false;

    const newOrder = {
      id: `o${Date.now()}`,
      userId: currentUser.id,
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

    const confirmNotif = {
      id: `n${Date.now()}`,
      userId: currentUser.id,
      message: `Your borrow request for '${book.title}' (x${quantity}) has been confirmed.`,
      type: "OrderConfirm",
      status: "sent",
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [confirmNotif, ...prev]);
    showToast(`Order placed for "${book.title}"!`);
    return true;
  };

  const cancelOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status !== "pending") return;

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
    );
    setBooks((prev) =>
      prev.map((b) =>
        b.id === order.bookId ? { ...b, stockCount: b.stockCount + order.quantity } : b
      )
    );

    const cancelNotif = {
      id: `n${Date.now()}`,
      userId: currentUser.id,
      message: `Your order for '${order.bookTitle}' has been cancelled.`,
      type: "Cancellation",
      status: "sent",
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [cancelNotif, ...prev]);
    showToast("Order cancelled.", "info");
  };

  const deleteNotification = (notifId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  const markRead = (notifId) => {
    setReadIds((prev) => new Set([...prev, notifId]));
  };

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const addBook = (bookData) => {
    const newBook = {
      id: `b${Date.now()}`,
      ...bookData,
      stockCount: parseInt(bookData.stockCount),
      color: "bg-indigo-500",
    };
    setBooks((prev) => [...prev, newBook]);
    showToast(`"${newBook.title}" added successfully!`);
  };

  const updateBook = (bookId, bookData) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? { ...b, ...bookData, stockCount: parseInt(bookData.stockCount) }
          : b
      )
    );
    showToast("Book updated successfully!");
  };

  const deleteBook = (bookId) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    showToast("Book deleted.", "info");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
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

export const useApp = () => useContext(AppContext);
