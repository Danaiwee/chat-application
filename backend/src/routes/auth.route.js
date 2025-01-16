import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// 1.signup, login, and logout part
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// 2.update data part (cannot change name and email) 
// 2.1 protectRoute means user need authentication (login) before update data (use middleware)
router.put('/update-profile', protectRoute, updateProfile);

// 3.check if users authenticate or not (use when refresh the page)
router.get('/check', protectRoute, checkAuth);

export default router;
