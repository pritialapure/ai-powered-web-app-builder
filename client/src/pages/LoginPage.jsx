import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { register, emailLogin } from '../services/authService.js';
import '../styles/login.css';

function LoginPage() {
  const { user, login } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  if (user) return <Navigate to="/dashboard" />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!formData.name || !formData.email || !formData.password) {
          showToast('Please fill in all fields', 'error');
          return;
        }
        const result = await register(formData.name, formData.email, formData.password);
        login(result.token, result.user);
        showToast('Account created successfully!', 'success');
        navigate('/dashboard');
      } else {
        if (!formData.email || !formData.password) {
          showToast('Please fill in all fields', 'error');
          return;
        }
        const result = await emailLogin(formData.email, formData.password);
        login(result.token, result.user);
        showToast('Logged in successfully!', 'success');
        navigate('/dashboard');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">NxtBuild</div>
        <h2 className="login-title">{isSignUp ? 'Create Account' : 'Sign In'}</h2>
        <p className="login-subtitle">
          {isSignUp ? 'Join us and start building' : 'Welcome back'}
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          {isSignUp && (
            <div className="login-form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="login-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="login-toggle">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            className="login-toggle-button"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
