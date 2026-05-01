import axios from "axios";

// Create a dedicated axios instance for order service
const orderApi = axios.create({
  baseURL: "https://ctse-order-service.onrender.com/orders",
  headers: {
    "Content-Type": "application/json",
  },
});

export const orderAPI = {
  // POST /orders - Create order
  create: async (data: { userId: string; bookId: string; quantity: number }) => {
    const token = localStorage.getItem('token');
    const res = await orderApi.post("/", data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },

 
  // GET /orders/history/:userId - Get user's orders
  getByUser: async (userId: string) => {
    const res = await orderApi.get(`/history/${userId}`);
    return res.data;
  },

  // GET /orders/:orderId - Get specific order
  getById: async (orderId: string) => {
    const res = await orderApi.get(`/${orderId}`);
    return res.data;
  },

  // PUT /orders/:orderId/cancel - Cancel order
  cancel: async (orderId: string) => {
    const res = await orderApi.put(`/${orderId}/cancel`);
    return res.data;
  },
};