// Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import LeftPanel from './LeftPanel';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#f4f5f7' }}>

      {/* ── Left panel (ẩn trên mobile) ── */}
      <div className="left-panel-wrapper">
        <LeftPanel />
      </div>

      {/* ── Right: Register form ── */}
      <div style={{ flex: 1, maxWidth: '50vw', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', background: '#f4f5f7' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Badge */}
          <div
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#e3fcef', borderRadius: 999, padding: '4px 12px', marginBottom: 16, border: '1px solid #abf5d1' }}
          >
            <span style={{ fontSize: 11 }}>✓</span>
            <span style={{ color: '#006644', fontSize: 12, fontWeight: 700 }}>Miễn phí mãi mãi. Không cần thẻ tín dụng.</span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#172b4d', letterSpacing: '-0.5px', margin: '0 0 6px 0' }}>
              Bắt đầu ngay hôm nay
            </h2>
            <p style={{ color: '#6b778c', fontSize: 14.5, margin: 0 }}>
              Tạo tài khoản và trải nghiệm sức mạnh AI
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#ffebe6', border: '1px solid #ff8f73', borderRadius: 10, padding: '12px 16px', color: '#bf2600', fontSize: 13.5, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#172b4d', marginBottom: 7, letterSpacing: '0.3px' }}>
                HỌ VÀ TÊN
              </label>
              <input
                type="text"
                placeholder="Nhập tên của bạn"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ width: '100%', padding: '11px 14px', border: '2px solid #dfe1e6', borderRadius: 8, fontSize: 14.5, color: '#172b4d', background: 'white', outline: 'none', transition: 'all 0.15s', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.border = '2px solid #0052cc'; e.target.style.boxShadow = '0 0 0 3px rgba(0,82,204,0.12)'; }}
                onBlur={(e) => { e.target.style.border = '2px solid #dfe1e6'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#172b4d', marginBottom: 7, letterSpacing: '0.3px' }}>
                EMAIL CÔNG VIỆC
              </label>
              <input
                type="email"
                placeholder="ten@congty.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{ width: '100%', padding: '11px 14px', border: '2px solid #dfe1e6', borderRadius: 8, fontSize: 14.5, color: '#172b4d', background: 'white', outline: 'none', transition: 'all 0.15s', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.border = '2px solid #0052cc'; e.target.style.boxShadow = '0 0 0 3px rgba(0,82,204,0.12)'; }}
                onBlur={(e) => { e.target.style.border = '2px solid #dfe1e6'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#172b4d', marginBottom: 7, letterSpacing: '0.3px' }}>
                MẬT KHẨU
              </label>
              <input
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                style={{ width: '100%', padding: '11px 14px', border: '2px solid #dfe1e6', borderRadius: 8, fontSize: 14.5, color: '#172b4d', background: 'white', outline: 'none', transition: 'all 0.15s', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.border = '2px solid #0052cc'; e.target.style.boxShadow = '0 0 0 3px rgba(0,82,204,0.12)'; }}
                onBlur={(e) => { e.target.style.border = '2px solid #dfe1e6'; e.target.style.boxShadow = 'none'; }}
              />
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
                  Đang tạo tài khoản...
                </span>
              ) : (
                'Đăng ký →'
              )}
            </button>
          </form>

          {/* Link to Login */}
          <p style={{ textAlign: 'center', marginTop: 24, color: '#6b778c', fontSize: 14 }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: '#0052cc', fontWeight: 700, textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
              Đăng Nhập
            </Link>
          </p>

          <p style={{ textAlign: 'center', marginTop: 20, color: '#97a0af', fontSize: 11.5 }}>
            Bằng cách đăng ký, bạn đồng ý với{' '}
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

export default Register;