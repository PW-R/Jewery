// src/pages/AdminPendingChats.jsx
import { useEffect, useState } from "react";
import { acceptChat, getAllChats } from "../api/chatApi"; // ✅ ใช้ getAllChats แทน getPendingChats
import { FaCheck } from "react-icons/fa";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function AdminPendingChats() {
  const [pendingChats, setPendingChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  const adminId = localStorage.getItem("userId");

  // ✅ โหลดแชทรอรับตอนเปิดหน้า
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

    // ✅ ฟัง event จาก socket — เมื่อมีลูกค้าใหม่
    socket.on("new_customer_chat", (chat) => {
      if (!chat.isAssigned) {
        setPendingChats((prev) => [...prev, chat]);
      }
    });

    // cleanup
    return () => {
      socket.off("new_customer_chat");
    };
  }, []);

  // ✅ ฟังก์ชันรับแชท
  const handleAccept = async (chatId) => {
    try {
      setAcceptingId(chatId);
      await acceptChat(chatId, adminId);

      // ลบแชทที่ถูก assign ออกจากรายการ pending
      setPendingChats((prev) => prev.filter((c) => c._id !== chatId));
    } catch (err) {
      console.error("Error accepting chat:", err);
    } finally {
      setAcceptingId(null);
    }
  };

  // ✅ แสดงสถานะโหลด
  if (loading) return <p className="p-6">Loading pending chats...</p>;

  // ✅ ถ้าไม่มีแชทรอรับ
  if (pendingChats.length === 0)
    return <p className="p-6 text-gray-600">No pending chats at the moment.</p>;

  // ✅ UI เดิมของคุณ (คงไว้ทั้งหมด)
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Pending User Chats</h1>
      {pendingChats.map((chat) => (
        <div
          key={chat._id}
          className="border p-4 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition"
        >
          <div>
            <p className="font-medium">
              User:{" "}
              {chat.customerId?.firstName
                ? `${chat.customerId.firstName} ${chat.customerId.lastName}`
                : "Unknown User"}
            </p>
            <p className="text-sm text-gray-600">
              Last message:{" "}
              {chat.messages?.length
                ? chat.messages[chat.messages.length - 1].text
                : "No message yet"}
            </p>
          </div>

          <button
            onClick={() => handleAccept(chat._id)}
            disabled={acceptingId === chat._id}
            className={`flex items-center gap-2 px-4 py-2 rounded transition ${
              acceptingId === chat._id
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {acceptingId === chat._id ? (
              "Accepting..."
            ) : (
              <>
                <FaCheck /> Accept
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminPendingChats;
