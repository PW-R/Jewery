// src/api/clickApi.js
import axios from "axios";

const API = axios.create({
   baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// === Record or update a user's product view history ===
export const recordUserViewHistory = async ({ userId, productId }) => {
  if (!userId || !productId) throw new Error("userId and productId are required");
  return API.post("/clicks/history", { userId, productId });
};

// === Get a specific user's view history ===
export const getUserViewHistory = async (userId) => {
  if (!userId) throw new Error("userId is required");
  return API.get(`/clicks/history/${userId}`);
};

// === Clear user's view history ===
export const clearUserViewHistory = async (userId) => {
  if (!userId) throw new Error("userId is required");
  return API.delete(`/clicks/history/${userId}`);
};

// === Record a product click (for analytics / total clicks) ===
export const recordProductClick = async ({ productId }) => {
  if (!productId) throw new Error("productId is required");
  return API.post("/clicks/product", { productId });
};

// === Get total clicks for a specific product ===
export const getProductClicksByProductId = async (productId) => {
  if (!productId) throw new Error("productId is required");
  return API.get(`/clicks/product/${productId}`);
};

// === Admin analytics: get all click logs ===
export const getAllClicks = async () => {
  return API.get("/clicks");
};
