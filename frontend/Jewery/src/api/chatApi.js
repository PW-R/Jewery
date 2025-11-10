// src/api/chatApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/chats";

// ===== ลูกค้าส่งข้อความ =====
//--Chatbox
export const sendCustomerMessage = async (customerId, message) => {
  const res = await axios.post(`${API_URL}/send`, { customerId, message });
  return res.data;
};

// ===== แอดมินตอบกลับ =====
//---AdminChatPanel
export const adminReply = async (chatId, adminId, message) => {
  const res = await axios.post(`${API_URL}/reply`, { chatId, adminId, message });
  return res.data;
};

// ===== ดึงแชทของแอดมินคนนั้น =====
//--AdminChatPanel
export const getChatsByAdmin = async (adminId) => {
  const res = await axios.get(`${API_URL}/admin/${adminId}`);
  return res.data;
};

// ===== ดึงแชทของลูกค้าคนเดียว(ประวัติchat) =====
//--Chatbox
export const getChatByCustomer = async (customerId) => {
  const res = await axios.get(`${API_URL}/customer/${customerId}`);
  return res.data;
};

// ===== ดึงแชททั้งหมด (ถ้าต้องการ) =====
//--AdminPendingChats
export const getAllChats = async () => {
  const res = await axios.get(`${API_URL}`);
  return res.data;
};

// pending changes to other files
//-----AdminPendingChats
export const acceptChat = async (chatId, adminId) => {
  const res = await axios.put(`${API_URL}/accept/${chatId}`, { adminId });
  return res.data;
};