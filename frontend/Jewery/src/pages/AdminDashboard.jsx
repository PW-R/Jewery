// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { FaUsers, FaChartLine, FaUserCheck } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

import { getUsers } from "../api/userApi";
import { getAllClicks } from "../api/clickApi";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#B87A7D", "#DA9FA3", "#E7B6B9", "#F0CCCE", "#D2979B"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, clicksRes] = await Promise.all([
          getUsers(),
          getAllClicks(),
        ]);
        setUsers(usersRes.data || []);
        setClicks(clicksRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-[#B87A7D] text-xl">
        Loading dashboard data...
      </div>
    );

  // === Metrics ===
  const totalUsers = users.length;

  // Treat clicks as "visits" for admin-friendly term
  const totalVisits = clicks.length;

  // === Visits by Day ===
  const dailyVisitsMap = clicks.reduce((acc, click) => {
    const day = new Date(click.timestamp).toLocaleDateString("en-US", {
      weekday: "short",
    });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const dailyVisitsData = Object.keys(dailyVisitsMap).map((day) => ({
    day,
    visits: dailyVisitsMap[day],
  }));

  // === Visits by Category ===
  const categoryMap = clicks.reduce((acc, click) => {
    const cat = click.category || "Other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.keys(categoryMap).map((name) => ({
    name,
    value: categoryMap[name],
  }));

  // === User Growth ===
  const userGrowthMap = users.reduce((acc, user) => {
    const month = new Date(user.createdAt).toLocaleString("en-US", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const userGrowthData = Object.keys(userGrowthMap).map((month) => ({
    month,
    users: userGrowthMap[month],
  }));

  // === Top Visitors ===
  const visitsByUserMap = {};
  clicks.forEach((click) => {
    const user = click.userId?.firstName
      ? `${click.userId.firstName} ${click.userId.lastName}`
      : `User ${click.userId?._id?.slice(-5) || "N/A"}`;
    visitsByUserMap[user] = (visitsByUserMap[user] || 0) + 1;
  });
  const topVisitors = Object.keys(visitsByUserMap)
    .map((name) => ({ name, visits: visitsByUserMap[name] }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5); // top 5 users

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-[#B87A7D]">Admin Dashboard</h1>
        <p className="text-[#DA9FA3] mt-2">
          Overview of Users and Visit Analytics
        </p>
      </header>

      {/* === METRICS === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-[#F0CCCE]/20 shadow rounded p-6 flex items-center gap-4 hover:scale-105 transition">
          <div className="text-[#B87A7D] text-3xl">
            <FaUsers />
          </div>
          <div>
            <h2 className="text-[#D2979B] font-medium mb-1">Total Users</h2>
            <p className="text-2xl font-bold text-[#B87A7D]">
              {totalUsers.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Total Visits */}
        <div className="bg-[#F0CCCE]/20 shadow rounded p-6 flex items-center gap-4 hover:scale-105 transition">
          <div className="text-[#DA9FA3] text-3xl">
            <FaUserCheck />
          </div>
          <div>
            <h2 className="text-[#E7B6B9] font-medium mb-1">Total Visits</h2>
            <p className="text-2xl font-bold text-[#DA9FA3]">
              {totalVisits.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Daily Visits */}
        <div className="bg-[#F0CCCE]/20 shadow rounded p-6 flex items-center gap-4 hover:scale-105 transition">
          <div className="text-[#E7B6B9] text-3xl">
            <FaChartLine />
          </div>
          <div>
            <h2 className="text-[#D2979B] font-medium mb-1">Daily Visits</h2>
            <p className="text-2xl font-bold text-[#E7B6B9]">
              {dailyVisitsData.reduce((a, b) => a + b.visits, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* === CHARTS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Weekly Visits Trend */}
        <div className="bg-[#F0CCCE]/10 shadow rounded p-6">
          <h2 className="text-[#D2979B] font-medium mb-4">Weekly Visit Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyVisitsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7B6B9" />
              <XAxis dataKey="day" stroke="#B87A7D" />
              <YAxis stroke="#B87A7D" />
              <Tooltip />
              <Line type="monotone" dataKey="visits" stroke="#B87A7D" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Visits by Category */}
        <div className="bg-[#F0CCCE]/10 shadow rounded p-6">
          <h2 className="text-[#D2979B] font-medium mb-4">Visits by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* === USER GROWTH & TOP VISITORS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* User Growth */}
        <div className="bg-[#F0CCCE]/10 shadow rounded p-6">
          <h2 className="text-[#D2979B] font-medium mb-4">User Growth Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7B6B9" />
              <XAxis dataKey="month" stroke="#B87A7D" />
              <YAxis stroke="#B87A7D" />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#DA9FA3" fill="#F0CCCE" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Visitors */}
        <div className="bg-[#F0CCCE]/10 shadow rounded p-6">
          <h2 className="text-[#D2979B] font-medium mb-4">Top Active Users</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topVisitors} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E7B6B9" />
              <XAxis type="number" stroke="#B87A7D" />
              <YAxis dataKey="name" type="category" stroke="#B87A7D" />
              <Tooltip />
              <Bar dataKey="visits" fill="#B87A7D" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
