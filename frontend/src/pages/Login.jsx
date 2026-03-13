// Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import LeftPanel from './LeftPanel';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#f4f5f7' }}>

      {/* ── Left panel (ẩn trên mobile) ── */}
      <div style={{ display: 'none' }} className="lg-left-panel">
        <LeftPanel />
      </div>
      <div className="left-panel-wrapper">
        <LeftPanel />
      </div>

      {/* ── Right: Login form ── */}
      <div style={{ flex: 1, maxWidth: '50vw', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', background: '#f4f5f7' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Heading */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#172b4d', letterSpacing: '-0.5px', margin: '0 0 6px 0' }}>
              Chào mừng trở lại
            </h2>
            <p style={{ color: '#6b778c', fontSize: 14.5, margin: 0 }}>
              Đăng nhập để tiếp tục làm việc cùng nhóm của bạn
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#ffebe6', border: '1px solid #ff8f73', borderRadius: 10, padding: '12px 16px', color: '#bf2600', fontSize: 13.5, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Social login */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {[
              {
                label: 'Google',
                icon: (
                  <svg width="17" height="17" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                ),
              },
              {
                label: 'Microsoft',
                icon: (
                  <svg width="17" height="17" viewBox="0 0 24 24">
                    <rect x="1" y="1" width="10" height="10" fill="#f25022" />
                    <rect x="13" y="1" width="10" height="10" fill="#7fba00" />
                    <rect x="1" y="13" width="10" height="10" fill="#00a4ef" />
                    <rect x="13" y="13" width="10" height="10" fill="#ffb900" />
                  </svg>
                ),
              },
            ].map((s) => (
              <button
                key={s.label}
                type="button"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', background: 'white', border: '1px solid #dadce0', borderRadius: 10, color: '#3c4043', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9fa')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#dfe1e6' }} />
            <span style={{ color: '#97a0af', fontSize: 12, fontWeight: 500 }}>hoặc đăng nhập bằng email</span>
            <div style={{ flex: 1, height: 1, background: '#dfe1e6' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#172b4d', marginBottom: 7, letterSpacing: '0.3px' }}>
                ĐỊA CHỈ EMAIL
              </label>
              <input
                type="email"
                value={email}
                placeholder="ban@congty.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '11px 14px', border: '2px solid #dfe1e6', borderRadius: 8, fontSize: 14.5, color: '#172b4d', background: 'white', outline: 'none', transition: 'all 0.15s', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.border = '2px solid #0052cc'; e.target.style.boxShadow = '0 0 0 3px rgba(0,82,204,0.12)'; }}
                onBlur={(e) => { e.target.style.border = '2px solid #dfe1e6'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#172b4d', letterSpacing: '0.3px' }}>MẬT KHẨU</label>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: '#0052cc', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  placeholder="Nhập mật khẩu"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '11px 44px 11px 14px', border: '2px solid #dfe1e6', borderRadius: 8, fontSize: 14.5, color: '#172b4d', background: 'white', outline: 'none', transition: 'all 0.15s', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.border = '2px solid #0052cc'; e.target.style.boxShadow = '0 0 0 3px rgba(0,82,204,0.12)'; }}
                  onBlur={(e) => { e.target.style.border = '2px solid #dfe1e6'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#97a0af', padding: 0, display: 'flex', alignItems: 'center' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#172b4d')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#97a0af')}
                >
                  {showPass ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#0747a6' : '#0052cc', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.15s', letterSpacing: '0.2px', boxShadow: '0 4px 14px rgba(0,82,204,0.35)' }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#0747a6'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#0052cc'; }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg style={{ animation: 'spin 0.8s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Đang đăng nhập...
                </span>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Link to Register */}
          <p style={{ textAlign: 'center', marginTop: 28, color: '#6b778c', fontSize: 14 }}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{ color: '#0052cc', fontWeight: 700, textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
              Đăng ký miễn phí
            </Link>
          </p>

          <p style={{ textAlign: 'center', marginTop: 20, color: '#97a0af', fontSize: 11.5 }}>
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <a href="#" style={{ color: '#0052cc', textDecoration: 'none' }}>Điều khoản dịch vụ</a>
            {' '}và{' '}
            <a href="#" style={{ color: '#0052cc', textDecoration: 'none' }}>Chính sách bảo mật</a>.
          </p>
        </div>
      </div>

      <style>{`
        .left-panel-wrapper { display: flex; }
        @media (max-width: 1024px) { .left-panel-wrapper { display: none; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;