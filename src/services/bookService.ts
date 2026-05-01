import api from "./api";

export const bookAPI = {
  // GET /api/books
  getAll: async () => {
    const res = await api.get("/api/books");
    return res.data;
  },

  // GET /api/books/:id
  getById: async (id: string) => {
    const res = await api.get(`/api/books/${id}`);
    return res.data;
  },

  // POST /api/books (multipart form data)
  create: async (data: {
    title: string;
    author: string;
    category: string;
    price: number;
    stockCount: number;
    createdBy: string;
    image?: File;
  }) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("category", data.category);
    formData.append("price", String(data.price));
    formData.append("stockCount", String(data.stockCount));
    formData.append("createdBy", data.createdBy);
    if (data.image) {
      formData.append("image", data.image);
    }
    const res = await api.post("/api/books", formData, {
      headers: { "Content-Type": undefined },
    });
    return res.data;
  },

  // PATCH /api/books/update/:id
  update: async (
    id: string,
    data: {
      title?: string;
      author?: string;
      category?: string;
      price?: number;
      stockCount?: number;
      image?: File;
    },
  ) => {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.author) formData.append("author", data.author);
    if (data.category) formData.append("category", data.category);
    if (data.price !== undefined) formData.append("price", String(data.price));
    if (data.stockCount !== undefined)
      formData.append("stockCount", String(data.stockCount));
    if (data.image) formData.append("image", data.image);
    const res = await api.patch(`/api/books/update/${id}`, formData, {
      headers: { "Content-Type": undefined },
    });
    return res.data;
  },

  // DELETE /api/books/delete/:id
  delete: async (id: string) => {
    const res = await api.delete(`/api/books/delete/${id}`);
    return res.data;
  },
};
