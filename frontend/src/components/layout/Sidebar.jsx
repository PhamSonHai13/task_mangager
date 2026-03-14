import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { avatarColor } from '../../utils/constants';
import { GridIcon, ProjectsIcon, FilterIcon, DashboardIcon, TeamsIcon, AppsIcon, LogoutIcon } from '../icons';
import WorkspaceDropdown from './WorkspaceDropdown';
import InviteMemberModal from './InviteMemberModal';
import { useWorkspace } from '../../context/WorkspaceContext';

const NAV_TOP = [
  { icon: <GridIcon />, label: 'Your work', active: false },
  { icon: <ProjectsIcon />, label: 'Projects', active: false },
  { icon: <FilterIcon />, label: 'Filters', active: false },
  { icon: <DashboardIcon />, label: 'Dashboards', active: false },
  { icon: <TeamsIcon />, label: 'Teams', active: false },
  { icon: <AppsIcon />, label: 'Apps', active: false },
];

const Sidebar = ({ sidebarCollapsed, setSidebarCollapsed, user, spaces = [], activeSpace, setActiveSpace, handleLogout, onOpenCreateProject }) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { activeWorkspace } = useWorkspace();

  return (
    <>
      <motion.div 
        animate={{ width: sidebarCollapsed ? 56 : 240 }} 
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ background: '#1d2125', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden', zIndex: 20, borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div style={{ minHeight: 56, display: 'flex', alignItems: 'center' }}>
          {!sidebarCollapsed ? (
            <>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <WorkspaceDropdown />
              </div>
              <button onClick={() => setSidebarCollapsed(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: '0 12px', display: 'flex', flexShrink: 0, height: '100%', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 16, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div
                onClick={() => setSidebarCollapsed(false)}
                style={{ width: 32, height: 32, background: '#0052cc', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontWeight: 800 }}
              >
                W
              </div>
              <button onClick={() => setSidebarCollapsed(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4, display: 'flex', flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
          {NAV_TOP.map((item, i) => (
            <motion.div key={i} whileHover={{ x: 2 }}
              onClick={() => {
                if (item.label === 'Teams') {
                  setIsInviteOpen(true);
                }
              }}
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
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>Không gian</span>
                  <button onClick={onOpenCreateProject} 
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', padding: 2 }} 
                    title="Tạo Không gian mới" 
                    onMouseEnter={e => e.currentTarget.style.color = 'white'} 
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                  </button>
                </div>

                {spaces.length === 0 ? (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', padding: '10px 0', fontStyle: 'italic' }}>
                    Chưa có dự án nào.
                  </div>
                ) : (
                  spaces.map((sp) => (
                    <motion.div key={sp._id} whileHover={{ x: 2 }} onClick={() => setActiveSpace(sp)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 6, cursor: 'pointer', marginBottom: 2, background: activeSpace?._id === sp._id ? 'rgba(0,82,204,0.25)' : 'transparent', border: activeSpace?._id === sp._id ? '1px solid rgba(0,82,204,0.4)' : '1px solid transparent', transition: 'all 0.15s' }}
                      onMouseEnter={e => { if (activeSpace?._id !== sp._id) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                      onMouseLeave={e => { if (activeSpace?._id !== sp._id) e.currentTarget.style.background = 'transparent'; }}>
                      <div style={{ width: 26, height: 26, borderRadius: 6, background: sp.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                        {sp.abbr}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sp.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>Team-managed</div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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

      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        workspaceId={activeWorkspace?._id}
      />
    </>
  );
};

export default Sidebar;