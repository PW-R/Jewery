import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetailPage() {
  const { productId } = useParams(); // get productId from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <img src={product.image} alt={product.name} className="my-4" />
      <p className="text-lg text-gray-700">{product.description}</p>
      <p className="text-xl font-semibold mt-2">${product.price}</p>
    </div>
  );
}

export default ProductDetailPage;
