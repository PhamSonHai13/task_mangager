import { motion } from 'framer-motion';
import { avatarColor } from '../../utils/constants';

const RightPanel = ({ tasks }) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
      style={{ width: 300, flexShrink: 0, padding: '32px 24px', borderLeft: '1px solid #e8eaed', background: 'white', overflowY: 'auto' }}>

      {/* Stats cards */}
      <h3 style={{ fontSize: 13, fontWeight: 800, color: '#172b4d', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Tổng quan</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
        {[
          { label: 'Tổng task', value: tasks.length, color: '#0052cc', bg: '#deebff' },
          { label: 'Hoàn thành', value: tasks.filter(t => t.status === 'DONE').length, color: '#006644', bg: '#e3fcef' },
          { label: 'Đang làm', value: tasks.filter(t => t.status === 'IN_PROGRESS').length, color: '#0747a6', bg: '#e8f4fd' },
          { label: 'Cần làm', value: tasks.filter(t => t.status === 'TODO').length, color: '#42526e', bg: '#f4f5f7' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.07 }}
            whileHover={{ scale: 1.03 }}
            style={{ background: stat.bg, borderRadius: 10, padding: '14px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: stat.color, fontWeight: 600, marginTop: 4 }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#172b4d' }}>Tiến độ Sprint</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#0052cc' }}>
            {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100) : 0}%
          </span>
        </div>
        <div style={{ height: 8, background: '#e8eaed', borderRadius: 999, overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100 : 0}%` }}
            transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #0052cc, #0065ff)', borderRadius: 999 }} />
        </div>
      </div>

      {/* Team members */}
      <h3 style={{ fontSize: 13, fontWeight: 800, color: '#172b4d', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Thành viên</h3>
      {[{ name: 'Thành Nam', abbr: 'TN', tasks: 2 }, { name: 'Hải Minh', abbr: 'HM', tasks: 2 }, { name: 'Lan Phương', abbr: 'LP', tasks: 1 }].map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 + i * 0.07 }}
          whileHover={{ x: 3 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f4f5f7' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: avatarColor(m.abbr), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'white' }}>{m.abbr}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#172b4d' }}>{m.name}</div>
            <div style={{ fontSize: 11, color: '#97a0af' }}>{m.tasks} tasks</div>
          </div>
          <div style={{ width: 50, height: 5, background: '#e8eaed', borderRadius: 999 }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${(m.tasks / 3) * 100}%` }} transition={{ delay: 0.8, duration: 0.5 }}
              style={{ height: '100%', background: avatarColor(m.abbr), borderRadius: 999 }} />
          </div>
        </motion.div>
      ))}

      {/* Recent activity */}
      <h3 style={{ fontSize: 13, fontWeight: 800, color: '#172b4d', margin: '24px 0 12px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Hoạt động gần đây</h3>
      {[
        { text: 'WR-11 đã được đánh dấu Hoàn thành', time: '2 giờ trước', dot: '#36b37e' },
        { text: 'WR-12 được tạo bởi Thành Nam', time: '5 giờ trước', dot: '#0052cc' },
        { text: 'WR-10 đang In Progress', time: 'Hôm qua', dot: '#ff991f' },
      ].map((act, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.06 }}
          style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: act.dot, marginTop: 5, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 12.5, color: '#172b4d', lineHeight: 1.4 }}>{act.text}</div>
            <div style={{ fontSize: 11, color: '#97a0af', marginTop: 2 }}>{act.time}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default RightPanel;