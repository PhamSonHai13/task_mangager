const Workspace = require('../models/workspace');
const WorkspaceMember = require('../models/workspacemember');
const User = require('../models/user'); 
const Space = require('../models/space');
const Folder = require('../models/folder');
const List = require('../models/list');

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

exports.getWorkspaceMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const members = await WorkspaceMember.find({ workspace: id })
      .populate('user', 'name email')
      .lean();
    
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;
    const currentUserId = req.user.id;

    const currentUserRole = await WorkspaceMember.findOne({ workspace: workspaceId, user: currentUserId });
    if (!currentUserRole || currentUserRole.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ Quản trị viên mới có quyền xóa thành viên!' });
    }

    const memberToRemove = await WorkspaceMember.findById(memberId);
    if (!memberToRemove) {
      return res.status(404).json({ message: 'Không tìm thấy thành viên này.' });
    }

    if (memberToRemove.user.toString() === currentUserId) {
      return res.status(400).json({ message: 'Bạn không thể tự xóa chính mình khỏi Không gian.' });
    }

    await WorkspaceMember.findByIdAndDelete(memberId);
    res.status(200).json({ message: 'Đã xóa thành viên thành công.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorkspaceHierarchy = async (req, res) => {
  try {
    const { id } = req.params;

    const spaces = await Space.find({ workspace: id }).lean();
    const folders = await Folder.find({ workspace: id }).lean();
    const lists = await List.find({ workspace: id }).lean();

    const hierarchy = spaces.map(space => {
      const spaceFolders = folders.filter(f => f.space.toString() === space._id.toString());
      
      const spaceListsNoFolder = lists.filter(l => 
        l.space.toString() === space._id.toString() && !l.folder
      );

      const foldersWithLists = spaceFolders.map(folder => {
        const folderLists = lists.filter(l => 
          l.folder && l.folder.toString() === folder._id.toString()
        );
        return { ...folder, lists: folderLists };
      });

      return {
        ...space,
        folders: foldersWithLists,
        lists: spaceListsNoFolder
      };
    });

    res.status(200).json(hierarchy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createSpace = async (req, res) => {
  try {
    const { name, color, workspaceId } = req.body;
    const space = await Space.create({ 
      name, 
      color, 
      workspace: workspaceId, 
      createdBy: req.user.id 
    });
    res.status(201).json(space);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFolder = async (req, res) => {
  try {
    const { name, spaceId, workspaceId } = req.body;
    const folder = await Folder.create({ 
      name, 
      space: spaceId, 
      workspace: workspaceId, 
      createdBy: req.user.id 
    });
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createList = async (req, res) => {
  try {
    const { name, color, folderId, spaceId, workspaceId } = req.body;
    const list = await List.create({ 
      name, 
      color, 
      folder: folderId || null, 
      space: spaceId, 
      workspace: workspaceId, 
      createdBy: req.user.id 
    });
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};