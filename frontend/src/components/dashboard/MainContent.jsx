import { motion } from 'framer-motion';
import { SPACES, TABS, STATUS_CONFIG, PRIORITY_CONFIG, avatarColor } from '../../utils/constants';
import { CheckIcon } from '../icons';

// --- THÊM onDelete, onToggleStatus VÀO PROPS ---
const MainContent = ({ user, tasks, activeSpace, setActiveSpace, activeTab, setActiveTab, onDelete, onToggleStatus,onEdit }) => {
  const todayTasks = tasks.filter(t => t.date === 'Hôm nay');
  const yesterdayTasks = tasks.filter(t => t.date === 'Hôm qua');
  const olderTasks = tasks.filter(t => t.date !== 'Hôm nay' && t.date !== 'Hôm qua');
  

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

      {/* Recent spaces */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#172b4d', margin: 0 }}>Không gian gần đây</h2>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {SPACES.map((sp, i) => (
            <motion.div key={sp.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
              whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} onClick={() => setActiveSpace(sp)}
              style={{ flex: 1, background: 'white', borderRadius: 10, border: activeSpace.id === sp.id ? `2px solid ${sp.color}` : '1px solid #e8eaed', padding: '20px', cursor: 'pointer', transition: 'all 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: sp.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white' }}>{sp.abbr}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#172b4d' }}>{sp.name}</div>
                  <div style={{ fontSize: 11.5, color: '#97a0af', marginTop: 1 }}>Team-managed software</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tabs + Task list */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #e8eaed', marginBottom: 20 }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #0052cc' : '2px solid transparent', marginBottom: -2, color: activeTab === tab ? '#0052cc' : '#6b778c', fontSize: 13.5, fontWeight: activeTab === tab ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
              {tab}
            </button>
          ))}
        </div>
        {[{ label: 'HÔM NAY', items: todayTasks }, { label: 'HÔM QUA', items: yesterdayTasks }].map((group, gi) => (
          group.items.length > 0 && (
            <div key={gi} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#97a0af', letterSpacing: '0.8px', marginBottom: 8, paddingLeft: 4 }}>{group.label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {group.items.map((task, i) => {
                  const status = STATUS_CONFIG[task.status];
                  const priority = PRIORITY_CONFIG[task.priority];
                  return (
                    <motion.div key={task._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + gi * 0.05 + i * 0.04 }}
                      whileHover={{ backgroundColor: '#f0f4ff', x: 2 }}
                      style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', borderRadius: 8, cursor: 'pointer', background: 'white', border: '1px solid #e8eaed', transition: 'all 0.12s', gap: 12 }}>
                      
                      {/* --- THÊM onClick VÀO CHECKBOX --- */}
                      <div 
                        onClick={() => onToggleStatus(task._id, task.status)}
                        style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${status.dot}`, background: task.status === 'DONE' ? status.dot : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
                      >
                        {task.status === 'DONE' && <span style={{ color: 'white', fontSize: 9 }}><CheckIcon /></span>}
                      </div>

                      <span style={{ flex: 1, fontSize: 13.5, color: task.status === 'DONE' ? '#97a0af' : '#172b4d', fontWeight: 500, textDecoration: task.status === 'DONE' ? 'line-through' : 'none' }}>{task.title}</span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: status.bg, borderRadius: 4, padding: '3px 8px', flexShrink: 0 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: status.dot }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: status.color }}>{status.label}</span>
                      </div>

                        <button 
                          onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                          title="Sửa công việc này"
                          style={{ background: 'none', border: 'none', color: '#0052cc', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, fontWeight: 600, fontSize: 12, opacity: 0.8 }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 1}
                          onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
                        >
                          Sửa
                        </button>
                    
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
                          onDelete(task._id);
                        }}
                        title="Xoá công việc này"
                        style={{ background: 'none', border: 'none', color: '#ff5630', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, fontWeight: 600, fontSize: 12, opacity: 0.8 }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
                      >
                        Xoá
                      </button>

                    </motion.div>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </motion.div>
    </div>
  );
};

export default MainContent;