
import express from 'express';
import { registerUser, loginUser, logoutUser, getUser, updateUser } from '../controllers/userController.js';
import { deleteUser } from '../controllers/adminController.js';
import { protect, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

// admin routes
router.delete("/admin/user/:id", protect, adminMiddleware, deleteUser);

export default router;