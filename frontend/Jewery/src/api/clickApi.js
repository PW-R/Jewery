// src/api/clickApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// === Record a product view (user click history) ===
export const recordUserViewHistory = async (data) => {
  return API.post("/clicks/history", data);
};

// === Get user's view history ===
export const getUserViewHistory = async (userId) => {
  return API.get(`/clicks/history/${userId}`);
};

// === Clear user's history ===
export const clearUserViewHistory = async (userId) => {
  return API.delete(`/clicks/history/${userId}`);
};

// === Product click tracking ===
export const recordProductClick = async (data) => {
  return API.post("/clicks/product", data);
};

export const getProductClicksByProductId = async (productId) => {
  return API.get(`/clicks/product/${productId}`);
};

// === Admin analytics (get all clicks) ===
export const getAllClicks = async () => {
  return API.get("/clicks");
};
