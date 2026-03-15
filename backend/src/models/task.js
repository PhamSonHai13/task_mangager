const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: '' 
  },
  status: { 
    type: String, 
    enum: ['TODO', 'IN_PROGRESS', 'DONE'], 
    default: 'TODO' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Normal', 'High', 'Urgent'], 
    default: 'Normal' 
  },
  list: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'List', 
    required: true 
  },
  folder: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Folder' 
  },
  space: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Space', 
    required: true 
  },
  workspace: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Workspace', 
    required: true 
  },
  assignees: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  dueDate: { 
    type: Date 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);