const Workspace = require('../models/workspace');
const WorkspaceMember = require('../models/workspacemember');
const User = require('../models/user'); 


exports.getWorkspaces = async (req, res) => {
  try {
 
    const memberships = await WorkspaceMember.find({ user: req.user.id }).populate('workspace');
    
 
    const workspaces = memberships.map(m => m.workspace);
    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    

    const workspace = await Workspace.create({
      name,
      description,
      owner: req.user.id
    });


    await WorkspaceMember.create({
      workspace: workspace._id,
      user: req.user.id,
      role: 'admin'
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.addMember = async (req, res) => {
  try {
    const { workspaceId, email, role } = req.body;

   
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng với email này trên hệ thống!' });
    }

   
    const existingMember = await WorkspaceMember.findOne({ workspace: workspaceId, user: userToAdd._id });
    if (existingMember) {
      return res.status(400).json({ message: 'Người dùng này đã ở trong Không gian làm việc rồi.' });
    }

   
    const newMember = await WorkspaceMember.create({
      workspace: workspaceId,
      user: userToAdd._id,
      role: role || 'member' 
    });

    res.status(200).json({ message: 'Đã thêm thành viên thành công!', member: newMember });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};