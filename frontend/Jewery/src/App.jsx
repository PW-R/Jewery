// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react"; 
//----imports Routes----//
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Necklacespage from "./pages/Necklaces";



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

         
         {/* หน้าแสดงสินค้าจ้า */}
         <Route path="/jewelry/necklaces" element={<Necklacespage />} />

          {/* Auth pages */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
