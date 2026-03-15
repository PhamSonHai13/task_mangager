require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const projectRoutes = require('./routes/project');
const workspaceRoutes = require('./routes/workspace')

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/projects', projectRoutes);
app.use('/workspaces', workspaceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});