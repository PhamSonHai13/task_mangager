import { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);

  const fetchWorkspaces = async () => {
    try {
      // Lấy token từ Local Storage
      const token = localStorage.getItem('token');
      
      // Gắn token vào header để Backend nhận diện
      const res = await axios.get('/workspaces', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setWorkspaces(res.data);
      // Nếu có workspace và chưa chọn cái nào thì tự động chọn cái đầu tiên
      if (res.data.length > 0 && !activeWorkspace) {
        setActiveWorkspace(res.data[0]);
      }
    } catch (error) {
      console.error("Lỗi khi tải Workspace:", error);
      
      // BẢO MẬT: Nếu Backend báo lỗi 401 (Không có quyền/Hết hạn token)
      // thì xóa token cũ đi và bắt người dùng đăng nhập lại
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login'; 
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchWorkspaces();
    }
  }, []);

  return (
    <WorkspaceContext.Provider value={{ workspaces, activeWorkspace, setActiveWorkspace, fetchWorkspaces }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);