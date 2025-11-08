// src/pages/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { getUsers, createUser, updateUser, deleteUser } from "../api/userApi";

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

  // Fetch users
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

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Open modal
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

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        const res = await updateUser(editUser._id, formData);
        setUsers(
          users.map((u) => (u._id === editUser._id ? res.data.user : u))
        );
      } else {
        const res = await createUser(formData);
        setUsers([res.data, ...users]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  // Filtered users
  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 bg-[#FFF5F5] text-[#B87A7D]">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#DA9FA3]">User Management</h1>
        <button
          className="px-5 py-2 rounded-lg flex items-center gap-2 bg-[#DA9FA3] text-white shadow-md hover:opacity-90 transition"
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
          className="p-3 rounded-lg w-full border border-[#D2979B] focus:outline-none focus:ring-2 focus:ring-[#DA9FA3] transition"
        />
      </div>

      {/* Users table */}
      <div className="rounded-lg overflow-x-auto shadow-lg bg-white">
        <table className="min-w-full text-left divide-y divide-gray-200">
          <thead className="bg-[#DA9FA3] text-white">
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
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-[#FAD5D7] transition">
                  <td className="p-3">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.age}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full text-white bg-[#D2979B] text-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 flex gap-3">
                    <button
                      className="hover:text-[#DA9FA3] transition"
                      onClick={() => openModal(user)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="hover:text-red-600 transition"
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
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 p-4">
          <div className="relative rounded-xl p-6 w-full max-w-lg bg-[#F8EDEE] shadow-lg overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-[#B87A7D] hover:text-gray-700 transition"
              onClick={() => setModalOpen(false)}
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-5 text-[#B87A7D] text-center">
              {editUser ? "Edit User" : "Add User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-[#B87A7D]">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DA9FA3] w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-[#B87A7D]">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DA9FA3] w-full"
                    required
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-[#B87A7D]">
                    Email
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    type="email"
                    className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DA9FA3] w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-[#B87A7D]">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DA9FA3] w-full"
                  />
                </div>
              </div>

              {/* Credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-[#B87A7D]">Age</label>
                  <input
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    type="number"
                    className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DA9FA3] w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-[#B87A7D]">
                    Password
                    {editUser && (
                      <span className="text-sm text-gray-500">
                        {" "}
                        (leave blank to keep current)
                      </span>
                    )}
                  </label>
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={editUser ? "••••••••" : "Enter password"}
                    type="password"
                    className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DA9FA3] w-full"
                    required={!editUser}
                  />
                </div>
              </div>

              {/* Role */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-[#B87A7D]">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DA9FA3] w-full"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#DA9FA3] text-white font-semibold hover:opacity-90 transition"
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
