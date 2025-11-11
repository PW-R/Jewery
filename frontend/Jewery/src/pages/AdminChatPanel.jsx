import { useEffect, useState, useRef } from "react";
import { getChatsByAdmin, adminReply } from "../api/chatApi";
import { FaTimes, FaPaperPlane, FaComments } from "react-icons/fa";

import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket", "polling"],
});


function AdminChatPanel() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const adminId = localStorage.getItem("userId");

  // === Scroll ===
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  // === โหลดแชทของแอดมิน ===
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const data = await getChatsByAdmin(adminId);
        setChats(data || []);
      } catch (err) {
        console.error("Error fetching admin chats:", err);
      } finally {
        setLoading(false);
      }
    };
    if (adminId) fetchChats();
  }, [adminId]);

  // === SOCKET.IO ===
  useEffect(() => {
    if (!adminId) return;

    const handleNewChat = (chat) => {
      if (!chat.isAssigned) {
        setChats((prev) => {
          if (prev.some((c) => c._id === chat._id)) return prev;
          return [...prev, chat];
        });
      }
    };

    const handleReceive = (newMsg) => {
      setSelectedChat((prev) => {
        if (!prev) return prev;
        const last = prev.messages.at(-1);
        if (last?.text === newMsg.text && last?.sender === newMsg.sender) return prev;
        return { ...prev, messages: [...prev.messages, newMsg] };
      });

      setChats((prev) =>
        prev.map((c) =>
          selectedChat && c._id === selectedChat._id
            ? {
                ...c,
                messages:
                  c.messages?.some(
                    (m) => m.text === newMsg.text && m.sender === newMsg.sender
                  )
                    ? c.messages
                    : [...c.messages, newMsg],
              }
            : c
        )
      );
    };

    // ป้องกันผูกซ้ำ
    socket.off("new_customer_chat");
    socket.off("receive_message");

    socket.on("new_customer_chat", handleNewChat);
    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("new_customer_chat", handleNewChat);
      socket.off("receive_message", handleReceive);
    };
  }, [adminId]);

  // === ส่งข้อความ ===
  const handleSend = async () => {
    if (!input.trim() || !selectedChat) return;
    const messageText = input.trim();
    setInput("");

    try {
      // บันทึกลงฐานข้อมูลก่อน
      await adminReply(selectedChat._id, adminId, messageText);

      // ส่ง socket ให้ลูกค้า
      socket.emit("admin_reply", {
        roomId: `room_${selectedChat.customerId._id || selectedChat.customerId}`,
        chatId: selectedChat._id,
        adminId,
        message: messageText,
      });

      // ❌ ไม่ต้องเพิ่มข้อความใน state เอง
      // เพราะ socket.receive_message จะอัปเดตให้อัตโนมัติ
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // === Loading ===
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF8F8]">
        <p className="text-[#B87A7D] text-lg font-medium animate-pulse">
          Loading chats...
        </p>
      </div>
    );

  return (
    <div className="flex h-screen bg-[#FFF8F8]">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-[#F0CCCE] bg-white shadow-sm p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#B87A7D] mb-4">Your Chats</h2>

        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-500">
            <FaComments className="text-4xl text-[#E7B6B9] mb-2" />
            <p>No active chats yet.</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`p-3 rounded-lg mb-2 cursor-pointer transition-all shadow-sm ${
                selectedChat?._id === chat._id
                  ? "bg-[#B87A7D] text-white"
                  : "bg-[#FFF8F8] hover:bg-[#F0CCCE]/60"
              }`}
              onClick={() => {
                if (!selectedChat || selectedChat._id !== chat._id) {
                  setSelectedChat(chat);
                  socket.emit(
                    "join_room",
                    `room_${chat.customerId._id || chat.customerId}`
                  );
                }
              }}
            >
              <p className="font-medium">
                {chat.customerId?.firstName
                  ? `${chat.customerId.firstName} ${chat.customerId.lastName}`
                  : "Customer"}
              </p>
              <p
                className={`text-sm truncate ${
                  selectedChat?._id === chat._id
                    ? "text-[#FFF8F8]"
                    : "text-gray-500"
                }`}
              >
                {chat.messages?.[chat.messages.length - 1]?.text ||
                  "No messages yet"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-[#F0CCCE] shadow-sm">
              <div>
                <p className="text-lg font-semibold text-[#B87A7D]">
                  Chat with{" "}
                  {selectedChat.customerId?.firstName ||
                    selectedChat.customerId ||
                    "Customer"}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedChat.customerId?.email || "—"}
                </p>
              </div>
              <FaTimes
                className="cursor-pointer text-gray-400 hover:text-[#DA9FA3] transition"
                onClick={() => setSelectedChat(null)}
              />
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-[#FFF8F8]">
              {selectedChat.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-sm text-sm max-w-xs break-words ${
                      msg.sender === "admin"
                        ? "bg-[#B87A7D] text-white rounded-br-none"
                        : "bg-white text-gray-700 border border-[#F0CCCE] rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-[#F0CCCE] flex items-center">
              <input
                type="text"
                className="flex-1 border border-[#E7B6B9] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#DA9FA3]"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="ml-3 px-5 py-2 bg-[#DA9FA3] text-white rounded-full hover:bg-[#E7B6B9] transition flex items-center gap-2 shadow-sm"
                onClick={handleSend}
              >
                <FaPaperPlane className="text-sm" />
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FaComments className="text-6xl text-[#E7B6B9] mb-4" />
            <p className="text-lg font-medium text-[#B87A7D]">
              Select a chat to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminChatPanel;
