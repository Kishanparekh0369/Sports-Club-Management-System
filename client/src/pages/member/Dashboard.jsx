import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  CalendarPlus,
  Trophy,
  CreditCard,
  BookmarkCheck,
  Bell,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import MemberHeader from '../../components/layout/MemberHeader';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { bookingService } from '../../services/bookingService';
import { membershipService } from '../../services/membershipService';
import { eventService } from '../../services/eventService';
import { paymentService } from '../../services/paymentService';
import { notificationService } from '../../services/notificationService';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const Dashboard = () => {
  const { onToggleMobile } = useOutletContext();
  const { user } = useAuth();

  const [membership, setMembership] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const [memRes, bookRes, evtRes, payRes, notifRes] = await Promise.all([
          membershipService.getMyMembership(),
          bookingService.getMyBookings(),
          eventService.getEvents({ status: 'upcoming' }),
          paymentService.getMyPayments(),
          notificationService.getNotifications()
        ]);

        setMembership(memRes.currentMembership);
        setUpcomingBookings(
          (bookRes.bookings || []).filter((b) => b.status === 'confirmed' || b.status === 'pending')
        );

        // Filter events where current member is in participants
        const myEvents = (evtRes.events || []).filter((evt) =>
          evt.participants?.some(
            (p) => (p.user?._id || p.user) === user?._id && p.status !== 'cancelled'
          )
        );
        setRegisteredEvents(myEvents);
        setRecentPayments(payRes.payments ? payRes.payments.slice(0, 3) : []);
        setUnreadNotifications(
          (notifRes.notifications || []).filter((n) => !n.isRead).slice(0, 3)
        );
      } catch (err) {
        console.error('Failed to load member dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [user]);

  if (loading) {
    return (
      <>
        <MemberHeader title="Athlete Portal" breadcrumb="Dashboard" onToggleMobile={onToggleMobile} />
        <Loader fullScreen message="Loading athlete profile and active sessions..." />
      </>
    );
  }

  // Calculate days remaining for active membership
  let daysRemaining = 0;
  if (membership?.endDate) {
    const diff = new Date(membership.endDate) - new Date();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <>
      <MemberHeader title="Athlete Dashboard" breadcrumb="Home" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        {/* Welcome Hero Banner */}
        <div className="member-welcome-banner">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <span className="member-badge-active mb-3">
                <CheckCircle size={14} /> ACTIVE ATHLETE PASS
              </span>
              <h2 className="hero-title mb-2 text-white" style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)' }}>
                Welcome back, {user?.name?.split(' ')[0]}!
              </h2>
              <p className="text-light mb-4" style={{ maxWidth: 560 }}>
                {membership ? (
                  <>
                    Your <strong>{membership.planName}</strong> is active with{' '}
                    <span className="text-lime fw-bold">{daysRemaining} days remaining</span>.
                    Enjoy court reservations and tournament participation.
                  </>
                ) : (
                  <>You do not have an active membership tier yet. Subscribe now to unlock discounted court slots and tournament entries.</>
                )}
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/member/book" className="btn-athletic btn-athletic-lime btn-athletic-sm">
                  <CalendarPlus size={16} /> Book Court Slot
                </Link>
                <Link to="/member/membership" className="btn-athletic btn-athletic-outline-light btn-athletic-sm">
                  <CreditCard size={16} /> {membership ? 'Upgrade Plan' : 'Get Membership'}
                </Link>
              </div>
            </div>

            <div className="col-lg-4 text-lg-end d-none d-lg-block">
              <div className="p-3 bg-navy rounded-3 border border-secondary text-center d-inline-block">
                <div className="text-muted small text-uppercase fw-bold">Current Tier</div>
                <div className="font-heading fs-4 fw-bold text-lime mt-1">
                  {membership?.planName || 'Free Pass'}
                </div>
                <div className="text-light small mt-1">
                  {membership ? `Valid until ${formatDate(membership.endDate)}` : 'No active tier'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4 col-sm-6">
            <Link to="/member/book" className="text-decoration-none">
              <div className="member-action-card">
                <div className="member-action-icon">
                  <CalendarPlus />
                </div>
                <h6 className="font-heading fw-bold text-navy mb-1">Reserve A Court</h6>
                <p className="text-muted small mb-0">Select sport discipline, date, and preferred time slot.</p>
              </div>
            </Link>
          </div>

          <div className="col-md-4 col-sm-6">
            <Link to="/member/events" className="text-decoration-none">
              <div className="member-action-card">
                <div className="member-action-icon" style={{ backgroundColor: 'rgba(249, 115, 22, 0.12)', color: '#f97316' }}>
                  <Trophy />
                </div>
                <h6 className="font-heading fw-bold text-navy mb-1">Upcoming Tournaments</h6>
                <p className="text-muted small mb-0">Browse championship cups and sign up your bracket.</p>
              </div>
            </Link>
          </div>

          <div className="col-md-4 col-sm-12">
            <Link to="/member/sports" className="text-decoration-none">
              <div className="member-action-card">
                <div className="member-action-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                  <BookmarkCheck />
                </div>
                <h6 className="font-heading fw-bold text-navy mb-1">Sports Catalogue</h6>
                <p className="text-muted small mb-0">Explore venues, coaches, and training schedules.</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Two Columns: Upcoming Bookings & Registered Tournaments */}
        <div className="row g-4 mb-4">
          {/* Upcoming Bookings */}
          <div className="col-lg-7">
            <div className="card-custom p-4 h-100 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="font-heading fw-bold text-navy mb-0">Your Upcoming Bookings</h5>
                <Link to="/member/my-bookings" className="small text-lime fw-semibold text-decoration-none">
                  View All ({upcomingBookings.length})
                </Link>
              </div>

              {upcomingBookings.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  No upcoming bookings. <Link to="/member/book" className="text-lime fw-bold">Book your next court slot</Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {upcomingBookings.slice(0, 4).map((b) => (
                    <div key={b._id} className="p-3 border rounded-3 bg-surface-subtle d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold text-navy">{b.sport?.name}</div>
                        <div className="text-muted small">{b.facility?.name} ({b.facility?.courtNumber})</div>
                        <div className="text-muted small">
                          <Clock size={13} className="me-1" />
                          {formatDate(b.date)} • {b.startTime} - {b.endTime}
                        </div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Registered Tournaments & Unread Notifications */}
          <div className="col-lg-5">
            <div className="card-custom p-4 h-100 bg-white d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="font-heading fw-bold text-navy mb-0">My Tournament Entries</h5>
                <Link to="/member/events" className="small text-orange fw-semibold text-decoration-none">
                  Browse All
                </Link>
              </div>

              {registeredEvents.length === 0 ? (
                <div className="text-center py-4 text-muted small mb-3">
                  Not registered for any upcoming tournaments yet.
                </div>
              ) : (
                <div className="d-flex flex-column gap-2 mb-3">
                  {registeredEvents.map((evt) => (
                    <div key={evt._id} className="p-3 border rounded-3 bg-surface-subtle">
                      <div className="fw-bold text-navy">{evt.title}</div>
                      <div className="text-muted small">{evt.venue} • {formatDate(evt.eventDate)}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Unread Alerts preview */}
              <div className="mt-auto pt-3 border-top">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-bold text-navy d-flex align-items-center gap-1">
                    <Bell size={14} className="text-lime" /> Unread Notifications
                  </span>
                  <Link to="/member/notifications" className="small text-muted text-decoration-none">
                    All
                  </Link>
                </div>
                {unreadNotifications.length === 0 ? (
                  <span className="text-muted small">All caught up! No unread messages.</span>
                ) : (
                  unreadNotifications.map((n) => (
                    <div key={n._id} className="small text-muted py-1 border-bottom">
                      <strong className="text-navy">{n.title}:</strong> {n.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
