import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import ProductCard from "../components/ProductCard";

function NecklacesPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const category = "Necklaces";

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products?category=${category}`)
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

  //ฟิลเตอร์สินค้าตามคำค้น
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#915858]">
        <ThreeDot variant="bounce" color="#915858" size="medium" />
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#915858]">
      {/* Header */}
      <div className="text-center py-20 px-6">
        <p className="uppercase text-sm mt-3 tracking-widest text-[#A07878]">
          Jewelry and High Jewelry
        </p>
        <h2 className="text-3xl mt-8 font-light tracking-wide capitalize">
          {category.replace("-", " ")}
        </h2>
        <p className="max-w-2xl mx-auto mt-4 text-[#915858]/80 text-sm leading-relaxed">
          Discover our selection of {category}, each piece crafted with timeless elegance.
        </p>
      </div>

      {/*Search Bar */}
      <div className="flex justify-center mb-10 px-6">
        <input
          type="text"
          placeholder="ค้นหาสินค้า"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#915858]"
        />
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-8 pb-20 max-w-6xl mx-auto">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 pb-20">
          ไม่พบสินค้าที่ตรงกับคำค้น "{searchTerm}"
        </p>
      )}
    </div>
  );
}

export default NecklacesPage;
