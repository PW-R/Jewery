// src/pages/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userApi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });

  // --- Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id, "dummy-token"); // replace with real token if needed
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // --- Open modal for add/edit
  const openModal = (user = null) => {
    if (user) {
      setEditUser(user);
      setFormData({
        title: user.title || "",
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        password: "",
        phone: user.phone,
        role: user.role,
      });
    } else {
      setEditUser(null);
      setFormData({
        title: "",
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        password: "",
        phone: "",
        role: "user",
      });
    }
    setModalOpen(true);
  };

  // --- Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        const res = await updateUser(editUser._id, formData, "dummy-token");
        setUsers(users.map((u) => (u._id === editUser._id ? res.data.user : u)));
      } else {
        const res = await createUser(formData);
        setUsers([res.data, ...users]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white text-[#B87A7D]">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#DA9FA3]">
          User Management
        </h1>
        <button
          className="px-4 py-2 rounded flex items-center gap-2 hover:opacity-90"
          style={{ backgroundColor: "#DA9FA3", color: "#fff" }}
          onClick={() => openModal()}
        >
          <FaPlus /> Add User
        </button>
      </header>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded w-full border"
          style={{ borderColor: "#D2979B", color: "#B87A7D" }}
        />
      </div>

      {/* Users table */}
      <div className="rounded overflow-x-auto shadow-md">
        <table className="min-w-full text-left">
          <thead style={{ backgroundColor: "#DA9FA3", color: "#fff" }}>
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Age</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : users.filter(
                (u) =>
                  u.firstName.toLowerCase().includes(search.toLowerCase()) ||
                  u.lastName.toLowerCase().includes(search.toLowerCase()) ||
                  u.email.toLowerCase().includes(search.toLowerCase())
              ).length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users
                .filter(
                  (u) =>
                    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
                    u.lastName.toLowerCase().includes(search.toLowerCase()) ||
                    u.email.toLowerCase().includes(search.toLowerCase())
                )
                .map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-[#E7B6B9]"
                  >
                    <td className="p-3">{user.firstName} {user.lastName}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.age}</td>
                    <td className="p-3">{user.phone}</td>
                    <td className="p-3">
                      <span
                        className="px-2 py-1 rounded text-white"
                        style={{ backgroundColor: "#D2979B" }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        className="hover:opacity-80 text-[#B87A7D]"
                        onClick={() => openModal(user)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="hover:opacity-80 text-red-600"
                        onClick={() => handleDelete(user._id)}
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
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-[#B87A7DAA]"
        >
          <div
            className="relative rounded-lg p-6 w-full max-w-2xl"
            style={{ backgroundColor: "#F0CCCE", color: "#B87A7D" }}
          >
            <button
              className="absolute top-4 right-4 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editUser ? "Edit User" : "Add User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-black">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="border p-2 rounded w-full"
                  required
                  style={{ backgroundColor: "#FOCCCE" }}
                />
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="border p-2 rounded w-full"
                  required
                  style={{ backgroundColor: "#FOCCCE" }}
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="border p-2 rounded w-full"
                  type="email"
                  required
                  style={{ backgroundColor: "#FOCCCE" }}
                />
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  type="password"
                  className="border p-2 rounded w-full"
                  required={!editUser}
                  style={{ backgroundColor: "#FOCCCE" }}
                />
                <input
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  type="number"
                  className="border p-2 rounded w-full"
                  style={{ backgroundColor: "#FOCCCE" }}
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="border p-2 rounded w-full"
                  style={{ backgroundColor: "#FOCCCE" }}
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  style={{ backgroundColor: "#FOCCCE" }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded hover:opacity-90"
                style={{ backgroundColor: "#DA9FA3", color: "#fff" }}
              >
                {editUser ? "Update User" : "Add User"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
