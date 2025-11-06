// src/api/userApi.js
import axios from "axios";

// ✅ สร้าง instance ของ axios
const API = axios.create({
  baseURL: "http://localhost:5000/api", // ต้องตรงกับ backend
});

// ✅ Interceptor: แนบ token ทุกครั้งก่อนส่ง request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- Get all users
export const getUsers = () => {
  return API.get("/users");
};

// --- Get single user by ID
export const getUserById = (id) => {
  return API.get(`/users/${id}`);
};

// --- Create / register a user
export const createUser = (userData) => {
  return API.post("/users", userData);
};

// --- Update user (ไม่ต้องส่ง token แล้ว)
export const updateUser = (id, userData) => {
  return API.put(`/users/update/${id}`, userData);
};

// --- Delete user (ไม่ต้องส่ง token แล้ว)
export const deleteUser = (id) => {
  return API.delete(`/users/delete/${id}`);
};

// --- Login (เพื่อรับ token ใหม่)
export const loginUser = (credentials) => {
  return API.post("/users/login", credentials);
};
