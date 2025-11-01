// src/pages/Home.jsx
import { useState } from "react";
import { GoPersonFill } from "react-icons/go";


export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // simulate login state
  const [activeTab, setActiveTab] = useState("login"); // "login" or "register"

  const menuItems = [ { 
      name: "JEWELRY", 
      subMenu: ["Necklaces", "Bracelets", "Rings", "Earrings"] 
    },
    { 
      name: "STONES EXPERTISE", 
      subMenu: ["Diamonds", "Emeralds", "Rubies", "Sapphires"] 
    },
    { name: "SERVICES", subMenu: ["Repair", "Cleaning", "Custom Design"] },
    { name: "CONTACT US", subMenu: [] }];

  return (
    <div className="min-h-screen bg-[#4E3332] text-white relative">
     
    </div>
        
  );
}
