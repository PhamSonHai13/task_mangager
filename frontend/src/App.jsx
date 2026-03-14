import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorkspaceProvider } from './context/WorkspaceContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <WorkspaceProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </WorkspaceProvider>
    </Router>
  );
}

export default App;