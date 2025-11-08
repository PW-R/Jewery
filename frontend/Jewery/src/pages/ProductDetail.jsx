import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [related, setRelated] = useState([]);

  useEffect(() => {
    // Fetch main product
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setSelectedImage(
          data.images?.[0] ||
            "https://res.cloudinary.com/dnd6qbufm/image/upload/v1730569000/jewelry_products/no-image.png"
        );
        setLoading(false);

        // Fetch related products in same category
        if (data.category) {
          fetch(
            `http://localhost:5000/api/products?category=${encodeURIComponent(
              data.category
            )}`
          )
            .then((res) => res.json())
            .then((relatedData) => {
              const filtered = relatedData.filter((p) => p._id !== data._id);
              setRelated(filtered);
            });
        }
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [productId]);

  if (loading)
    return (
      <div className="text-center p-20 text-lg text-gray-500">
        Loading product...
      </div>
    );
  if (!product)
    return (
      <div className="text-center p-20 text-lg text-red-500">
        Product not found.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-16">
      {/* Main Product */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 transition ${
                    selectedImage === img
                      ? "border-[#B87A7D]"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col justify-start space-y-6">
          <h1 className="text-5xl font-extrabold text-[#B87A7D]">
            {product.name}
          </h1>

          <p className="text-3xl font-bold text-gray-900">
            ${product.price?.toFixed(2)}
          </p>

          <p className="text-gray-600 text-lg leading-relaxed">
            {product.description}
          </p>

          {product.stock !== undefined && (
            <p
              className={`text-sm font-semibold ${
                product.stock > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 text-gray-500 text-sm mt-6">
            {product.material && <p>Material: {product.material}</p>}
            {product.weight && <p>Weight: {product.weight} g</p>}
            {product.category && <p>Category: {product.category}</p>}
          </div>
        </div>
      </div>

      {/* Recommended / Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-[#B87A7D] mb-6">
            More in {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {related.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item._id}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transform transition cursor-pointer"
              >
                <img
                  src={
                    item.images?.[0] ||
                    "https://res.cloudinary.com/dnd6qbufm/image/upload/v1730569000/jewelry_products/no-image.png"
                  }
                  alt={item.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-[#B87A7D]">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 mt-1">${item.price?.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;
