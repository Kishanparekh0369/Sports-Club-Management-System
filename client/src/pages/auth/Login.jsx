import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Activity, Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import FormInput from '../../components/forms/FormInput';
import Button from '../../components/common/Button';
import { getErrorMessage } from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login(formData);
      toast.success(`Welcome back, ${res.user.name}!`);

      // Determine redirection: intended path or role dashboard
      if (from) {
        navigate(from, { replace: true });
      } else if (res.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/member/dashboard', { replace: true });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for evaluator convenience
  const fillCredentials = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo text-decoration-none">
            <Activity size={28} className="text-lime" />
            <span>ELITE</span> SPORTS CLUB
          </Link>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to manage your bookings and membership</p>
        </div>

        {/* Demo Credentials Quick-Fill Toolbar */}
        <div className="demo-accounts-box">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="small fw-bold text-navy d-flex align-items-center gap-1">
              <Sparkles size={14} className="text-warning" /> Evaluation Demo Logins
            </span>
            <span className="badge bg-light text-muted border">1-Click</span>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="demo-pill-btn demo-pill-admin flex-grow-1"
              onClick={() => fillCredentials('admin@sportclub.local', 'Admin@12345')}
            >
              Fill Admin Account
            </button>
            <button
              type="button"
              className="demo-pill-btn demo-pill-member flex-grow-1"
              onClick={() => fillCredentials('member@sportclub.local', 'Member@12345')}
            >
              Fill Member Account
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger p-2 small mb-3 rounded-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            required
            placeholder="admin@sportclub.local"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="rememberMe" defaultChecked />
              <label className="form-check-label small text-muted" htmlFor="rememberMe">
                Remember session
              </label>
            </div>
            <Link to="/forgot-password" className="small text-navy fw-semibold text-decoration-none">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="lime"
            className="w-100 py-3"
            loading={loading}
            icon={LogIn}
          >
            Sign In
          </Button>
        </form>

        <div className="auth-divider">
          <span>New to Elite Club?</span>
        </div>

        <div className="text-center">
          <Link to="/register" className="btn-athletic btn-athletic-outline-navy w-100 py-2">
            Create Free Member Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
