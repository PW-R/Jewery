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

const AdminLogs = () => {
  const COLORS = ["#B87A7D", "#DA9FA3", "#E7B6B9", "#FOCCCE", "#D2979B"];

  // Dummy logs
  const dummyLogs = [
    { id: 1, user: "John Doe", action: "Created Product", product: "Necklace A1", date: "2025-11-01 10:23" },
    { id: 2, user: "Jane Smith", action: "Deleted Product", product: "Ring B3", date: "2025-11-02 14:12" },
    { id: 3, user: "Admin", action: "Updated User", product: "N/A", date: "2025-11-02 16:45" },
    { id: 4, user: "Alice", action: "Created Product", product: "Bracelet C2", date: "2025-11-03 09:10" },
  ];

  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => setLogs(dummyLogs), []);

  const filteredLogs = logs.filter(
    log =>
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.product.toLowerCase().includes(search.toLowerCase())
  );

  // Dummy analytics for user
  const userAnalytics = selectedUser
    ? {
        dailyVisits: [
          { day: "Mon", visits: Math.floor(Math.random() * 10 + 5) },
          { day: "Tue", visits: Math.floor(Math.random() * 10 + 5) },
          { day: "Wed", visits: Math.floor(Math.random() * 10 + 5) },
          { day: "Thu", visits: Math.floor(Math.random() * 10 + 5) },
          { day: "Fri", visits: Math.floor(Math.random() * 10 + 5) },
          { day: "Sat", visits: Math.floor(Math.random() * 10 + 5) },
          { day: "Sun", visits: Math.floor(Math.random() * 10 + 5) },
        ],
        favoriteCategories: [
          { name: "Necklaces", value: Math.floor(Math.random() * 10 + 1) },
          { name: "Rings", value: Math.floor(Math.random() * 10 + 1) },
          { name: "Bracelets", value: Math.floor(Math.random() * 10 + 1) },
        ],
        spending: [
          { week: "Week 1", amount: Math.floor(Math.random() * 200 + 50) },
          { week: "Week 2", amount: Math.floor(Math.random() * 200 + 50) },
          { week: "Week 3", amount: Math.floor(Math.random() * 200 + 50) },
          { week: "Week 4", amount: Math.floor(Math.random() * 200 + 50) },
        ],
      }
    : null;

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
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <FaSearch className="text-[#B87A7D]" />
      </div>

      {/* Logs Table */}
      <div className="bg-[#FOCCCE]/10 shadow rounded overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[#E7B6B9]/30">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Action</th>
              <th className="p-3">Product</th>
              <th className="p-3">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">No logs found.</td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr
                  key={log.id}
                  className="border-b hover:bg-[#DA9FA3]/10 cursor-pointer transition"
                  onClick={() => setSelectedUser(log.user)}
                >
                  <td className="p-3 text-[#B87A7D] font-medium">{log.user}</td>
                  <td className="p-3 text-[#DA9FA3]">{log.action}</td>
                  <td className="p-3 text-[#E7B6B9]">{log.product}</td>
                  <td className="p-3 text-[#D2979B]">{log.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Inspector Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-end z-50">
          <div className="bg-white w-full md:w-2/3 h-full p-6 overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedUser(null)}
            >
              <FaTimes />
            </button>
            <h2 className="text-3xl font-bold text-[#B87A7D] mb-4">User: {selectedUser}</h2>
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

            {/* Spending */}
            <div className="mb-6">
              <h3 className="text-[#E7B6B9] font-medium mb-2">Spending (per week)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userAnalytics.spending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#B87A7D" barSize={20} />
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
