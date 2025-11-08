import express from "express";
import {
  startChat,
  sendMessage,
  acceptChat,
  getChatHistory
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/start", startChat);
router.post("/send", sendMessage);
router.post("/accept", acceptChat);
router.get("/:userId", getChatHistory);

export default router;
