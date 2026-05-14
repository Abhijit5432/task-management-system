const express = require('express');

const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();


// CREATE TASK
router.post('/', protect, createTask);

// GET TASKS
router.get('/', protect, getTasks);

// UPDATE TASK
router.put('/:id', protect, updateTask);

// DELETE TASK
router.delete('/:id', protect, deleteTask);

module.exports = router;