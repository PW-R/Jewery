// src/Navbar.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GoPersonFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeTab, setActiveTab] = useState("login");
  //   ขอข้อมูลผู้ใช้ที่loginอยู่
  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.log("No userId or token found, cannot fetch user data");
        return;
      }

      fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user data");
          return res.json();
        })
        .then((data) => setUserInfo(data))
        .catch((err) => console.log(err));
    }
  }, [isLoggedIn]);

  const menuItems = [
    {
      name: "JEWELRY",
      path: "/jewelry",
      subMenu: [
        { name: "Necklaces", path: "/jewelry/necklaces" },
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
    <div>
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

        <div className="p-6 mt-16 font-sans ">
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
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        setIsLoggedIn(true);
        setIsUserPanelOpen(false);

        // console.log("Login response user:", data.user);
        if (data.user.role === "admin") {
          // console.log("Redirecting to admin dashboard");
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm mb-1">Email *</label>
      <input
        type="email"
        placeholder="Email ID"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className="block text-sm mt-6 mb-1">Password *</label>
      <input
        type="password"
        placeholder="Password"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A]"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full border border-[#6B4A4A] text-[#6B4A4A] mt-8 py-3 tracking-wide uppercase font-medium hover:bg-[#6B4A4A] hover:text-[#FCE4E4] transition"
      >
        Submit
      </button>
      {/* <p className="text-center mt-3 text-sm underline cursor-pointer">
        Forgot your password?
      </p> */}
      <div className="text-center mt-10">
        <h3 className="text-lg mb-2 font-medium">Any Questions?</h3>
        <p className="text-sm text-[#6B4A4A]/80 mb-4">
          Our client advisors would be delighted to assist you
        </p>
        <div className="flex justify-center items-center gap-2 text-[#6B4A4A]">
          <span>📧</span>
          <span className="underline cursor-pointer">Contact Us</span>
        </div>
      </div>
    </div>
  );
}

// --- Register Form Component ---
function RegisterForm({ setIsLoggedIn, setIsUserPanelOpen }) {
  const [title, setTitle] = useState("Mr.");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          firstName,
          lastName,
          age,
          email,
          password,
          phone,
        }),
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
    <div className="space-y-4 ">
      <div className="flex gap-4 mb-4 ">
        <label>
          <input
            type="radio"
            value="Mr."
            checked={title === "Mr."}
            onChange={(e) => setTitle(e.target.value)}
            className="mr-2"
          />
          Mr.
        </label>
        <label>
          <input
            type="radio"
            value="Mrs."
            checked={title === "Mrs."}
            onChange={(e) => setTitle(e.target.value)}
            className="mr-2"
          />
          Mrs.
        </label>
        <label>
          <input
            type="radio"
            value="Ms."
            checked={title === "Ms."}
            onChange={(e) => setTitle(e.target.value)}
            className="mr-2"
          />
          Ms.
        </label>
      </div>
      <label className="block text-sm mb-1">First Name *</label>
      <input
        type="text"
        placeholder="Your first name"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A]"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <label className="block text-sm mt-6 mb-1">Last Name *</label>
      <input
        type="text"
        placeholder="Your last name"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A]"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <label className="block text-sm mt-6 mb-1">Age *</label>
      <input
        type="number"
        placeholder="ํYour Age"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A]"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <label className="block text-sm mt-6 mb-1">Email *</label>
      <input
        type="email"
        placeholder="Your email address"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="block text-sm mt-6 mb-1">Password *</label>
      <input
        type="password"
        placeholder="Password"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A]"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="block text-sm mt-6 mb-1">Phone Number *</label>
      <input
        type="text"
        placeholder="Your Phone Number"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A]"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        onClick={handleRegister}
        className="w-full border border-[#6B4A4A] text-[#6B4A4A] mt-8 py-3 tracking-wide uppercase font-medium hover:bg-[#6B4A4A] hover:text-[#FCE4E4] transition"
      >
        Create an Account
      </button>

    
    </div>
  );
}

// --- User Info Component **ยังไม่ได้ทำ ล็อกอินแล้วเจอหน้านี้ ---
function UserInfo({ userInfo, setIsLoggedIn, setIsUserPanelOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserPanelOpen(false);
    localStorage.removeItem("token"); // ลบ token ออกด้วย
    localStorage.removeItem("userId");
    navigate("/"); // ไปหน้า Home
  };

  return (
    <div className="space-y-4 mt-6 font-sans">
      <h2 className="text-3xl font-semibold mb-8 text-center text-[#5a3a3a]">
        My Account
      </h2>
      <div className="bg-[#f9dcdc] rounded-2xl shadow-md p-6 space-y-4">
        <div>
          <p className="text-sm text-[#8b6f6f] uppercase tracking-wide">Name</p>
          <p className="text-lg font-medium">
            {userInfo?.title} {userInfo?.firstName} {userInfo?.lastName}
          </p>
        </div>

        <div>
          <p className="text-sm text-[#8b6f6f] uppercase tracking-wide">Email</p>
          <p className="text-lg font-medium">{userInfo?.email}</p>
        </div>

        <div>
          <p className="text-sm text-[#8b6f6f] uppercase tracking-wide">Phone</p>
          <p className="text-lg font-medium">{userInfo?.phone}</p>
        </div>

        <div>
          <p className="text-sm text-[#8b6f6f] uppercase tracking-wide">Age</p>
          <p className="text-lg font-medium">{userInfo?.age}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full mt-8 bg-[#915858] text-[#FFD7D7] py-3 rounded-lg font-semibold hover:bg-[#7a4d4d] transition-all"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
