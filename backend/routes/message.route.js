import {Router} from "express";
import { authUser } from "../middlewares/authUser.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.post("/send-message/:receiverId", authUser , sendMessage);
router.get("/get-messages/:participantId", authUser , getMessages);

export default router;