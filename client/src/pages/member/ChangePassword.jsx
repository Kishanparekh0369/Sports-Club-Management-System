import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { KeyRound, ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';
import MemberHeader from '../../components/layout/MemberHeader';
import Button from '../../components/common/Button';
import FormInput from '../../components/forms/FormInput';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../services/api';

const ChangePassword = () => {
  const { onToggleMobile } = useOutletContext();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword(formData);
      toast.success('Your password has been changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MemberHeader title="Security Settings" breadcrumb="Change Password" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card-custom p-4 p-md-5 bg-white">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-orange-subtle text-orange"
                  style={{ width: '50px', height: '50px' }}
                >
                  <KeyRound size={26} />
                </div>
                <div>
                  <h4 className="font-heading fw-bold text-navy mb-0">Change Password</h4>
                  <p className="text-muted small mb-0">
                    Ensure your account stays protected by using a strong password.
                  </p>
                </div>
              </div>

              <div className="alert alert-info py-2 px-3 small d-flex align-items-center gap-2 mb-4">
                <ShieldAlert size={18} className="flex-shrink-0" />
                <span>
                  Passwords must be at least 6 characters long and include numbers and special characters.
                </span>
              </div>

              <form onSubmit={handleSubmit}>
                <FormInput
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  required
                  placeholder="Enter your existing password"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                />

                <FormInput
                  label="New Password"
                  name="newPassword"
                  type="password"
                  required
                  placeholder="Enter your new password (min. 6 characters)"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                />

                <FormInput
                  label="Confirm New Password"
                  name="confirmNewPassword"
                  type="password"
                  required
                  placeholder="Re-enter your new password"
                  value={formData.confirmNewPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmNewPassword: e.target.value })
                  }
                />

                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mt-4 pt-2 border-top">
                  <Link
                    to="/member/profile"
                    className="btn btn-outline-secondary d-flex align-items-center gap-2 w-100 w-sm-auto justify-content-center"
                  >
                    <ArrowLeft size={16} /> Back to Profile
                  </Link>

                  <Button
                    type="submit"
                    variant="navy"
                    loading={loading}
                    className="w-100 w-sm-auto"
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
