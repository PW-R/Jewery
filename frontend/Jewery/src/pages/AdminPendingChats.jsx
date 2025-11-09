// src/pages/AdminPendingChats.jsx
import { useEffect, useState } from "react";
import { acceptChat, getAllChats } from "../api/chatApi";
import { FaCheck, FaComments } from "react-icons/fa";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function AdminPendingChats() {
  const [pendingChats, setPendingChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  const adminId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPendingChats = async () => {
      try {
        setLoading(true);
        const data = await getAllChats();
        const unassigned = data.filter((chat) => !chat.isAssigned);
        setPendingChats(unassigned);
      } catch (err) {
        console.error("Error fetching pending chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingChats();

    socket.on("new_customer_chat", (chat) => {
      if (!chat.isAssigned) {
        setPendingChats((prev) => [...prev, chat]);
      }
    });

    return () => {
      socket.off("new_customer_chat");
    };
  }, []);

  const handleAccept = async (chatId) => {
    try {
      setAcceptingId(chatId);
      await acceptChat(chatId, adminId);
      setPendingChats((prev) => prev.filter((c) => c._id !== chatId));
    } catch (err) {
      console.error("Error accepting chat:", err);
    } finally {
      setAcceptingId(null);
    }
  };

  // --- Loading
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF8F8]">
        <p className="text-[#B87A7D] text-lg font-medium animate-pulse">
          Loading pending chats...
        </p>
      </div>
    );

  // --- No pending chats
  if (pendingChats.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF8F8] text-center">
        <FaComments className="text-5xl text-[#E7B6B9] mb-4" />
        <h2 className="text-2xl font-semibold text-[#B87A7D]">
          No pending chats right now 💬
        </h2>
        <p className="text-gray-500 mt-2">
          You’ll see new user requests appear here in real-time.
        </p>
      </div>
    );

  // --- Pending chat list
  return (
    <div className="min-h-screen bg-[#FFF8F8] p-8">
      <header className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#B87A7D]">
          Pending User Chats
        </h1>
        <div className="text-sm text-gray-500">
          Total Pending:{" "}
          <span className="text-[#DA9FA3] font-semibold">
            {pendingChats.length}
          </span>
        </div>
      </header>

      <div className="grid gap-4">
        {pendingChats.map((chat) => (
          <div
            key={chat._id}
            className="bg-white border border-[#F0CCCE] rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#E7B6B9] transition"
          >
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <p className="font-semibold text-[#B87A7D] text-lg">
                  {" "}
                  {chat.customerId?.firstName
                    ? `${chat.customerId.firstName} ${chat.customerId.lastName}`
                    : "Unknown User"}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  <span className="font-medium text-[#DA9FA3]">
                    Last message:
                  </span>{" "}
                  {chat.messages?.length
                    ? chat.messages[chat.messages.length - 1].text
                    : "No message yet"}
                </p>
              </div>

              <button
                onClick={() => handleAccept(chat._id)}
                disabled={acceptingId === chat._id}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all shadow-sm ${
                  acceptingId === chat._id
                    ? "bg-gray-300 cursor-not-allowed text-gray-700"
                    : "bg-[#DA9FA3] text-white hover:bg-[#E7B6B9]"
                }`}
              >
                {acceptingId === chat._id ? (
                  "Accepting..."
                ) : (
                  <>
                    <FaCheck className="text-sm" /> Accept Chat
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPendingChats;
