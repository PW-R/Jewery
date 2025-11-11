import axios from "axios";

const API = axios.create({
   baseURL: `${import.meta.env.VITE_API_URL}/api`,
 });

// ดึง token อัตโนมัติในทุก request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Get next product code
export const getNextCode = (category) =>
  API.get(`/products/next-code?category=${category}`);

// --- Get all products
export const getProducts = (category = "") =>
  API.get(category ? `/products?category=${category}` : "/products");

// --- Get single product
export const getProductById = (id) => API.get(`/products/${id}`);

// --- Create new product
export const createProduct = (formData) =>
  API.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// --- Update product
export const updateProduct = (id, formData) =>
  API.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// --- Delete product
export const deleteProduct = (id) => API.delete(`/products/${id}`);
