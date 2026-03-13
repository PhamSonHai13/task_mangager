import { motion } from 'framer-motion';
import { SearchIcon, PlusIcon, BellIcon } from '../icons';
import { avatarColor } from '../../utils/constants';

// Đã thêm onOpenCreateModal vào props
const Topbar = ({ user, searchFocused, setSearchFocused, onOpenCreateModal }) => {
  return (
    <div style={{ height: 56, background: 'white', borderBottom: '1px solid #e8eaed', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0, zIndex: 10 }}>
      {/* Search */}
      <motion.div animate={{ width: searchFocused ? 480 : 340 }} transition={{ duration: 0.2 }} style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#97a0af', pointerEvents: 'none' }}>
          <SearchIcon />
        </div>
        <input
          placeholder="Tìm kiếm công việc, dự án..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{ width: '100%', padding: '8px 14px 8px 40px', border: '2px solid', borderColor: searchFocused ? '#0052cc' : '#e8eaed', borderRadius: 8, fontSize: 13.5, outline: 'none', background: searchFocused ? 'white' : '#f4f5f7', color: '#172b4d', transition: 'all 0.2s', boxSizing: 'border-box', boxShadow: searchFocused ? '0 0 0 3px rgba(0,82,204,0.1)' : 'none' }}
        />
      </motion.div>

      <div style={{ flex: 1 }} />

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Đã thêm onClick={onOpenCreateModal} vào đây */}
        <motion.button 
          onClick={onOpenCreateModal}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#0052cc', color: 'white', border: 'none', borderRadius: 6, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,82,204,0.3)' }}>
          <PlusIcon /> Tạo
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid #e8eaed', borderRadius: '50%', cursor: 'pointer', color: '#42526e', position: 'relative' }}>
          <BellIcon />
          <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ff5630', borderRadius: '50%', border: '2px solid white' }} />
        </motion.button>
        <motion.div whileHover={{ scale: 1.05 }}
          style={{ width: 34, height: 34, borderRadius: '50%', background: avatarColor(user?.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'white', cursor: 'pointer', letterSpacing: '-0.5px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
          {user?.name?.substring(0, 2).toUpperCase()}
        </motion.div>
      </div>
    </div>
  );
};

export default Topbar;