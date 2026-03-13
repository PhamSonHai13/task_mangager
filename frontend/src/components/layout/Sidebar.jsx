import { motion, AnimatePresence } from 'framer-motion';
import { SPACES, avatarColor } from '../../utils/constants';
import { GridIcon, ProjectsIcon, FilterIcon, DashboardIcon, TeamsIcon, AppsIcon, LogoutIcon } from '../icons';

const NAV_TOP = [
  { icon: <GridIcon />, label: 'Your work', active: false },
  { icon: <ProjectsIcon />, label: 'Projects', active: false },
  { icon: <FilterIcon />, label: 'Filters', active: false },
  { icon: <DashboardIcon />, label: 'Dashboards', active: false },
  { icon: <TeamsIcon />, label: 'Teams', active: false },
  { icon: <AppsIcon />, label: 'Apps', active: false },
];

const Sidebar = ({ sidebarCollapsed, setSidebarCollapsed, user, activeSpace, setActiveSpace, handleLogout }) => {
  return (
    <motion.div 
      animate={{ width: sidebarCollapsed ? 56 : 240 }} 
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ background: '#1d2125', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden', zIndex: 20, borderRight: '1px solid rgba(255,255,255,0.05)' }}
    >
      
     {/* Top logo row */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        
        {/* SỬA Ở ĐÂY: Thêm sự kiện onClick và đổi trỏ chuột thành hình bàn tay khi đang thu nhỏ */}
        <div 
          onClick={() => {
            if (sidebarCollapsed) setSidebarCollapsed(false);
          }}
          title={sidebarCollapsed ? "Mở rộng thanh bên" : ""}
          style={{ 
            width: 28, height: 28, background: '#0052cc', borderRadius: 6, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            cursor: sidebarCollapsed ? 'pointer' : 'default'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M11.571 11.513H0a5.218 5.218 0 005.232 5.215h2.13v2.057A5.215 5.215 0 0012.575 24V12.518a1.005 1.005 0 00-1.004-1.005z"/><path d="M6.016 6.016H0a5.218 5.218 0 005.232 5.215h2.13V9.173A5.215 5.215 0 0012.575 14.4V7.02a1.005 1.005 0 00-1.004-1.005H6.016z" opacity=".5"/></svg>
        </div>

        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -10 }} 
              transition={{ duration: 0.2 }}
              style={{ color: 'white', fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}
            >
              WorkFlow
            </motion.span>
          )}
        </AnimatePresence>
        <div style={{ flex: 1 }} />
        
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4, display: 'flex', borderRadius: 4, flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {sidebarCollapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
          </svg>
        </button>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
        {NAV_TOP.map((item, i) => (
          <motion.div key={i} whileHover={{ x: 2 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: sidebarCollapsed ? '10px 18px' : '10px 16px', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', transition: 'background 0.15s, padding 0.3s', borderRadius: 4, margin: '1px 6px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}>
            <div style={{ flexShrink: 0 }}>{item.icon}</div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -10 }} 
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap' }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Spaces section đã được sửa hiệu ứng */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ padding: '16px 16px 8px', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>Starred</span>
              </div>
              {SPACES.slice(0, 2).map((sp) => (
                <motion.div key={sp.id} whileHover={{ x: 2 }} onClick={() => setActiveSpace(sp)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 6, cursor: 'pointer', marginBottom: 2, background: activeSpace.id === sp.id ? 'rgba(0,82,204,0.25)' : 'transparent', border: activeSpace.id === sp.id ? '1px solid rgba(0,82,204,0.4)' : '1px solid transparent', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (activeSpace.id !== sp.id) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={e => { if (activeSpace.id !== sp.id) e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: sp.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white', flexShrink: 0 }}>{sp.abbr}</div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sp.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>Team-managed</div>
                  </div>
                </motion.div>
              ))}
              <div style={{ padding: '6px 10px', fontSize: 13, color: 'rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
                <span>···</span> More spaces
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User bottom */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: avatarColor(user?.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'white', flexShrink: 0, letterSpacing: '-0.5px' }}>
            {user?.name?.substring(0, 2).toUpperCase()}
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }} 
                transition={{ duration: 0.2 }}
                style={{ flex: 1, overflow: 'hidden' }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
              </motion.div>
            )}
          </AnimatePresence>
          {!sidebarCollapsed && (
            <button onClick={handleLogout} title="Đăng xuất"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 4, borderRadius: 4, display: 'flex', flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = '#ff5630'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
              <LogoutIcon />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;