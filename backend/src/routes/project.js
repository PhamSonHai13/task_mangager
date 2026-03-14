const express = require('express');
const router = express.Router();
const { getProjects, createProject } = require('../controllers/projectController'); 
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware); 

router.get('/', getProjects);
router.post('/', createProject);

module.exports = router;