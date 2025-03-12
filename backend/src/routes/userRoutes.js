
import express from 'express';
import { registerUser, loginUser, logoutUser, getUser, updateUser, userLoginStatus } from '../controllers/userController.js';
import { verifyEmail, verifyUser, forgotPassword } from '../controllers/userController.js';
import { deleteUser, getAllUsers } from '../controllers/adminController.js';
import { protect, adminMiddleware, creatorMiddleware, varifiedMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

// admin routes
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

// get all users
router.get("/admin/users", protect, creatorMiddleware, getAllUsers);

// login status
router.get("/login-status", userLoginStatus);

// verify user -> email verification
router.post("/verify-email", protect, verifyEmail);

// verify user --> email verification
router.post("/verify-user/:verificationToken", verifyUser);

// forgot password
router.post("/forgot-password", forgotPassword);

export default router;