import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, KeyRound, Shield, CheckCircle } from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import Button from '../../components/common/Button';
import FormInput from '../../components/forms/FormInput';
import FormTextarea from '../../components/forms/FormTextarea';
import useAuth from '../../hooks/useAuth';
import { memberService } from '../../services/memberService';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../services/api';

const Profile = () => {
  const { onToggleMobile } = useOutletContext();
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await memberService.updateProfile(profileData);
      updateUser(res.user);
      toast.success('Admin profile updated!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setPasswordLoading(true);
    try {
      await authService.changePassword(passwordData);
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Admin Profile & Security" breadcrumb="Profile" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="row g-4">
          {/* Profile Details */}
          <div className="col-lg-7">
            <div className="card-custom p-4 bg-white h-100">
              <h5 className="font-heading fw-bold text-navy mb-3 d-flex align-items-center gap-2">
                <User className="text-lime" /> Personal Information
              </h5>

              <form onSubmit={handleUpdateProfile}>
                <FormInput
                  label="Full Name"
                  name="name"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />

                <FormInput
                  label="Email Address (Read Only)"
                  name="email"
                  value={user?.email || ''}
                  disabled
                  helperText="Email cannot be changed directly."
                />

                <FormInput
                  label="Phone Number"
                  name="phone"
                  required
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />

                <FormInput
                  label="Avatar Image URL"
                  name="avatar"
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                />

                <FormTextarea
                  label="Executive Bio"
                  name="bio"
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                />

                <Button type="submit" variant="lime" loading={profileLoading}>
                  Save Profile Changes
                </Button>
              </form>
            </div>
          </div>

          {/* Password Change */}
          <div className="col-lg-5">
            <div className="card-custom p-4 bg-white h-100">
              <h5 className="font-heading fw-bold text-navy mb-3 d-flex align-items-center gap-2">
                <KeyRound className="text-orange" /> Change Password
              </h5>

              <form onSubmit={handleChangePassword}>
                <FormInput
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                />

                <FormInput
                  label="New Password"
                  name="newPassword"
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                />

                <FormInput
                  label="Confirm New Password"
                  name="confirmNewPassword"
                  type="password"
                  required
                  value={passwordData.confirmNewPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                  }
                />

                <Button type="submit" variant="navy" loading={passwordLoading}>
                  Update Password
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
