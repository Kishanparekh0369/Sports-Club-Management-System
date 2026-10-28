import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BookmarkCheck, CalendarPlus, Clock, X, AlertCircle } from 'lucide-react';
import MemberHeader from '../../components/layout/MemberHeader';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import { bookingService } from '../../services/bookingService';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { getErrorMessage } from '../../services/api';

const MyBookings = () => {
  const { onToggleMobile } = useOutletContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Cancel dialog
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings({ status: statusFilter });
      setBookings(res.bookings || []);
    } catch (err) {
      toast.error('Failed to load your reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const confirmCancel = (booking) => {
    setBookingToCancel(booking);
    setShowCancelDialog(true);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    setCancelLoading(true);
    try {
      await bookingService.cancelBooking(bookingToCancel._id);
      toast.success('Your booking has been cancelled.');
      setShowCancelDialog(false);
      fetchBookings();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <>
      <MemberHeader title="My Reservations" breadcrumb="My Bookings" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h4 className="font-heading fw-bold text-navy mb-1">Your Court Reservations ({bookings.length})</h4>
            <span className="text-muted small">View active schedules, slot approvals, and cancellation history</span>
          </div>
          <Link to="/member/book" className="btn-athletic btn-athletic-lime btn-athletic-sm">
            <CalendarPlus size={16} /> New Reservation
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {['', 'confirmed', 'pending', 'cancelled', 'rejected'].map((st) => (
            <button
              key={st}
              className={`btn btn-sm px-3 rounded-pill fw-semibold ${
                statusFilter === st ? 'btn-athletic-navy' : 'btn-outline-secondary'
              }`}
              onClick={() => setStatusFilter(st)}
            >
              {st === '' ? 'All Bookings' : st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="row g-3">
          {loading ? (
            <div className="col-12">
              <Loader message="Loading your bookings..." />
            </div>
          ) : bookings.length === 0 ? (
            <div className="col-12">
              <EmptyState
                icon={BookmarkCheck}
                title="No bookings found"
                description="You don't have any reservations under the selected status."
                actionText="Book A Court Now"
                onAction={() => (window.location.href = '/member/book')}
              />
            </div>
          ) : (
            bookings.map((b) => {
              const isEligibleForCancel = b.status === 'confirmed' || b.status === 'pending';
              return (
                <div key={b._id} className="col-lg-6">
                  <div className="booking-card h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-light text-navy border fw-bold">
                          {b.sport?.name}
                        </span>
                        <StatusBadge status={b.status} />
                      </div>

                      <h5 className="font-heading fw-bold text-navy mb-1">
                        {b.facility?.name || 'Club Court'}
                      </h5>
                      <div className="text-muted small mb-3">
                        Court Code: <strong>{b.facility?.courtNumber || 'General Arena'}</strong>
                      </div>

                      <div className="p-3 bg-surface-subtle rounded-3 small text-muted d-flex flex-column gap-1 mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <Clock size={15} className="text-lime" />
                          <span>
                            <strong>Date & Time:</strong> {formatDate(b.date)} ({b.startTime} - {b.endTime})
                          </span>
                        </div>
                        {b.notes && (
                          <div className="text-muted small mt-1">
                            <strong>Note:</strong> {b.notes}
                          </div>
                        )}
                        {b.rejectionReason && (
                          <div className="text-danger small mt-1">
                            <strong>Admin Note:</strong> {b.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <span className="small text-muted">
                        Fee: <strong>{formatCurrency(b.price)}</strong>
                      </span>
                      {isEligibleForCancel && (
                        <button
                          className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                          onClick={() => confirmCancel(b)}
                        >
                          <X size={14} /> Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* CANCEL CONFIRMATION DIALOG */}
        <ConfirmDialog
          show={showCancelDialog}
          title="Cancel Reservation"
          message={`Are you sure you want to cancel your session at '${bookingToCancel?.facility?.name}' on ${formatDate(bookingToCancel?.date)}?`}
          confirmText="Yes, Cancel Booking"
          confirmVariant="orange"
          loading={cancelLoading}
          onConfirm={handleCancelBooking}
          onCancel={() => setShowCancelDialog(false)}
        />
      </div>
    </>
  );
};

export default MyBookings;
