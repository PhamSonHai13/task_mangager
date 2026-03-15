import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';

const STATUS_CONFIG = {
  TODO: { label: 'To Do', dot: '#64748b', bg: '#f1f5f9', color: '#475569' },
  IN_PROGRESS: { label: 'In Progress', dot: '#3b82f6', bg: '#eff6ff', color: '#2563eb' },
  DONE: { label: 'Done', dot: '#22c55e', bg: '#f0fdf4', color: '#16a34a' },
};

const PRIORITY_CONFIG = {
  Low: { label: 'Thấp', bg: '#f0f9ff', color: '#0284c7' },
  Normal: { label: 'Bình thường', bg: '#f0fdf4', color: '#16a34a' },
  High: { label: 'Cao', bg: '#fffbeb', color: '#d97706' },
  Urgent: { label: 'Khẩn cấp', bg: '#fef2f2', color: '#dc2626' },
};

const TaskDetailModal = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const [commentText, setCommentText] = useState('');
  const [newFiles, setNewFiles] = useState([]);
  const [isSending, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen || !task) return null;

  const s = STATUS_CONFIG[task.status] || STATUS_CONFIG['TODO'];
  const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['Normal'];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...files]);
  };

  const removeNewFile = (indexToRemove) => {
    setNewFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSendCommentAndFiles = async () => {
    if (!commentText.trim() && newFiles.length === 0) return;
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const payload = new FormData();
      
      if (commentText.trim()) payload.append('newComment', commentText);
      newFiles.forEach((file) => payload.append('attachments', file));

      const response = await axios.put(`/tasks/${task._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Nếu không có hàm cập nhật từ component cha thì load lại trang cho ăn chắc
      if (onTaskUpdated) {
        onTaskUpdated(response.data);
      } else {
        window.location.reload();
      }
      setCommentText('');
      setNewFiles([]);
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
        
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} 
          style={{ position: 'relative', width: '100%', maxWidth: '720px', background: 'white', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
          
          <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Chi tiết công việc</div>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a', lineHeight: '1.4' }}>{task.title}</h2>
            </div>
            <button onClick={onClose} style={{ flexShrink: 0, width: '36px', height: '36px', background: '#f8fafc', border: 'none', cursor: 'pointer', color: '#64748b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '24px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>TRẠNG THÁI</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: s.bg, color: s.color, fontSize: '13px', fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.dot }} /> {s.label}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>ĐỘ ƯU TIÊN</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 12px', borderRadius: '20px', background: p.bg, color: p.color, fontSize: '13px', fontWeight: 600 }}>{p.label}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>NGƯỜI PHỤ TRÁCH</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: '#334155' }}>Đã giao cho bạn</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>HẠN CHÓT</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: task.dueDate ? '#d97706' : '#64748b' }}>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString('vi-VN') : 'Không có'}
                </div>
              </div>
            </div>

            <div style={{ padding: '24px 0' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Mô tả công việc</div>
              <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6', background: '#f8fafc', padding: '16px', borderRadius: '8px', whiteSpace: 'pre-wrap', border: '1px solid #f1f5f9' }}>
                {task.description || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có mô tả nào...</span>}
              </div>
            </div>

            {task.attachments && task.attachments.length > 0 && (
              <div style={{ paddingBottom: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Tài liệu đính kèm ({task.attachments.length})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {task.attachments.map((file, index) => (
                    <a key={index} href={`http://localhost:5000/${file.path}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#0284c7', textDecoration: 'none', fontWeight: 500 }}>
                      📎 {file.originalName}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div style={{ paddingBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Hoạt động & Bình luận</div>
              {task.comments && task.comments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {task.comments.map((cmt, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
                        {(cmt.user?.name || 'U').substring(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{cmt.user?.name || 'Ẩn danh'}</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(cmt.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5', background: 'white', padding: '12px 16px', borderRadius: '0 12px 12px 12px', border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap' }}>
                          {cmt.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '20px 0', background: '#f8fafc', borderRadius: '8px' }}>Chưa có bình luận nào.</div>
              )}
            </div>
            <div style={{ height: '40px' }}></div>
          </div>
          
          <div style={{ padding: '16px 32px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            {newFiles.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {newFiles.map((file, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#e0e7ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}>
                    📎 {file.name}
                    <button onClick={() => removeNewFile(idx)} style={{ background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer' }}>❌</button>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, background: 'white', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '8px 12px', display: 'flex', flexDirection: 'column' }}>
                <textarea placeholder="Thêm bình luận hoặc câu hỏi..." value={commentText} onChange={e => setCommentText(e.target.value)} rows={2} style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', color: '#0f172a', resize: 'none', background: 'transparent' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <div>
                    <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={handleFileChange} />
                    <button onClick={() => fileInputRef.current.click()} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px', fontSize: '13px', fontWeight: 600 }}>
                      📎 Đính kèm
                    </button>
                  </div>
                  <button onClick={handleSendCommentAndFiles} disabled={isSending || (!commentText.trim() && newFiles.length === 0)} style={{ background: (!commentText.trim() && newFiles.length === 0) ? '#e2e8f0' : '#2563eb', color: (!commentText.trim() && newFiles.length === 0) ? '#94a3b8' : 'white', border: 'none', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: (!commentText.trim() && newFiles.length === 0) ? 'not-allowed' : 'pointer' }}>
                    {isSending ? 'Đang gửi...' : 'Gửi'}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskDetailModal;