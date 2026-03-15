import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';
import { useWorkspace } from '../../context/WorkspaceContext';

// ─── DESIGN TOKENS (khớp trang chính: xanh dương #2563eb) ────────────────────
// Primary  : #2563eb  (blue-600)
// Hover    : #1d4ed8  (blue-700)
// Light bg : #eff6ff  (blue-50)
// Border   : #bfdbfe  (blue-200)
// Focus    : rgba(37,99,235,.12)
// Text     : #1e3a5f  (đậm), #64748b (muted)

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IconFileText = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" x2="8" y1="13" y2="13"/>
    <line x1="16" x2="8" y1="17" y2="17"/>
  </svg>
);
const IconFolder = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-1.22-1.8A2 2 0 0 0 8.53 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
  </svg>
);
const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);
const IconChevron = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const IconCheck = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13l4 4L19 7"/>
  </svg>
);
const IconSpinner = () => (
  <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18L18 6M6 6l12 12"/>
  </svg>
);
const IconSearch = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const MONTHS_VI = [
  'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
  'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12',
];
const DOW_VI = ['CN','T2','T3','T4','T5','T6','T7'];

// Avatar colors — giữ nguyên đa sắc để phân biệt người
const AVATAR_COLORS = [
  { bg: '#dbeafe', color: '#1d4ed8' },
  { bg: '#d1fae5', color: '#065f46' },
  { bg: '#fef3c7', color: '#92400e' },
  { bg: '#fee2e2', color: '#991b1b' },
  { bg: '#ede9fe', color: '#6d28d9' },
];

const STATUSES = [
  {
    value: 'TODO',
    label: 'To Do',
    dot: 'bg-slate-400',
    base: 'border-slate-200 text-slate-600 hover:bg-slate-50',
    active: 'border-slate-500 bg-slate-100 text-slate-800 ring-2 ring-slate-200',
  },
  {
    value: 'IN_PROGRESS',
    label: 'In Progress',
    dot: 'bg-blue-500',
    base: 'border-blue-200 text-blue-700 hover:bg-blue-50',
    active: 'border-blue-600 bg-blue-100 text-blue-800 ring-2 ring-blue-200',
  },
  {
    value: 'DONE',
    label: 'Done',
    dot: 'bg-emerald-500',
    base: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50',
    active: 'border-emerald-500 bg-emerald-100 text-emerald-800 ring-2 ring-emerald-100',
  },
];

const PRIORITIES = [
  {
    value: 'Low',
    label: 'Thấp',
    dot: 'bg-sky-400',
    base: 'border-sky-200 text-sky-700 hover:bg-sky-50',
    active: 'border-sky-500 bg-sky-100 text-sky-800 ring-2 ring-sky-100',
  },
  {
    value: 'Normal',
    label: 'Bình thường',
    dot: 'bg-emerald-500',
    base: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50',
    active: 'border-emerald-500 bg-emerald-100 text-emerald-800 ring-2 ring-emerald-100',
  },
  {
    value: 'High',
    label: 'Cao',
    dot: 'bg-amber-400',
    base: 'border-amber-200 text-amber-700 hover:bg-amber-50',
    active: 'border-amber-500 bg-amber-100 text-amber-800 ring-2 ring-amber-100',
  },
  {
    value: 'Urgent',
    label: 'Khẩn cấp',
    dot: 'bg-red-500',
    base: 'border-red-200 text-red-700 hover:bg-red-50',
    active: 'border-red-500 bg-red-100 text-red-800 ring-2 ring-red-100',
  },
];

// ─── SHARED FIELD CLASSES ─────────────────────────────────────────────────────
const fieldCls =
  'w-full pl-10 pr-9 py-2.5 text-sm font-medium text-slate-800 text-left bg-white ' +
  'border border-slate-200 rounded-lg outline-none transition-all duration-150 cursor-pointer ' +
  'hover:border-blue-300 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,.12)]';

const labelCls = 'block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5';

// ─── CUSTOM DROPDOWN ──────────────────────────────────────────────────────────
const CustomDropdown = ({ icon, placeholder, value, onChange, options, renderOption, renderSelected }) => {
  const [open, setOpen]   = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = options.filter(o =>
    JSON.stringify(o).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      {/* Left icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
        {icon}
      </div>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={[
          fieldCls,
          'flex items-center justify-between gap-2',
          open ? 'border-blue-500 shadow-[0_0_0_3px_rgba(37,99,235,.12)]' : '',
          !value ? 'text-slate-400 font-normal' : '',
        ].join(' ')}
      >
        <span className="truncate flex-1">
          {value ? renderSelected(value) : placeholder}
        </span>
        <span className="text-slate-400 flex-shrink-0">
          <IconChevron open={open} />
        </span>
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 500, damping: 36 }}
            className="absolute top-[calc(100%+5px)] left-0 right-0 z-[9999] bg-white border border-slate-200 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,.1),0_2px_8px_rgba(0,0,0,.06)] overflow-hidden"
          >
            {/* Search */}
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <IconSearch />
                </div>
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full pl-8 pr-3 py-1.5 text-[13px] text-slate-800 border border-slate-200 rounded-lg outline-none transition-all focus:border-blue-400 focus:shadow-[0_0_0_2px_rgba(37,99,235,.1)] placeholder:text-slate-300 bg-slate-50"
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="py-5 text-center text-[13px] text-slate-400">Không tìm thấy</div>
              ) : (
                filtered.map(opt => {
                  const optId = opt.value || opt._id;
                  const selId = value?.value || value?._id;
                  const isSelected = selId === optId;
                  return (
                    <button
                      key={optId}
                      type="button"
                      onClick={() => { onChange(opt); setOpen(false); setSearch(''); }}
                      className={[
                        'w-full flex items-center gap-2.5 px-3 py-2 text-left text-[13px] font-medium transition-colors duration-100',
                        isSelected
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-700 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {renderOption(opt, isSelected)}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── CALENDAR PICKER ──────────────────────────────────────────────────────────
const CalendarPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });
  const [tempDate, setTempDate] = useState(value);
  const ref = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const navMonth = (dir) =>
    setViewing(v => {
      let m = v.month + dir, y = v.year;
      if (m > 11) { m = 0; y++; }
      if (m < 0)  { m = 11; y--; }
      return { year: y, month: m };
    });

  const buildDays = () => {
    const { year, month } = viewing;
    const firstDow  = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotal = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDow; i++)
      days.push({ day: prevTotal - firstDow + 1 + i, type: 'prev' });
    for (let d = 1; d <= totalDays; d++) {
      const date    = new Date(year, month, d);
      const isToday = date.getTime() === today.getTime();
      const isPast  = date < today;
      const isSel   = tempDate &&
        date.getTime() === new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()).getTime();
      days.push({ day: d, type: 'cur', isToday, isPast, isSel, date });
    }
    const rem = days.length % 7 === 0 ? 0 : 7 - (days.length % 7);
    for (let i = 1; i <= rem; i++) days.push({ day: i, type: 'next' });
    return days;
  };

  const apply = () => { onChange(tempDate); setOpen(false); };
  const clear  = () => { setTempDate(null); onChange(null); setOpen(false); };
  const fmt = (d) => d
    ? `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
    : null;

  return (
    <div className="relative" ref={ref}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
        <IconCalendar />
      </div>

      <button
        type="button"
        onClick={() => { setTempDate(value); setOpen(o => !o); }}
        className={[
          fieldCls,
          'flex items-center justify-between gap-2',
          open ? 'border-blue-500 shadow-[0_0_0_3px_rgba(37,99,235,.12)]' : '',
          !value ? 'text-slate-400 font-normal' : '',
        ].join(' ')}
      >
        <span className="flex-1">{fmt(value) || 'Chọn ngày...'}</span>
        <span className="text-slate-400 flex-shrink-0">
          <IconChevron open={open} />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 500, damping: 36 }}
            className="absolute top-[calc(100%+5px)] left-0 z-[9999] bg-white border border-slate-200 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,.1)] p-3 w-[262px]"
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => navMonth(-1)}
                className="w-7 h-7 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 text-base hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all"
              >‹</button>
              <span className="text-[13px] font-bold text-slate-800">
                {MONTHS_VI[viewing.month]} {viewing.year}
              </span>
              <button
                type="button"
                onClick={() => navMonth(1)}
                className="w-7 h-7 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 text-base hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all"
              >›</button>
            </div>

            {/* DOW headers */}
            <div className="grid grid-cols-7 mb-0.5">
              {DOW_VI.map(d => (
                <div key={d} className="text-center text-[10px] font-semibold text-slate-400 tracking-wide py-0.5">
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-[2px]">
              {buildDays().map((item, i) => {
                if (item.type !== 'cur') {
                  return (
                    <div key={i} className="h-8 flex items-center justify-center text-[11.5px] text-slate-300">
                      {item.day}
                    </div>
                  );
                }
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={item.isPast}
                    onClick={() => !item.isPast && setTempDate(item.date)}
                    className={[
                      'h-8 w-full flex items-center justify-center rounded-lg text-[11.5px] font-medium transition-all duration-100',
                      item.isSel
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : item.isToday
                          ? 'border border-blue-400 text-blue-600 font-semibold hover:bg-blue-50'
                          : item.isPast
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600',
                    ].join(' ')}
                  >
                    {item.day}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex gap-2 mt-2.5 pt-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={clear}
                className="flex-1 py-1.5 border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-500 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Xóa
              </button>
              <button
                type="button"
                onClick={apply}
                className="flex-1 py-1.5 rounded-lg text-[12px] font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm"
              >
                Chọn ngày này
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── TAG BUTTON ───────────────────────────────────────────────────────────────
const TagButton = ({ item, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold',
      'transition-all duration-150 select-none bg-white',
      isActive ? item.active : item.base,
    ].join(' ')}
  >
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.dot}`} />
    {item.label}
  </button>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const CreateTaskModal = ({ isOpen, onClose, onTaskCreated, activeSpace }) => {
  const { activeWorkspace } = useWorkspace();

  const [formData, setFormData]             = useState({ title: '', status: 'TODO', priority: 'Normal' });
  const [selectedList, setSelectedList]     = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [dueDate, setDueDate]               = useState(null);
  const [lists, setLists]                   = useState([]);
  const [members, setMembers]               = useState([]);
  const [loading, setLoading]               = useState(false);

  useEffect(() => {
    if (!isOpen || !activeWorkspace) return;
    const token = localStorage.getItem('token');

    axios.get(`/workspaces/${activeWorkspace._id}/hierarchy`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const flat = [];
      res.data.forEach(space => {
        space.lists.forEach(l =>
          flat.push({ ...l, spaceName: space.name, spaceId: space._id })
        );
        space.folders.forEach(folder =>
          folder.lists.forEach(l =>
            flat.push({
              ...l,
              spaceName: space.name,
              spaceId: space._id,
              folderName: folder.name,
              folderId: folder._id,
            })
          )
        );
      });
      setLists(flat);
      if (activeSpace?.type === 'list')
        setSelectedList(flat.find(l => l._id === activeSpace.data._id) || flat[0] || null);
      else
        setSelectedList(flat[0] || null);
    }).catch(console.error);

    axios.get(`/workspaces/${activeWorkspace._id}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setMembers(res.data)).catch(console.error);
  }, [isOpen, activeWorkspace, activeSpace]);

  const reset = () => {
    setFormData({ title: '', status: 'TODO', priority: 'Normal' });
    setSelectedMember(null);
    setDueDate(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedList) return alert('Vui lòng chọn Danh sách lưu Task!');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        listId: selectedList._id,
        folderId: selectedList.folderId || null,
        spaceId: selectedList.spaceId,
        workspaceId: activeWorkspace._id,
        assignees: selectedMember ? [selectedMember.user._id] : [],
        dueDate: dueDate ? dueDate.toISOString() : null,
      };
      const { data } = await axios.post('/tasks', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onTaskCreated(data);
      reset();
      onClose();
    } catch {
      alert('Lỗi khi tạo Task!');
    } finally {
      setLoading(false);
    }
  };

  // Shape options
  const listOptions = lists.map(l => ({
    ...l,
    value: l._id,
    mainLabel: l.name || '(Chưa đặt tên)',
    sublabel: [l.spaceName, l.folderName].filter(Boolean).join(' > '),
  }));

  const memberOptions = members.map((m, i) => ({
    ...m,
    value: m.user._id,
    initials: m.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 flex flex-col overflow-visible"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,.12), 0 4px 16px rgba(0,0,0,.06)' }}
          >
            {/* Blue accent top bar — giống nút "+ Tạo" trên trang */}
            <div className="h-[3px] w-full rounded-t-2xl bg-blue-600 flex-shrink-0" />

            {/* ── Header ── */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-slate-800 tracking-tight leading-tight">
                    Tạo công việc mới
                  </h2>
                  <p className="text-[12px] text-slate-400 mt-0.5">Điền thông tin để bắt đầu</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600 flex items-center justify-center transition-all"
              >
                <IconX />
              </button>
            </div>

            {/* ── Body ── */}
            <form onSubmit={handleSubmit} className="overflow-visible">
              <div className="p-6 flex flex-col gap-5 overflow-visible">

                {/* Task title */}
                <div>
                  <label className={labelCls}>
                    Tên công việc <span className="text-red-500 normal-case tracking-normal">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                      <IconFileText />
                    </div>
                    <input
                      autoFocus
                      required
                      type="text"
                      placeholder="Ví dụ: Thiết kế giao diện trang chủ..."
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 text-sm font-medium text-slate-800 bg-white border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400 placeholder:font-normal hover:border-blue-300 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,.12)]"
                    />
                  </div>
                </div>

                {/* List selector */}
                <div>
                  <label className={labelCls}>
                    Lưu vào danh sách <span className="text-red-500 normal-case tracking-normal">*</span>
                  </label>
                  <CustomDropdown
                    icon={<IconFolder />}
                    placeholder="Chọn nơi lưu Task..."
                    value={selectedList}
                    onChange={setSelectedList}
                    options={listOptions}
                    renderOption={(opt, isSelected) => (
                      <>
                        <svg
                          className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`}
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-1.22-1.8A2 2 0 0 0 8.53 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
                        </svg>
                        <div className="min-w-0">
                          <div className="truncate">{opt.mainLabel}</div>
                          {opt.sublabel && (
                            <div className="text-[11px] text-slate-400 font-normal mt-0.5 truncate">{opt.sublabel}</div>
                          )}
                        </div>
                      </>
                    )}
                    renderSelected={opt =>
                      [opt.sublabel, opt.mainLabel].filter(Boolean).join(' > ')
                    }
                  />
                </div>

                {/* Assignee + Due date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Người phụ trách</label>
                    <CustomDropdown
                      icon={<IconUser />}
                      placeholder="Chưa giao cho ai..."
                      value={selectedMember}
                      onChange={setSelectedMember}
                      options={memberOptions}
                      renderOption={(opt, isSelected) => (
                        <>
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                            style={{ background: opt.avatarColor.bg, color: opt.avatarColor.color }}
                          >
                            {opt.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate">{opt.user.name}</div>
                            {opt.user.email && (
                              <div className="text-[11px] text-slate-400 font-normal mt-0.5 truncate">{opt.user.email}</div>
                            )}
                          </div>
                        </>
                      )}
                      renderSelected={opt => (
                        <span className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                            style={{ background: opt.avatarColor.bg, color: opt.avatarColor.color }}
                          >
                            {opt.initials}
                          </span>
                          {opt.user.name}
                        </span>
                      )}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Hạn chót</label>
                    <CalendarPicker value={dueDate} onChange={setDueDate} />
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100" />

                {/* Status + Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Trạng thái</label>
                    <div className="flex flex-wrap gap-1.5">
                      {STATUSES.map(s => (
                        <TagButton
                          key={s.value}
                          item={s}
                          isActive={formData.status === s.value}
                          onClick={() => setFormData({ ...formData, status: s.value })}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Độ ưu tiên</label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRIORITIES.map(p => (
                        <TagButton
                          key={p.value}
                          item={p}
                          isActive={formData.priority === p.value}
                          onClick={() => setFormData({ ...formData, priority: p.value })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Footer ── */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-2xl">
                <span className="text-[11px] text-slate-400">
                  Nhấn{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-500">
                    Esc
                  </kbd>{' '}
                  để đóng
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-px active:scale-[.97] focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                  >
                    {loading ? <><IconSpinner /> Đang tạo...</> : <><IconCheck /> Tạo Công việc</>}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskModal;