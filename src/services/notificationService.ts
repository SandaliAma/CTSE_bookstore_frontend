import type { Notification } from "../types";

const API_BASE = import.meta.env.VITE_NOTIFICATION_SERVICE_URL || "http://localhost:5004";

export const notificationAPI = {
  // GET /notifications?userId=xxx
  getByUser: async (userId: string): Promise<Notification[]> => {
    const res = await fetch(`${API_BASE}/notifications?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
  },

  // DELETE /notifications/:id
  remove: async (id: string): Promise<unknown> => {
    const res = await fetch(`${API_BASE}/notifications/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete notification");
    return res.json();
  },

  // POST /notify/send
  send: async ({ userId, type, message }: { userId: string; type: string; message: string }): Promise<unknown> => {
    const res = await fetch(`${API_BASE}/notify/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, type, message }),
    });
    if (!res.ok) throw new Error("Failed to send notification");
    return res.json();
  },
};
