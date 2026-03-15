const express = require('express');
const router = express.Router();
const { getWorkspaces, createWorkspace, addMember, getWorkspaceMembers,removeMember,getWorkspaceHierarchy,createSpace, createFolder, createList,updateSpace, deleteSpace, 
  updateFolder, deleteFolder, 
  updateList, deleteList } = require('../controllers/workspaceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', getWorkspaces);
router.post('/', createWorkspace);
router.post('/add-member', addMember); 
router.get('/:id/members', getWorkspaceMembers);
router.delete('/:workspaceId/members/:memberId', removeMember);
router.get('/:id/hierarchy', getWorkspaceHierarchy);
router.post('/:id/spaces', createSpace);
router.post('/:id/folders', createFolder);
router.post('/:id/lists', createList);

router.put('/spaces/:id', authMiddleware, updateSpace);
router.delete('/spaces/:id', authMiddleware, deleteSpace);
router.put('/folders/:id', authMiddleware, updateFolder);
router.delete('/folders/:id', authMiddleware, deleteFolder);
router.put('/lists/:id', authMiddleware, updateList);
router.delete('/lists/:id', authMiddleware, deleteList);
module.exports = router;