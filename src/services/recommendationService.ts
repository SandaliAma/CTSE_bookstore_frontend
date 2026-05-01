import api from "./api";

export const recommendationAPI = {
  // GET /api/recommendation/trending - top 5 most expensive books
  getTrending: async () => {
    const res = await api.get("/api/recommendation/trending");
    return res.data;
  },

  // GET /api/recommendation/limited - 3 books with lowest stock
  getLimited: async () => {
    const res = await api.get("/api/recommendation/limited");
    return res.data;
  },
};
