import mongoose from "mongoose";

const clickSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // must match your actual User model name
      default: null,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // must match your Product model name
      required: true,
    },
    category: {
      type: String,
      default: "Unknown",
    },
    device: {
      type: String,
      default: "desktop", // optional: "desktop", "mobile", etc.
    },
    page: {
      type: String,
      default: "product-page",
    },
    clickCount: {
      type: Number,
      default: 1,
    },
    type: {
      type: String,
      enum: ["user", "product"],
      default: "user",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Click = mongoose.model("Click", clickSchema);
export default Click;
