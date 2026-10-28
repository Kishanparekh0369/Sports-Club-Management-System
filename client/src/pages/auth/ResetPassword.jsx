import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Activity, KeyRound, CheckCircle } from 'lucide-react';
import FormInput from '../../components/forms/FormInput';
import Button from '../../components/common/Button';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../services/api';
import useAuth from '../../hooks/useAuth';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authService.resetPassword(token, password);
      toast.success('Password successfully reset! You are now logged in.');
      if (res.user) {
        updateUser(res.user);
        navigate(res.user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard', { replace: true });
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo text-decoration-none">
            <Activity size={28} className="text-lime" />
            <span>ELITE</span> SPORTS CLUB
          </Link>
          <h2 className="auth-title">Create New Password</h2>
          <p className="auth-subtitle">Choose a secure password for your club account</p>
        </div>

        {error && (
          <div className="alert alert-danger p-2 small mb-3 rounded-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="New Password"
            name="password"
            type="password"
            required
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormInput
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            required
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="lime"
            className="w-100 py-3 mt-2"
            loading={loading}
            icon={KeyRound}
          >
            Save Password & Log In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
