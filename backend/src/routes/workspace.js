const express = require('express');
const router = express.Router();
const { getWorkspaces, createWorkspace, addMember } = require('../controllers/workspaceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', getWorkspaces);
router.post('/', createWorkspace);
router.post('/add-member', addMember); 

module.exports = router;