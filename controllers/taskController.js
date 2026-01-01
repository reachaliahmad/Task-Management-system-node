const mongoose = require('mongoose');
const Task = require('../models/Task');

// Get all tasks (admin sees all, team member sees assigned)
const getTasks = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { assignedTo: req.user.id };
    const tasks = await Task.find(query).populate('assignedTo', 'name email').populate('createdBy', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new task (admin only)
const createTask = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const taskData = { ...req.body, createdBy: req.user.id };
    if (taskData.assignedTo && !mongoose.Types.ObjectId.isValid(taskData.assignedTo)) {
      return res.status(400).json({ message: 'Invalid assignedTo user ID' });
    }
    const task = new Task(taskData);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.body.assignedTo && !mongoose.Types.ObjectId.isValid(req.body.assignedTo)) {
      return res.status(400).json({ message: 'Invalid assignedTo user ID' });
    }
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task (admin only)
const deleteTask = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
