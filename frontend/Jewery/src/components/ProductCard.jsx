function ProductCard({ category, products }) {
  return (
    <div className="bg-[#FBE8E8] min-h-screen text-[#915858]">
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
        {products.map((item) => (
          <div
            key={item._id}
            className="text-center bg-[#FBE8E8] hover:bg-[#F9D9D9] transition rounded-xl p-6 shadow-sm"
          >
            <img
              src={
                item.images && item.images.length > 0
                  ? item.images[0]
                  : "https://res.cloudinary.com/dnd6qbufm/image/upload/v1730569000/jewelry_products/no-image.png"
              }
              alt={item.name}
              className="w-64 h-64 object-cover mx-auto mb-4 rounded-md transform transition-transform duration-300 hover:scale-105"
            />

            <h3 className="text-lg font-medium">{item.name}</h3>
            <p className="text-sm text-[#915858]/80">{item.description}</p>
            <p className="mt-2 text-[#915858] font-semibold">
              ${item.price?.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCard;
