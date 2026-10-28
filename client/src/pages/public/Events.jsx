import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Trophy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { eventService } from '../../services/eventService';
import { formatDate } from '../../utils/formatDate';
import { getErrorMessage } from '../../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [filter, setFilter] = useState('upcoming');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.getEvents({ status: filter });
      setEvents(res.events || []);
    } catch (err) {
      console.error('Failed to load tournaments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const handleRegister = async (event) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/events' } });
      return;
    }

    setRegisteringId(event._id);
    try {
      await eventService.registerEvent(event._id);
      toast.success(`Registered for ${event.title}!`);
      await fetchEvents();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <PublicNavbar />

      <main className="flex-grow-1">
        {/* Banner */}
        <section className="bg-navy text-white py-5 text-center">
          <div className="container py-3">
            <span className="text-orange fw-bold text-uppercase small">Competitions & Cups</span>
            <h1 className="hero-title mt-2 mb-2">Tournaments & League Events</h1>
            <p className="text-light fs-5 mx-auto" style={{ maxWidth: '640px' }}>
              Compete against top athletes, win coveted championship cups, and earn points on the club ranking leaderboard.
            </p>

            {/* Filter Tabs */}
            <div className="d-inline-flex gap-2 p-1 bg-navy-card rounded-pill border border-secondary mt-3">
              <button
                className={`btn btn-sm px-4 rounded-pill fw-bold ${
                  filter === 'upcoming' ? 'btn-athletic-lime' : 'text-light'
                }`}
                onClick={() => setFilter('upcoming')}
              >
                Upcoming Tournaments
              </button>
              <button
                className={`btn btn-sm px-4 rounded-pill fw-bold ${
                  filter === 'completed' ? 'btn-athletic-lime' : 'text-light'
                }`}
                onClick={() => setFilter('completed')}
              >
                Past Results
              </button>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
          <div className="container py-3">
            {loading ? (
              <Loader message="Loading tournaments..." />
            ) : events.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title={`No ${filter} events found`}
                description="Check back regularly as new seasonal tournaments are published by the administration."
              />
            ) : (
              <div className="row g-4">
                {events.map((evt) => {
                  const activeParticipants = evt.participants
                    ? evt.participants.filter((p) => p.status !== 'cancelled')
                    : [];
                  const seatsLeft = Math.max(0, evt.capacity - activeParticipants.length);
                  const isRegistered = user
                    ? activeParticipants.some((p) => (p.user?._id || p.user) === user._id)
                    : false;
                  const isDeadlinePassed = new Date() > new Date(evt.registrationDeadline);
                  const isFull = seatsLeft === 0;

                  return (
                    <div key={evt._id} className="col-lg-6">
                      <div className="card-custom h-100 overflow-hidden d-flex flex-column flex-md-row">
                        {/* Event Image */}
                        <div
                          className="flex-shrink-0"
                          style={{
                            width: '100%',
                            maxWidth: '260px',
                            minHeight: '220px',
                            position: 'relative'
                          }}
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
                          <span
                            className="position-absolute top-0 start-0 m-2 badge bg-navy text-lime px-2 py-1 small fw-bold"
                          >
                            {evt.sport?.name || 'Tournament'}
                          </span>
                        </div>

                        {/* Event Content */}
                        <div className="p-4 d-flex flex-column flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="badge bg-orange-subtle text-orange small fw-bold">
                              Prize: {evt.prizePool}
                            </span>
                            <span className="text-muted small">
                              {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left
                            </span>
                          </div>

                          <h5 className="font-heading fw-bold text-navy mb-2">{evt.title}</h5>
                          <p className="text-muted small line-clamp-2 mb-3">{evt.description}</p>

                          <div className="small text-muted d-flex flex-column gap-1 mb-4">
                            <div className="d-flex align-items-center gap-2">
                              <CalendarDays size={16} className="text-lime flex-shrink-0" />
                              <span>{formatDate(evt.eventDate)} ({evt.startTime} - {evt.endTime})</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <MapPin size={16} className="text-orange flex-shrink-0" />
                              <span>{evt.venue}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <Clock size={16} className="text-muted flex-shrink-0" />
                              <span>Registration Closes: {formatDate(evt.registrationDeadline)}</span>
                            </div>
                          </div>

                          <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                            {evt.status === 'completed' ? (
                              <span className="badge bg-secondary py-2 px-3">Tournament Concluded</span>
                            ) : isRegistered ? (
                              <span className="badge bg-success py-2 px-3 d-inline-flex align-items-center gap-1">
                                <CheckCircle size={14} /> You Are Registered
                              </span>
                            ) : isFull ? (
                              <span className="badge bg-danger py-2 px-3">Sold Out</span>
                            ) : isDeadlinePassed ? (
                              <span className="badge bg-warning text-dark py-2 px-3">Deadline Expired</span>
                            ) : (
                              <Button
                                variant="lime"
                                size="sm"
                                loading={registeringId === evt._id}
                                onClick={() => handleRegister(evt)}
                              >
                                {isAuthenticated ? 'Register Now' : 'Sign In To Register'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Events;
