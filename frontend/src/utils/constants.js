export const MOCK_TASKS = [
  { _id: '1', title: 'Thiết kế Database cho module Task', status: 'TODO', priority: 'High', project: 'WR-12', assignee: 'TN', date: 'Hôm nay' },
  { _id: '2', title: 'Viết API Đăng ký / Đăng nhập', status: 'DONE', priority: 'Urgent', project: 'WR-11', assignee: 'HM', date: 'Hôm nay' },
  { _id: '3', title: 'Tạo layout Dashboard bằng Tailwind', status: 'IN_PROGRESS', priority: 'Normal', project: 'WR-10', assignee: 'TN', date: 'Hôm qua' },
  { _id: '4', title: 'Tích hợp OAuth2 với Google', status: 'TODO', priority: 'High', project: 'WR-9', assignee: 'LP', date: 'Hôm qua' },
  { _id: '5', title: 'Viết unit test cho Auth module', status: 'IN_PROGRESS', priority: 'Normal', project: 'WR-8', assignee: 'HM', date: '11/3' },
  { _id: '6', title: 'Deploy lên server staging', status: 'DONE', priority: 'Urgent', project: 'WR-7', assignee: 'TN', date: '10/3' },
];

export const SPACES = [
  { id: 1, name: 'Dự án Web React', color: '#0052cc', abbr: 'WR', tasks: 6 },
  { id: 2, name: 'Chiến dịch Marketing', color: '#ff5630', abbr: 'CM', tasks: 3 },
  { id: 3, name: 'Mobile App v2', color: '#36b37e', abbr: 'MA', tasks: 9 },
];

export const TABS = ['Worked on', 'Viewed', 'Assigned to me', 'Starred', 'Boards'];

export const STATUS_CONFIG = {
  DONE: { label: 'Done', bg: '#e3fcef', color: '#006644', dot: '#36b37e' },
  IN_PROGRESS: { label: 'In Progress', bg: '#deebff', color: '#0052cc', dot: '#0052cc' },
  TODO: { label: 'To Do', bg: '#f4f5f7', color: '#42526e', dot: '#97a0af' },
};

export const PRIORITY_CONFIG = {
  Urgent: { color: '#ff5630', icon: '▲▲' },
  High: { color: '#ff7452', icon: '▲' },
  Normal: { color: '#0065ff', icon: '▬' },
  Low: { color: '#36b37e', icon: '▼' },
};

const AVATAR_COLORS = ['#0052cc', '#ff5630', '#36b37e', '#ff991f', '#6554c0', '#00b8d9'];
export const avatarColor = (str) => AVATAR_COLORS[str?.charCodeAt(0) % AVATAR_COLORS.length] || '#0052cc';