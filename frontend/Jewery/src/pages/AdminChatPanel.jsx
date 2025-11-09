import { useEffect, useState, useRef } from "react";
import { getChatsByAdmin, adminReply } from "../api/chatApi";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

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

    socket.on("new_customer_chat", handleNewChat);
    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("new_customer_chat", handleNewChat);
      socket.off("receive_message", handleReceive);
    };
  }, [adminId, selectedChat?._id]);

  const handleSend = async () => {
    if (!input.trim() || !selectedChat) return;
    const messageText = input.trim();
    setInput("");

    const newMsg = { sender: "admin", text: messageText };

    try {
      await adminReply(selectedChat._id, adminId, messageText);

      socket.emit("admin_reply", {
        roomId: `room_${selectedChat.customerId._id || selectedChat.customerId}`,
        chatId: selectedChat._id,
        adminId,
        message: messageText,
      });

      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, newMsg],
      }));

      setChats((prev) =>
        prev.map((c) =>
          c._id === selectedChat._id
            ? { ...c, messages: [...c.messages, newMsg] }
            : c
        )
      );
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading) return <p className="p-6">Loading chats...</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r overflow-y-auto bg-gray-100 p-4">
        <h2 className="text-xl font-semibold mb-4">Your Chats</h2>
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`p-3 rounded mb-2 cursor-pointer ${
              selectedChat?._id === chat._id
                ? "bg-[#B87A7D] text-white"
                : "bg-white"
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
            <p className="text-sm truncate">
              {chat.messages?.[chat.messages.length - 1]?.text ||
                "No messages yet"}
            </p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            <div className="flex justify-between items-center p-4 border-b">
              <p className="font-semibold">
                Chat with{" "}
                {selectedChat.customerId?.firstName ||
                  selectedChat.customerId ||
                  "Customer"}
              </p>
              <FaTimes
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedChat(null)}
              />
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {selectedChat.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`${
                    msg.sender === "admin" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block px-3 py-2 rounded-lg text-sm ${
                      msg.sender === "admin"
                        ? "bg-[#B87A7D] text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex p-4 border-t">
              <input
                type="text"
                className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#B87A7D]"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="ml-2 px-4 py-2 bg-[#B87A7D] text-white rounded-xl hover:bg-[#DA9FA3] transition flex items-center gap-2"
                onClick={handleSend}
              >
                <FaPaperPlane />
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="p-6 text-gray-500">Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );
}

export default AdminChatPanel;
