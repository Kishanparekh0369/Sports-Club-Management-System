import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Trophy,
  CalendarDays,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react';
import MemberHeader from '../../components/layout/MemberHeader';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { eventService } from '../../services/eventService';
import { formatDate } from '../../utils/formatDate';
import { getErrorMessage } from '../../services/api';

const MemberEvents = () => {
  const { onToggleMobile } = useOutletContext();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.getEvents();
      setEvents(res.events || []);
    } catch (err) {
      toast.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    setActionLoadingId(eventId);
    try {
      await eventService.registerEvent(eventId);
      toast.success('Successfully registered for tournament!');
      fetchEvents();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    setActionLoadingId(eventId);
    try {
      await eventService.cancelEventRegistration(eventId);
      toast.info('Tournament registration cancelled.');
      fetchEvents();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <>
      <MemberHeader title="Club Tournaments" breadcrumb="Competitions" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="mb-4">
          <h4 className="font-heading fw-bold text-navy mb-1">Club Tournaments & Events ({events.length})</h4>
          <span className="text-muted small">
            Sign up for upcoming leagues, open championship cups, and state master meets
          </span>
        </div>

        {/* Tournament Cards */}
        <div className="row g-4">
          {loading ? (
            <div className="col-12">
              <Loader message="Loading tournament schedules..." />
            </div>
          ) : events.length === 0 ? (
            <div className="col-12">
              <EmptyState icon={Trophy} title="No tournaments currently scheduled" />
            </div>
          ) : (
            events.map((evt) => {
              const activeParticipants = evt.participants
                ? evt.participants.filter((p) => p.status !== 'cancelled')
                : [];
              const seatsLeft = Math.max(0, evt.capacity - activeParticipants.length);
              const isRegistered = activeParticipants.some(
                (p) => (p.user?._id || p.user) === user?._id
              );
              const isDeadlinePassed = new Date() > new Date(evt.registrationDeadline);
              const isFull = seatsLeft === 0;

              return (
                <div key={evt._id} className="col-lg-6">
                  <div className="card-custom h-100 overflow-hidden d-flex flex-column flex-md-row bg-white">
                    <div
                      className="flex-shrink-0"
                      style={{ width: '100%', maxWidth: '240px', minHeight: '220px', position: 'relative' }}
                    >
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <span className="position-absolute top-0 start-0 m-2 badge bg-navy text-lime small">
                        {evt.sport?.name}
                      </span>
                    </div>

                    <div className="p-3 d-flex flex-column flex-grow-1">
                      <div className="d-flex justify-content-between align-items-baseline mb-2">
                        <span className="badge bg-orange-subtle text-orange small fw-bold">
                          {evt.prizePool}
                        </span>
                        <span className="text-muted small">
                          {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left
                        </span>
                      </div>

                      <h5 className="font-heading fw-bold text-navy mb-1">{evt.title}</h5>
                      <p className="text-muted small line-clamp-2 mb-3">{evt.description}</p>

                      <div className="small text-muted d-flex flex-column gap-1 mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <CalendarDays size={15} className="text-lime" />
                          <span>{formatDate(evt.eventDate)} ({evt.startTime} - {evt.endTime})</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <MapPin size={15} className="text-orange" />
                          <span>{evt.venue}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Clock size={15} className="text-muted" />
                          <span>Deadline: {formatDate(evt.registrationDeadline)}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                        {isRegistered ? (
                          <div className="d-flex align-items-center justify-content-between w-100">
                            <span className="badge bg-success-subtle text-success py-2 px-3 small d-inline-flex align-items-center gap-1">
                              <CheckCircle size={14} /> Registered
                            </span>
                            <Button
                              variant="outline-navy"
                              size="sm"
                              loading={actionLoadingId === evt._id}
                              onClick={() => handleCancelRegistration(evt._id)}
                            >
                              Withdraw
                            </Button>
                          </div>
                        ) : isFull ? (
                          <span className="badge bg-danger py-2 px-3">Tournament Full</span>
                        ) : isDeadlinePassed ? (
                          <span className="badge bg-secondary py-2 px-3">Deadline Passed</span>
                        ) : (
                          <Button
                            variant="lime"
                            size="sm"
                            className="w-100"
                            loading={actionLoadingId === evt._id}
                            onClick={() => handleRegister(evt._id)}
                          >
                            Register In Bracket
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default MemberEvents;
