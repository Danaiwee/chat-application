import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMessages, getUserForSidebar, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

//1.get user detail to show on the sidebar
router.get("/user", protectRoute, getUserForSidebar);

//2.when click username on the sidebar, chat datas will show
router.get("/:id", protectRoute, getMessages);

//3.for sending messages
router.post("/send/:id", protectRoute, sendMessage);

export default router;