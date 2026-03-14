import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';

const COLORS = ['#0052cc', '#ff5630', '#36b37e', '#ffab00', '#6554c0', '#00b8d9'];

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({ name: '', abbr: '', color: COLORS[0] });
  const [loading, setLoading] = useState(false);
  const [focusInput, setFocusInput] = useState(false);

  // Tự động tạo chữ viết tắt (Abbr) từ tên dự án
  const handleNameChange = (e) => {
    const name = e.target.value;
    const words = name.trim().split(/\s+/);
    let abbr = '';
    if (words.length >= 2) {
      abbr = (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1 && words[0].length >= 2) {
      abbr = words[0].substring(0, 2).toUpperCase();
    } else {
      abbr = name.toUpperCase();
    }
    setFormData({ ...formData, name, abbr: abbr.substring(0, 2) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/projects', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onProjectCreated(response.data);
      setFormData({ name: '', abbr: '', color: COLORS[0] });
      onClose();
    } catch (error) {
      alert('Lỗi khi tạo Không gian: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }}
          onClick={onClose}
        />
        
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
          style={{ position: 'relative', width: '100%', maxWidth: '400px', background: 'white', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden', fontFamily: "'Segoe UI', system-ui, sans-serif" }}
        >
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Tạo Không gian mới</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', borderRadius: '6px' }}>✕</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Tên dự án / Không gian <span style={{ color: '#ef4444' }}>*</span></label>
                <input autoFocus required placeholder="VD: Dự án Web React..." value={formData.name} onChange={handleNameChange} onFocus={() => setFocusInput(true)} onBlur={() => setFocusInput(false)}
                  style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: focusInput ? '2px solid #0052cc' : '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Chữ viết tắt (Tự động)</label>
                  <input required maxLength={3} value={formData.abbr} onChange={e => setFormData({...formData, abbr: e.target.value.toUpperCase()})}
                    style={{ width: '100%', padding: '10px 14px', fontSize: '14px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Màu sắc nhận diện</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    {COLORS.map(c => (
                      <div key={c} onClick={() => setFormData({...formData, color: c})}
                        style={{ width: '24px', height: '24px', borderRadius: '6px', background: c, cursor: 'pointer', border: formData.color === c ? '2px solid #0f172a' : '2px solid transparent', transform: formData.color === c ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={onClose} style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 600, color: '#475569', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
              <button type="submit" disabled={loading} style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: 'white', background: '#0052cc', border: 'none', borderRadius: '8px', cursor: loading ? 'wait' : 'pointer' }}>
                {loading ? 'Đang tạo...' : 'Tạo mới'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateProjectModal;