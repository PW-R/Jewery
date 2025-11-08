// src/pages/AdminSettings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaSave, FaTrash, FaSignOutAlt } from "react-icons/fa";
import { getUserById, updateUser, deleteUser } from "../api/userApi";

const AdminSettings = () => {
  // ✅ Get setIsLoggedIn from Outlet context
  const { setIsLoggedIn } = useOutletContext();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const fetchUser = async () => {
    try {
      const res = await getUserById(userId);
      setUser(res.data);
      setFormData({
        title: res.data.title || "",
        firstName: res.data.firstName || "",
        lastName: res.data.lastName || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        age: res.data.age || "",
        password: "",
      });
    } catch (err) {
      console.error("Error fetching user:", err);
      setMessage("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUser(userId, formData);
      setUser(res.data);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      setMessage("Error updating profile");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await deleteUser(userId);
      alert("Account deleted successfully");
      handleLogout();
    } catch (err) {
      console.error("Error deleting account:", err);
      setMessage("Error deleting account");
    }
  };

  // ✅ Fixed logout using context function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false); // update main app state
    navigate("/Home");
  };

  if (loading) return <p className="text-[#B87A7D]">Loading...</p>;

  return (
    <div className="min-h-screen bg-white p-8">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#B87A7D]">Settings</h1>
          <p className="text-[#DA9FA3] mt-2">Manage your profile information</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-[#DA9FA3] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#E7B6B9]"
        >
          <FaSignOutAlt /> Logout
        </button>
      </header>

      {message && (
        <div className="mb-4 p-3 bg-[#E7B6B9]/20 text-[#B87A7D] rounded">
          {message}
        </div>
      )}

      <form
        onSubmit={handleUpdate}
        className="space-y-4 bg-[#F0CCCE]/10 p-6 rounded shadow-md max-w-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded w-full border-[#D2979B]"
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="border p-2 rounded w-full border-[#D2979B]"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="border p-2 rounded w-full border-[#D2979B]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded w-full border-[#D2979B]"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 rounded w-full border-[#D2979B]"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="border p-2 rounded w-full border-[#D2979B]"
          />
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 rounded w-full border-[#D2979B]"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-[#B87A7D] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#DA9FA3]"
          >
            <FaSave /> Save Changes
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-600"
            onClick={handleDelete}
          >
            <FaTrash /> Delete Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
