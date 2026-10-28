import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Megaphone, Plus, Edit2, Trash2, Eye, EyeOff, Radio } from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import FormTextarea from '../../components/forms/FormTextarea';
import { announcementService } from '../../services/announcementService';
import { formatDate } from '../../utils/formatDate';
import { getErrorMessage } from '../../services/api';

const Announcements = () => {
  const { onToggleMobile } = useOutletContext();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    message: '',
    audience: 'all',
    priority: 'medium',
    status: 'published',
    expiresAt: ''
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementService.getAnnouncements();
      setAnnouncements(res.announcements || []);
    } catch (err) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      _id: '',
      title: '',
      message: '',
      audience: 'all',
      priority: 'medium',
      status: 'published',
      expiresAt: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (announcement) => {
    setIsEditing(true);
    setFormData({
      _id: announcement._id,
      title: announcement.title,
      message: announcement.message,
      audience: announcement.audience,
      priority: announcement.priority,
      status: announcement.status,
      expiresAt: announcement.expiresAt
        ? new Date(announcement.expiresAt).toISOString().split('T')[0]
        : ''
    });
    setShowModal(true);
  };

  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.warning('Please enter announcement title and message');
      return;
    }

    setModalLoading(true);
    try {
      if (isEditing) {
        await announcementService.updateAnnouncement(formData._id, formData);
        toast.success('Announcement updated!');
      } else {
        await announcementService.createAnnouncement(formData);
        toast.success('Announcement broadcast published!');
      }
      setShowModal(false);
      fetchAnnouncements();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setModalLoading(false);
    }
  };

  const confirmDelete = (announcement) => {
    setItemToDelete(announcement);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      await announcementService.deleteAnnouncement(itemToDelete._id);
      toast.success('Announcement deleted.');
      setShowDeleteDialog(false);
      fetchAnnouncements();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Club Announcements" breadcrumb="Broadcasts" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h4 className="font-heading fw-bold text-navy mb-1">Club Bulletins & Broadcasts ({announcements.length})</h4>
            <span className="text-muted small">Publish official club notices, maintenance alerts, and tournament news</span>
          </div>
          <Button variant="lime" icon={Plus} onClick={handleOpenAdd}>
            Create Announcement
          </Button>
        </div>

        {/* Announcements List */}
        <div className="row g-4">
          {loading ? (
            <div className="col-12">
              <Loader message="Loading announcements..." />
            </div>
          ) : announcements.length === 0 ? (
            <div className="col-12">
              <EmptyState
                icon={Megaphone}
                title="No announcements published"
                actionText="Create Notice"
                onAction={handleOpenAdd}
              />
            </div>
          ) : (
            announcements.map((item) => (
              <div key={item._id} className="col-lg-6">
                <div className="card-custom h-100 p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex gap-2">
                      <span className={`badge ${item.priority === 'high' ? 'bg-danger' : item.priority === 'medium' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                        {item.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className="badge bg-light text-navy border text-capitalize">
                        Audience: {item.audience}
                      </span>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <h5 className="font-heading fw-bold text-navy mb-2">{item.title}</h5>
                  <p className="text-muted small line-clamp-3 mb-3 flex-grow-1">{item.message}</p>

                  <div className="d-flex justify-content-between align-items-center pt-3 border-top small text-muted">
                    <span>Published: {formatDate(item.createdAt)}</span>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary p-1"
                        title="Edit Bulletin"
                        onClick={() => handleOpenEdit(item)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger p-1"
                        title="Delete Bulletin"
                        onClick={() => confirmDelete(item)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL: CREATE / EDIT ANNOUNCEMENT */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content card-custom border-0 p-3">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title font-heading fw-bold">
                    {isEditing ? 'Edit Announcement' : 'New Broadcast Bulletin'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSaveAnnouncement}>
                  <div className="modal-body py-3">
                    <FormInput
                      label="Announcement Title"
                      name="title"
                      required
                      placeholder="e.g. Olympic Pool Maintenance Window"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />

                    <div className="row g-2">
                      <div className="col-6">
                        <FormSelect
                          label="Target Audience"
                          name="audience"
                          value={formData.audience}
                          onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                          options={[
                            { label: 'All Users', value: 'all' },
                            { label: 'Members Only', value: 'members' },
                            { label: 'Coaches Only', value: 'coaches' }
                          ]}
                        />
                      </div>
                      <div className="col-6">
                        <FormSelect
                          label="Priority Level"
                          name="priority"
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          options={[
                            { label: 'High', value: 'high' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'Low', value: 'low' }
                          ]}
                        />
                      </div>
                    </div>

                    <FormTextarea
                      label="Bulletin Message Content"
                      name="message"
                      required
                      rows={4}
                      placeholder="Write your club announcement message..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />

                    <div className="row g-2">
                      <div className="col-6">
                        <FormSelect
                          label="Publish Status"
                          name="status"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          options={[
                            { label: 'Published', value: 'published' },
                            { label: 'Draft', value: 'draft' },
                            { label: 'Archived', value: 'archived' }
                          ]}
                        />
                      </div>
                      <div className="col-6">
                        <FormInput
                          label="Expiry Date (Optional)"
                          name="expiresAt"
                          type="date"
                          value={formData.expiresAt}
                          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0 pt-0 gap-2">
                    <Button variant="outline-navy" size="sm" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="lime" size="sm" loading={modalLoading}>
                      {isEditing ? 'Update Notice' : 'Broadcast Now'}
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
          title="Delete Announcement"
          message={`Are you sure you want to delete '${itemToDelete?.title}'?`}
          confirmText="Delete Bulletin"
          confirmVariant="orange"
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </div>
    </>
  );
};

export default Announcements;
