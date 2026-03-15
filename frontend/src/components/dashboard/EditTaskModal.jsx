import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';
import { useWorkspace } from '../../context/WorkspaceContext';

const STATUS_CONFIG = {
  TODO: { label: 'To Do', dot: '#64748b', bg: '#f8fafc', color: '#475569', border: '#cbd5e1' },
  IN_PROGRESS: { label: 'In Progress', dot: '#3b82f6', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  DONE: { label: 'Done', dot: '#22c55e', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
};

const PRIORITY_CONFIG = {
  Low: { label: 'Thấp', dot: '#0ea5e9', bg: '#f0f9ff', color: '#0284c7', border: '#bae6fd' },
  Normal: { label: 'Bình thường', dot: '#22c55e', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  High: { label: 'Cao', dot: '#f59e0b', bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  Urgent: { label: 'Khẩn cấp', dot: '#ef4444', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

const EditTaskModal = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const { activeWorkspace } = useWorkspace();
  const [formData, setFormData] = useState({ title: '', description: '', status: 'TODO', priority: 'Normal', dueDate: '' });
  const [listId, setListId] = useState('');
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);

  const [attachments, setAttachments] = useState([]); 
  const [commentText, setCommentText] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && activeWorkspace) {
      axios.get(`/workspaces/${activeWorkspace._id}/hierarchy`)
        .then(res => {
          let flatLists = [];
          res.data.forEach(space => {
            space.lists.forEach(l => flatLists.push({ ...l, spaceName: space.name, spaceId: space._id }));
            space.folders.forEach(folder => {
              folder.lists.forEach(l => flatLists.push({ ...l, spaceName: space.name, spaceId: space._id, folderName: folder.name, folderId: folder._id }));
            });
          });
          setLists(flatLists);
        })
        .catch(err => console.error(err));
    }
  }, [isOpen, activeWorkspace]);

  useEffect(() => {
    if (task) {
      const formattedDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
      setFormData({ title: task.title, description: task.description || '', status: task.status, priority: task.priority, dueDate: formattedDate });
      setListId(task.list || '');
      setAttachments([]); 
      setCommentText('');
    }
  }, [task]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeFile = (indexToRemove) => {
    setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!listId) { alert("Vui lòng chọn Danh sách lưu Task!"); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const selectedList = lists.find(l => l._id === listId);
      
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('status', formData.status);
      payload.append('priority', formData.priority);
      if (formData.dueDate) payload.append('dueDate', formData.dueDate);
      payload.append('listId', selectedList._id);
      if (selectedList.folderId) payload.append('folderId', selectedList.folderId);
      payload.append('spaceId', selectedList.spaceId);
      payload.append('workspaceId', activeWorkspace._id);
      if (commentText.trim()) payload.append('newComment', commentText);

      attachments.forEach((file) => payload.append('attachments', file));

      const response = await axios.put(`/tasks/${task._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onTaskUpdated(response.data);
      onClose();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
        
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} 
          style={{ position: 'relative', width: '100%', maxWidth: '640px', background: 'white', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
          
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Cập nhật công việc</h2>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Chỉnh sửa thông tin chi tiết</div>
              </div>
            </div>
            <button type="button" onClick={onClose} style={{ width: '32px', height: '32px', background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#64748b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'white'}><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxHeight: '75vh' }}>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', letterSpacing: '0.5px' }}>TÊN CÔNG VIỆC <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'absolute', left: '14px', color: '#94a3b8' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
                  <input autoFocus required placeholder="Ví dụ: Thiết kế giao diện trang chủ..." value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '12px 14px 12px 40px', fontSize: '14px', color: '#0f172a', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', letterSpacing: '0.5px' }}>MÔ TẢ CÔNG VIỆC</label>
                <textarea placeholder="Thêm mô tả chi tiết cho công việc này..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: '100%', padding: '12px 14px', fontSize: '14px', color: '#0f172a', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', letterSpacing: '0.5px' }}>LƯU VÀO DANH SÁCH <span style={{ color: '#ef4444' }}>*</span></label>
                <select required value={listId} onChange={(e) => setListId(e.target.value)} style={{ width: '100%', padding: '12px 14px', fontSize: '14px', color: '#334155', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <option value="" disabled>-- Chọn nơi lưu Task --</option>
                  {lists.map(l => (<option key={l._id} value={l._id}>{l.spaceName} {l.folderName ? `> ${l.folderName}` : ''} {' > '} {l.name}</option>))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', letterSpacing: '0.5px' }}>HẠN CHÓT (DUE DATE)</label>
                  <input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} style={{ width: '100%', padding: '11px 14px', fontSize: '14px', color: '#0f172a', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', cursor: 'pointer' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '10px', letterSpacing: '0.5px' }}>TRẠNG THÁI</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <button key={key} type="button" onClick={() => setFormData({...formData, status: key})}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                        border: formData.status === key ? `1.5px solid ${config.dot}` : '1.5px solid #e2e8f0', color: formData.status === key ? config.color : '#64748b' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: formData.status === key ? config.dot : '#cbd5e1' }} />
                        {config.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '10px', letterSpacing: '0.5px' }}>ĐỘ ƯU TIÊN</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                      <button key={key} type="button" onClick={() => setFormData({...formData, priority: key})}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                        border: formData.priority === key ? `1.5px solid ${config.dot}` : '1.5px solid #e2e8f0', color: formData.priority === key ? config.color : '#64748b' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: formData.priority === key ? config.dot : '#cbd5e1' }} />
                        {config.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '4px 0' }} />

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', letterSpacing: '0.5px' }}>TÀI LIỆU ĐÍNH KÈM</label>
                <div onClick={() => fileInputRef.current.click()} style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '16px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                  <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={handleFileChange} />
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Nhấn để tải file lên (Ảnh, PDF, Word...)</div>
                </div>

                {attachments.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {attachments.map((file, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                        <span style={{ fontSize: '14px', marginRight: '8px' }}>📄</span>
                        <span style={{ flex: 1, fontSize: '12px', color: '#334155', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                        <button type="button" onClick={() => removeFile(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>❌</button>
                      </div>
                    ))}
                  </div>
                )}
                
                {task.attachments && task.attachments.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {task.attachments.map((file, index) => (
                      <a key={index} href={`http://localhost:5000/${file.path}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', padding: '6px 10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', color: '#0284c7', textDecoration: 'none', fontWeight: 500 }}>
                        📎 {file.originalName}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', letterSpacing: '0.5px' }}>BÌNH LUẬN</label>
                <textarea placeholder="Thêm bình luận mới..." value={commentText} onChange={e => setCommentText(e.target.value)} rows={2} style={{ width: '100%', padding: '10px 12px', fontSize: '13px', color: '#0f172a', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', resize: 'none' }} />
              </div>

            </div>
            
            <div style={{ padding: '16px 24px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyItems: 'space-between' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', flex: 1 }}>Nhấn <kbd style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '4px', color: '#475569' }}>Esc</kbd> để đóng</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={onClose} style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 600, color: '#475569', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Hủy bỏ</button>
                <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: 'white', background: loading ? '#93c5fd' : '#2563eb', border: 'none', borderRadius: '8px', cursor: loading ? 'wait' : 'pointer' }}>
                  {loading ? 'Đang lưu...' : 'Lưu Công việc'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditTaskModal;