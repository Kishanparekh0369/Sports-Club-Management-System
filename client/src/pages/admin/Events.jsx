import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  CalendarDays,
  Plus,
  Edit2,
  Trash2,
  Users,
  Download,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import FormTextarea from '../../components/forms/FormTextarea';
import { eventService } from '../../services/eventService';
import { sportService } from '../../services/sportService';
import { formatDate } from '../../utils/formatDate';
import { getErrorMessage } from '../../services/api';

const Events = () => {
  const { onToggleMobile } = useOutletContext();
  const [events, setEvents] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    description: '',
    sport: '',
    venue: '',
    eventDate: '',
    startTime: '09:00',
    endTime: '17:00',
    registrationDeadline: '',
    capacity: 32,
    prizePool: '$1,500 Trophy & Medals',
    registrationFee: 0,
    image: '',
    status: 'upcoming'
  });

  // Participants modal
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const [evtRes, sportRes] = await Promise.all([
        eventService.getEvents(),
        sportService.getSports()
      ]);
      setEvents(evtRes.events || []);
      setSports(sportRes.sports || []);
    } catch (err) {
      toast.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    const inTwoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const inOneWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    setFormData({
      _id: '',
      title: '',
      description: '',
      sport: sports[0]?._id || '',
      venue: 'Main Arena',
      eventDate: inTwoWeeks,
      startTime: '09:00',
      endTime: '17:00',
      registrationDeadline: inOneWeek,
      capacity: 32,
      prizePool: '$2,000 Trophy & Medals',
      registrationFee: 20,
      image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=900&q=80',
      status: 'upcoming'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (evt) => {
    setIsEditing(true);
    setFormData({
      _id: evt._id,
      title: evt.title,
      description: evt.description,
      sport: evt.sport?._id || evt.sport,
      venue: evt.venue,
      eventDate: evt.eventDate ? new Date(evt.eventDate).toISOString().split('T')[0] : '',
      startTime: evt.startTime || '09:00',
      endTime: evt.endTime || '17:00',
      registrationDeadline: evt.registrationDeadline
        ? new Date(evt.registrationDeadline).toISOString().split('T')[0]
        : '',
      capacity: evt.capacity,
      prizePool: evt.prizePool,
      registrationFee: evt.registrationFee || 0,
      image: evt.image,
      status: evt.status
    });
    setShowModal(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.sport || !formData.eventDate || !formData.registrationDeadline) {
      toast.warning('Please fill in title, sport, date, and deadline');
      return;
    }

    setModalLoading(true);
    try {
      if (isEditing) {
        await eventService.updateEvent(formData._id, formData);
        toast.success('Tournament details updated!');
      } else {
        await eventService.createEvent(formData);
        toast.success('Tournament created successfully!');
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewParticipants = async (evtId) => {
    try {
      const res = await eventService.getEventById(evtId);
      setActiveEvent(res.event);
      setShowParticipantsModal(true);
    } catch (err) {
      toast.error('Failed to load participants');
    }
  };

  const handleExportCSV = (evtId) => {
    eventService.exportParticipantsCSV(evtId);
    toast.info('Downloading participants CSV...');
  };

  const confirmDelete = (evt) => {
    setEventToDelete(evt);
    setShowDeleteDialog(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    setDeleteLoading(true);
    try {
      await eventService.deleteEvent(eventToDelete._id);
      toast.success('Event deleted successfully.');
      setShowDeleteDialog(false);
      fetchEvents();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Tournaments & Events" breadcrumb="Event Management" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h4 className="font-heading fw-bold text-navy mb-1">Club Tournaments ({events.length})</h4>
            <span className="text-muted small">Manage upcoming competitions, participant rosters, and results</span>
          </div>
          <Button variant="lime" icon={Plus} onClick={handleOpenAdd}>
            Create Tournament
          </Button>
        </div>

        {/* Events Table */}
        <div className="table-custom-wrapper">
          {loading ? (
            <Loader message="Loading events..." />
          ) : events.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No tournaments scheduled"
              actionText="Create First Tournament"
              onAction={handleOpenAdd}
            />
          ) : (
            <div className="table-responsive">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Tournament Title</th>
                    <th>Sport</th>
                    <th>Date & Time</th>
                    <th>Venue</th>
                    <th>Registrations</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((evt) => {
                    const activeParticipants = evt.participants
                      ? evt.participants.filter((p) => p.status !== 'cancelled')
                      : [];
                    return (
                      <tr key={evt._id}>
                        <td>
                          <div className="fw-bold text-navy">{evt.title}</div>
                          <div className="text-muted small">Prize: {evt.prizePool}</div>
                        </td>
                        <td>
                          <span className="badge bg-light text-navy border">
                            {evt.sport?.name || 'Sport'}
                          </span>
                        </td>
                        <td>
                          <div>{formatDate(evt.eventDate)}</div>
                          <div className="text-muted small">{evt.startTime} - {evt.endTime}</div>
                        </td>
                        <td className="text-muted">{evt.venue}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold text-navy">{activeParticipants.length}</span>
                            <span className="text-muted small">/ {evt.capacity}</span>
                          </div>
                        </td>
                        <td>
                          <StatusBadge status={evt.status} />
                        </td>
                        <td className="text-end">
                          <div className="d-inline-flex gap-1">
                            <button
                              className="btn btn-sm btn-outline-secondary p-1"
                              title="View Participants"
                              onClick={() => handleViewParticipants(evt._id)}
                            >
                              <Users size={16} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-success p-1"
                              title="Export CSV"
                              onClick={() => handleExportCSV(evt._id)}
                            >
                              <Download size={16} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-primary p-1"
                              title="Edit Tournament"
                              onClick={() => handleOpenEdit(evt)}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger p-1"
                              title="Delete Tournament"
                              onClick={() => confirmDelete(evt)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL 1: ADD / EDIT EVENT */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content card-custom border-0 p-3">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title font-heading fw-bold">
                    {isEditing ? `Edit Tournament: ${formData.title}` : 'Create New Tournament'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSaveEvent}>
                  <div className="modal-body py-3">
                    <FormInput
                      label="Tournament Title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />

                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormSelect
                          label="Sport Discipline"
                          name="sport"
                          required
                          value={formData.sport}
                          onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                          options={sports.map((s) => ({ label: s.name, value: s._id }))}
                        />
                      </div>
                      <div className="col-md-6">
                        <FormInput
                          label="Venue"
                          name="venue"
                          required
                          value={formData.venue}
                          onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-4">
                        <FormInput
                          label="Event Date"
                          name="eventDate"
                          type="date"
                          required
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <FormInput
                          label="Start Time"
                          name="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <FormInput
                          label="End Time"
                          name="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-4">
                        <FormInput
                          label="Registration Deadline"
                          name="registrationDeadline"
                          type="date"
                          required
                          value={formData.registrationDeadline}
                          onChange={(e) =>
                            setFormData({ ...formData, registrationDeadline: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <FormInput
                          label="Player Capacity"
                          name="capacity"
                          type="number"
                          required
                          value={formData.capacity}
                          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <FormSelect
                          label="Status"
                          name="status"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          options={[
                            { label: 'Upcoming', value: 'upcoming' },
                            { label: 'Ongoing', value: 'ongoing' },
                            { label: 'Completed', value: 'completed' },
                            { label: 'Cancelled', value: 'cancelled' }
                          ]}
                        />
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <FormInput
                          label="Prize Pool"
                          name="prizePool"
                          value={formData.prizePool}
                          onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <FormInput
                          label="Banner Image URL"
                          name="image"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                      </div>
                    </div>

                    <FormTextarea
                      label="Event Description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="modal-footer border-0 pt-0 gap-2">
                    <Button variant="outline-navy" size="sm" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="lime" size="sm" loading={modalLoading}>
                      {isEditing ? 'Save Changes' : 'Publish Tournament'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: PARTICIPANTS ROSTER */}
        {showParticipantsModal && activeEvent && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content card-custom border-0 p-3">
                <div className="modal-header border-0 pb-0">
                  <div>
                    <h5 className="modal-title font-heading fw-bold mb-1">
                      Participants: {activeEvent.title}
                    </h5>
                    <span className="text-muted small">
                      {activeEvent.participants?.length || 0} registered out of {activeEvent.capacity} capacity
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowParticipantsModal(false)}
                  ></button>
                </div>
                <div className="modal-body py-3">
                  <div className="d-flex justify-content-end mb-3">
                    <Button
                      variant="outline-navy"
                      size="sm"
                      icon={Download}
                      onClick={() => handleExportCSV(activeEvent._id)}
                    >
                      Export CSV Roster
                    </Button>
                  </div>

                  {activeEvent.participants?.length === 0 ? (
                    <EmptyState title="No registered participants yet" />
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-hover align-middle small">
                        <thead className="table-light">
                          <tr>
                            <th>Athlete</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Registered On</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeEvent.participants.map((p) => (
                            <tr key={p._id}>
                              <td className="fw-bold text-navy">{p.user?.name || 'Member'}</td>
                              <td className="text-muted">{p.user?.email || 'N/A'}</td>
                              <td className="text-muted">{p.user?.phone || 'N/A'}</td>
                              <td className="text-muted">{formatDate(p.registeredAt)}</td>
                              <td><StatusBadge status={p.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONFIRM DELETE */}
        <ConfirmDialog
          show={showDeleteDialog}
          title="Delete Tournament"
          message={`Are you sure you want to remove '${eventToDelete?.title}'? This will delete all participant registrations.`}
          confirmText="Delete Tournament"
          confirmVariant="orange"
          loading={deleteLoading}
          onConfirm={handleDeleteEvent}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </div>
    </>
  );
};

export default Events;
