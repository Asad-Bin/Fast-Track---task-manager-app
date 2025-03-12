
import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/taskModel.js";

export const createTask = asyncHandler(async (req, res) => {
    try{
        const { title, description, dueDate, priority, status } = req.body;

        if(!title || title.trim() == ""){
            res.status(400).json({ message: "Title is required" });
        }
        
        if(!description || description.trim() == ""){
            res.status(400).json({ message: "Description is required" });
        }

        const task = new TaskModel({
            title,
            description,
            dueDate,
            priority,
            status,
            user: req.user._id,
        });

        await task.save();

        res.status(201).json(task);
    } catch(err){
        if (err.code === 11000) {
            return res.status(400).json({ message: "Task with this title already exists" });
        }
        console.log("error in createTask: ", err.message);
        res.status(500).json({ message:err.message });
    }
});

export const getTasks = asyncHandler(async (req, res) => {
    try{
        const userId = req.user._id;

        if(!userId){
            return res.status(400).json({ message: "User not found" });
        }

        const tasks = await TaskModel.find({ user: userId });

        res.status(200).json({
            length: tasks.length,
            tasks,
        });
    } catch(err){
        if (err.code === 11000) {
            return res.status(400).json({ message: "Task with this title already exists" });
        }
        console.log("error in createTask: ", err.message);
        res.status(500).json({ message:err.message });
    }
});

export const getTask = asyncHandler(async (req, res) => {
    try{
        const userId = req.user._id;

        const { task_id } = req.params;

        if(!task_id){
            return res.status(400).json({ message: "Please provide a task id" });
        }

        // console.log("hi");

        const task = await TaskModel.findById(task_id);

        if(!task){
            return res.status(404).json({ message: "Task not found!" });
        }

        if(!task.user.equals(userId)){
            return res.status(401).json({ message:"not authorized" });
        }

        res.status(200).json(task);
    } catch (error) {
        ;
    }
});