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
      .populate('comments.user', 'name email')
      .sort({ createdAt: -1 });
      
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };
    let pushData = {};

    if (updateData.newComment) {
      pushData.comments = {
        user: req.user.id,
        content: updateData.newComment,
        createdAt: new Date()
      };
      delete updateData.newComment;
    }

    if (req.files && req.files.length > 0) {
      pushData.attachments = {
        $each: req.files.map(file => ({
          originalName: file.originalname,
          filename: file.filename,
          path: file.path.replace(/\\/g, '/'),
          mimetype: file.mimetype,
          size: file.size
        }))
      };
    }

    if (Object.keys(pushData).length > 0) {
      updateData.$push = pushData;
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      updateData,
      { new: true }
    ).populate('comments.user', 'name email');

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