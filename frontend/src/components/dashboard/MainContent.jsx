import { useState } from 'react'; // Bổ sung useState cho Kéo thả
import { motion } from 'framer-motion';
import { TABS, STATUS_CONFIG, PRIORITY_CONFIG, avatarColor } from '../../utils/constants';
import { CheckIcon } from '../icons';

const getTaskLocation = (task, hierarchy) => {
  if (!hierarchy || hierarchy.length === 0) return '';
  let spaceName = '';
  let folderName = '';
  let listName = '';

  const space = hierarchy.find(s => s._id === (task.space || task.project));
  if (space) {
    spaceName = space.name;
    if (task.folder) {
      const folder = space.folders?.find(f => f._id === task.folder);
      if (folder) folderName = folder.name;
    }
    let list;
    if (task.folder && space.folders) {
      const folder = space.folders.find(f => f._id === task.folder);
      list = folder?.lists?.find(l => l._id === task.list);
    } else {
      list = space.lists?.find(l => l._id === task.list);
    }
    if (list) listName = list.name;
  }

  const path = [];
  if (spaceName) path.push(spaceName);
  if (folderName) path.push(folderName);
  if (listName) path.push(listName);

  return path.join(' > ');
};

const MainContent = ({ user, tasks, spaces, activeSpace, setActiveSpace, activeTab, setActiveTab, onDelete, onToggleStatus, onUpdateStatus, onEdit }) => {
  // Giữ nguyên các biến logic cũ của bác
  const todayTasks = tasks.filter(t => t.date === 'Hôm nay');
  const yesterdayTasks = tasks.filter(t => t.date === 'Hôm qua');

  // --- LOGIC KÉO THẢ (DRAG & DROP) ---
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Cần có dòng này để cho phép thả (drop)
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== targetStatus) {
      onUpdateStatus(draggedTask._id, targetStatus);
    }
  };

  // Cấu hình 3 cột Bảng Kanban
  const KANBAN_COLUMNS = [
    { id: 'TODO', label: 'Cần làm (To Do)', color: '#94a3b8', bg: '#f8fafc' },
    { id: 'IN_PROGRESS', label: 'Đang làm (In Progress)', color: '#6366f1', bg: '#f5f7ff' },
    { id: 'DONE', label: 'Hoàn thành (Done)', color: '#22c55e', bg: '#f0fdf4' }
  ];

  return (
    <div style={{ flex: 1, padding: '32px 40px', minWidth: 0, overflowY: 'auto' }}>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 26, fontWeight: 900, color: '#172b4d', letterSpacing: '-0.5px', marginBottom: 6 }}>
        Dành cho bạn
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ color: '#6b778c', fontSize: 14, marginBottom: 28 }}>
        Chào mừng trở lại, <strong style={{ color: '#172b4d' }}>{user?.name}</strong> 👋
      </motion.p>

      {spaces && spaces.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#172b4d', margin: 0 }}>Không gian gần đây</h2>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {spaces.slice(0, 3).map((sp, i) => (
              <motion.div key={sp._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} onClick={() => setActiveSpace(sp)}
                style={{ flex: 1, background: 'white', borderRadius: 10, border: activeSpace?._id === sp._id ? `2px solid ${sp.color}` : '1px solid #e8eaed', padding: '20px', cursor: 'pointer', transition: 'all 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: sp.color || '#0052cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white' }}>{sp.abbr || sp.name?.substring(0,2).toUpperCase()}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#172b4d' }}>{sp.name}</div>
                    <div style={{ fontSize: 11.5, color: '#97a0af', marginTop: 1 }}>Team-managed software</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #e8eaed', marginBottom: 24 }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #0052cc' : '2px solid transparent', marginBottom: -2, color: activeTab === tab ? '#0052cc' : '#6b778c', fontSize: 13.5, fontWeight: activeTab === tab ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
              {tab}
            </button>
          ))}
        </div>
        
        {/* --- BẢNG KANBAN BOARD 3 CỘT ĐƯỢC THAY THẾ CHO LIST DỌC CŨ --- */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', minHeight: '500px' }}>
          {KANBAN_COLUMNS.map((col) => {
            const columnTasks = tasks.filter(t => t.status === col.id);

            return (
              <div 
                key={col.id} 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                style={{ flex: 1, minWidth: '280px', background: col.bg, borderRadius: '12px', padding: '16px', border: '1px solid #e8eaed' }}
              >
                {/* Tiêu đề Cột */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#172b4d' }}>{col.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 600, color: '#6b778c', background: 'rgba(255,255,255,0.6)', padding: '2px 8px', borderRadius: '10px' }}>{columnTasks.length}</span>
                </div>

                {/* Danh sách Task trong Cột */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '150px' }}>
                  {columnTasks.map((task) => {
                    const status = STATUS_CONFIG[task.status];
                    const priority = PRIORITY_CONFIG[task.priority];
                    const locationPath = getTaskLocation(task, spaces);
                    
                    return (
                      <motion.div 
                        key={task._id} 
                        draggable // Bật tính năng kéo cho thẻ này
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        // Giữ nguyên thiết kế màu sắc, đường viền của bác, chỉ đổi sang flex dọc cho gọn
                        style={{ display: 'flex', flexDirection: 'column', padding: '14px', borderRadius: 8, cursor: 'grab', background: 'white', border: '1px solid #e8eaed', transition: 'all 0.12s', gap: 10 }}
                      >
                        
                        {/* Hàng 1: Checkbox & Tên Task & Đường dẫn */}
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          <div 
                            onClick={() => onToggleStatus(task._id, task.status)}
                            style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${status.dot}`, background: task.status === 'DONE' ? status.dot : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', marginTop: 2 }}
                          >
                            {task.status === 'DONE' && <span style={{ color: 'white', fontSize: 9 }}><CheckIcon /></span>}
                          </div>

                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span style={{ fontSize: 13.5, color: task.status === 'DONE' ? '#97a0af' : '#172b4d', fontWeight: 500, textDecoration: task.status === 'DONE' ? 'line-through' : 'none', lineHeight: '1.4' }}>
                              {task.title}
                            </span>
                            {locationPath && (
                              <span style={{ fontSize: 11, color: '#8993a4', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                {locationPath}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Hàng 2: Trạng thái, Độ ưu tiên & Nút chức năng */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f4f5f7', paddingTop: 10, marginTop: 2 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: status.bg, borderRadius: 4, padding: '3px 8px' }}>
                              <div style={{ width: 7, height: 7, borderRadius: '50%', background: status.dot }} />
                              <span style={{ fontSize: 11, fontWeight: 700, color: status.color }}>{status.label}</span>
                            </div>
                            {priority && (
                              <div style={{ background: priority.bg, color: priority.color, padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                                {task.priority}
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: 4 }}>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                              title="Sửa" style={{ background: 'none', border: 'none', color: '#0052cc', cursor: 'pointer', padding: '4px', borderRadius: 4, fontWeight: 600, fontSize: 12, opacity: 0.7 }}
                              onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
                            >Sửa</button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
                              title="Xóa" style={{ background: 'none', border: 'none', color: '#ff5630', cursor: 'pointer', padding: '4px', borderRadius: 4, fontWeight: 600, fontSize: 12, opacity: 0.7 }}
                              onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
                            >Xoá</button>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </motion.div>
    </div>
  );
};

export default MainContent;