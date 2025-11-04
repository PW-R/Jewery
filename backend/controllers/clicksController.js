import Click from "../models/Click.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// === Record a User Click ===
// Stores a single user's click action on a product
export const recordUserClick = async (req, res) => {
  try {
    const { userId, productId, category } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    const userExists = await User.findById(userId);
    const productExists = await Product.findById(productId);

    if (!userExists || !productExists) {
      return res.status(404).json({ message: "User or Product not found" });
    }

    const newClick = new Click({
      userId,
      productId,
      category: category || productExists.category || "Unknown",
      type: "user",
    });

    await newClick.save();
    res.status(201).json({ message: "✅ User click recorded", data: newClick });
  } catch (err) {
    console.error("Error recording user click:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// === Record or Increment Product Click ===
// Tracks total clicks per product
export const recordProductClick = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    let productClick = await Click.findOne({ productId, type: "product" });

    if (!productClick) {
      productClick = new Click({
        productId,
        category: productExists.category || "Unknown",
        clickCount: 1,
        type: "product",
      });
    } else {
      productClick.clickCount += 1;
    }

    await productClick.save();
    res.status(201).json({ message: "✅ Product click recorded", data: productClick });
  } catch (err) {
    console.error("Error recording product click:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// === Get All Click Records (Admin Analytics) ===
export const getAllClicks = async (req, res) => {
  try {
    const clicks = await Click.find()
      .populate("userId", "firstName lastName email")
      .populate("productId", "name category price");
    res.json(clicks);
  } catch (err) {
    console.error("Error fetching clicks:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// === Get Clicks by User ===
export const getUserClicksByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const clicks = await Click.find({ userId, type: "user" })
      .populate("productId", "name category price")
      .sort({ createdAt: -1 });

    res.json(clicks);
  } catch (err) {
    console.error("Error fetching user clicks:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// === Get Product Click Count ===
export const getProductClicksByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const clickData = await Click.findOne({ productId, type: "product" })
      .populate("productId", "name category");

    if (!clickData) {
      return res.status(404).json({ message: "No clicks found for this product" });
    }

    res.json(clickData);
  } catch (err) {
    console.error("Error fetching product clicks:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
