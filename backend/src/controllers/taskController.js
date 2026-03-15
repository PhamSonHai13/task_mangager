const Task = require('../models/task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, listId, folderId, spaceId, workspaceId, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      list: listId,
      folder: folderId || null,
      space: spaceId,
      workspace: workspaceId,
      dueDate,
      createdBy: req.user.id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { workspaceId } = req.query;
    let filter = {};
    
    if (workspaceId) {
      filter.workspace = workspaceId; 
    } else {
      filter.createdBy = req.user.id;
    }

    const tasks = await Task.find(filter)
      .populate('assignees', 'name email')
      .sort({ createdAt: -1 });
      
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, createdBy: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};