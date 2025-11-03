// src/api/productApi.js
import axios from "axios";

// Updated base URL to match backend
const API = axios.create({
  baseURL: "http://localhost:5000/api", // <-- note the /api prefix
});

// --- Get all products (optional filter by category)
export const getProducts = (category = "") => {
  return API.get(category ? `/products?category=${category}` : "/products");
};

// --- Get single product by ID
export const getProductById = (id) => {
  return API.get(`/products/${id}`);
};

// --- Create new product (formData for image upload)
export const createProduct = (formData) => {
  return API.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// --- Update product by ID
export const updateProduct = (id, formData) => {
  return API.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// --- Delete product by ID
export const deleteProduct = (id) => {
  return API.delete(`/products/${id}`);
};
