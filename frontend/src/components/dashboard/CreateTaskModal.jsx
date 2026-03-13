import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: 'TODO',
    priority: 'Normal'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Gọi API POST tạo task thật
      const response = await axios.post('/tasks', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onTaskCreated(response.data); // Truyền data mới tạo ra ngoài
      setFormData({ title: '', status: 'TODO', priority: 'Normal' }); // Reset form
      onClose(); // Đóng modal
    } catch (error) {
      alert('Lỗi khi tạo Task: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Lớp mờ nền */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(9, 30, 66, 0.54)' }}
          onClick={onClose}
        />
        
        {/* Khối Modal */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
          style={{ position: 'relative', width: '100%', maxWidth: 500, background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 8px 16px rgba(9, 30, 66, 0.25)' }}
        >
          <h2 style={{ margin: '0 0 20px 0', fontSize: 20, color: '#172b4d' }}>Tạo công việc mới</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#5e6c84', marginBottom: 4 }}>TÊN CÔNG VIỆC <span style={{color: 'red'}}>*</span></label>
              <input 
                autoFocus required placeholder="Nhập tên task..." value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                style={{ width: '100%', padding: '8px 12px', border: '2px solid #dfe1e6', borderRadius: 4, outline: 'none', transition: 'border 0.2s' }}
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