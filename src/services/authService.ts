import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: "user" | "admin" | string;
  id: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin" | string;
}

export interface RegisterResponse {
  msg: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);
  localStorage.setItem(
    "bookstore_user",
    JSON.stringify({
      id: response.data.id,
      username: response.data.username,
      role: response.data.role,
      email: data.email,
    }),
  );
  return response.data;
};

export const registerUser = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};
