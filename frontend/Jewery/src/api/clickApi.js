import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // <-- must match backend server.js
});

// === RECORD A USER CLICK ===
// Logs a user's click on a specific product
// body: { userId, productId, category (optional) }
export const recordUserClick = async (data) => {
  return API.post("/clicks/user", data);
};

// === RECORD A PRODUCT CLICK ===
// Logs a product click (total count per product)
// body: { productId }
export const recordProductClick = async (data) => {
  return API.post("/clicks/product", data);
};

// === GET ALL USER CLICKS (ADMIN DASHBOARD) ===
export const getAllClicks = async () => {
  return API.get("/clicks");
};

// === GET USER CLICK HISTORY ===
// param: userId
export const getUserClicks = async (userId) => {
  return API.get(`/clicks/user/${userId}`);
};

// === GET PRODUCT CLICK STATS ===
// param: productId
export const getProductClicks = async (productId) => {
  return API.get(`/clicks/product/${productId}`);
};
