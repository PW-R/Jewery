// src/components/AdminNavbar.jsx
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBox, FaUsers, FaChartLine, FaCog } from "react-icons/fa";

function AdminNavbar() {
  const location = useLocation();

  const menuItems = [
<<<<<<< HEAD
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
    { name: "Stock Management", path: "/admin/stock", icon: <FaBox /> },
    { name: "User Management", path: "/admin/users", icon: <FaUsers /> },
    { name: "Activity Logs", path: "/admin/logs", icon: <FaChartLine /> },
    { name: "Setting", path: "/admin/settings", icon: <FaCog /> },
  ];

  return (
    <aside className="w-64 bg-[#d9a6a3] text-white flex flex-col min-h-screen">
=======
    { name: "Dashboard", path: "#", icon: <FaHome /> },
    { name: "Stock Management", path: "/admin/stock", icon: <FaBox /> },
    { name: "User Management", path: "#", icon: <FaUsers /> },
    { name: "Activity Logs", path: "#", icon: <FaChartLine /> },
    { name: "Setting", path: "#", icon: <FaCog /> },
  ];

  return (
    <aside className="w-64 bg-[#d9a6a3] text-white flex flex-col">
>>>>>>> 1ba99065897bbd08d0ad2bd6c11752c430599f88
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
<<<<<<< HEAD
                ? "bg-[#c28987] border-l-4 border-white"
=======
                ? "bg-[#c28987]"
>>>>>>> 1ba99065897bbd08d0ad2bd6c11752c430599f88
                : "hover:bg-[#c28987]/80"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default AdminNavbar;
