import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { avatarColor } from '../../utils/constants';
import { GridIcon, ProjectsIcon, FilterIcon, DashboardIcon, TeamsIcon, AppsIcon, LogoutIcon } from '../icons';
import WorkspaceDropdown from './WorkspaceDropdown';
import InviteMemberModal from './InviteMemberModal';
import MembersModal from './MembersModal';
import { useWorkspace } from '../../context/WorkspaceContext';
import axios from '../../api/axios';

const NAV_TOP = [
  { icon: <GridIcon />, label: 'Your work', active: false },
  { icon: <ProjectsIcon />, label: 'Projects', active: false },
  { icon: <FilterIcon />, label: 'Filters', active: false },
  { icon: <DashboardIcon />, label: 'Dashboards', active: false },
  { icon: <TeamsIcon />, label: 'Teams', active: false },
  { icon: <AppsIcon />, label: 'Apps', active: false },
];

const Sidebar = ({ sidebarCollapsed, setSidebarCollapsed, user, spaces = [], hierarchy = [], activeSpace, setActiveSpace, handleLogout, onOpenCreateProject }) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const { activeWorkspace } = useWorkspace();
  const [expandedNodes, setExpandedNodes] = useState({});

  const [editingNode, setEditingNode] = useState(null);
  const [editName, setEditName] = useState('');

  const toggleNode = (e, id) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartEdit = (e, id, currentName) => {
    e.stopPropagation();
    setEditingNode(id);
    setEditName(currentName);
  };

  const handleSaveEdit = async (id, type) => {
    if (!editName.trim() || editName === "") {
      setEditingNode(null); 
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const url = type === 'Không gian' ? `/workspaces/spaces/${id}` : type === 'Thư mục' ? `/workspaces/folders/${id}` : `/workspaces/lists/${id}`;
      await axios.put(url, { name: editName }, { headers: { Authorization: `Bearer ${token}` } });
      window.location.reload();
    } catch (err) { alert("Lỗi khi đổi tên!"); }
  };

  const handleKeyDown = (e, id, type) => {
    if (e.key === 'Enter') handleSaveEdit(id, type);
    if (e.key === 'Escape') setEditingNode(null);
  };

  const handleDeleteItem = async (e, id, type) => {
    e.stopPropagation(); 
    if (!window.confirm(`Bạn có chắc muốn xóa ${type} này không? Hành động này sẽ xóa mọi dữ liệu bên trong!`)) return;

    try {
      const token = localStorage.getItem('token');
      const url = type === 'Không gian' ? `/workspaces/spaces/${id}` : type === 'Thư mục' ? `/workspaces/folders/${id}` : `/workspaces/lists/${id}`;
      await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
      window.location.reload(); 
    } catch (err) { alert("Lỗi khi xóa!"); }
  };

  const ChevronIcon = ({ isExpanded }) => (
    <svg style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
  );

  const ActionMenu = ({ id, name, type }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ position: 'relative', marginLeft: 'auto', flexShrink: 0 }} onClick={(e) => e.stopPropagation()} onMouseLeave={() => setIsOpen(false)}>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex' }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'} 
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -5 }} transition={{ duration: 0.15 }}
              style={{ position: 'absolute', right: 0, top: '100%', background: '#2c333a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px', zIndex: 99, display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '100px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
            >
              <button 
                onClick={(e) => { setIsOpen(false); handleStartEdit(e, id, name); }} 
                style={{ textAlign: 'left', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.85)', padding: '6px 8px', fontSize: '12px', cursor: 'pointer', borderRadius: '4px', display: 'flex', gap: '6px', alignItems: 'center', whiteSpace: 'nowrap' }} 
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                ✏️ Sửa tên
              </button>
              <button 
                onClick={(e) => { setIsOpen(false); handleDeleteItem(e, id, type); }} 
                style={{ textAlign: 'left', background: 'transparent', border: 'none', color: '#ff5630', padding: '6px 8px', fontSize: '12px', cursor: 'pointer', borderRadius: '4px', display: 'flex', gap: '6px', alignItems: 'center', whiteSpace: 'nowrap' }} 
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,86,48,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                🗑️ Xóa bỏ
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const safeHierarchy = hierarchy || [];
  const safeSpaces = spaces || [];

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
                  setIsMembersOpen(true);
                }
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: sidebarCollapsed ? '10px 18px' : '10px 16px', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', transition: 'background 0.15s, padding 0.3s', borderRadius: 4, margin: '1px 6px' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}>
              <div style={{ flexShrink: 0 }}>{item.icon}</div>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
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
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{ padding: '16px 8px 8px', overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 8px' }}>
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

                {safeHierarchy.length > 0 ? (
                  safeHierarchy.filter(s => s && s._id).map((space) => {
                    const isSpaceExpanded = expandedNodes[space._id];
                    const isSpaceActive = activeSpace?._id === space._id;
                    
                    return (
                      <div key={space._id}>
                        {/* THE SPACE ROW */}
                        <div onClick={() => setActiveSpace(space)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px', borderRadius: 6, cursor: 'pointer', background: isSpaceActive ? 'rgba(0,82,204,0.25)' : 'transparent', color: isSpaceActive ? 'white' : 'rgba(255,255,255,0.85)' }} onMouseEnter={e => { if(!isSpaceActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }} onMouseLeave={e => { if(!isSpaceActive) e.currentTarget.style.background = 'transparent' }}>
                          <div onClick={(e) => toggleNode(e, space._id)} style={{ padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }}><ChevronIcon isExpanded={isSpaceExpanded} /></div>
                          <div style={{ width: 22, height: 22, borderRadius: 4, background: space.color || '#0052cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white', flexShrink: 0 }}>{space.name?.substring(0, 1).toUpperCase()}</div>
                          
                          {/* SỬA TRỰC TIẾP SPACE - Đã thêm minWidth: 0 */}
                          {editingNode === space._id ? (
                            <input 
                              autoFocus value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => handleKeyDown(e, space._id, 'Không gian')} onBlur={() => setEditingNode(null)} onClick={e => e.stopPropagation()}
                              style={{ flex: 1, minWidth: 0, width: '100%', background: '#1d2125', color: 'white', border: '1px solid #0052cc', borderRadius: 4, padding: '2px 6px', fontSize: 13, outline: 'none' }}
                            />
                          ) : (
                            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{space.name}</span>
                          )}
                          
                          {editingNode !== space._id && <ActionMenu id={space._id} name={space.name} type="Không gian" />}
                        </div>

                        {/* FOLDERS & LISTS BẢO VỆ AN TOÀN */}
                        {isSpaceExpanded && (
                          <div style={{ paddingLeft: 12, marginLeft: 12, borderLeft: '1px solid rgba(255,255,255,0.1)', marginTop: 4 }}>
                            {(space.folders || []).filter(f => f && f._id).map(folder => {
                              const isFolderExpanded = expandedNodes[folder._id];
                              const isFolderActive = activeSpace?._id === folder._id;
                              return (
                                <div key={folder._id}>
                                  <div onClick={() => setActiveSpace(folder)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 4, cursor: 'pointer', background: isFolderActive ? 'rgba(255,255,255,0.1)' : 'transparent', color: isFolderActive ? 'white' : 'rgba(255,255,255,0.65)' }} onMouseEnter={e => { if(!isFolderActive) e.currentTarget.style.color = 'white' }} onMouseLeave={e => { if(!isFolderActive) e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}>
                                    <div onClick={(e) => toggleNode(e, folder._id)} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}><ChevronIcon isExpanded={isFolderExpanded} /></div>
                                    <svg style={{ flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                                    
                                    {/* SỬA TRỰC TIẾP FOLDER - Đã thêm minWidth: 0 */}
                                    {editingNode === folder._id ? (
                                      <input 
                                        autoFocus value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => handleKeyDown(e, folder._id, 'Thư mục')} onBlur={() => setEditingNode(null)} onClick={e => e.stopPropagation()}
                                        style={{ flex: 1, minWidth: 0, width: '100%', background: '#1d2125', color: 'white', border: '1px solid #0052cc', borderRadius: 4, padding: '2px 6px', fontSize: 12.5, outline: 'none' }}
                                      />
                                    ) : (
                                      <span style={{ flex: 1, fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder.name}</span>
                                    )}

                                    {editingNode !== folder._id && <ActionMenu id={folder._id} name={folder.name} type="Thư mục" />}
                                  </div>

                                  {isFolderExpanded && (
                                    <div style={{ paddingLeft: 22, marginTop: 2 }}>
                                      {(folder.lists || []).filter(l => l && l._id).map(list => {
                                        const isListActive = activeSpace?._id === list._id;
                                        return (
                                          <div key={list._id} onClick={() => setActiveSpace(list)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 4, cursor: 'pointer', background: isListActive ? 'rgba(255,255,255,0.1)' : 'transparent', color: isListActive ? 'white' : 'rgba(255,255,255,0.55)' }} onMouseEnter={e => { if(!isListActive) e.currentTarget.style.color = 'white' }} onMouseLeave={e => { if(!isListActive) e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: list.color || '#5e6c84', flexShrink: 0 }} />
                                            
                                            {/* SỬA TRỰC TIẾP LIST - Đã thêm minWidth: 0 */}
                                            {editingNode === list._id ? (
                                              <input 
                                                autoFocus value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => handleKeyDown(e, list._id, 'Danh sách')} onBlur={() => setEditingNode(null)} onClick={e => e.stopPropagation()}
                                                style={{ flex: 1, minWidth: 0, width: '100%', background: '#1d2125', color: 'white', border: '1px solid #0052cc', borderRadius: 4, padding: '2px 6px', fontSize: 12, outline: 'none' }}
                                              />
                                            ) : (
                                              <span style={{ flex: 1, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{list.name}</span>
                                            )}

                                            {editingNode !== list._id && <ActionMenu id={list._id} name={list.name} type="Danh sách" />}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {(space.lists || []).filter(l => l && l._id).map(list => {
                              const isListActive = activeSpace?._id === list._id;
                              return (
                                <div key={list._id} onClick={() => setActiveSpace(list)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 4, cursor: 'pointer', background: isListActive ? 'rgba(255,255,255,0.1)' : 'transparent', color: isListActive ? 'white' : 'rgba(255,255,255,0.55)' }} onMouseEnter={e => { if(!isListActive) e.currentTarget.style.color = 'white' }} onMouseLeave={e => { if(!isListActive) e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}>
                                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: list.color || '#5e6c84', flexShrink: 0 }} />
                                  
                                  {/* SỬA TRỰC TIẾP LIST - Đã thêm minWidth: 0 */}
                                  {editingNode === list._id ? (
                                    <input 
                                      autoFocus value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => handleKeyDown(e, list._id, 'Danh sách')} onBlur={() => setEditingNode(null)} onClick={e => e.stopPropagation()}
                                      style={{ flex: 1, minWidth: 0, width: '100%', background: '#1d2125', color: 'white', border: '1px solid #0052cc', borderRadius: 4, padding: '2px 6px', fontSize: 12, outline: 'none' }}
                                    />
                                  ) : (
                                    <span style={{ flex: 1, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{list.name}</span>
                                  )}

                                  {editingNode !== list._id && <ActionMenu id={list._id} name={list.name} type="Danh sách" />}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : safeSpaces.length === 0 ? (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', padding: '10px 0', fontStyle: 'italic' }}>
                    Chưa có dự án nào.
                  </div>
                ) : (
                  safeSpaces.filter(sp => sp && sp._id).map((sp) => (
                    <motion.div key={sp._id} whileHover={{ x: 2 }} onClick={() => setActiveSpace(sp)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 6, cursor: 'pointer', marginBottom: 2, background: activeSpace?._id === sp._id ? 'rgba(0,82,204,0.25)' : 'transparent', border: activeSpace?._id === sp._id ? '1px solid rgba(0,82,204,0.4)' : '1px solid transparent', transition: 'all 0.15s' }}
                      onMouseEnter={e => { if (activeSpace?._id !== sp._id) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                      onMouseLeave={e => { if (activeSpace?._id !== sp._id) e.currentTarget.style.background = 'transparent'; }}>
                      <div style={{ width: 26, height: 26, borderRadius: 6, background: sp.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                        {sp.abbr || sp.name?.substring(0,2).toUpperCase()}
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
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
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

      <InviteMemberModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} workspaceId={activeWorkspace?._id} />
      <MembersModal isOpen={isMembersOpen} onClose={() => setIsMembersOpen(false)} workspaceId={activeWorkspace?._id} onOpenInvite={() => { setIsMembersOpen(false); setIsInviteOpen(true); }} />
    </>
  );
};

export default Sidebar;