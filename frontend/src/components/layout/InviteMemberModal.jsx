import { useState } from 'react';
import axios from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const InviteMemberModal = ({ isOpen, onClose, workspaceId }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axios.post('/workspaces/add-member', {
        workspaceId,
        email,
        role
      });
      setMessage(res.data.message);
      setEmail('');
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi lời mời. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0, 0, 0, 0.4)', 
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      zIndex: 2000,
      padding: '20px'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '16px', 
          width: '100%', 
          maxWidth: '440px', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative'
        }}
      >
        {/* Close button X */}
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#111827', textAlign: 'center' }}>Mời đồng đội</h2>
        <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>
          Cùng nhau hoàn thành dự án nhanh hơn.
        </p>
        
        <AnimatePresence>
          {message && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ padding: '12px', background: '#ecfdf5', color: '#065f46', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              {message}
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ padding: '12px', background: '#fef2f2', color: '#991b1b', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleInvite}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>ĐỊA CHỈ EMAIL</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ten@congty.com"
              style={{ 
                width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '10px', boxSizing: 'border-box', outline: 'none',
                fontSize: '15px', transition: 'all 0.2s ease'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>VAI TRÒ TRONG NHÓM</label>
            <div style={{ position: 'relative' }}>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ 
                  width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '10px', boxSizing: 'border-box', outline: 'none',
                  fontSize: '15px', background: 'white', appearance: 'none', cursor: 'pointer'
                }}
              >
                <option value="member">Thành viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
              <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', 
                cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '16px', transition: 'background 0.2s ease' 
              }}
              onMouseOver={(e) => !loading && (e.target.style.background = '#1d4ed8')}
              onMouseOut={(e) => !loading && (e.target.style.background = '#2563eb')}
            >
              {loading ? 'Đang gửi...' : 'Gửi lời mời'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ 
                width: '100%', padding: '12px', background: 'transparent', color: '#4b5563', border: 'none', borderRadius: '10px', 
                cursor: 'pointer', fontWeight: '500', fontSize: '14px' 
              }}
              onMouseOver={(e) => (e.target.style.background = '#f3f4f6')}
              onMouseOut={(e) => (e.target.style.background = 'transparent')}
            >
              Để sau
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default InviteMemberModal;