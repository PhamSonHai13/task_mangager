import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContent from '../components/dashboard/MainContent';
import RightPanel from '../components/dashboard/RightPanel';
import CreateTaskModal from '../components/dashboard/CreateTaskModal';
import EditTaskModal from '../components/dashboard/EditTaskModal'; 
import CreateProjectModal from '../components/dashboard/CreateProjectModal'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [spaces, setSpaces] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('Worked on');
  const [activeSpace, setActiveSpace] = useState(null); 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false); 
  const [editingTask, setEditingTask] = useState(null); 

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!token || !userData) { navigate('/login'); return; }
    
    setUser(JSON.parse(userData));
    fetchData(); 
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [tasksRes, projectsRes] = await Promise.all([
        axios.get('/tasks', { headers }),
        axios.get('/projects', { headers })
      ]);

      setSpaces(projectsRes.data);
      if (projectsRes.data.length > 0) {
        setActiveSpace(projectsRes.data[0]); 
      }

      const realTasks = tasksRes.data.map(t => ({
        ...t,
        assignee: JSON.parse(localStorage.getItem('user'))?.name?.substring(0, 2).toUpperCase() || 'Me',
        date: 'Hôm nay' 
      }));
      setTasks(realTasks);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
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
      
      {/* TRUYỀN activeSpace VÀO TRONG MODAL TẠO TASK */}
      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        activeSpace={activeSpace}
        onTaskCreated={(newTask) => {
          setTasks([{
            ...newTask,
            assignee: user?.name?.substring(0, 2).toUpperCase(),
            date: 'Hôm nay'
          }, ...tasks]);
        }} 
      />

      <EditTaskModal 
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingTask(null); }}
        task={editingTask}
        onTaskUpdated={(updatedTask) => {
          setTasks(tasks.map(t => t._id === updatedTask._id ? {
            ...updatedTask,
            assignee: t.assignee, date: t.date 
          } : t));
        }}
      />

      <CreateProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        onProjectCreated={(newProject) => {
          setSpaces([...spaces, newProject]); 
          setActiveSpace(newProject);         
        }} 
      />

      <Sidebar 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
        user={user} 
        spaces={spaces} 
        activeSpace={activeSpace} 
        setActiveSpace={setActiveSpace} 
        handleLogout={handleLogout} 
        onOpenCreateProject={() => setIsProjectModalOpen(true)} 
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        
        <Topbar 
          user={user} 
          searchFocused={searchFocused} 
          setSearchFocused={setSearchFocused} 
          onOpenCreateModal={() => setIsModalOpen(true)}
        />

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', gap: 0 }}>
          {/* LỌC DỮ LIỆU: Chỉ hiển thị nếu đã có activeSpace và task thuộc activeSpace đó */}
          {!activeSpace ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '16px', fontWeight: 600 }}>
              ← Vui lòng chọn hoặc tạo một Không gian làm việc
            </div>
          ) : (
            <>
              <MainContent 
                user={user} 
                // THUẬT TOÁN Ở ĐÂY: Filter các task có projectId khớp với _id của Không gian đang chọn
                tasks={tasks.filter(t => t.project === activeSpace._id)} 
                spaces={spaces}
                activeSpace={activeSpace} 
                setActiveSpace={setActiveSpace} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onDelete={handleDeleteTask}
                onToggleStatus={handleToggleStatus}
                onEdit={(task) => { setEditingTask(task); setIsEditModalOpen(true); }}
              />
              {/* Thống kê cũng chỉ đếm các task của không gian hiện tại */}
              <RightPanel tasks={tasks.filter(t => t.project === activeSpace._id)} />
            </>
          )}
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