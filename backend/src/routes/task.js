const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getTasks);


router.put('/:id', upload.array('attachments'), updateTask);

router.delete('/:id', deleteTask);

module.exports = router;