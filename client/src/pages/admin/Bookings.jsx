import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  BookmarkCheck,
  Search,
  Check,
  X,
  AlertTriangle,
  Calendar,
  Eye
} from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import SearchInput from '../../components/common/SearchInput';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import FormTextarea from '../../components/forms/FormTextarea';
import { bookingService } from '../../services/bookingService';
import { sportService } from '../../services/sportService';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { getErrorMessage } from '../../services/api';

const Bookings = () => {
  const { onToggleMobile } = useOutletContext();
  const [bookings, setBookings] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Rejection modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [bookingToReject, setBookingToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        status: statusFilter,
        sport: sportFilter,
        date: dateFilter
      };
      const res = await bookingService.getAllBookings(params);
      setBookings(res.bookings || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSportsList = async () => {
      try {
        const res = await sportService.getSports();
        setSports(res.sports || []);
      } catch {
        // Silently catch
      }
    };
    fetchSportsList();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter, sportFilter, dateFilter]);

  const handleApprove = async (id) => {
    try {
      await bookingService.updateBookingStatus(id, 'confirmed');
      toast.success('Booking has been approved!');
      fetchBookings();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const openRejectModal = (booking) => {
    setBookingToReject(booking);
    setRejectionReason('Facility unavailable due to maintenance / schedule conflict.');
    setShowRejectModal(true);
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!bookingToReject) return;
    setActionLoading(true);
    try {
      await bookingService.updateBookingStatus(bookingToReject._id, 'rejected', rejectionReason);
      toast.info('Booking rejected and member notified.');
      setShowRejectModal(false);
      fetchBookings();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Booking Management" breadcrumb="Court Reservations" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="mb-4">
          <h4 className="font-heading fw-bold text-navy mb-1">Facility Booking Schedule</h4>
          <span className="text-muted small">Monitor real-time court allocations, approve pending slots, and prevent double-booking</span>
        </div>

        {/* Filter Controls */}
        <div className="filter-bar">
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <select
                className="form-select-custom"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending Approval</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select-custom"
                value={sportFilter}
                onChange={(e) => {
                  setSportFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Sports</option>
                {sports.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <input
                type="date"
                className="form-control-custom"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="col-md-3 text-md-end">
              {(statusFilter || sportFilter || dateFilter) && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    setStatusFilter('');
                    setSportFilter('');
                    setDateFilter('');
                    setPage(1);
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="table-custom-wrapper">
          {loading ? (
            <Loader message="Loading reservations..." />
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={BookmarkCheck}
              title="No bookings found"
              description="No reservation requests match the selected parameters."
            />
          ) : (
            <div className="table-responsive">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Sport</th>
                    <th>Facility & Court</th>
                    <th>Date & Time</th>
                    <th>Fee</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <div className="fw-bold text-navy">{b.member?.name || 'Member'}</div>
                        <div className="text-muted small">{b.member?.email}</div>
                      </td>
                      <td>
                        <span className="badge bg-light text-navy border">
                          {b.sport?.name}
                        </span>
                      </td>
                      <td>
                        <div className="fw-semibold text-navy">{b.facility?.name}</div>
                        <div className="text-muted small">{b.facility?.courtNumber}</div>
                      </td>
                      <td>
                        <div>{formatDate(b.date)}</div>
                        <div className="text-muted small">
                          {b.startTime} - {b.endTime}
                        </div>
                      </td>
                      <td className="fw-bold text-navy">{formatCurrency(b.price)}</td>
                      <td>
                        <StatusBadge status={b.status} />
                        {b.rejectionReason && (
                          <div className="text-danger small mt-1 font-monospace" style={{ fontSize: '0.72rem' }}>
                            Reason: {b.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          {b.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-sm btn-success p-1"
                                title="Approve Booking"
                                onClick={() => handleApprove(b._id)}
                              >
                                <Check size={16} />
                              </button>
                              <button
                                className="btn btn-sm btn-danger p-1"
                                title="Reject Booking"
                                onClick={() => openRejectModal(b)}
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                          {b.status === 'confirmed' && (
                            <button
                              className="btn btn-sm btn-outline-danger p-1"
                              title="Reject / Cancel Reservation"
                              onClick={() => openRejectModal(b)}
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />

        {/* MODAL: REJECT BOOKING REASON */}
        {showRejectModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content card-custom border-0 p-3">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title font-heading fw-bold text-danger">Reject Booking</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowRejectModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleConfirmReject}>
                  <div className="modal-body py-3">
                    <p className="text-muted small mb-3">
                      Please enter a rejection reason. This message will be sent to the member's notification center.
                    </p>
                    <FormTextarea
                      label="Rejection Reason"
                      name="rejectionReason"
                      required
                      rows={3}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                  <div className="modal-footer border-0 pt-0 gap-2">
                    <Button variant="outline-navy" size="sm" onClick={() => setShowRejectModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="orange" size="sm" loading={actionLoading}>
                      Confirm Rejection
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Bookings;
