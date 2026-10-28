import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Tag, Plus, Edit2, Trash2, CheckCircle, Star } from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import FormTextarea from '../../components/forms/FormTextarea';
import { membershipService } from '../../services/membershipService';
import { formatCurrency } from '../../utils/formatCurrency';
import { getErrorMessage } from '../../services/api';

const MembershipPlans = () => {
  const { onToggleMobile } = useOutletContext();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    tagline: 'Ideal for sports progression',
    durationMonths: 1,
    price: 49,
    benefits: 'Full Gym Access\n2 Court Bookings / month\nLocker Room Access',
    badge: 'Popular',
    isPopular: false,
    status: 'active'
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await membershipService.getPlans({ all: true });
      setPlans(res.plans || []);
    } catch (err) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      _id: '',
      name: '',
      tagline: 'Flexible athletic training plan',
      durationMonths: 1,
      price: 49,
      benefits: 'Unlimited gym & fitness hub\n2 court bookings per month\nSauna & recovery access',
      badge: '',
      isPopular: false,
      status: 'active'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (plan) => {
    setIsEditing(true);
    setFormData({
      _id: plan._id,
      name: plan.name,
      tagline: plan.tagline || '',
      durationMonths: plan.durationMonths,
      price: plan.price,
      benefits: Array.isArray(plan.benefits) ? plan.benefits.join('\n') : '',
      badge: plan.badge || '',
      isPopular: plan.isPopular || false,
      status: plan.status
    });
    setShowModal(true);
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.durationMonths) {
      toast.warning('Please provide plan name, price, and duration');
      return;
    }

    setModalLoading(true);
    try {
      if (isEditing) {
        await membershipService.updatePlan(formData._id, formData);
        toast.success('Membership plan updated!');
      } else {
        await membershipService.createPlan(formData);
        toast.success('Membership plan created!');
      }
      setShowModal(false);
      fetchPlans();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setModalLoading(false);
    }
  };

  const confirmDelete = (plan) => {
    setPlanToDelete(plan);
    setShowDeleteDialog(true);
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    setDeleteLoading(true);
    try {
      await membershipService.deletePlan(planToDelete._id);
      toast.success('Membership plan removed.');
      setShowDeleteDialog(false);
      fetchPlans();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Membership Tiers" breadcrumb="Plans" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h4 className="font-heading fw-bold text-navy mb-1">Membership Pricing Plans ({plans.length})</h4>
            <span className="text-muted small">Configure durations, pricing, perks, and promotional badges</span>
          </div>
          <Button variant="lime" icon={Plus} onClick={handleOpenAdd}>
            Create New Plan
          </Button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="row g-4">
          {loading ? (
            <div className="col-12">
              <Loader message="Loading membership plans..." />
            </div>
          ) : plans.length === 0 ? (
            <div className="col-12">
              <EmptyState
                icon={Tag}
                title="No plans created"
                actionText="Create First Plan"
                onAction={handleOpenAdd}
              />
            </div>
          ) : (
            plans.map((plan) => (
              <div key={plan._id} className="col-lg-3 col-md-6">
                <div className={`card-custom h-100 p-4 d-flex flex-column ${plan.isPopular ? 'border-success' : ''}`}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <StatusBadge status={plan.status} />
                    {plan.badge && <span className="badge bg-lime-subtle text-success">{plan.badge}</span>}
                  </div>

                  <h5 className="font-heading fw-bold text-navy mb-1">{plan.name}</h5>
                  <p className="text-muted small mb-3">{plan.tagline}</p>

                  <div className="pricing-price my-1">
                    {formatCurrency(plan.price)}
                    <span className="fs-6"> / {plan.durationMonths} mo</span>
                  </div>

                  <div className="border-top my-3"></div>

                  <ul className="list-unstyled small text-muted d-flex flex-column gap-2 flex-grow-1">
                    {plan.benefits.map((b, idx) => (
                      <li key={idx} className="d-flex align-items-start gap-2">
                        <CheckCircle size={15} className="text-lime flex-shrink-0 mt-1" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-3 border-top d-flex justify-content-end gap-1">
                    <button
                      className="btn btn-sm btn-outline-primary p-1"
                      title="Edit Plan"
                      onClick={() => handleOpenEdit(plan)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger p-1"
                      title="Delete Plan"
                      onClick={() => confirmDelete(plan)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL: ADD / EDIT PLAN */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content card-custom border-0 p-3">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title font-heading fw-bold">
                    {isEditing ? `Edit Plan: ${formData.name}` : 'Create Membership Plan'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSavePlan}>
                  <div className="modal-body py-3">
                    <FormInput
                      label="Plan Name"
                      name="name"
                      required
                      placeholder="e.g. Quarterly Pro"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <FormInput
                      label="Tagline"
                      name="tagline"
                      placeholder="Short marketing hook"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    />

                    <div className="row g-2">
                      <div className="col-6">
                        <FormInput
                          label="Duration (Months)"
                          name="durationMonths"
                          type="number"
                          required
                          value={formData.durationMonths}
                          onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <FormInput
                          label="Price ($)"
                          name="price"
                          type="number"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <FormInput
                          label="Badge (Optional)"
                          name="badge"
                          placeholder="e.g. Best Value"
                          value={formData.badge}
                          onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
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
                      label="Benefits List (One per line)"
                      name="benefits"
                      rows={4}
                      value={formData.benefits}
                      onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    />

                    <div className="form-check mt-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isPopularCheck"
                        checked={formData.isPopular}
                        onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      />
                      <label className="form-check-label small" htmlFor="isPopularCheck">
                        Highlight as Recommended / Popular
                      </label>
                    </div>
                  </div>
                  <div className="modal-footer border-0 pt-0 gap-2">
                    <Button variant="outline-navy" size="sm" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="lime" size="sm" loading={modalLoading}>
                      {isEditing ? 'Save Changes' : 'Create Plan'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRM */}
        <ConfirmDialog
          show={showDeleteDialog}
          title="Delete Plan"
          message={`Are you sure you want to delete '${planToDelete?.name}'? Will fail safely if active subscribers exist.`}
          confirmText="Delete Plan"
          confirmVariant="orange"
          loading={deleteLoading}
          onConfirm={handleDeletePlan}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </div>
    </>
  );
};

export default MembershipPlans;
