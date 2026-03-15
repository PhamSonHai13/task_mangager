const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }, 
  space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('List', listSchema);