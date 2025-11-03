// src/pages/AdminDashboard.jsx
import React from "react";
import { FaUsers, FaDollarSign, FaChartLine } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const AdminDashboard = () => {
  // Dummy data
  const monthlyVisits = 12345;
  const revenue = 23450;
  const dailyVisits = 1234;

  const visitsData = [
    { day: "1", visits: 400 },
    { day: "2", visits: 700 },
    { day: "3", visits: 500 },
    { day: "4", visits: 900 },
    { day: "5", visits: 800 },
    { day: "6", visits: 1200 },
    { day: "7", visits: 1000 },
  ];

  const revenueData = [
    { day: "Mon", revenue: 4000 },
    { day: "Tue", revenue: 3000 },
    { day: "Wed", revenue: 5000 },
    { day: "Thu", revenue: 7000 },
    { day: "Fri", revenue: 6000 },
    { day: "Sat", revenue: 8000 },
    { day: "Sun", revenue: 9000 },
  ];

  const comboData = [
    { day: "Mon", visits: 120, revenue: 4000 },
    { day: "Tue", visits: 210, revenue: 3000 },
    { day: "Wed", visits: 150, revenue: 5000 },
    { day: "Thu", visits: 260, revenue: 7000 },
    { day: "Fri", visits: 200, revenue: 6000 },
    { day: "Sat", visits: 300, revenue: 8000 },
    { day: "Sun", visits: 280, revenue: 9000 },
  ];

  const trafficSourceData = [
    { name: "Direct", value: 400 },
    { name: "Referral", value: 300 },
    { name: "Social", value: 300 },
    { name: "Email", value: 200 },
  ];

  const userGrowthData = [
    { month: "Jan", users: 200 },
    { month: "Feb", users: 400 },
    { month: "Mar", users: 600 },
    { month: "Apr", users: 800 },
    { month: "May", users: 1000 },
    { month: "Jun", users: 1200 },
  ];

  const COLORS = ["#B87A7D", "#DA9FA3", "#E7B6B9", "#FOCCCE", "#D2979B"];

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-[#B87A7D]">Admin Dashboard</h1>
        <p className="text-[#DA9FA3] mt-2">Welcome, Admin!</p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#FOCCCE]/20 shadow rounded p-6 flex items-center gap-4 transition hover:scale-105">
          <div className="text-[#B87A7D] text-3xl">
            <FaUsers />
          </div>
          <div>
            <h2 className="text-[#D2979B] font-medium mb-1">Monthly Visits</h2>
            <p className="text-2xl font-bold text-[#B87A7D]">
              {monthlyVisits.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-[#FOCCCE]/20 shadow rounded p-6 flex items-center gap-4 transition hover:scale-105">
          <div className="text-[#DA9FA3] text-3xl">
            <FaDollarSign />
          </div>
          <div>
            <h2 className="text-[#E7B6B9] font-medium mb-1">Revenue</h2>
            <p className="text-2xl font-bold text-[#DA9FA3]">
              ${revenue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-[#FOCCCE]/20 shadow rounded p-6 flex items-center gap-4 transition hover:scale-105">
          <div className="text-[#E7B6B9] text-3xl">
            <FaChartLine />
          </div>
          <div>
            <h2 className="text-[#D2979B] font-medium mb-1">Daily Visits</h2>
            <p className="text-2xl font-bold text-[#E7B6B9]">
              {dailyVisits.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Monthly Visits Line Chart */}
        <div className="bg-[#FOCCCE]/10 shadow rounded p-6">
          <h2 className="text-[#D2979B] font-medium mb-4">Monthly Visits</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={visitsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7B6B9" />
              <XAxis dataKey="day" stroke="#B87A7D" />
              <YAxis stroke="#B87A7D" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#B87A7D"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Bar Chart */}
        <div className="bg-[#FOCCCE]/10 shadow rounded p-6">
          <h2 className="text-[#D2979B] font-medium mb-4">Revenue This Week</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7B6B9" />
              <XAxis dataKey="day" stroke="#B87A7D" />
              <YAxis stroke="#B87A7D" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#DA9FA3" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Combo Chart: Visits vs Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#FOCCCE]/10 shadow rounded p-6">
          <h2 className="text-[#D2979B] font-medium mb-4">Daily Visits vs Revenue</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={comboData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7B6B9" />
              <XAxis dataKey="day" stroke="#B87A7D" />
              <YAxis stroke="#B87A7D" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#DA9FA3" />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#B87A7D"
                strokeWidth={3}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Source Pie Chart */}
        <div className="bg-[#FOCCCE]/10 shadow rounded p-6">
          <h2 className="text-[#D2979B] font-medium mb-4">Traffic Sources</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={trafficSourceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {trafficSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area Chart: User Growth */}
      <div className="bg-[#FOCCCE]/10 shadow rounded p-6">
        <h2 className="text-[#D2979B] font-medium mb-4">User Growth Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7B6B9" />
            <XAxis dataKey="month" stroke="#B87A7D" />
            <YAxis stroke="#B87A7D" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#DA9FA3"
              fill="#FOCCCE"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
