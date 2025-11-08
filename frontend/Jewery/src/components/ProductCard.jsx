import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recordProductClick, recordUserViewHistory } from "../api/clickApi";

function ProductCard({ product, userId }) {
  const navigate = useNavigate();
  const [isClicking, setIsClicking] = useState(false); // Prevent double clicks

  if (!product) return null;

  const handleClick = async () => {
    if (isClicking) return; // Ignore if already processing
    setIsClicking(true);

    try {
      // Record the product click (analytics)
      await recordProductClick({ productId: product._id });

      // Optionally, record the user's view history if you have a userId
      if (userId) {
        await recordUserViewHistory({ userId, productId: product._id });
      }

      // Navigate to product detail page
      navigate(`/product/${product._id}`);
    } catch (err) {
      console.error("Error recording click:", err);
      navigate(`/product/${product._id}`); // Still navigate on error
    } finally {
      setIsClicking(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="text-center rounded-xl p-6 shadow-sm cursor-pointer hover:shadow-md transition"
    >
      <img
        src={
          product.images && product.images.length > 0
            ? product.images[0]
            : "https://res.cloudinary.com/dnd6qbufm/image/upload/v1730569000/jewelry_products/no-image.png"
        }
        alt={product.name}
        className="w-64 h-64 object-cover mx-auto mb-4 rounded-md transform transition-transform duration-300 hover:scale-105"
      />
      <h3 className="text-lg font-medium">{product.name}</h3>
      <p className="text-sm text-[#915858]/80">{product.description}</p>
      <p className="mt-2 text-[#915858] font-semibold">
        ${product.price?.toLocaleString()}
      </p>
    </div>
  );
}

export default ProductCard;
