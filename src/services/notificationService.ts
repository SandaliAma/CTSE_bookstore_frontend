import api from "./api";
import type { Notification } from "../types";

export const notificationAPI = {
  // GET /notifications?userId=xxx
  getByUser: async (userId: string): Promise<Notification[]> => {
    const res = await api.get(`/notifications?userId=${userId}`);
    return res.data;
  },

  // DELETE /notifications/:id
  remove: async (id: string): Promise<unknown> => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  },

  // POST /notify/send
  send: async ({ userId, type, message }: { userId: string; type: string; message: string }): Promise<unknown> => {
    const res = await api.post("/notify/send", { userId, type, message });
    return res.data;
  },
};
