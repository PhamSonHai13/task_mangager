const Project = require('../models/project');
const WorkspaceMember = require('../models/workspacemember');

exports.getProjects = async (req, res) => {
  try {
    const memberships = await WorkspaceMember.find({ user: req.user.id });
    const workspaceIds = memberships.map(m => m.workspace);
    
    const projects = await Project.find({ workspace: { $in: workspaceIds } }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, color, abbr } = req.body;
    
    const defaultMember = await WorkspaceMember.findOne({ user: req.user.id });
    
    if (!defaultMember) {
      return res.status(400).json({ message: 'Workspace not found for this user' });
    }

    const project = await Project.create({
      name,
      color: color || '#0052cc',
      abbr,
      workspace: defaultMember.workspace,
      createdBy: req.user.id
    });
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};