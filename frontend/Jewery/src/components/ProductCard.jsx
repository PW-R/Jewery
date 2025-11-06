// src/components/ProductCard.jsx
function ProductCard({ product }) {
  if (!product) return null; // Prevent errors if product is undefined

  return (
    <div className="text-center   rounded-xl p-6 shadow-sm cursor-pointer">
      {/* Product Image */}
      <img
        src={
          product.images && product.images.length > 0
            ? product.images[0]
            : "https://res.cloudinary.com/dnd6qbufm/image/upload/v1730569000/jewelry_products/no-image.png"
        }
        alt={product.name}
        className="w-64 h-64 object-cover mx-auto mb-4 rounded-md transform transition-transform duration-300 hover:scale-105"
      />

      {/* Product Name */}
      <h3 className="text-lg font-medium">{product.name}</h3>

      {/* Product Description */}
      <p className="text-sm text-[#915858]/80">{product.description}</p>

      {/* Product Price */}
      <p className="mt-2 text-[#915858] font-semibold">
        ${product.price?.toLocaleString()}
      </p>
    </div>
  );
}

export default ProductCard;
