import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoPersonFill } from "react-icons/go";
import { FaCommentDots } from "react-icons/fa"; // chat icon
import ChatBox from "./ChatBox"; // import your ChatBox

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeTab, setActiveTab] = useState("login");
  const [isNavigating, setIsNavigating] = useState(false);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, [setIsLoggedIn]);

  // Fetch user info only if logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setUserInfo(null);
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

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
      .catch((err) => console.error("Error fetching user:", err));
  }, [isLoggedIn]);

  const menuItems = [
    {
      name: "JEWELRY",
      path: "/Home",
      subMenu: [
        { name: "Necklaces", path: "/jewelry/necklaces" },
        { name: "Bracelets", path: "/jewelry/bracelets" },
        { name: "Rings", path: "/jewelry/rings" },
        { name: "Earrings", path: "/jewelry/earrings" },
      ],
    },
    {
      name: "SERVICES",
      path: "/Home",
      subMenu: [
        { name: "Repair", path: "#" },
        { name: "Cleaning", path: "#" },
        { name: "Custom Design", path: "#" },
      ],
    },
    { name: "CONTACT US", path: "/contact", subMenu: [] },
  ];

  // Smooth navigation
  const smoothNavigate = (path) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 300);
  };

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${
        isNavigating ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* --- Top Bar --- */}
      <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-center z-30">
        <div
          className="absolute left-0 top-0 h-16 w-12 flex items-center justify-center cursor-pointer"
          onMouseEnter={() => setIsSidebarOpen(true)}
        >
          <span className="text-2xl font-bold text-[#674948]">☰</span>
        </div>
        <h1
          className="text-5xl font-light tracking-widest text-[#674948] cursor-pointer"
          onClick={() => smoothNavigate("/Home")}
        >
          LURICE
        </h1>
        <div className="absolute right-4 top-0 h-16 flex items-center">
          <GoPersonFill
            className="text-3xl text-[#674948] cursor-pointer transition"
            onClick={() => setIsUserPanelOpen(!isUserPanelOpen)}
          />
        </div>
      </header>

      {/* --- Sidebar --- */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#edb5b5] text-white z-50 shadow-[4px_0_25px_rgba(0,0,0,0.3)]
        transition-all duration-500 ease-in-out transform ${
          isSidebarOpen
            ? "translate-x-0 opacity-100 w-80"
            : "-translate-x-full opacity-0 w-0 overflow-hidden"
        }`}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="mt-16 px-4 text-lg text-white">
          {menuItems.map((item, index) => (
            <div key={index} className="mb-2">
              <div
                className="flex justify-between items-center px-2 py-2 cursor-pointer hover:bg-[#b38585] rounded-md"
                onClick={() =>
                  setActiveMenu(activeMenu === item.name ? null : item.name)
                }
              >
                <Link to={item.path}>{item.name}</Link>
                {item.subMenu.length > 0 && <span>›</span>}
              </div>
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

      {/* --- User Panel --- */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-[#fce3e3] text-[#915858] shadow-[0_0_25px_rgba(0,0,0,0.3)]
        transition-transform duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] transform z-50 ${
          isUserPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
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
              {activeTab === "login" ? (
                <LoginForm
                  setIsLoggedIn={setIsLoggedIn}
                  setIsUserPanelOpen={setIsUserPanelOpen}
                />
              ) : (
                <RegisterForm
                  setIsLoggedIn={setIsLoggedIn}
                  setIsUserPanelOpen={setIsUserPanelOpen}
                  setActiveTab={setActiveTab}
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

      {/* --- Floating Chat Bubble --- */}
      {isLoggedIn && <ChatBox />}
    </div>
  );
}

// --- Login Form ---
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
        localStorage.setItem("userId", data.user._id || data.user.id);
        if (data.user.role) localStorage.setItem("role", data.user.role);

        setIsLoggedIn(true);
        setIsUserPanelOpen(false);

        navigate(
          data.user.role === "admin" || data.user.role === "superadmin"
            ? "/admin/dashboard"
            : "/Home"
        );
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm mb-1">Email *</label>
      <input
        type="email"
        placeholder="Email ID"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A] placeholder-[#3a2a2a]/60"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className="block text-sm mt-6 mb-1">Password *</label>
      <input
        type="password"
        placeholder="Password"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A] placeholder-[#3a2a2a]/60"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full border border-[#6B4A4A] text-[#6B4A4A] mt-8 py-3 tracking-wide uppercase font-medium hover:bg-[#6B4A4A] hover:text-[#FCE4E4] transition"
      >
        Submit
      </button>
    </div>
  );
}

// --- Register Form ---
function RegisterForm({ setIsLoggedIn, setIsUserPanelOpen,setActiveTab }) {
  const [title, setTitle] = useState("Mr.");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    // ตรวจสอบ validation ก่อนส่ง
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMessage("Phone number must be exactly 10 digits.");
      return;
    }

    // ล้างข้อความ error ก่อนส่ง request
    setErrorMessage("");

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
        setIsLoggedIn(false); // อย่าให้ auto login
        setIsUserPanelOpen(false);
        alert("Registration successful! Please login.");
        // หรือถ้าอยากพาไปหน้า login
        setActiveTab("login");
      } else alert(data.message);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        {["Mr.", "Mrs.", "Ms."].map((t) => (
          <label key={t}>
            <input
              type="radio"
              value={t}
              checked={title === t}
              onChange={(e) => setTitle(e.target.value)}
              className="mr-2 accent-[#4d3d29b5]"
            />
            {t}
          </label>
        ))}
      </div>

      <label className="block text-sm mb-1">First Name *</label>
      <input
        type="text"
        placeholder="Your first name"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A] placeholder-[#3a2a2a]/60"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <label className="block text-sm mt-6 mb-1">Last Name *</label>
      <input
        type="text"
        placeholder="Your last name"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A] placeholder-[#3a2a2a]/60"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <label className="block text-sm mt-6 mb-1">Age *</label>
      <input
        type="number"
        placeholder="Your Age"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A] placeholder-[#3a2a2a]/60"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <label className="block text-sm mt-6 mb-1">Email *</label>
      <input
        type="email"
        placeholder="Your email address"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A] placeholder-[#3a2a2a]/60"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="block text-sm mt-6 mb-1">Password *</label>
      <input
        type="password"
        placeholder="Password"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A] placeholder-[#3a2a2a]/60"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="block text-sm mt-6 mb-1">Phone Number *</label>
      <input
        type="text"
        placeholder="Your Phone Number"
        className="w-full border-b border-[#6B4A4A]/40 bg-transparent px-2 py-3 focus:outline-none focus:border-[#6B4A4A] placeholder-[#3a2a2a]/60"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {/* --- Error Message --- */}
      {errorMessage && (
        <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
      )}

      <button
        onClick={handleRegister}
        className="w-full border border-[#6B4A4A] text-[#6B4A4A] mt-8 py-3 tracking-wide uppercase font-medium hover:bg-[#6B4A4A] hover:text-[#FCE4E4] transition"
      >
        Create an Account
      </button>
    </div>
  );
}

// --- User Info ---
function UserInfo({ userInfo, setIsLoggedIn, setIsUserPanelOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserPanelOpen(false);
    localStorage.clear();
    navigate("/Home");
  };

  return (
    <div className="space-y-6 mt-8 font-sans max-w-xl mx-auto">
      <h2 className="text-4xl font-semibold text-center text-[#5a3a3a] drop-shadow-sm">
        My Account
      </h2>
      <div>
        {[
          {
            label: "Name",
            value: `${userInfo?.title} ${userInfo?.firstName} ${userInfo?.lastName}`,
          },
          { label: "Email", value: userInfo?.email },
          { label: "Phone", value: userInfo?.phone },
          { label: "Age", value: userInfo?.age },
          { label: "Role", value: userInfo?.role || "user" },
        ].map((item, idx) => (
          <div key={idx} className="pb-3 border-b border-[#e8bcbc]/50 mb-5">
            <p className="text-xs text-[#8b6f6f] uppercase tracking-wider">
              {item.label}
            </p>
            <p className="text-lg font-medium text-[#5a3a3a] mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="w-full mt-6 bg-[#915858] shadow-sm text-[#FFE5E5] py-3.5 rounded-xl font-semibold tracking-wide hover:bg-[#7a4d4d] active:scale-[0.98] transition-all duration-200"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
