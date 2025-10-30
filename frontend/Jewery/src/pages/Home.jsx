// src/pages/Home.jsx
import { useState } from "react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // simulate login state
  const [activeTab, setActiveTab] = useState("login"); // "login" or "register"

  const menuItems = ["JEWELRY", "STONES EXPERTISE", "SERVICES", "CONTACT US"];

  return (
    <div className="min-h-screen bg-[#915858] text-white relative">
      {/* --- Top Bar --- */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#A56C6C] shadow-md flex items-center justify-center z-20">
        {/* Left: small hover area for sidebar */}
        <div
          className="absolute left-0 top-0 h-16 w-12 flex items-center justify-center cursor-pointer"
          onMouseEnter={() => setIsSidebarOpen(true)}
        >
          <span className="text-2xl font-bold">☰</span>
        </div>

        {/* Center title */}
        <h1 className="text-xl font-bold tracking-widest">LURICE</h1>

        {/* Right: user icon toggle panel */}
        <div className="absolute right-4 top-0 h-16 flex items-center">
          <span
            className="text-2xl cursor-pointer hover:opacity-80 transition"
            onClick={() => setIsUserPanelOpen(!isUserPanelOpen)}
          >
            👤
          </span>
        </div>
      </header>

      {/* --- Sidebar --- */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#FFD7D7] text-[#915858] shadow-lg 
                    transition-all duration-300 ease-in-out z-10
                    ${isSidebarOpen ? "w-48" : "w-0 overflow-hidden"}`}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="flex flex-col mt-20 space-y-6 px-4">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer hover:bg-[#F3B6B6] rounded-md px-3 py-2 text-lg font-semibold"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* --- Right-side User Panel --- */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#FFD7D7] text-[#915858] shadow-2xl
              transition-transform duration-300 ease-in-out z-20
              ${isUserPanelOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close button */}
        <div
          className="absolute top-4 right-4 cursor-pointer text-2xl font-bold hover:opacity-80 transition"
          onClick={() => setIsUserPanelOpen(false)}
        >
          ✖
        </div>

        <div className="p-6 mt-16 font-sans">
          {!isLoggedIn ? (
            <div>
              {/* Tabs */}
              <div className="flex mb-6 border-b-2 border-[#915858]">
                <button
                  className={`flex-1 py-3 text-center font-semibold uppercase text-[#915858] tracking-wide ${
                    activeTab === "login"
                      ? "border-b-2 border-[#915858]"
                      : "opacity-60"
                  } transition`}
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>
                <button
                  className={`flex-1 py-3 text-center font-semibold uppercase text-[#915858] tracking-wide ${
                    activeTab === "register"
                      ? "border-b-2 border-[#915858]"
                      : "opacity-60"
                  } transition`}
                  onClick={() => setActiveTab("register")}
                >
                  Register
                </button>
              </div>

              {/* Active form */}
              {activeTab === "login" ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-lg border border-[#915858] focus:outline-none focus:ring-2 focus:ring-[#A56C6C] text-[#915858] bg-[#fff6f6] transition"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-lg border border-[#915858] focus:outline-none focus:ring-2 focus:ring-[#A56C6C] text-[#915858] bg-[#fff6f6] transition"
                  />
                  <button
                    className="w-full bg-[#915858] text-[#FFD7D7] py-3 rounded-lg shadow-lg hover:opacity-90 transition font-bold tracking-wide uppercase"
                    onClick={() => {
                      setIsLoggedIn(true);
                      setIsUserPanelOpen(false);
                    }}
                  >
                    SUBMIT
                  </button>
                  <p className="text-sm mt-2 text-[#A56C6C] font-medium">
                    Any Questions? Our client advisors would be delighted to
                    assist you.
                  </p>
                  <button className="w-full bg-[#A56C6C] text-[#FFD7D7] py-3 rounded-lg shadow hover:opacity-90 transition font-semibold tracking-wide">
                    Contact Us
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-lg border border-[#915858] focus:outline-none focus:ring-2 focus:ring-[#A56C6C] text-[#915858] bg-[#fff6f6] transition"
                  />
                  <input
                    type="text"
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-lg border border-[#915858] focus:outline-none focus:ring-2 focus:ring-[#A56C6C] text-[#915858] bg-[#fff6f6] transition"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-lg border border-[#915858] focus:outline-none focus:ring-2 focus:ring-[#A56C6C] text-[#915858] bg-[#fff6f6] transition"
                  />
                  <button
                    className="w-full bg-[#915858] text-[#FFD7D7] py-3 rounded-lg shadow-lg hover:opacity-90 transition font-bold tracking-wide uppercase"
                    onClick={() => {
                      setIsLoggedIn(true);
                      setIsUserPanelOpen(false);
                    }}
                  >
                    SUBMIT
                  </button>
                  <p className="text-sm mt-2 text-[#A56C6C] font-medium">
                    Any Questions? Our client advisors would be delighted to
                    assist you.
                  </p>
                  <button className="w-full bg-[#A56C6C] text-[#FFD7D7] py-3 rounded-lg shadow hover:opacity-90 transition font-semibold tracking-wide">
                    Contact Us
                  </button>
                </div>
              )}
            </div>
          ) : (
            // User Info / Modify
            <div className="space-y-4 mt-6 font-sans">
              <h2 className="text-2xl font-bold mb-4 text-[#915858]">
                User Info
              </h2>
              <p className="text-lg font-medium">Name: John Doe</p>
              <p className="text-lg font-medium">Email: john@example.com</p>
              <button
                className="w-full bg-[#915858] text-[#FFD7D7] py-3 rounded-lg shadow-lg hover:opacity-90 transition font-bold tracking-wide uppercase"
                onClick={() => {
                  setIsLoggedIn(false);
                  setIsUserPanelOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Page Content --- */}
      <main className="pt-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Welcome to Our Jewelry Store
        </h2>
        <p className="text-lg max-w-2xl mx-auto">
          Discover timeless designs, elegant stones, and our expert
          craftsmanship.
        </p>
      </main>
    </div>
  );
}
