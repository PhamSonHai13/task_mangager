import { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';

const WorkspaceDropdown = () => {
  const { workspaces, activeWorkspace, setActiveWorkspace } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!activeWorkspace) {
    return (
      <div style={{ padding: '16px', color: '#fff', fontWeight: 'bold' }}>
        Đang tải...
      </div>
    );
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px', borderRadius: '8px', transition: 'background 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ width: '32px', height: '32px', background: '#0052cc', color: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
          {activeWorkspace.name.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {activeWorkspace.name}
          </div>
          <div style={{ color: '#8c9bab', fontSize: '12px' }}>Miễn phí</div>
        </div>
       
      </div>

      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: '16px', right: '16px', background: '#fff', borderRadius: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', zIndex: 100, overflow: 'hidden', marginTop: '4px' }}>
          <div style={{ padding: '12px', fontSize: '11px', fontWeight: 'bold', color: '#5e6c84', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Các Không gian của bạn
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {workspaces.map((ws) => (
              <div 
                key={ws._id}
                onClick={() => {
                  setActiveWorkspace(ws);
                  setIsOpen(false);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', cursor: 'pointer', background: activeWorkspace._id === ws._id ? '#e6f0ff' : 'transparent', color: '#172b4d' }}
                onMouseOver={(e) => e.currentTarget.style.background = activeWorkspace._id === ws._id ? '#e6f0ff' : '#f4f5f7'}
                onMouseOut={(e) => e.currentTarget.style.background = activeWorkspace._id === ws._id ? '#e6f0ff' : 'transparent'}
              >
                <div style={{ width: '24px', height: '24px', background: '#0052cc', color: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                  {ws.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ fontSize: '14px', fontWeight: activeWorkspace._id === ws._id ? 'bold' : 'normal' }}>
                  {ws.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDropdown;