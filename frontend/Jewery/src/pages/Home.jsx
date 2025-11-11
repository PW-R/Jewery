import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const categoryConfig = [
    { name: "Necklaces", count: 3 },
    { name: "Rings", count: 3 },
    { name: "Bracelets", count: 2 },
    { name: "Earrings", count: 5 },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const promises = categoryConfig.map(async ({ name, count }) => {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/products/category/${name}`
          );

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
    <div className="min-h-screen bg-[#4a2c2b] text-[#e8c7b0] font-serif flex flex-col overflow-hidden pt-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center flex-1 px-4 py-32">
        <img
          src="https://png.pngtree.com/png-vector/20231016/ourmid/pngtree-diamond-chain-necklace-accessory-style-png-image_10189412.png"
          alt="Diamond Necklace"
          className="w-72 mt-8 mb-6"
        />

        <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#f1d1bc]">
          Gold and diamond flowers come to life
        </h2>
        <p className="text-sm max-w-xl text-[#d9b5a1]">
          Our jewelry garden blossoms with elegance and timeless design.
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-[#f9e9e4] py-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
          <div className="space-y-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/455/455705.png"
              alt="Chat Support"
              className="w-12 mx-auto opacity-80"
            />
            <h3 className="text-lg font-semibold text-[#4a2c2b]">
              Chat with Us Anytime
            </h3>
            <p className="text-[#7d5f5f] text-sm">
              Have a question? Our friendly team is always ready to assist you
              via chat.
            </p>
          </div>

          <div className="space-y-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
              alt="Curated Designs"
              className="w-12 mx-auto opacity-80"
            />
            <h3 className="text-lg font-semibold text-[#4a2c2b]">
              Carefully Curated Designs
            </h3>
            <p className="text-[#7d5f5f] text-sm">
              Each jewelry piece is handpicked with love — elegant, timeless,
              and unique.
            </p>
          </div>

          <div className="space-y-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
              alt="Detailed View"
              className="w-12 mx-auto opacity-80"
            />
            <h3 className="text-lg font-semibold text-[#4a2c2b]">
              Explore Every Detail
            </h3>
            <p className="text-[#7d5f5f] text-sm">
              Take a closer look at each piece before you decide — clear images
              and full details await.
            </p>
          </div>
        </div>
      </section>

      {/* Product Carousel */}
      <section className="bg-[#fbd9d9] text-[#4a2c2b] py-20 relative">
        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-[#f7dcdc] z-10"
        >
          <FaChevronLeft className="text-[#4a2c2b]" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-[#f7dcdc] z-10"
        >
          <FaChevronRight className="text-[#4a2c2b]" />
        </button>

        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide px-6">
          <div className="flex gap-8 py-6 snap-x snap-mandatory">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="min-w-[400px] bg-white rounded-2xl shadow-lg transition hover:shadow-xl hover:-translate-y-1 snap-center cursor-pointer p-16"
              >
                <div className="rounded-xl p-6 flex justify-center items-center">
                  <img
                    src={product.images?.[0] || "/images/no-image.png"}
                    alt={product.name}
                    className="w-44 h-44 object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <h3 className="text-lg font-semibold text-[#4a2c2b] mt-4">
                  {product.name}
                </h3>

                <p className="text-sm text-[#915858]/80 mt-1 line-clamp-2">
                  {product.description}
                </p>

                <p className="mt-4 text-[#915858] font-bold text-xl">
                  ${product.price?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="bg-[#f9f4f1] py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center px-8">
          <div className="bg-white rounded-3xl shadow-xl p-4">
            <img
              src="https://img.freepik.com/premium-photo/portrait-young-gorgeous-woman-dressed-jewelry-set-necklace-ring-bracelet-earrings-pretty-blue-eyed-model-is-demonstrating-attractive-makeup-manicure_353119-76.jpg"
              alt="Fashion Model"
              className="rounded-2xl w-full object-cover"
            />
          </div>
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl font-semibold text-[#4a2c2b]">
              The Art Of Radiant Refinement
            </h2>
            <p className="text-[#7d5f5f] leading-relaxed">
              Discover timeless elegance crafted with precision and grace. Our
              jewelry reflects exquisite craftsmanship and a refined sense of
              beauty—perfect for every occasion.
            </p>

            <button className="mt-4 px-6 py-3 border border-[#4a2c2b] text-[#4a2c2b] rounded-full hover:bg-[#4a2c2b] hover:text-white transition">
              Learn More
            </button>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-4">
            <img
              src="https://www.ylang23.com/cdn/shop/collections/SUZ-35072230_b.jpg?v=1720713235"
              alt="Jewelry"
              className="rounded-2xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4a2c2b] text-[#f3dbcd] py-16 mt-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">LURICE</h2>
            <p className="text-[#d9b5a1] text-sm leading-relaxed">
              Discover elegance in every detail. Crafted with passion, worn with
              pride.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-[#e8c7b0]">
              <li className="hover:text-white cursor-pointer">Home</li>
              <li className="hover:text-white cursor-pointer">Collections</li>
              <li className="hover:text-white cursor-pointer">New Arrivals</li>
              <li className="hover:text-white cursor-pointer">About Us</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-[#e8c7b0]">
              <li className="hover:text-white cursor-pointer">Shipping Info</li>
              <li className="hover:text-white cursor-pointer">
                Returns & Refunds
              </li>
              <li className="hover:text-white cursor-pointer">FAQ</li>
              <li className="hover:text-white cursor-pointer">
                Support Center
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-[#e8c7b0]">
              <li>📍 Bangkok, Thailand</li>
              <li>📞 +66 99-999-9999</li>
              <li>📧 support@LURICE.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#e8c7b0]/20 mt-12 pt-6 text-center text-sm text-[#e8c7b0]">
          © {new Date().getFullYear()} LURICE — All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
