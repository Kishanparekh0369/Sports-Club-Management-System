import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Trophy, Plus, Edit2, Trash2, Search, Building2, Users } from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import SearchInput from '../../components/common/SearchInput';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import FormTextarea from '../../components/forms/FormTextarea';
import { sportService } from '../../services/sportService';
import { facilityService } from '../../services/facilityService';
import { coachService } from '../../services/coachService';
import { formatCurrency } from '../../utils/formatCurrency';
import { getErrorMessage } from '../../services/api';

const Sports = () => {
  const { onToggleMobile } = useOutletContext();
  const [sports, setSports] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Add / Edit Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    category: 'Outdoor',
    description: '',
    image: '',
    price: 30,
    capacity: 10,
    facilities: [],
    coaches: [],
    rules: '',
    amenities: '',
    status: 'active'
  });

  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sportToDelete, setSportToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchSports = async () => {
    setLoading(true);
    try {
      const [sportsRes, facRes, coachRes] = await Promise.all([
        sportService.getSports({ all: true, search, category: categoryFilter }),
        facilityService.getFacilities(),
        coachService.getCoaches()
      ]);
      setSports(sportsRes.sports || []);
      setFacilities(facRes.facilities || []);
      setCoaches(coachRes.coaches || []);
    } catch (err) {
      toast.error('Failed to load sports data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, [search, categoryFilter]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      _id: '',
      name: '',
      category: 'Outdoor',
      description: '',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=80',
      price: 30,
      capacity: 10,
      facilities: [],
      coaches: [],
      rules: 'Non-marking shoes required.\nRespect tournament equipment.',
      amenities: 'Showers\nLocker Access\nEquipment Rental',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (sport) => {
    setIsEditing(true);
    setFormData({
      _id: sport._id,
      name: sport.name,
      category: sport.category,
      description: sport.description,
      image: sport.image,
      price: sport.price,
      capacity: sport.capacity,
      facilities: sport.facilities ? sport.facilities.map((f) => f._id || f) : [],
      coaches: sport.coaches ? sport.coaches.map((c) => c._id || c) : [],
      rules: Array.isArray(sport.rules) ? sport.rules.join('\n') : '',
      amenities: Array.isArray(sport.amenities) ? sport.amenities.join('\n') : '',
      status: sport.status
    });
    setShowModal(true);
  };

  const handleSaveSport = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.image) {
      toast.warning('Please fill in name, description, and image URL');
      return;
    }

    setModalLoading(true);
    try {
      if (isEditing) {
        await sportService.updateSport(formData._id, formData);
        toast.success('Sport updated successfully!');
      } else {
        await sportService.createSport(formData);
        toast.success('Sport added to catalogue!');
      }
      setShowModal(false);
      fetchSports();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setModalLoading(false);
    }
  };

  const confirmDelete = (sport) => {
    setSportToDelete(sport);
    setShowDeleteDialog(true);
  };

  const handleDeleteSport = async () => {
    if (!sportToDelete) return;
    setDeleteLoading(true);
    try {
      await sportService.deleteSport(sportToDelete._id);
      toast.success('Sport deleted successfully.');
      setShowDeleteDialog(false);
      fetchSports();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Sports Catalogue" breadcrumb="Sports Management" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h4 className="font-heading fw-bold text-navy mb-1">Club Sports Catalogue ({sports.length})</h4>
            <span className="text-muted small">Configure sport disciplines, pricing, capacity, and coach linkages</span>
          </div>
          <Button variant="lime" icon={Plus} onClick={handleOpenAdd}>
            Add New Sport
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <SearchInput
                placeholder="Search sport by name..."
                value={search}
                onChange={(val) => setSearch(val)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select-custom"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Indoor">Indoor</option>
                <option value="Aquatic">Aquatic</option>
                <option value="Fitness">Fitness</option>
                <option value="Racket">Racket</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sports Table */}
        <div className="table-custom-wrapper">
          {loading ? (
            <Loader message="Loading sports..." />
          ) : sports.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="No sports found"
              actionText="Add First Sport"
              onAction={handleOpenAdd}
            />
          ) : (
            <div className="table-responsive">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Sport</th>
                    <th>Category</th>
                    <th>Slot Fee</th>
                    <th>Slot Capacity</th>
                    <th>Linked Venues</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sports.map((sport) => (
                    <tr key={sport._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={sport.image}
                            alt={sport.name}
                            className="rounded-3"
                            style={{ width: 44, height: 44, objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-bold text-navy">{sport.name}</div>
                            <div className="text-muted small line-clamp-1" style={{ maxWidth: 220 }}>
                              {sport.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-navy border">{sport.category}</span>
                      </td>
                      <td className="fw-bold text-navy">{formatCurrency(sport.price)}</td>
                      <td className="text-muted">{sport.capacity} players</td>
                      <td>
                        <div className="small text-muted">
                          {sport.facilities && sport.facilities.length > 0
                            ? sport.facilities.map((f) => f.name).join(', ')
                            : 'None assigned'}
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={sport.status} />
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary p-1"
                            title="Edit Sport"
                            onClick={() => handleOpenEdit(sport)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger p-1"
                            title="Delete Sport"
                            onClick={() => confirmDelete(sport)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL: ADD / EDIT SPORT */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content card-custom border-0 p-3">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title font-heading fw-bold">
                    {isEditing ? `Edit Sport: ${formData.name}` : 'Add New Sport'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleSaveSport}>
                  <div className="modal-body py-3">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormInput
                          label="Sport Name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <FormSelect
                          label="Category"
                          name="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          options={[
                            { label: 'Outdoor', value: 'Outdoor' },
                            { label: 'Indoor', value: 'Indoor' },
                            { label: 'Aquatic', value: 'Aquatic' },
                            { label: 'Fitness', value: 'Fitness' },
                            { label: 'Racket', value: 'Racket' }
                          ]}
                        />
                      </div>
                    </div>

                    <FormTextarea
                      label="Description"
                      name="description"
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormInput
                          label="Image URL"
                          name="image"
                          required
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                      </div>
                      <div className="col-md-3">
                        <FormInput
                          label="Price / Slot ($)"
                          name="price"
                          type="number"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                      </div>
                      <div className="col-md-3">
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

                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormTextarea
                          label="Court Rules (One per line)"
                          name="rules"
                          rows={3}
                          value={formData.rules}
                          onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <FormTextarea
                          label="Amenities Provided (One per line)"
                          name="amenities"
                          rows={3}
                          value={formData.amenities}
                          onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                        />
                      </div>
                    </div>

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
                  <div className="modal-footer border-0 pt-0 gap-2">
                    <Button variant="outline-navy" size="sm" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="lime" size="sm" loading={modalLoading}>
                      {isEditing ? 'Update Sport' : 'Create Sport'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* CONFIRM DELETE DIALOG */}
        <ConfirmDialog
          show={showDeleteDialog}
          title="Delete Sport"
          message={`Are you sure you want to delete '${sportToDelete?.name}'? This action cannot be undone if no active bookings exist.`}
          confirmText="Delete Sport"
          confirmVariant="orange"
          loading={deleteLoading}
          onConfirm={handleDeleteSport}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </div>
    </>
  );
};

export default Sports;
