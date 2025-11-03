// src/components/AdminNavbar.jsx
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBox, FaUsers, FaChartLine, FaCog } from "react-icons/fa";

function AdminNavbar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "#", icon: <FaHome /> },
    { name: "Stock Management", path: "#", icon: <FaBox /> },
    { name: "User Management", path: "#", icon: <FaUsers /> },
    { name: "Activity Logs", path: "#", icon: <FaChartLine /> },
    { name: "Setting", path: "#", icon: <FaCog /> },
  ];

  return (
    <aside className="w-64 bg-[#d9a6a3] text-white flex flex-col">
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
                ? "bg-[#c28987]"
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
