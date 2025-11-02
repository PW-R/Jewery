// src/pages/AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    console.log("AdminDashboard rendered");
  return (
    <div className="min-h-screen bg-gray-100 p-8">
  <header className="mb-8">
    <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
    <p className="text-gray-600 mt-2">Welcome, Admin!</p>
  </header>
  <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* panels */}
  </main>
</div>

  );
};

export default AdminDashboard;
