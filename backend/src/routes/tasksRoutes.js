
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createTask, getTask, getTasks } from "../controllers/task/taskController.js";

const router = express.Router();

router.post("/task/create", protect, createTask);
router.get("/tasks", protect, getTasks);
router.get("/task/:task_id", protect, getTask);

export default router;