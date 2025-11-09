import { useState, useEffect, useRef } from "react";
import { FaTimes, FaCommentDots } from "react-icons/fa";
import io from "socket.io-client";
import { sendCustomerMessage, getChatByCustomer } from "../api/chatApi";

const socket = io("http://localhost:5000");

function CustomerChatBox() {
  const customerId = localStorage.getItem("userId");
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ scroll อัตโนมัติทุกครั้งที่มีข้อความใหม่
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ เข้าห้องแค่ครั้งเดียว (ไม่ผูกกับ isOpen)
  useEffect(() => {
    if (!customerId) return;

    const roomId = `room_${customerId}`;
    socket.emit("join_room", roomId);
    console.log("🟢 Joined room:", roomId);

    return () => {
      socket.emit("leave_room", roomId);
      console.log("🚪 Left room:", roomId);
    };
  }, [customerId]);

  // ✅ โหลดประวัติแชททันทีหลัง login (ไม่ต้องเปิดกล่อง)
  useEffect(() => {
    if (!customerId) return;

    const loadHistory = async () => {
      try {
        const data = await getChatByCustomer(customerId);
        if (data?._id) {
          setChat(data);
          setMessages(data.messages || []);
          console.log("📜 Loaded chat history on login:", data.messages.length);
        } else {
          setMessages([]); // ไม่มีแชทเก่า
        }
      } catch (err) {
        console.error("❌ Failed to load chat history:", err);
      }
    };

    loadHistory();
  }, [customerId]);

  // ✅ ฟังข้อความใหม่ (ตลอดเวลา ไม่ต้องรอเปิดกล่อง)
  useEffect(() => {
    if (!customerId) return;

    const handleReceive = (newMsg) => {
      setMessages((prev) => {
        const last = prev.at(-1);
        if (
          last?.text === newMsg.text &&
          last?.sender === newMsg.sender &&
          Math.abs(new Date(newMsg.timestamp) - new Date(last.timestamp)) < 1000
        ) {
          return prev; // ✅ กันซ้ำภายใน 1 วิ
        }
        return [...prev, newMsg];
      });
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [customerId]);

  const handleSend = async () => {
    if (!input.trim() || !customerId) return;

    const newMessage = {
      sender: "customer",
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsWaiting(true);

    try {
      await sendCustomerMessage(customerId, input.trim());
      socket.emit("send_message", {
        roomId: `room_${customerId}`,
        customerId,
        message: input.trim(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "system", text: "❌ Failed to send message" },
      ]);
    } finally {
      setIsWaiting(false);
    }
  };

  const ChatButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 bg-[#B87A7D] text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-[#DA9FA3] transition-all z-50"
      title="Chat with us"
    >
      <FaCommentDots />
    </button>
  );

  if (!customerId)
    return (
      <div className="fixed bottom-24 right-6 w-80 bg-white border rounded-xl shadow-lg p-4 text-center">
        <p className="text-gray-700">⚠️ Please log in to start a chat.</p>
      </div>
    );

  return (
    <>
      <ChatButton onClick={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white border rounded-xl shadow-lg flex flex-col z-50 overflow-hidden">
          <div className="flex justify-between items-center p-3 bg-[#B87A7D] text-white">
            <span>Chat with us</span>
            <FaTimes
              className="cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 text-sm mt-10">
                No previous messages
              </p>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`${
                    msg.sender === "customer" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block px-3 py-2 rounded-lg text-sm ${
                      msg.sender === "customer"
                        ? "bg-[#B87A7D] text-white"
                        : msg.sender === "admin"
                        ? "bg-gray-200 text-gray-800"
                        : "text-red-500"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))
            )}
            {isWaiting && (
              <div className="text-left text-gray-500 text-sm italic">
                Waiting for admin response...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex p-3 border-t">
            <input
              type="text"
              className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#B87A7D]"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="ml-2 px-4 py-2 bg-[#B87A7D] text-white rounded-xl hover:bg-[#DA9FA3] transition"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomerChatBox;
