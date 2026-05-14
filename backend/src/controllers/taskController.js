const Task = require('../models/Task');


// CREATE TASK
const createTask = async(req, res) => {
    try {

        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({
                message: 'Title is required',
            });
        }

        const task = await Task.create({
            title,
            description,
            user: req.user._id,
        });

        res.status(201).json(task);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};



// GET USER TASKS
const getTasks = async(req, res) => {
    try {

        const tasks = await Task.find({
            user: req.user._id,
        });

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};



// UPDATE TASK
const updateTask = async(req, res) => {
    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        // Only owner can update
        if (
            task.user.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: 'Access denied',
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );

        res.status(200).json(updatedTask);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};



// DELETE TASK
const deleteTask = async(req, res) => {
    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        // User OR admin
        if (
            task.user.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                message: 'Access denied',
            });
        }

        await task.deleteOne();

        res.status(200).json({
            message: 'Task deleted successfully',
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};