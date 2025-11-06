import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import ProductCard from "../components/ProductCard";

function BraceletsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const category = "Bracelets";

  useEffect(() => {
    fetch(`http://localhost:5000/api/products?category=${category}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data); // or data.products
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

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-8 pb-20 max-w-6xl mx-auto">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BraceletsPage;
