import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Activity, Mail, ArrowLeft, Send, Key } from 'lucide-react';
import FormInput from '../../components/forms/FormInput';
import Button from '../../components/common/Button';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [testingInfo, setTestingInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      toast.success(res.message);
      if (res.resetToken) {
        setTestingInfo({
          token: res.resetToken,
          url: `/reset-password/${res.resetToken}`
        });
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
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
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">Enter your registered email to receive a password reset token</p>
        </div>

        {testingInfo && (
          <div className="alert alert-success p-3 mb-4 rounded-3 border-0">
            <div className="fw-bold d-flex align-items-center gap-1 mb-1">
              <Key size={16} /> Local Development Reset Link Generated:
            </div>
            <p className="small text-muted mb-2">
              Since this is running in local environment without SMTP email relay, click below to test the reset flow immediately:
            </p>
            <Link
              to={testingInfo.url}
              className="btn btn-sm btn-success fw-bold w-100"
            >
              Click Here To Reset Password
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            required
            placeholder="member@sportclub.local"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            variant="lime"
            className="w-100 py-3 mt-2"
            loading={loading}
            icon={Send}
          >
            Generate Reset Token
          </Button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <Link to="/login" className="small text-muted d-inline-flex align-items-center gap-1">
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
