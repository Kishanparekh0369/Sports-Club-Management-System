import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Building2, Plus, Edit2, Trash2, Wrench, CheckCircle } from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import FormTextarea from '../../components/forms/FormTextarea';
import { facilityService } from '../../services/facilityService';
import { sportService } from '../../services/sportService';
import { getErrorMessage } from '../../services/api';

const Facilities = () => {
  const { onToggleMobile } = useOutletContext();
  const [facilities, setFacilities] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    description: '',
    sport: '',
    sportName: 'General',
    capacity: 20,
    courtNumber: 'Court 1',
    openingHours: { start: '06:00', end: '22:00' },
    availabilityStatus: 'available',
    status: 'active'
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const [facRes, sportRes] = await Promise.all([
        facilityService.getFacilities({ all: true }),
        sportService.getSports()
      ]);
      setFacilities(facRes.facilities || []);
      setSports(sportRes.sports || []);
    } catch (err) {
      toast.error('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      _id: '',
      name: '',
      description: 'Professional court with tournament-grade surface and lighting.',
      sport: sports[0]?._id || '',
      sportName: sports[0]?.name || 'General',
      capacity: 15,
      courtNumber: 'Court 1',
      openingHours: { start: '06:00', end: '22:00' },
      availabilityStatus: 'available',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (fac) => {
    setIsEditing(true);
    setFormData({
      _id: fac._id,
      name: fac.name,
      description: fac.description,
      sport: fac.sport?._id || fac.sport || '',
      sportName: fac.sportName || 'General',
      capacity: fac.capacity,
      courtNumber: fac.courtNumber,
      openingHours: fac.openingHours || { start: '06:00', end: '22:00' },
      availabilityStatus: fac.availabilityStatus || 'available',
      status: fac.status
    });
    setShowModal(true);
  };

  const handleSaveFacility = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.courtNumber) {
      toast.warning('Please enter facility name and court number');
      return;
    }

    setModalLoading(true);
    try {
      if (isEditing) {
        await facilityService.updateFacility(formData._id, formData);
        toast.success('Facility updated successfully!');
      } else {
        await facilityService.createFacility(formData);
        toast.success('Facility added successfully!');
      }
      setShowModal(false);
      fetchFacilities();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setModalLoading(false);
    }
  };

  const confirmDelete = (fac) => {
    setFacilityToDelete(fac);
    setShowDeleteDialog(true);
  };

  const handleDeleteFacility = async () => {
    if (!facilityToDelete) return;
    setDeleteLoading(true);
    try {
      await facilityService.deleteFacility(facilityToDelete._id);
      toast.success('Facility deleted.');
      setShowDeleteDialog(false);
      fetchFacilities();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Facilities & Venues" breadcrumb="Venues" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h4 className="font-heading fw-bold text-navy mb-1">Club Venues & Courts ({facilities.length})</h4>
            <span className="text-muted small">Configure physical grounds, court numbers, capacity, and maintenance schedules</span>
          </div>
          <Button variant="lime" icon={Plus} onClick={handleOpenAdd}>
            Add Facility / Court
          </Button>
        </div>

        {/* Facilities Grid */}
        <div className="row g-4">
          {loading ? (
            <div className="col-12">
              <Loader message="Loading facility list..." />
            </div>
          ) : facilities.length === 0 ? (
            <div className="col-12">
              <EmptyState
                icon={Building2}
                title="No facilities created"
                actionText="Add Venue"
                onAction={handleOpenAdd}
              />
            </div>
          ) : (
            facilities.map((fac) => (
              <div key={fac._id} className="col-lg-4 col-md-6">
                <div className="card-custom h-100 p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-light text-navy border font-monospace small">
                      {fac.courtNumber}
                    </span>
                    <StatusBadge status={fac.availabilityStatus} />
                  </div>

                  <h5 className="font-heading fw-bold text-navy mb-1">{fac.name}</h5>
                  <div className="text-lime fw-semibold small mb-3">
                    Sport: {fac.sport?.name || fac.sportName || 'General Arena'}
                  </div>

                  <p className="text-muted small mb-3 flex-grow-1">{fac.description}</p>

                  <div className="small text-muted d-flex flex-column gap-1 mb-3 pt-2 border-top">
                    <div>
                      <strong>Capacity:</strong> {fac.capacity} players
                    </div>
                    <div>
                      <strong>Hours:</strong> {fac.openingHours?.start} – {fac.openingHours?.end}
                    </div>
                  </div>

                  <div className="mt-auto pt-2 border-top d-flex justify-content-end gap-1">
                    <button
                      className="btn btn-sm btn-outline-primary p-1"
                      title="Edit Facility"
                      onClick={() => handleOpenEdit(fac)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger p-1"
                      title="Delete Facility"
                      onClick={() => confirmDelete(fac)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL: ADD / EDIT FACILITY */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content card-custom border-0 p-3">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title font-heading fw-bold">
                    {isEditing ? `Edit Facility: ${formData.name}` : 'Add Facility / Court'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSaveFacility}>
                  <div className="modal-body py-3">
                    <FormInput
                      label="Facility Name"
                      name="name"
                      required
                      placeholder="e.g. Centre Court"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <div className="row g-2">
                      <div className="col-6">
                        <FormInput
                          label="Court / Area Code"
                          name="courtNumber"
                          required
                          placeholder="Court 1 / Deck A"
                          value={formData.courtNumber}
                          onChange={(e) => setFormData({ ...formData, courtNumber: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <FormInput
                          label="Capacity"
                          name="capacity"
                          type="number"
                          required
                          value={formData.capacity}
                          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        />
                      </div>
                    </div>

                    <FormSelect
                      label="Linked Sport"
                      name="sport"
                      value={formData.sport}
                      onChange={(e) => {
                        const sId = e.target.value;
                        const sObj = sports.find((s) => s._id === sId);
                        setFormData({
                          ...formData,
                          sport: sId,
                          sportName: sObj ? sObj.name : 'General'
                        });
                      }}
                      options={sports.map((s) => ({ label: s.name, value: s._id }))}
                    />

                    <div className="row g-2">
                      <div className="col-6">
                        <FormSelect
                          label="Availability Status"
                          name="availabilityStatus"
                          value={formData.availabilityStatus}
                          onChange={(e) =>
                            setFormData({ ...formData, availabilityStatus: e.target.value })
                          }
                          options={[
                            { label: 'Available', value: 'available' },
                            { label: 'Under Maintenance', value: 'maintenance' },
                            { label: 'Reserved', value: 'reserved' }
                          ]}
                        />
                      </div>
                      <div className="col-6">
                        <FormSelect
                          label="General Status"
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
                      label="Description"
                      name="description"
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="modal-footer border-0 pt-0 gap-2">
                    <Button variant="outline-navy" size="sm" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="lime" size="sm" loading={modalLoading}>
                      {isEditing ? 'Save Changes' : 'Create Facility'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* DELETE DIALOG */}
        <ConfirmDialog
          show={showDeleteDialog}
          title="Delete Facility"
          message={`Are you sure you want to delete '${facilityToDelete?.name}'? This will succeed only if no active bookings exist.`}
          confirmText="Delete Facility"
          confirmVariant="orange"
          loading={deleteLoading}
          onConfirm={handleDeleteFacility}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </div>
    </>
  );
};

export default Facilities;
