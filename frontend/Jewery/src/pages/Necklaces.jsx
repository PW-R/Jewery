// src/pages/Necklaces.jsx
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function NecklacesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลสินค้าหมวด "necklaces" จาก backend
    fetch("http://localhost:5000/api/products?category=necklaces")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#915858]">
        กำลังโหลดสินค้า...
      </div>
    );
  }

  // ส่งข้อมูลให้ ProductCard Template
  return (
    <ProductCard
      category="necklaces"
      products={products}
    />
  );
}

export default NecklacesPage;
