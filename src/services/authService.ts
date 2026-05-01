import api from "./api";
import { notificationAPI } from "./notificationService"; // Import this

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
  id?: string; // Add this - your backend might return user id
  userId?: string; // Alternative field name
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
  // Step 1: Register the user
  const response = await api.post("/auth/register", data);
  
  // Step 2: Get the user ID from registration response
  // Your auth service should return the user ID. If not, we need to login to get it
  let userId = response.data.id || response.data.userId;
  
  if (!userId) {
    // If registration doesn't return user ID, login to get it
    try {
      const loginResponse = await login({
        email: data.email,
        password: data.password
      });
      userId = loginResponse.id;
    } catch (loginError) {
      console.error("Could not get user ID after registration:", loginError);
    }
  }
  
  // Send welcome notification (don't await - let it happen in background)
  if (userId) {
    notificationAPI.send({
      userId: userId,
      type: "welcome",
      message: `Welcome to Bookstore, ${data.username}!  Start exploring our amazing collection.`
    }).then(() => {
      console.log(" Welcome notification sent successfully");
    }).catch((error) => {
      console.error(" Failed to send welcome notification:", error);
    });
  } else {
    console.error(" Cannot send welcome notification: No user ID available");
  }
  
  return response.data;
};
