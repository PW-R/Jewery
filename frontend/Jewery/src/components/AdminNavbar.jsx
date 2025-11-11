// src/components/AdminNavbar.jsx
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaBox, FaUsers, FaChartLine, FaCog, FaComments } from "react-icons/fa";

function AdminNavbar({ setIsLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/"); // No token → back to Home
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/Home"); // Back to Home
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
    { name: "Stock Management", path: "/admin/stock", icon: <FaBox /> },
    { name: "User Management", path: "/admin/users", icon: <FaUsers /> },
    { name: "Activity Logs", path: "/admin/logs", icon: <FaChartLine /> },
    { name: "Pending Chats", path: "/admin/chats/pending", icon: <FaComments /> },
    { name: "Chat Panel", path: "/admin/chats/panel", icon: <FaComments /> },
    { name: "Setting", path: "/admin/settings", icon: <FaCog /> },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

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
              isActive(item.path)
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
}

export default AdminNavbar;
