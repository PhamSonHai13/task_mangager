const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: '#0052cc' },
  abbr: { type: String, required: true }, // Chữ viết tắt (VD: WR)
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);