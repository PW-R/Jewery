// src/Navbar.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GoPersonFill } from "react-icons/go";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeTab, setActiveTab] = useState("login");
  //   ขอข้อมูลผู้ใช้ที่loginอยู่
  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/user/me") //รอเปลี่ยนของจริงจ้าพี่ๆ
        .then((res) => res.json())
        .then((data) => setUserInfo(data))
        .catch((err) => console.log(err));
    }
  }, [isLoggedIn]);

  const menuItems = [
    {
      name: "JEWELRY",
      path: "/jewelry",
      subMenu: [
        { name: "Necklaces", path: "#" },
        { name: "Bracelets", path: "#" },
        { name: "Rings", path: "#" },
        { name: "Earrings", path: "#" },
      ],
    },
    {
      name: "STONES EXPERTISE",
      path: "/stones",
      subMenu: [
        { name: "Diamonds", path: "#" },
        { name: "Emeralds", path: "#" },
        { name: "Rubies", path: "#" },
        { name: "Sapphires", path: "#" },
      ],
    },
    {
      name: "SERVICES",
      path: "/services",
      subMenu: [
        { name: "Repair", path: "#" },
        { name: "Cleaning", path: "#" },
        { name: "Custom Design", path: "#" },
      ],
    },
    { name: "CONTACT US", path: "/contact", subMenu: [] },
  ];

  return (
    <div className="min-h-screen bg-[#4E3332] text-[#D2979B] relative">
      {/* --- Top Bar --- */}
      <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-center z-30 ">
        {/* Left: sidebar toggle */}
        <div
          className="absolute left-0 top-0 h-16 w-12 flex items-center justify-center cursor-pointer"
          onMouseEnter={() => setIsSidebarOpen(true)}
        >
          <span className="text-2xl font-bold">☰</span>
        </div>
        {/* Center title */}
        <h1 className="text-5xl font-light tracking-widest">LURICE</h1>

        {/* Right: user icon toggle panel */}
        <div className="absolute right-4 top-0 h-16 flex items-center">
          <GoPersonFill
            className="text-3xl text-[#D2979B]  cursor-pointer transition"
            onClick={() => setIsUserPanelOpen(!isUserPanelOpen)}
          />
        </div>
      </header>

      {/* --- Sidebar --- */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#edb5b5] text-white
              transition-all duration-500 ease-in-out transform shadow-[4px_0_25px_rgba(0,0,0,0.3)]
              ${
                isSidebarOpen
                  ? "translate-x-0 opacity-100 w-80"
                  : "-translate-x-full opacity-0 w-0 overflow-hidden"
              }`}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="mt-16 px-4 text-lg text-white ">
          {menuItems.map((item, index) => (
            <div key={index} className="mb-2">
              {/* เมนูหลัก */}
              <div
                className="flex justify-between items-center px-2 py-2 cursor-pointer hover:bg-[#b38585] rounded-md"
                onClick={() =>
                  setActiveMenu(activeMenu === item.name ? null : item.name)
                }
              >
                <Link to={item.path}>{item.name}</Link>
                {item.subMenu.length > 0 && <span>›</span>}
              </div>

              {/* Submenu */}
              {activeMenu === item.name && item.subMenu.length > 0 && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.subMenu.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className="cursor-pointer hover:text-[#4E3332]"
                    >
                      <Link to={subItem.path}>{subItem.name}</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* ------------------ User Panel ----------------- */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-[#FFD7D7] text-[#915858]
  shadow-[0_0_25px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]
  transform z-50
  ${isUserPanelOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div
          className="absolute top-4 right-4 cursor-pointer text-2xl font-bold hover:opacity-80 transition"
          onClick={() => setIsUserPanelOpen(false)}
        >
          ✖
        </div>

        <div className="p-6 mt-16 font-sans">
          {!isLoggedIn ? (
            <>
              {/* Login/Register Tabs */}
              <div className="flex mb-6 border-b-2 border-[#915858]">
                <button
                  className={`flex-1 py-3 text-center font-semibold uppercase ${
                    activeTab === "login"
                      ? "border-b-2 border-[#915858]"
                      : "opacity-60"
                  }`}
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>
                <button
                  className={`flex-1 py-3 text-center font-semibold uppercase ${
                    activeTab === "register"
                      ? "border-b-2 border-[#915858]"
                      : "opacity-60"
                  }`}
                  onClick={() => setActiveTab("register")}
                >
                  Register
                </button>
              </div>

              {/* Forms */}
              {activeTab === "login" ? (
                <LoginForm
                  setIsLoggedIn={setIsLoggedIn}
                  setIsUserPanelOpen={setIsUserPanelOpen}
                />
              ) : (
                <RegisterForm
                  setIsLoggedIn={setIsLoggedIn}
                  setIsUserPanelOpen={setIsUserPanelOpen}
                />
              )}
            </>
          ) : (
            <UserInfo
              userInfo={userInfo}
              setIsLoggedIn={setIsLoggedIn}
              setIsUserPanelOpen={setIsUserPanelOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
}
// --- Login Form Component ---
function LoginForm({ setIsLoggedIn, setIsUserPanelOpen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // ตัวอย่างเรียก backend
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsLoggedIn(true);
        setIsUserPanelOpen(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-[#915858] text-[#FFD7D7] py-3 rounded-lg font-bold"
      >
        Login
      </button>
    </div>
  );
}

// --- Register Form Component ---
function RegisterForm({ setIsLoggedIn, setIsUserPanelOpen }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsLoggedIn(true);
        setIsUserPanelOpen(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleRegister}
        className="w-full bg-[#915858] text-[#FFD7D7] py-3 rounded-lg font-bold"
      >
        Register
      </button>
    </div>
  );
}

// --- User Info Component ---
function UserInfo({ userInfo, setIsLoggedIn, setIsUserPanelOpen }) {
  return (
    <div className="space-y-4 mt-6 font-sans">
      <h2 className="text-2xl font-bold mb-4 text-[#915858]">User Info</h2>
      <p className="text-lg font-medium">
        Name: {userInfo?.name || "John Doe"}
      </p>
      <p className="text-lg font-medium">
        Email: {userInfo?.email || "john@example.com"}
      </p>
      <button
        className="w-full bg-[#915858] text-[#FFD7D7] py-3 rounded-lg font-bold"
        onClick={() => {
          setIsLoggedIn(false);
          setIsUserPanelOpen(false);
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
