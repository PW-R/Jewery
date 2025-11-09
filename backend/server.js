// backend/server.js
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app, { initDB } from "./app.js";
import Chat from "./models/Chat.js";

dotenv.config();

const startServer = async () => {
  try {
    await initDB();
    console.log("✅ MongoDB connected and admin ready");

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("⚡ User connected:", socket.id);

      // --- Join ห้อง ---
      socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`🟢 Joined room: ${roomId}`);
      });

      // --- ลูกค้าส่งข้อความ ---
      socket.on("send_message", async (data) => {
        const { roomId, customerId, message } = data;
        if (!message?.trim()) return;

        let chat = await Chat.findOne({ customerId });
        if (!chat) chat = new Chat({ customerId, messages: [] });

        const newMsg = { sender: "customer", text: message, timestamp: new Date() };

        // ✅ ป้องกันบันทึกข้อความซ้ำ
        const lastMsg = chat.messages.at(-1);
        if (!lastMsg || lastMsg.text !== newMsg.text || lastMsg.sender !== newMsg.sender) {
          chat.messages.push(newMsg);
          await chat.save();
        }

        // ✅ ส่งเฉพาะในห้อง
        io.to(roomId).emit("receive_message", newMsg);

        // ✅ แจ้งแอดมิน (เช่น แสดงใน sidebar)
        io.emit("new_customer_chat", chat);
      });

      // --- แอดมินตอบกลับ ---
      socket.on("admin_reply", async (data) => {
        const { roomId, chatId, adminId, message } = data;
        if (!message?.trim()) return;

        const chat = await Chat.findById(chatId);
        if (!chat) return;

        if (!chat.isAssigned) {
          chat.adminId = adminId;
          chat.isAssigned = true;
        }

        const newMsg = { sender: "admin", text: message, timestamp: new Date() };

        // ✅ ป้องกันบันทึกซ้ำ
        const lastMsg = chat.messages.at(-1);
        if (!lastMsg || lastMsg.text !== newMsg.text || lastMsg.sender !== newMsg.sender) {
          chat.messages.push(newMsg);
          await chat.save();
        }

        // ✅ ส่งเฉพาะในห้อง ไม่ broadcast ทั้งระบบ
        io.to(roomId).emit("receive_message", newMsg);
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server startup error:", err.message);
    process.exit(1);
  }
};

startServer();
