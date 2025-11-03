
// src/pages/AdminStock.jsx
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";

const AdminStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    material: "",
    weight: "",
    images: [],
  });
  const [imagePreview, setImagePreview] = useState([]);

  // --- Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts(categoryFilter);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  // --- Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // --- Open modal for add/edit
  const openModal = (product = null) => {
    if (product) {
      setEditProduct(product);
      setFormData({
        code: product.code,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description,
        material: product.material,
        weight: product.weight,
        images: [],
      });
      setImagePreview(product.images || []);
    } else {
      setEditProduct(null);
      setFormData({
        code: "",
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        material: "",
        weight: "",
        images: [],
      });
      setImagePreview([]);
    }
    setModalOpen(true);
  };

  // --- Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
    setImagePreview(files.map((file) => URL.createObjectURL(file)));
  };

  // --- Submit form for add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (let key in formData) {
        if (key === "images") {
          formData.images.forEach((file) => data.append("images", file));
        } else {
          data.append(key, formData[key]);
        }
      }

      if (editProduct) {
        const res = await updateProduct(editProduct._id, data);
        setProducts(
          products.map((p) => (p._id === editProduct._id ? res.data.product : p))
        );
      } else {
        const res = await createProduct(data);
        setProducts([res.data.product, ...products]);
      }

      setModalOpen(false);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  // === Custom colors ===
  const colors = {
    primary: "#B87A7D",
    secondary: "#DA9FA3",
    accent1: "#E7B6B9",
    accent2: "#FOCCCE",
    accent3: "#D2979B",
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#B87A7D]">Stock Management</h1>
        <button
          className="bg-[#DA9FA3] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#E7B6B9] transition"
          onClick={() => openModal()}
        >
          <FaPlus /> Add Product
        </button>
      </header>

      {/* Filters */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Search by name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 flex-1 border-[#D2979B]"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded p-2 border-[#D2979B]"
        >
          <option value="">All Categories</option>
          <option value="Necklaces">Necklaces</option>
          <option value="Rings">Rings</option>
          <option value="Bracelets">Bracelets</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[#FOCCCE]">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Code</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products
                .filter(
                  (p) =>
                    p.name.toLowerCase().includes(search.toLowerCase()) ||
                    p.code.toLowerCase().includes(search.toLowerCase())
                )
                .map((product) => (
                  <tr key={product._id} className="border-b hover:bg-[#FOCCCE]/30">
                    <td className="p-3">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-[#E7B6B9] rounded flex items-center justify-center text-white">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-[#B87A7D]">{product.code}</td>
                    <td className="p-3 text-[#DA9FA3]">{product.name}</td>
                    <td className="p-3 text-[#E7B6B9]">{product.category}</td>
                    <td className="p-3 text-[#D2979B]">${product.price.toFixed(2)}</td>
                    <td className="p-3 text-[#B87A7D]">{product.stock}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        className="text-[#DA9FA3] hover:text-[#B87A7D]"
                        onClick={() => openModal(product)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-[#E7B6B9] hover:text-[#D2979B]"
                        onClick={() => handleDelete(product._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setModalOpen(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#B87A7D]">
              {editProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Code"
                  className="border p-2 rounded w-full border-[#D2979B]"
                  required
                />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="border p-2 rounded w-full border-[#D2979B]"
                  required
                />
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Category"
                  className="border p-2 rounded w-full border-[#D2979B]"
                  required
                />
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  className="border p-2 rounded w-full border-[#D2979B]"
                  required
                />
                <input
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  type="number"
                  placeholder="Stock"
                  className="border p-2 rounded w-full border-[#D2979B]"
                  required
                />
                <input
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Weight"
                  className="border p-2 rounded w-full border-[#D2979B]"
                />
                <input
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="Material"
                  className="border p-2 rounded w-full border-[#D2979B]"
                />
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="border p-2 rounded w-full border-[#D2979B]"
              />

              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="border p-2 rounded w-full border-[#D2979B]"
              />

              {imagePreview.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {imagePreview.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="bg-[#DA9FA3] text-white px-4 py-2 rounded hover:bg-[#E7B6B9] mt-3 transition"
              >
                {editProduct ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStock;

