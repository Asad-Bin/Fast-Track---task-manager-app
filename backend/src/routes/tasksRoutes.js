
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../controllers/task/taskController.js";

const router = express.Router();

router.post("/task/create", protect, createTask);
router.get("/tasks", protect, getTasks);
router.get("/task/:task_id", protect, getTask);
router.patch("/task/:task_id", protect, updateTask);
router.delete("/task/:task_id", protect, deleteTask);

export default router;