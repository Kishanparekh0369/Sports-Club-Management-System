import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Phone, Mail, FileText, Image, ShieldCheck, Calendar, KeyRound } from 'lucide-react';
import MemberHeader from '../../components/layout/MemberHeader';
import Button from '../../components/common/Button';
import FormInput from '../../components/forms/FormInput';
import FormTextarea from '../../components/forms/FormTextarea';
import useAuth from '../../hooks/useAuth';
import { memberService } from '../../services/memberService';
import { getErrorMessage } from '../../services/api';
import { formatDate } from '../../utils/formatDate';

const Profile = () => {
  const { onToggleMobile } = useOutletContext();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await memberService.updateProfile(formData);
      updateUser(res.user);
      toast.success('Your profile has been successfully updated!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MemberHeader title="My Profile" breadcrumb="Profile" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="row g-4">
          {/* Member Card Summary */}
          <div className="col-lg-4">
            <div className="card-custom p-4 bg-white text-center h-100">
              <div className="position-relative d-inline-block mb-3">
                <img
                  src={
                    formData.avatar ||
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={user?.name}
                  className="rounded-circle shadow-sm object-fit-cover"
                  style={{ width: '120px', height: '120px' }}
                />
                <span className="position-absolute bottom-0 end-0 bg-success p-1 rounded-circle border border-2 border-white">
                  <span className="visually-hidden">Active</span>
                </span>
              </div>

              <h4 className="font-heading fw-bold text-navy mb-1">{user?.name}</h4>
              <p className="text-muted small mb-3">{user?.email}</p>

              <div className="d-flex justify-content-center gap-2 mb-4">
                <span className="badge bg-lime-subtle text-success px-3 py-2 fw-semibold">
                  Club Member
                </span>
                <span className="badge bg-primary-subtle text-primary px-3 py-2 fw-semibold">
                  Status: Active
                </span>
              </div>

              <hr />

              <div className="text-start space-y-2 mt-3">
                <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                  <Phone size={15} /> <span>{user?.phone || 'No phone set'}</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                  <Mail size={15} /> <span>{user?.email}</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted small mb-3">
                  <Calendar size={15} /> <span>Member since {formatDate(user?.createdAt)}</span>
                </div>
              </div>

              <Link
                to="/member/change-password"
                className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
              >
                <KeyRound size={15} /> Change Password
              </Link>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="col-lg-8">
            <div className="card-custom p-4 bg-white h-100">
              <div className="border-bottom pb-3 mb-4">
                <h5 className="font-heading fw-bold text-navy mb-1">Personal Details</h5>
                <p className="text-muted small mb-0">
                  Update your contact details and club public profile information.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <FormInput
                      label="Full Name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className="col-md-6">
                    <FormInput
                      label="Phone Number"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +1 555-019-2831"
                    />
                  </div>

                  <div className="col-12">
                    <FormInput
                      label="Email Address"
                      name="email"
                      value={user?.email || ''}
                      disabled
                      helperText="Email address is permanent and used for membership verification."
                    />
                  </div>

                  <div className="col-12">
                    <FormInput
                      label="Avatar Photo URL"
                      name="avatar"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      helperText="Provide a direct image URL for your profile picture."
                    />
                  </div>

                  <div className="col-12">
                    <FormTextarea
                      label="Bio & Athletic Interests"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell the club coaches and fellow members about your favorite sports and goals..."
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <Button type="submit" variant="lime" loading={loading}>
                    Save Changes
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

export default Profile;
