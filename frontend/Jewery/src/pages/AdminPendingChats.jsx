// src/pages/AdminPendingChats.jsx
import { useEffect, useState } from "react";
import { acceptChat, getPendingChats } from "../api/chatApi"; // <-- fixed import
import { FaCheck } from "react-icons/fa";

function AdminPendingChats() {
  const [pendingChats, setPendingChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null); // track chat being accepted

  const adminId = localStorage.getItem("userId");

  // Fetch pending chats
  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoading(true);
        const data = await getPendingChats(); // implement this in chatApi.js
        setPendingChats(data);
      } catch (err) {
        console.error("Error fetching pending chats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleAccept = async (chatId) => {
    try {
      setAcceptingId(chatId);
      await acceptChat({ chatId, adminId });
      // remove accepted chat from list
      setPendingChats((prev) => prev.filter((c) => c._id !== chatId));
    } catch (err) {
      console.error("Error accepting chat:", err);
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) return <p className="p-6">Loading pending chats...</p>;

  if (pendingChats.length === 0)
    return <p className="p-6">No pending chats at the moment.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Pending User Chats</h1>
      {pendingChats.map((chat) => (
        <div
          key={chat._id}
          className="border p-4 rounded-lg flex justify-between items-center shadow-sm"
        >
          <div>
            <p className="font-medium">User: {chat.userName || chat.userId}</p>
            <p className="text-sm text-gray-600">
              Last message: {chat.lastMessage || "No message yet"}
            </p>
          </div>
          <button
            onClick={() => handleAccept(chat._id)}
            disabled={acceptingId === chat._id}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            {acceptingId === chat._id ? "Accepting..." : <><FaCheck /> Accept</>}
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminPendingChats;
