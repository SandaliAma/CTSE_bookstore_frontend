import api from "./api";

export const orderAPI = {
  // POST /api/orders/ - Create order
  create: async (data: { userId: string; bookId: string; quantity: number }) => {
    const res = await api.post("/orders", data);
    return res.data;
  },

  // GET /api/orders/history/:userId - Get user's orders
  getByUser: async (userId: string) => {
    const res = await api.get(`/orders/history/${userId}`);
    return res.data;
  },

  // GET /api/orders/:orderId - Get specific order
  getById: async (orderId: string) => {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
  },

  // PUT /api/orders/:orderId/cancel - Cancel order
  cancel: async (orderId: string) => {
    const res = await api.put(`/orders/${orderId}/cancel`);
    return res.data;
  },
};
