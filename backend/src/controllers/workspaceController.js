const Workspace = require('../models/workspace');
const WorkspaceMember = require('../models/workspacemember');
const User = require('../models/user'); 
const Space = require('../models/space');
const Folder = require('../models/folder');
const List = require('../models/list');
const Task = require('../models/task'); 

// --- QUẢN LÝ WORKSPACE ---

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
    const workspace = await Workspace.create({ name, description, owner: req.user.id });
    await WorkspaceMember.create({ workspace: workspace._id, user: req.user.id, role: 'admin' });
    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.addMember = async (req, res) => {
  try {
    const { workspaceId, email, role } = req.body;
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'Không tìm thấy người dùng!' });

    const existingMember = await WorkspaceMember.findOne({ workspace: workspaceId, user: userToAdd._id });
    if (existingMember) return res.status(400).json({ message: 'Người dùng đã có trong Workspace.' });

    const newMember = await WorkspaceMember.create({ workspace: workspaceId, user: userToAdd._id, role: role || 'member' });
    res.status(200).json({ message: 'Thêm thành viên thành công!', member: newMember });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 

exports.getWorkspaceMembers = async (req, res) => {
  try {
    const members = await WorkspaceMember.find({ workspace: req.params.id }).populate('user', 'name email').lean();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;
    const currentUserRole = await WorkspaceMember.findOne({ workspace: workspaceId, user: req.user.id });
    if (!currentUserRole || currentUserRole.role !== 'admin') return res.status(403).json({ message: 'Quyền admin mới được xóa!' });

    await WorkspaceMember.findByIdAndDelete(memberId);
    res.status(200).json({ message: 'Xóa thành viên thành công.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getWorkspaceHierarchy = async (req, res) => {
  try {
    const { id } = req.params;
    const [spaces, folders, lists] = await Promise.all([
      Space.find({ workspace: id }).lean(),
      Folder.find({ workspace: id }).lean(),
      List.find({ workspace: id }).lean()
    ]);

    const hierarchy = spaces.map(space => {
      const spaceFolders = folders.filter(f => f.space.toString() === space._id.toString());
      const spaceListsNoFolder = lists.filter(l => l.space.toString() === space._id.toString() && !l.folder);

      const foldersWithLists = spaceFolders.map(folder => {
        const folderLists = lists.filter(l => l.folder && l.folder.toString() === folder._id.toString());
        return { ...folder, lists: folderLists };
      });

      return { ...space, folders: foldersWithLists, lists: spaceListsNoFolder };
    });

    res.status(200).json(hierarchy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.createSpace = async (req, res) => {
  try {
    const space = await Space.create({ ...req.body, workspace: req.body.workspaceId, createdBy: req.user.id });
    res.status(201).json(space);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.createFolder = async (req, res) => {
  try {
    const folder = await Folder.create({ ...req.body, space: req.body.spaceId, workspace: req.body.workspaceId, createdBy: req.user.id });
    res.status(201).json(folder);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.createList = async (req, res) => {
  try {
    const list = await List.create({ ...req.body, folder: req.body.folderId || null, space: req.body.spaceId, workspace: req.body.workspaceId, createdBy: req.user.id });
    res.status(201).json(list);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// --- UPDATE ---

exports.updateSpace = async (req, res) => {
  try {
    const space = await Space.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(space);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.updateFolder = async (req, res) => {
  try {
    const folder = await Folder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(folder);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.updateList = async (req, res) => {
  try {
    const list = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(list);
  } catch (error) { res.status(500).json({ error: error.message }); }
};



exports.deleteSpace = async (req, res) => {
  try {
    const { id } = req.params;
    await Space.findByIdAndDelete(id);
    await Folder.deleteMany({ space: id });
    await List.deleteMany({ space: id }); 
    await Task.deleteMany({ project: id }); 
    res.status(200).json({ message: 'Đã xóa Không gian và dữ liệu liên quan!' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    await Folder.findByIdAndDelete(id);
    await List.deleteMany({ folder: id });
    await Task.deleteMany({ folder: id });
    res.status(200).json({ message: 'Đã xóa Thư mục và dữ liệu liên quan!' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    await List.findByIdAndDelete(id);
    await Task.deleteMany({ list: id });
    res.status(200).json({ message: 'Đã xóa Danh sách và các Task bên trong!' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};