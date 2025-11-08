import Chat from "../models/Chat.js";

/**
 * Start or get existing chat for a user
 */
export const startChat = async (req, res) => {
  const { userId } = req.body;

  try {
    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = new Chat({ userId });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to start chat" });
  }
};

/**
 * Send a message from user or admin
 */
export const sendMessage = async (req, res) => {
  const { userId, senderId, senderRole, text } = req.body;

  try {
    const chat = await Chat.findOne({ userId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.push({ senderId, senderRole, text });
    await chat.save();

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

/**
 * Admin accepts a pending chat
 */
export const acceptChat = async (req, res) => {
  const { userId, adminId } = req.body;

  try {
    const chat = await Chat.findOne({ userId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.adminId = adminId;
    chat.status = "active";
    await chat.save();

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to accept chat" });
  }
};

/**
 * Get chat history for a user
 */
export const getChatHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const chat = await Chat.findOne({ userId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch chat" });
  }
};
