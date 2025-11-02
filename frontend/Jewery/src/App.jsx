// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react"; 
//----imports Routes----//
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router basename="/Jewery">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="pt-16">
        <Routes>
          {/* Home page */}
          <Route path="/" element={<Home />} />

          {/* Admin pages */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Auth pages */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
