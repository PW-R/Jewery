import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import { useRef } from "react";
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

  // 🔹 ตั้งค่าหมวดหมู่และจำนวนสินค้าที่ต้องการ
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
            `http://localhost:5000/api/products/category/${name}`
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
      {/* หัว */}
      <section className="flex flex-col items-center justify-center text-center flex-1 px-4 p-60">
        <img
          src="https://cdn.vancleefarpels.com/media/catalog/product/cache/1/image/1800x/0dc2d03fe217f8c83829496872af24a0/v/c/vcarp5h70000_x.jpg"
          alt="Diamond Necklace"
          className="w-72 mt-8 mb-6"
        />
        <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#f1d1bc]">
          Gold and diamond flowers come to life
        </h2>
        <p className="text-sm max-w-xl text-[#d9b5a1]">
          Van Cleef & Arpels' jewelry garden blossoms with the Flowerlace
          collection
        </p>
      </section>

      {/* ไอคอน */}
      <section className="bg-[#f9e9e4] py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center justify-center justify-items-center">
            {/* Box 1 */}
            <div className="space-y-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
                alt="Icon 1"
                className="w-12 mx-auto opacity-80"
              />
              <h3 className="text-lg font-semibold text-[#4a2c2b]">
                Fast Shipping
              </h3>
              <p className="text-[#7d5f5f] text-sm">
                Receive your order quickly with express worldwide delivery.
              </p>
            </div>

            {/* Box 2 */}
            <div className="space-y-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/yyy/yyy.png"
                alt="Icon 2"
                className="w-12 mx-auto opacity-80"
              />
              <h3 className="text-lg font-semibold text-[#4a2c2b]">
                Excellent Quality
              </h3>
              <p className="text-[#7d5f5f] text-sm">
                Our jewelry pieces are made with precision and care.
              </p>
            </div>

            {/* Box 3 */}
            <div className="space-y-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/zzz/zzz.png"
                alt="Icon 3"
                className="w-12 mx-auto opacity-80"
              />
              <h3 className="text-lg font-semibold text-[#4a2c2b]">
                Gift Packaging
              </h3>
              <p className="text-[#7d5f5f] text-sm">
                Every piece comes in luxurious gift-ready packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* แสดงสินค้า */}
      <section className="bg-[#fbd9d9] text-[#4a2c2b] py-20 relative">
        {/* ปุ่มซ้าย */}
        <button
          onClick={scrollLeft}
          className="
      absolute left-4 top-1/2 -translate-y-1/2
      bg-white shadow-lg rounded-full p-3
      hover:bg-[#f7dcdc] transition
      z-10
    "
        >
          <FaChevronLeft className="text-[#4a2c2b]" />
        </button>

        {/* ปุ่มขวา */}
        <button
          onClick={scrollRight}
          className="
      absolute right-4 top-1/2 -translate-y-1/2
      bg-white shadow-lg rounded-full p-3
      hover:bg-[#f7dcdc] transition
      z-10
    "
        >
          <FaChevronRight className="text-[#4a2c2b]" />
        </button>

        <div
          ref={scrollRef} // ✅ ต้องอยู่ตรงนี้
          className="overflow-x-auto scrollbar-hide px-6"
        >
          <div
            className="
      flex 
      gap-8 
      py-6 
      snap-x 
      snap-mandatory
    "
          >
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="
          min-w-[400px]
          bg-white
          rounded-2xl 
          shadow-lg 
          transition-all 
          duration-300 
          hover:shadow-xl 
          hover:-translate-y-1 
          snap-center 
          cursor-pointer
          p-16
        "
              >
                <div className="rounded-xl p-6 flex justify-center items-center">
                  <img
                    src={
                      product.images?.[0] ||
                      "https://res.cloudinary.com/dnd6qbufm/image/upload/v1730569000/jewelry_products/no-image.png"
                    }
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
      {/* โชว์รูป */}
      {/* Section สไตล์หรูแบบในภาพตัวอย่าง */}
      <section className="bg-[#f9f4f1] py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center px-8">
          {/* ✅ ซ้าย: ภาพผู้หญิง */}
          <div className="bg-white rounded-3xl shadow-xl p-4">
            <img
              src="https://images.pexels.com/photos/19886859/pexels-photo-19886859/free-photo-of-elegant-woman-wearing-sunglasses.jpeg"
              alt="Fashion Model"
              className="rounded-2xl w-full object-cover"
            />
          </div>

          {/* ✅ กลาง: ข้อความ */}
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl font-semibold text-[#4a2c2b]">
              The Art Of Radiant Refinement
            </h2>
            <p className="text-[#7d5f5f] leading-relaxed">
              Discover timeless elegance crafted with precision and grace. Our
              jewelry reflects exquisite craftsmanship and a refined sense of
              beauty—perfect for every occasion. Explore unique pieces that
              shine with sophistication.
            </p>

            <button className="mt-4 px-6 py-3 border border-[#4a2c2b] text-[#4a2c2b] rounded-full hover:bg-[#4a2c2b] hover:text-white transition">
              Learn More
            </button>
          </div>

          {/* ✅ ขวา: ภาพสินค้าเล็ก */}
          <div className="bg-white rounded-3xl shadow-xl p-4">
            <img
              src="https://images.pexels.com/photos/14530043/pexels-photo-14530043.jpeg"
              alt="Jewelry"
              className="rounded-2xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== Footer Section ===== */}
      <footer className="bg-[#4a2c2b] text-[#f3dbcd] py-16 mt-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* ===== Logo & Description ===== */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">LURICE</h2>
            <p className="text-[#d9b5a1] text-sm leading-relaxed">
              Discover elegance in every detail. Crafted with passion, worn with
              pride.
            </p>
          </div>

          {/* ===== Quick Links ===== */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-[#e8c7b0]">
              <li className="hover:text-white transition cursor-pointer">
                Home
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Collections
              </li>
              <li className="hover:text-white transition cursor-pointer">
                New Arrivals
              </li>
              <li className="hover:text-white transition cursor-pointer">
                About Us
              </li>
            </ul>
          </div>

          {/* ===== Customer Service ===== */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-[#e8c7b0]">
              <li className="hover:text-white transition cursor-pointer">
                Shipping Info
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Returns & Refunds
              </li>
              <li className="hover:text-white transition cursor-pointer">
                FAQ
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Support Center
              </li>
            </ul>
          </div>

          {/* ===== Contact Info ===== */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-[#e8c7b0]">📍 Bangkok, Thailand</li>
              <li className="text-[#e8c7b0]">📞 +66 99-999-9999</li>
              <li className="text-[#e8c7b0]">📧 support@aurumluxe.com</li>
            </ul>
          </div>
        </div>

        {/* ===== Bottom Line ===== */}
        <div className="border-t border-[#e8c7b0]/20 mt-12 pt-6 text-center text-sm text-[#e8c7b0]">
          © {new Date().getFullYear()} LURICE — All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
