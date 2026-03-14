import { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);

  const fetchWorkspaces = async () => {
    try {
      const res = await axios.get('/workspaces');
      setWorkspaces(res.data);
      if (res.data.length > 0 && !activeWorkspace) {
        setActiveWorkspace(res.data[0]);
      }
    } catch (error) {
      console.error(error);
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