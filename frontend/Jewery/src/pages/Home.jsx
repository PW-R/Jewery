import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 ตั้งค่าหมวดหมู่และจำนวนสินค้าที่ต้องการ
  const categoryConfig = [
    { name: "Necklaces", count: 2 },
    { name: "Rings", count: 2 },
    { name: "Bracelets", count: 2 },
    { name: "Earrings", count: 2 },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const promises = categoryConfig.map(async ({ name, count }) => {
          const res = await fetch(`http://localhost:5000/api/products/category/${name}`);
          const data = await res.json();
          const shuffled = data.sort(() => 0.5 - Math.random());
          return shuffled.slice(0, count);
        });

        const results = await Promise.all(promises);
        setProducts(results.flat());
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#915858]">
        <ThreeDot variant="bounce" color="#915858" size="medium" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4a2c2b] text-[#e8c7b0] font-serif flex flex-col overflow-hidden">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center flex-1 px-4">
        <img
          src="https://cdn.vancleefarpels.com/media/catalog/product/cache/1/image/1800x/0dc2d03fe217f8c83829496872af24a0/v/c/vcarp5h70000_x.jpg"
          alt="Diamond Necklace"
          className="w-72 mt-8 mb-6"
        />
        <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#f1d1bc]">
          Gold and diamond flowers come to life
        </h2>
        <p className="text-sm max-w-xl text-[#d9b5a1]">
          Van Cleef & Arpels' jewelry garden blossoms with the Flowerlace collection
        </p>
      </section>

      {/* ✅ Our Creations Section */}
      <section className="bg-[#f9e3e3] text-center py-20">
        <h2 className="text-3xl font-light text-[#3a2a2a]">Our Creations</h2>
        <p className="text-gray-500 mt-2 mb-10">Discover a variety of our pieces.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-8 max-w-6xl mx-auto">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-4"
              >
                {/* 🔹 พื้นหลังรูปสีขาว */}
                <div className="bg-white rounded-lg overflow-hidden mb-4 flex justify-center items-center">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : "https://res.cloudinary.com/dnd6qbufm/image/upload/v1730569000/jewelry_products/no-image.png"
                    }
                    alt={product.name}
                    className="w-56 h-56 object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <h3 className="text-lg font-medium text-[#4a2c2b]">{product.name}</h3>
                <p className="text-sm text-[#915858]/80 mt-1">{product.description}</p>
                <p className="mt-3 text-[#915858] font-semibold text-lg">
                  ${product.price?.toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-[#915858]/70">
              No products found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
