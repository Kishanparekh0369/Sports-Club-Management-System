import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Activity, UserPlus, CheckCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import FormInput from '../../components/forms/FormInput';
import Button from '../../components/common/Button';
import { getErrorMessage } from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Valid email address is required';
    }
    if (!formData.phone.trim() || formData.phone.length < 6) {
      errs.phone = 'Contact phone number is required';
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await register(formData);
      toast.success('Registration successful! Welcome to Elite Sports Club.');
      navigate('/member/dashboard', { replace: true });
    } catch (err) {
      const msg = getErrorMessage(err);
      setErrors({ form: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <Link to="/" className="auth-logo text-decoration-none">
            <Activity size={28} className="text-lime" />
            <span>ELITE</span> SPORTS CLUB
          </Link>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join Elite Sports Club and unlock access to all athletic courts</p>
        </div>

        {errors.form && (
          <div className="alert alert-danger p-2 small mb-3 rounded-2">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Full Name"
            name="name"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

          <div className="row g-2">
            <div className="col-md-6">
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Phone Number"
                name="phone"
                required
                placeholder="+1 555-019-2831"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
              />
            </div>
          </div>

          <div className="row g-2">
            <div className="col-md-6">
              <FormInput
                label="Password"
                name="password"
                type="password"
                required
                placeholder="At least 6 chars"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                required
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
              />
            </div>
          </div>

          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="agreeTerms"
              required
            />
            <label className="form-check-label small text-muted" htmlFor="agreeTerms">
              I agree to the Club Code of Conduct & Reservation Terms
            </label>
          </div>

          <Button
            type="submit"
            variant="lime"
            className="w-100 py-3"
            loading={loading}
            icon={UserPlus}
          >
            Register As Member
          </Button>
        </form>

        <div className="auth-divider">
          <span>Already registered?</span>
        </div>

        <div className="text-center">
          <Link to="/login" className="btn-athletic btn-athletic-outline-navy w-100 py-2">
            Sign In To Existing Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
