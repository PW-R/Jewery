import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

//สร้างรหัสสินค้าอัตโนมัติตามหมวดหมู่
export const getNextCode = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // ✅ สร้าง prefix ตาม category
    let prefix = "PRD";
    const cat = category.toLowerCase();
    if (cat.includes("necklace")) prefix = "NCK";
    else if (cat.includes("ring")) prefix = "RNG";
    else if (cat.includes("bracelet")) prefix = "BRC";

    // ✅ หา product ล่าสุดใน category นั้น
    const lastProduct = await Product.findOne({ category })
      .sort({ createdAt: -1 })
      .exec();

    let nextNumber = 1;
    if (lastProduct && lastProduct.code) {
      const match = lastProduct.code.match(/\d+$/);
      if (match) nextNumber = parseInt(match[0]) + 1;
    }

    const nextCode = `${prefix}${String(nextNumber).padStart(3, "0")}`;
    res.json({ nextCode });
  } catch (err) {
    console.error("Error generating next code:", err);
    res.status(500).json({ message: err.message });
  }
};


// === GET ALL PRODUCTS (optional filter by category) ===
export const getProducts = async (req, res) => {
  const { category } = req.query;

  try {
    const query = category ? { category } : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    console.error("❌ Error in getProducts:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// === GET PRODUCTS BY CATEGORY PARAM ===
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (err) {
    console.error("❌ Error in getProductsByCategory:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// === GET SINGLE PRODUCT BY ID ===
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// === CREATE NEW PRODUCT ===
export const createProduct = async (req, res) => {
  try {
    const { code, name, description, category, price, material, weight, stock } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const newProduct = new Product({
      code,
      name,
      description,
      category,
      price,
      material,
      weight,
      stock,
      images
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// === UPDATE PRODUCT ===
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// === DELETE PRODUCT ===
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
