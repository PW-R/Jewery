import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderRole: { type: String, enum: ["user", "admin"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // one chat per user
    adminId: { type: String, default: null }, // admin currently chatting
    status: {
      type: String,
      enum: ["pending", "active", "closed"],
      default: "pending",
    },
    messages: [messageSchema],
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
