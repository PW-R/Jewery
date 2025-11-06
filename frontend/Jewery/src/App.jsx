import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
//----Components----//
import Navbar from "./components/Navbar";
import AdminLayout from "./components/AdminLayout";

//----Pages (ลูกค้า)----//
import Home from "./pages/Home";
import Necklacespage from "./pages/Necklaces";
import BraceletsPage from "./pages/Bracelets";
import RingsPage from "./pages/Rings";
import EarringsPage from "./pages/Earrings";
import ProductDetailPage from "./pages/ProductDetail";

//----Pages (แอดมิน)----//
import AdminDashboard from "./pages/AdminDashboard";
import AdminStock from "./pages/AdminStock";
import AdminUsers from "./pages/AdminUsers";
import AdminLogs from "./pages/AdminLogs";
import AdminSettings from "./pages/AdminSettings";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Navbar ฝั่งลูกค้า แสดงบนทุกหน้า */}
      {!isAdminRoute && (
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      )}

      <div className={!isAdminRoute ? "pt-16" : ""}>
        <Routes>
          {/* หน้าแรก */}
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />

          {/* ฝั่งลูกค้า */}
          <Route path="/jewelry/necklaces" element={<Necklacespage />} />
          <Route path="/jewelry/bracelets" element={<BraceletsPage />} />
          <Route path="/jewelry/rings" element={<RingsPage />} />
          <Route path="/jewelry/earrings" element={<EarringsPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />

          {/* ฝั่งแอดมิน */}
          <Route
            path="/admin"
            element={<AdminLayout setIsLoggedIn={setIsLoggedIn} />}
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="stock" element={<AdminStock />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
