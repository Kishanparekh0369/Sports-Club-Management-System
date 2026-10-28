import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserCheck, Plus, Edit2, Trash2, Star, Mail, Phone } from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import FormTextarea from '../../components/forms/FormTextarea';
import { coachService } from '../../services/coachService';
import { sportService } from '../../services/sportService';
import { getErrorMessage } from '../../services/api';

const Coaches = () => {
  const { onToggleMobile } = useOutletContext();
  const [coaches, setCoaches] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: 5,
    bio: '',
    photo: '',
    sports: [],
    certifications: '',
    status: 'active'
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [coachToDelete, setCoachToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const [coachRes, sportRes] = await Promise.all([
        coachService.getCoaches({ all: true }),
        sportService.getSports()
      ]);
      setCoaches(coachRes.coaches || []);
      setSports(sportRes.sports || []);
    } catch (err) {
      toast.error('Failed to load coaches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      _id: '',
      name: '',
      email: '',
      phone: '',
      specialization: '',
      experience: 5,
      bio: '',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      sports: [],
      certifications: 'Level 2 Athletic Coach\nFirst Aid Certified',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (coach) => {
    setIsEditing(true);
    setFormData({
      _id: coach._id,
      name: coach.name,
      email: coach.email,
      phone: coach.phone,
      specialization: coach.specialization,
      experience: coach.experience,
      bio: coach.bio,
      photo: coach.photo,
      sports: coach.sports ? coach.sports.map((s) => s._id || s) : [],
      certifications: Array.isArray(coach.certifications) ? coach.certifications.join('\n') : '',
      status: coach.status
    });
    setShowModal(true);
  };

  const handleSaveCoach = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.specialization) {
      toast.warning('Please fill in coach name, email, and specialization');
      return;
    }

    setModalLoading(true);
    try {
      if (isEditing) {
        await coachService.updateCoach(formData._id, formData);
        toast.success('Coach updated successfully!');
      } else {
        await coachService.createCoach(formData);
        toast.success('Coach added successfully!');
      }
      setShowModal(false);
      fetchCoaches();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setModalLoading(false);
    }
  };

  const confirmDelete = (coach) => {
    setCoachToDelete(coach);
    setShowDeleteDialog(true);
  };

  const handleDeleteCoach = async () => {
    if (!coachToDelete) return;
    setDeleteLoading(true);
    try {
      await coachService.deleteCoach(coachToDelete._id);
      toast.success('Coach record deleted.');
      setShowDeleteDialog(false);
      fetchCoaches();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Coaches & Mentors" breadcrumb="Coach Directory" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h4 className="font-heading fw-bold text-navy mb-1">Club Coaching Faculty ({coaches.length})</h4>
            <span className="text-muted small">Manage coaches, certifications, and assigned sports disciplines</span>
          </div>
          <Button variant="lime" icon={Plus} onClick={handleOpenAdd}>
            Add New Coach
          </Button>
        </div>

        {/* Coaches Grid */}
        <div className="row g-4">
          {loading ? (
            <div className="col-12">
              <Loader message="Loading coaches..." />
            </div>
          ) : coaches.length === 0 ? (
            <div className="col-12">
              <EmptyState
                icon={UserCheck}
                title="No coaches registered"
                actionText="Add First Coach"
                onAction={handleOpenAdd}
              />
            </div>
          ) : (
            coaches.map((coach) => (
              <div key={coach._id} className="col-lg-4 col-md-6">
                <div className="card-custom h-100 overflow-hidden d-flex flex-column">
                  <div className="d-flex gap-3 p-3 bg-surface-subtle align-items-center">
                    <img
                      src={coach.photo}
                      alt={coach.name}
                      className="rounded-circle"
                      style={{ width: 64, height: 64, objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div>
                      <h5 className="font-heading fw-bold text-navy mb-0">{coach.name}</h5>
                      <span className="text-lime fw-semibold small">{coach.specialization}</span>
                      <div className="d-flex gap-2 mt-1">
                        <StatusBadge status={coach.status} />
                        <span className="badge bg-light text-navy border small">★ {coach.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 d-flex flex-column flex-grow-1">
                    <div className="text-muted small mb-2">
                      <Mail size={14} className="me-1" /> {coach.email}
                    </div>
                    <div className="text-muted small mb-3">
                      <Phone size={14} className="me-1" /> {coach.phone}
                    </div>

                    <p className="text-muted small line-clamp-3 mb-3">{coach.bio}</p>

                    <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                      <span className="small text-muted">{coach.experience} yrs exp</span>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary p-1"
                          title="Edit Coach"
                          onClick={() => handleOpenEdit(coach)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger p-1"
                          title="Delete Coach"
                          onClick={() => confirmDelete(coach)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL: ADD / EDIT COACH */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content card-custom border-0 p-3">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title font-heading fw-bold">
                    {isEditing ? `Edit Coach: ${formData.name}` : 'Add New Coach'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSaveCoach}>
                  <div className="modal-body py-3">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormInput
                          label="Coach Name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <FormInput
                          label="Specialization"
                          name="specialization"
                          required
                          placeholder="e.g. Tennis & Badminton Head Coach"
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormInput
                          label="Email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <FormInput
                          label="Phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormInput
                          label="Photo URL"
                          name="photo"
                          value={formData.photo}
                          onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                        />
                      </div>
                      <div className="col-md-3">
                        <FormInput
                          label="Experience (Years)"
                          name="experience"
                          type="number"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        />
                      </div>
                      <div className="col-md-3">
                        <FormSelect
                          label="Status"
                          name="status"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          options={[
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' }
                          ]}
                        />
                      </div>
                    </div>

                    <FormTextarea
                      label="Biography"
                      name="bio"
                      required
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />

                    <FormTextarea
                      label="Certifications (One per line)"
                      name="certifications"
                      rows={2}
                      value={formData.certifications}
                      onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    />
                  </div>
                  <div className="modal-footer border-0 pt-0 gap-2">
                    <Button variant="outline-navy" size="sm" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="lime" size="sm" loading={modalLoading}>
                      {isEditing ? 'Update Coach' : 'Create Coach'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION */}
        <ConfirmDialog
          show={showDeleteDialog}
          title="Delete Coach"
          message={`Are you sure you want to remove coach '${coachToDelete?.name}' from the roster?`}
          confirmText="Delete Record"
          confirmVariant="orange"
          loading={deleteLoading}
          onConfirm={handleDeleteCoach}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </div>
    </>
  );
};

export default Coaches;
