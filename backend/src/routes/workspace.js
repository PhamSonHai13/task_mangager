const express = require('express');
const router = express.Router();
const { getWorkspaces, createWorkspace, addMember, getWorkspaceMembers,removeMember,getWorkspaceHierarchy,createSpace, createFolder, createList } = require('../controllers/workspaceController');
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

module.exports = router;