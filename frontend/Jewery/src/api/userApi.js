// src/api/userApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // matches your backend prefix
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

// --- Update a user (requires authentication token)
export const updateUser = (id, userData, token) => {
  return API.put(`/users/${id}`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// --- Delete a user (requires authentication token)
export const deleteUser = (id, token) => {
  return API.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// --- Login (to get token if needed)
export const loginUser = (credentials) => {
  return API.post("/users/login", credentials);
};
