import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { motion } from 'framer-motion';

const getAvatarColor = (name) => {
  const colors = ['#0052cc', '#008da6', '#36b37e', '#ff5630', '#ffab00', '#6554c0'];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const MembersModal = ({ isOpen, onClose, workspaceId, onOpenInvite }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!isOpen || !workspaceId) return;
      setLoading(true);
      try {
        const res = await axios.get(`/workspaces/${workspaceId}/members`);
        setMembers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [isOpen, workspaceId]);

  const handleRemove = async (memberId, memberName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${memberName} khỏi Không gian làm việc?`)) return;
    try {
      await axios.delete(`/workspaces/${workspaceId}/members/${memberId}`);
      setMembers(prev => prev.filter(m => m._id !== memberId));
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra khi xóa thành viên.");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(9, 30, 66, 0.54)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1500, padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '640px', boxShadow: '0 12px 28px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #ebecf0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '600', color: '#172b4d', letterSpacing: '-0.01em' }}>Thành viên Không gian</h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#5e6c84' }}>Quản lý những người làm việc cùng bạn trong không gian này.</p>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: '#f4f5f7', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#42526e', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#ebecf0'}
            onMouseLeave={e => e.currentTarget.style.background = '#f4f5f7'}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div style={{ padding: '16px 32px', display: 'flex', justifyContent: 'flex-end', background: '#fafbfc', borderBottom: '1px solid #ebecf0' }}>
          <button 
            onClick={onOpenInvite}
            style={{ padding: '8px 16px', background: '#0052cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#0047b3'}
            onMouseLeave={e => e.currentTarget.style.background = '#0052cc'}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
            Mời người mới
          </button>
        </div>

        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8993a4', fontSize: '14px', fontWeight: '500' }}>Đang tải dữ liệu...</div>
          ) : members.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8993a4', fontSize: '14px' }}>Chưa có thành viên nào.</div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px', padding: '12px 32px', borderBottom: '2px solid #f4f5f7', color: '#5e6c84', fontSize: '12px', fontWeight: '700', letterSpacing: '0.04em' }}>
                <div>NGƯỜI DÙNG</div>
                <div>VAI TRÒ</div>
                <div style={{ textAlign: 'right' }}>THAO TÁC</div>
              </div>

              {members.map((member) => (
                <div 
                  key={member._id} 
                  style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px', padding: '16px 32px', borderBottom: '1px solid #f4f5f7', alignItems: 'center', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', overflow: 'hidden' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: getAvatarColor(member.user?.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', flexShrink: 0 }}>
                      {member.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: '600', color: '#172b4d', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {member.user?.name}
                      </div>
                      <div style={{ color: '#5e6c84', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {member.user?.email}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.03em',
                      background: member.role === 'admin' ? '#eae6ff' : '#e3fcef', 
                      color: member.role === 'admin' ? '#403294' : '#006644' 
                    }}>
                      {member.role === 'admin' ? 'QUẢN TRỊ' : 'THÀNH VIÊN'}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => handleRemove(member._id, member.user?.name)}
                      style={{ background: 'transparent', border: 'none', color: '#5e6c84', cursor: 'pointer', fontSize: '14px', fontWeight: '500', padding: '6px 12px', borderRadius: '6px', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#de350b'; e.currentTarget.style.background = '#ffebe6'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#5e6c84'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MembersModal;