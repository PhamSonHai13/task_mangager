import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';

const EditTaskModal = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const [formData, setFormData] = useState({ title: '', status: 'TODO', priority: 'Normal' });
  const [loading, setLoading] = useState(false);

  // Tự động điền dữ liệu của task hiện tại vào form khi mở Modal
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        status: task.status,
        priority: task.priority
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Gọi API PUT để cập nhật
      const response = await axios.put(`/tasks/${task._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onTaskUpdated(response.data);
      onClose();
    } catch (error) {
      alert('Lỗi khi cập nhật Task: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(9, 30, 66, 0.54)' }}
          onClick={onClose}
        />
        
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
          style={{ position: 'relative', width: '100%', maxWidth: 500, background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 8px 16px rgba(9, 30, 66, 0.25)' }}
        >
          <h2 style={{ margin: '0 0 20px 0', fontSize: 20, color: '#172b4d' }}>Cập nhật công việc</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5e6c84', marginBottom: 4 }}>TÊN CÔNG VIỆC <span style={{color: 'red'}}>*</span></label>
              <input autoFocus required placeholder="Nhập tên task..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                style={{ width: '100%', padding: '8px 12px', border: '2px solid #dfe1e6', borderRadius: 4, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#4c9aff'} onBlur={e => e.target.style.borderColor = '#dfe1e6'}
              />
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5e6c84', marginBottom: 4 }}>TRẠNG THÁI</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '2px solid #dfe1e6', borderRadius: 4, background: '#f4f5f7' }}>
                  <option value="TODO">To Do (Cần làm)</option>
                  <option value="IN_PROGRESS">In Progress (Đang làm)</option>
                  <option value="DONE">Done (Hoàn thành)</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5e6c84', marginBottom: 4 }}>ĐỘ ƯU TIÊN</label>
                <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '2px solid #dfe1e6', borderRadius: 4, background: '#f4f5f7' }}>
                  <option value="Low">Low (Thấp)</option>
                  <option value="Normal">Normal (Bình thường)</option>
                  <option value="High">High (Cao)</option>
                  <option value="Urgent">Urgent (Khẩn cấp)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button type="button" onClick={onClose} style={{ padding: '8px 12px', background: 'none', border: 'none', color: '#5e6c84', fontWeight: 600, cursor: 'pointer' }}>Hủy</button>
              <button type="submit" disabled={loading} style={{ padding: '8px 16px', background: '#0052cc', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600, cursor: loading ? 'wait' : 'pointer' }}>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditTaskModal;