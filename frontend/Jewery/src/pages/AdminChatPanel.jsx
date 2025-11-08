// src/pages/AdminChatPanel.jsx
import { useEffect, useState } from "react";
import { getAdminChats, sendMessage } from "../api/chatApi"; // <-- fixed import
import { FaTimes, FaPaperPlane } from "react-icons/fa";

function AdminChatPanel() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const adminId = localStorage.getItem("userId");

  // Fetch chats assigned to this admin
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const data = await getAdminChats(adminId);
        setChats(data);
      } catch (err) {
        console.error("Error fetching admin chats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [adminId]);

  const handleSend = async () => {
    if (!input.trim() || !selectedChat) return;
    try {
      const msg = await sendMessage({
        chatId: selectedChat._id,
        sender: "admin",
        message: input,
      });

      // Update messages locally
      setChats((prev) =>
        prev.map((c) =>
          c._id === selectedChat._id
            ? { ...c, messages: [...c.messages, msg] }
            : c
        )
      );
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, msg],
      }));
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading) return <p className="p-6">Loading chats...</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar: list of chats */}
      <div className="w-1/4 border-r overflow-y-auto bg-gray-100 p-4">
        <h2 className="text-xl font-semibold mb-4">Your Chats</h2>
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`p-3 rounded mb-2 cursor-pointer ${
              selectedChat?._id === chat._id ? "bg-[#B87A7D] text-white" : "bg-white"
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            <p className="font-medium">User: {chat.userName || chat.userId}</p>
            <p className="text-sm truncate">
              {chat.messages?.[chat.messages.length - 1]?.text || "No messages"}
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
                Chat with {selectedChat.userName || selectedChat.userId}
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
                  className={`${msg.sender === "admin" ? "text-right" : "text-left"}`}
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
