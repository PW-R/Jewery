import axios from "axios";

const API_BASE = "/api/chats";

// ==== CREATE OR INIT CHAT ====
export const initChatForUser = async (userId) => {
  try {
    const res = await axios.post(`${API_BASE}/init`, { userId });
    return res.data;
  } catch (err) {
    console.error("Error initializing chat:", err);
    throw err;
  }
};

// ==== GET CHAT HISTORY ====
export const getChatByUser = async (userId) => {
  try {
    const res = await axios.get(`${API_BASE}/user/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching chat history:", err);
    throw err;
  }
};

// ==== SEND MESSAGE ====
export const sendMessage = async ({ chatId, sender, message }) => {
  try {
    const res = await axios.post(`${API_BASE}/message`, { chatId, sender, message });
    return res.data;
  } catch (err) {
    console.error("Error sending message:", err);
    throw err;
  }
};

// ==== ADMIN ACCEPT CHAT ====
export const acceptChat = async ({ chatId, adminId }) => {
  try {
    const res = await axios.post(`${API_BASE}/accept`, { chatId, adminId });
    return res.data;
  } catch (err) {
    console.error("Error accepting chat:", err);
    throw err;
  }
};

// ==== ADMIN: GET PENDING CHATS ====
export const getPendingChats = async () => {
  try {
    const res = await axios.get(`${API_BASE}/pending`);
    return res.data;
  } catch (err) {
    console.error("Error fetching pending chats:", err);
    throw err;
  }
};

// ==== ADMIN: GET CHATS ASSIGNED TO ADMIN ====
export const getAdminChats = async (adminId) => {
  try {
    const res = await axios.get(`${API_BASE}/admin/${adminId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching admin chats:", err);
    throw err;
  }
};
