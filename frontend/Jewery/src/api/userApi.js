// src/api/userApi.js
import axios from "axios";

// ✅ Create axios instance
const API = axios.create({
   baseURL: `${import.meta.env.VITE_API_URL}/api`,
 });

// ✅ Automatically attach JWT token if present
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// === USERS API ===
// === USERS API ===

// Get all users
export const getUsers = () => API.get("/users");

// Get single user by ID
export const getUserById = (id) => API.get(`/users/${id}`);

// Register (Create) new user
// Register (Create) new user
export const createUser = (userData) => API.post("/users/register", userData);

// Update user info
export const updateUser = (id, data) => API.put(`/users/update/${id}`, data);

// Delete user
// Delete user
export const deleteUser = (id) => API.delete(`/users/delete/${id}`);

// Login user
export const loginUser = (credentials) => API.post("/users/login", credentials);
