import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';
import { useWorkspace } from '../../context/WorkspaceContext';

const COLORS = ['#0052cc', '#ff5630', '#36b37e', '#ffab00', '#6554c0', '#00b8d9'];

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const { activeWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState('space');
  const [formData, setFormData] = useState({ name: '', abbr: '', color: COLORS[0] });
  const [spaceId, setSpaceId] = useState('');
  const [folderId, setFolderId] = useState('');
  const [hierarchy, setHierarchy] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && activeWorkspace?._id) {
      const token = localStorage.getItem('token');
      axios.get(`/workspaces/${activeWorkspace._id}/hierarchy`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setHierarchy(res.data || []);
        if (res.data && res.data.length > 0) {
          setSpaceId(res.data[0]._id);
        }
      })
      .catch(err => {
          console.error("Error fetching hierarchy:", err);
          setHierarchy([]);
      });
    }
  }, [isOpen, activeWorkspace]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vẫn bảo vệ khi ấn Lưu (Submit)
    if (!activeWorkspace || !activeWorkspace._id) {
      alert("⚠️ Vui lòng tạo hoặc chọn Không gian làm việc (Workspace) từ Menu thả xuống ở góc trên bên trái trước khi lưu Dự án!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const finalAbbr = formData.abbr.trim() !== '' 
        ? formData.abbr 
        : formData.name.substring(0, 2).toUpperCase();

      const basePayload = { 
        name: formData.name, 
        abbr: finalAbbr,
        color: formData.color, 
        workspaceId: activeWorkspace._id 
      };
      
      if (activeTab === 'space') {
        await axios.post(`/workspaces/${activeWorkspace._id}/spaces`, basePayload, { headers });
      } else if (activeTab === 'folder') {
        await axios.post(`/workspaces/${activeWorkspace._id}/folders`, { ...basePayload, spaceId }, { headers });
      } else if (activeTab === 'list') {
        await axios.post(`/workspaces/${activeWorkspace._id}/lists`, { ...basePayload, spaceId, folderId: folderId || null }, { headers });
      }

      onProjectCreated();
      setFormData({ name: '', abbr: '', color: COLORS[0] });
      onClose();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedSpace = (hierarchy || []).find(s => s._id === spaceId);

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} style={{ position: 'relative', width: '100%', maxWidth: '440px', background: 'white', borderRadius: '12px', boxShadow: '0 20px 25px rgba(0,0,0,0.1)', overflow: 'hidden', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
          
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Thêm mới vào Không gian</h2>
            <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', borderRadius: '6px' }}>✕</button>
          </div>

          <div style={{ padding: '16px 24px 0' }}>
            <div style={{ display: 'flex', gap: 8, background: '#f1f5f9', padding: 4, borderRadius: 8 }}>
              {['space', 'folder', 'list'].map(tab => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '8px 0', border: 'none', background: activeTab === tab ? 'white' : 'transparent', borderRadius: 6, cursor: 'pointer', fontWeight: 600, color: activeTab === tab ? '#0052cc' : '#64748b', boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', textTransform: 'capitalize', fontSize: '13px', transition: 'all 0.2s' }}>
                  {tab === 'space' ? 'Khu vực' : tab === 'folder' ? 'Thư mục' : 'Danh sách'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {!activeWorkspace && (
                <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⚠️ Bạn chưa có Workspace nào. Vui lòng tạo Workspace trước.
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Tên <span style={{ color: '#ef4444' }}>*</span></label>
                {/* ĐÃ MỞ KHÓA HOÀN TOÀN Ô NÀY - BÁC GÕ THOẢI MÁI NHÉ */}
                <input 
                  autoFocus 
                  required 
                  placeholder="Nhập tên..." 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }} 
                />
              </div>

              {(activeTab === 'folder' || activeTab === 'list') && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Chọn Khu vực (Space) <span style={{ color: '#ef4444' }}>*</span></label>
                  <select required value={spaceId} onChange={(e) => { setSpaceId(e.target.value); setFolderId(''); }} style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: 'white' }}>
                    {(!hierarchy || hierarchy.length === 0) ? (
                      <option value="" disabled>⚠️ Hãy tạo Khu vực trước!</option>
                    ) : (
                      <>
                        <option value="" disabled>-- Chọn Khu vực --</option>
                        {hierarchy.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                      </>
                    )}
                  </select>
                </div>
              )}

              {activeTab === 'list' && selectedSpace && selectedSpace.folders && selectedSpace.folders.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Chọn Thư mục (Tùy chọn)</label>
                  <select value={folderId} onChange={(e) => setFolderId(e.target.value)} style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: 'white' }}>
                    <option value="">-- Không nằm trong Thư mục --</option>
                    {selectedSpace.folders.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Chữ viết tắt</label>
                  <input maxLength={3} value={formData.abbr} onChange={e => setFormData({...formData, abbr: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '10px 14px', fontSize: '14px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Màu sắc</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    {COLORS.map(c => (
                      <div key={c} onClick={() => setFormData({...formData, color: c})} style={{ width: '24px', height: '24px', borderRadius: '6px', background: c, cursor: 'pointer', border: formData.color === c ? '2px solid #0f172a' : '2px solid transparent', transform: formData.color === c ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={onClose} style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 600, color: '#475569', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}>Hủy</button>
              <button type="submit" disabled={loading || (activeTab !== 'space' && !spaceId)} style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: 'white', background: (activeTab !== 'space' && !spaceId) ? '#94a3b8' : '#0052cc', border: 'none', borderRadius: '8px', cursor: loading ? 'wait' : 'pointer' }}>
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