import { useState, useEffect, useRef } from "react";
import { FaTimes, FaCommentDots } from "react-icons/fa";
import { initChatForUser, getChatByUser, sendMessage } from "../api/chatApi"; // adjust path

function ChatBox({ userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isWaiting]);

  // Initialize chat when chat box opens
  useEffect(() => {
    if (!isOpen || !userId) return;

    const initChat = async () => {
      try {
        const chat = await initChatForUser(userId);
        setChatId(chat._id);

        // Load existing messages
        const history = await getChatByUser(userId);
        setMessages(history.messages || []);
      } catch (err) {
        console.error("Failed to initialize chat:", err);
      }
    };

    initChat();
  }, [isOpen, userId]);

  const handleSend = async () => {
    if (!input.trim() || !chatId) return;

    const userMessage = input;
    setInput("");

    // Add user message immediately
    setMessages(prev => [...prev, { from: "user", text: userMessage }]);
    setIsWaiting(true);

    try {
      const res = await sendMessage({ chatId, sender: "user", message: userMessage });

      // Add shop reply if API returns it
      if (res.reply) {
        setMessages(prev => [...prev, { from: "shop", text: res.reply }]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages(prev => [...prev, { from: "shop", text: "Failed to send message" }]);
    } finally {
      setIsWaiting(false);
    }
  };

  // Chat button component
  const ChatButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 bg-[#B87A7D] text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-[#DA9FA3] transition-all z-50"
      title="Chat with us"
    >
      <FaCommentDots />
    </button>
  );

  return (
    <>
      <ChatButton onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white border rounded-xl shadow-lg flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-[#B87A7D] text-white">
            <span>Chat with us</span>
            <FaTimes className="cursor-pointer" onClick={() => setIsOpen(false)} />
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${msg.from === "user" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg text-sm ${
                    msg.from === "user"
                      ? "bg-[#B87A7D] text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {isWaiting && (
              <div className="text-left text-gray-500 text-sm italic">
                Waiting for shop response...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
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

export default ChatBox;
