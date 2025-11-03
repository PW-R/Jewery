<<<<<<< HEAD
import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
//----Components----//
import Navbar from "./components/Navbar";
import AdminLayout from "./components/AdminLayout";

//----Pages (ลูกค้า)----//
import Home from "./pages/Home";
import Necklacespage from "./pages/Necklaces";

//----Pages (แอดมิน)----//
import AdminDashboard from "./pages/AdminDashboard";
import AdminStock from "./pages/AdminStock";
import AdminUsers from "./pages/AdminUsers";
import AdminLogs from "./pages/AdminLogs";
import AdminSettings from "./pages/AdminSettings";
=======
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react"; 
//----Components----//
import Navbar from "./components/Navbar";
import AdminLayout from "./components/AdminLayout";

//----Pages (ลูกค้า)----//
import Home from "./pages/Home";
import Necklacespage from "./pages/Necklaces";
//----Pages (แอดมิน)----//
import AdminDashboard from "./pages/AdminDashboard";
import AdminStock from "./pages/AdminStock";

>>>>>>> 1ba99065897bbd08d0ad2bd6c11752c430599f88

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
<<<<<<< HEAD
      {/* Navbar ฝั่งลูกค้า แสดงบนทุกหน้า */}
=======
      {/*  Navbar ฝั่งลูกค้า แสดงบนทุกหน้า */}
>>>>>>> 1ba99065897bbd08d0ad2bd6c11752c430599f88
      {!isAdminRoute && (
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      )}

      <div className={!isAdminRoute ? "pt-16" : ""}>
        <Routes>
<<<<<<< HEAD
          {/* ฝั่งลูกค้า */}
          <Route path="/" element={<Home />} />
          <Route path="/jewelry/necklaces" element={<Necklacespage />} />

          {/* ฝั่งแอดมิน */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="stock" element={<AdminStock />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="settings" element={<AdminSettings />} />
=======
          {/*  ฝั่งลูกค้า */}
          <Route path="/" element={<Home />} />
          <Route path="/jewelry/necklaces" element={<Necklacespage />} />

          {/*  ฝั่งแอดมิน */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="stock" element={<AdminStock />} />
           
>>>>>>> 1ba99065897bbd08d0ad2bd6c11752c430599f88
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;


