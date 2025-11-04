// src/components/AdminNavbar.jsx
import { useEffect } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import { FaHome, FaBox, FaUsers, FaChartLine, FaCog, } from "react-icons/fa";

function AdminNavbar({ setIsLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // ไม่มี token → กลับหน้า Home
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false); // <-- อัปเดตสถานะหลักให้ Navbar รู้
    navigate("/"); // กลับหน้า Home
  };

  
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
    { name: "Stock Management", path: "/admin/stock", icon: <FaBox /> },
    { name: "User Management", path: "/admin/users", icon: <FaUsers /> },
    { name: "Activity Logs", path: "/admin/logs", icon: <FaChartLine /> },
    { name: "Setting", path: "/admin/settings", icon: <FaCog /> },
  ];

  return (
    <aside className="w-64 bg-[#d9a6a3] text-white flex flex-col min-h-screen">
      <div className="text-3xl font-light tracking-widest text-center py-6 border-b border-white">
        LURICE
      </div>

      <nav className="flex-1 px-4 py-6 space-y-3 text-lg">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
              location.pathname === item.path
                ? "bg-[#c28987] border-l-4 border-white"
                : "hover:bg-[#c28987]/80"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

           <div className="p-4 border-t border-white">
       <button
        onClick={handleLogout}
        className="w-full mt-8 bg-[#915858] text-[#FFD7D7] py-3 rounded-lg font-semibold hover:bg-[#7a4d4d] transition-all"
      >
        Logout
      </button>
      </div>
    </aside>
  );

};



export default AdminNavbar;
