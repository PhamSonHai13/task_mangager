import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';

const STATUS_CONFIG = {
  TODO: { label: 'To Do', dot: '#94a3b8', bg: '#f1f5f9', color: '#475569' },
  IN_PROGRESS: { label: 'In Progress', dot: '#6366f1', bg: '#e0e7ff', color: '#4338ca' },
  DONE: { label: 'Done', dot: '#22c55e', bg: '#dcfce7', color: '#15803d' },
};

const PRIORITY_CONFIG = {
  Low: { bg: '#f0f9ff', color: '#0369a1', dot: '#0ea5e9' },
  Normal: { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
  High: { bg: '#fef3c7', color: '#b45309', dot: '#f59e0b' },
  Urgent: { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' },
};

// NHẬN THÊM PROP: activeSpace
const CreateTaskModal = ({ isOpen, onClose, onTaskCreated, activeSpace }) => {
  const [formData, setFormData] = useState({ title: '', status: 'TODO', priority: 'Normal' });
  const [loading, setLoading] = useState(false);
  const [focusInput, setFocusInput] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // KIỂM TRA: Bắt buộc phải có project được chọn trước khi tạo Task
    if (!activeSpace) {
      alert("Vui lòng chọn một Không gian làm việc ở bên trái trước khi tạo Task!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // GẮN PROJECT ID VÀO DATA GỬI ĐI
      const dataToSend = {
        ...formData,
        project: activeSpace._id 
      };

      const response = await axios.post('/tasks', dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onTaskCreated(response.data);
      setFormData({ title: '', status: 'TODO', priority: 'Normal' });
      onClose();
    } catch (error) {
      alert('Lỗi khi tạo Task: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const s = STATUS_CONFIG[formData.status];
  const p = PRIORITY_CONFIG[formData.priority];

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box' }}>
        
        {/* Lớp nền mờ */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }}
          onClick={onClose}
        />
        
        {/* Khối Modal */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ position: 'relative', width: '100%', maxWidth: '480px', background: 'white', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'Segoe UI', system-ui, sans-serif" }}
        >
          {/* Header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
              Tạo công việc mới 
              {activeSpace && <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b', marginLeft: '8px' }}>trong {activeSpace.name}</span>}
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', borderRadius: '6px', display: 'flex' }}
              onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Tên công việc */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  Tên công việc <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  autoFocus required
                  placeholder="Ví dụ: Thiết kế giao diện trang chủ..."
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  onFocus={() => setFocusInput(true)}
                  onBlur={() => setFocusInput(false)}
                  style={{ 
                    width: '100%', padding: '12px 14px', fontSize: '14px', color: '#0f172a', background: 'white', 
                    border: focusInput ? '2px solid #6366f1' : '1px solid #cbd5e1', 
                    borderRadius: '8px', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s',
                    boxShadow: focusInput ? '0 0 0 3px rgba(99, 102, 241, 0.1)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}
                />
              </div>

              {/* Grid 2 cột */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {/* Trạng thái */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', fontSize: '14px', color: '#334155', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', cursor: 'pointer', appearance: 'auto', boxSizing: 'border-box', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                  <div style={{ marginTop: '10px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.bg}` }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot }} /> {s.label}
                    </span>
                  </div>
                </div>

                {/* Độ ưu tiên */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Độ ưu tiên</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', fontSize: '14px', color: '#334155', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', cursor: 'pointer', appearance: 'auto', boxSizing: 'border-box', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                  >
                    <option value="Low">Low (Thấp)</option>
                    <option value="Normal">Normal (Bình thường)</option>
                    <option value="High">High (Cao)</option>
                    <option value="Urgent">Urgent (Khẩn cấp)</option>
                  </select>
                  <div style={{ marginTop: '10px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, background: p.bg, color: p.color, border: `1px solid ${p.bg}` }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.dot }} /> {formData.priority}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={onClose}
                style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 600, color: '#475569', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
              >
                Hủy
              </button>
              <button type="submit" disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: 'white', background: loading ? '#818cf8' : '#4f46e5', border: 'none', borderRadius: '8px', cursor: loading ? 'wait' : 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                onMouseEnter={e => { if(!loading) e.currentTarget.style.background = '#4338ca'; }}
                onMouseLeave={e => { if(!loading) e.currentTarget.style.background = '#4f46e5'; }}
              >
                {loading ? 'Đang tạo...' : 'Tạo Task'}
              </button>
            </div>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateTaskModal;