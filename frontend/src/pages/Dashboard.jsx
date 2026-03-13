import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContent from '../components/dashboard/MainContent';
import RightPanel from '../components/dashboard/RightPanel';
import CreateTaskModal from '../components/dashboard/CreateTaskModal';
import EditTaskModal from '../components/dashboard/EditTaskModal'; // Nhớ import Edit Modal
import { SPACES } from '../utils/constants';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE QUẢN LÝ UI ---
  const [activeTab, setActiveTab] = useState('Worked on');
  const [activeSpace, setActiveSpace] = useState(SPACES[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // --- STATE QUẢN LÝ MODAL (Lỗi của bạn nằm ở việc thiếu 2 dòng này) ---
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal Tạo mới
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal Sửa
  const [editingTask, setEditingTask] = useState(null); // Lưu data của task đang sửa

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!token || !userData) { navigate('/login'); return; }
    
    setUser(JSON.parse(userData));
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const realTasks = response.data.map(t => ({
        ...t,
        assignee: JSON.parse(localStorage.getItem('user'))?.name?.substring(0, 2).toUpperCase() || 'Me',
        project: 'WR', 
        date: 'Hôm nay' 
      }));
      setTasks(realTasks);
    } catch (error) {
      console.error("Lỗi lấy task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá công việc này?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Lỗi khi xoá task:", error);
      alert('Không thể xoá task!');
    }
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #e0e0e0', borderTop: '3px solid #0052cc', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#42526e', fontWeight: 600, fontSize: 14 }}>Đang tải dữ liệu...</p>
      </motion.div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', position: 'fixed', top: 0, left: 0, fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#f4f5f7' }}>
      
      {/* --- MODAL TẠO MỚI --- */}
      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTaskCreated={(newTask) => {
          setTasks([{
            ...newTask,
            assignee: user?.name?.substring(0, 2).toUpperCase(),
            project: 'WR',
            date: 'Hôm nay'
          }, ...tasks]);
        }} 
      />

      {/* --- MODAL SỬA TASK --- */}
      <EditTaskModal 
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingTask(null); }}
        task={editingTask}
        onTaskUpdated={(updatedTask) => {
          setTasks(tasks.map(t => t._id === updatedTask._id ? {
            ...updatedTask,
            assignee: t.assignee, project: t.project, date: t.date 
          } : t));
        }}
      />

      <Sidebar 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
        user={user} 
        activeSpace={activeSpace} 
        setActiveSpace={setActiveSpace} 
        handleLogout={handleLogout} 
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        
        <Topbar 
          user={user} 
          searchFocused={searchFocused} 
          setSearchFocused={setSearchFocused} 
          onOpenCreateModal={() => setIsModalOpen(true)}
        />

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', gap: 0 }}>
          <MainContent 
            user={user} 
            tasks={tasks} 
            activeSpace={activeSpace} 
            setActiveSpace={setActiveSpace} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
            // Truyền hàm mở form Sửa xuống cho MainContent
            onEdit={(task) => { setEditingTask(task); setIsEditModalOpen(true); }}
          />
          <RightPanel tasks={tasks} />
        </div>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #dfe1e6; border-radius: 999px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Dashboard;