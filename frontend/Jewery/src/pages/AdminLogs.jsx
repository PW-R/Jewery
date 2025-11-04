// src/pages/AdminLogs.jsx
import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";
import { getAllClicks, getUserClicks } from "../api/clickApi.js"; // ✅ use existing APIs

const AdminLogs = () => {
  const COLORS = ["#B87A7D", "#DA9FA3", "#E7B6B9", "#F0CCCE", "#D2979B"];

  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // === FETCH ALL CLICKS ===
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getAllClicks();
        const clicks = res.data;

        // Normalize for table
        const formatted = clicks.map((c, index) => ({
          id: index + 1,
          user: c.userId
            ? `${c.userId.firstName || ""} ${c.userId.lastName || ""}`.trim()
            : `User ${c.userId?._id?.slice(-5) || "N/A"}`,
          userId: c.userId?._id,
          action: "Clicked Product",
          product: c.productId?.name || `Product ${c.productId?._id?.slice(-5) || "N/A"}`,
          category: c.category || "Unknown",
          date: new Date(c.createdAt).toLocaleString(),
        }));

        setLogs(formatted);
      } catch (err) {
        console.error("Error loading clicks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // === FILTER LOGS ===
  const filteredLogs = logs.filter(
    (log) =>
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.product.toLowerCase().includes(search.toLowerCase())
  );

  // === FETCH USER ANALYTICS ===
  const loadUserAnalytics = async (user) => {
    setSelectedUser(user);
    setUserAnalytics(null);

    try {
      const res = await getUserClicks(user.userId);
      const clicks = res.data;

      // ---- ANALYTICS CALCULATIONS ----
      // 1️⃣ Daily visits
      const dailyMap = {};
      clicks.forEach((click) => {
        const day = new Date(click.createdAt).toLocaleDateString("en-US", { weekday: "short" });
        dailyMap[day] = (dailyMap[day] || 0) + 1;
      });
      const dailyVisits = Object.keys(dailyMap).map((day) => ({ day, visits: dailyMap[day] }));

      // 2️⃣ Favorite categories
      const catMap = {};
      clicks.forEach((click) => {
        const cat = click.category || "Other";
        catMap[cat] = (catMap[cat] || 0) + 1;
      });
      const favoriteCategories = Object.keys(catMap).map((name) => ({ name, value: catMap[name] }));

      // 3️⃣ Product frequency
      const prodMap = {};
      clicks.forEach((click) => {
        const prod = click.productId?.name || click.productId?._id || "Unknown";
        prodMap[prod] = (prodMap[prod] || 0) + 1;
      });
      const productClicks = Object.keys(prodMap).map((name) => ({ name, clicks: prodMap[name] }));

      setUserAnalytics({ dailyVisits, favoriteCategories, productClicks });
    } catch (err) {
      console.error("Error loading user analytics:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#B87A7D]">
        Loading activity logs...
      </div>
    );

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-[#B87A7D]">Activity Logs</h1>
        <p className="text-[#DA9FA3] mt-2">Click on a user to inspect activity and analytics</p>
      </header>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by user, action, or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <FaSearch className="text-[#B87A7D]" />
      </div>

      {/* Logs Table */}
      <div className="bg-[#F0CCCE]/10 shadow rounded overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[#E7B6B9]/30">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Action</th>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b hover:bg-[#DA9FA3]/10 cursor-pointer transition"
                  onClick={() => loadUserAnalytics(log)}
                >
                  <td className="p-3 text-[#B87A7D] font-medium">{log.user}</td>
                  <td className="p-3 text-[#DA9FA3]">{log.action}</td>
                  <td className="p-3 text-[#E7B6B9]">{log.product}</td>
                  <td className="p-3 text-[#E7B6B9]">{log.category}</td>
                  <td className="p-3 text-[#D2979B]">{log.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Inspector Modal */}
      {selectedUser && userAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-end z-50">
          <div className="bg-white w-full md:w-2/3 h-full p-6 overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedUser(null)}
            >
              <FaTimes />
            </button>
            <h2 className="text-3xl font-bold text-[#B87A7D] mb-4">
              User: {selectedUser.user}
            </h2>
            <p className="text-[#DA9FA3] mb-6">Analytics & activity overview</p>

            {/* Daily Visits */}
            <div className="mb-6">
              <h3 className="text-[#E7B6B9] font-medium mb-2">Daily Visits</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={userAnalytics.dailyVisits}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#B87A7D" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Favorite Categories */}
            <div className="mb-6">
              <h3 className="text-[#E7B6B9] font-medium mb-2">Favorite Categories</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={userAnalytics.favoriteCategories}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#DA9FA3"
                    label
                  >
                    {userAnalytics.favoriteCategories.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Product Clicks */}
            <div className="mb-6">
              <h3 className="text-[#E7B6B9] font-medium mb-2">Most Clicked Products</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userAnalytics.productClicks}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#B87A7D" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogs;
