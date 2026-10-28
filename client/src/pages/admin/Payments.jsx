import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  CreditCard,
  Search,
  Receipt,
  Eye,
  FileCheck,
  CheckCircle,
  XCircle,
  ShieldCheck
} from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import SearchInput from '../../components/common/SearchInput';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import { paymentService } from '../../services/paymentService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';

const Payments = () => {
  const { onToggleMobile } = useOutletContext();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Receipt modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        type: typeFilter,
        status: statusFilter,
        search
      };
      const res = await paymentService.getAllPayments(params);
      setPayments(res.payments || []);
      setTotalPages(res.totalPages || 1);
      setTotalRevenue(res.totalRevenue || 0);
    } catch (err) {
      toast.error('Failed to load payment transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, typeFilter, statusFilter, search]);

  const openReceipt = (payment) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  return (
    <>
      <AdminHeader title="Payment Ledger" breadcrumb="Transactions" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        {/* Header strip with total revenue */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h4 className="font-heading fw-bold text-navy mb-1">Financial Ledger & Receipts</h4>
            <span className="text-muted small">
              Audited demo-payment records with encrypted transaction IDs
            </span>
          </div>

          <div className="card-custom py-2 px-4 bg-white border d-flex align-items-center gap-3">
            <span className="text-muted small text-uppercase fw-bold">Total Revenue:</span>
            <span className="font-heading fs-4 fw-bold text-navy">
              {formatCurrency(totalRevenue)}
            </span>
            <span className="badge bg-success-subtle text-success small">Verified</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <SearchInput
                placeholder="Search reference code..."
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  setPage(1);
                }}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select-custom"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Types</option>
                <option value="membership">Membership Subscriptions</option>
                <option value="booking">Court Bookings</option>
                <option value="event">Tournament Entries</option>
              </select>
            </div>

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
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="table-custom-wrapper">
          {loading ? (
            <Loader message="Loading payments..." />
          ) : payments.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No transactions logged"
              description="No payment records match your filters."
            />
          ) : (
            <div className="table-responsive">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Payment Reference</th>
                    <th>Member</th>
                    <th>Type / Description</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th className="text-end">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <span className="font-monospace small fw-bold text-navy">
                          {p.paymentReference}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold text-navy">{p.member?.name || 'Member'}</div>
                        <div className="text-muted small">{p.member?.email}</div>
                      </td>
                      <td>
                        <div className="fw-semibold text-navy text-capitalize">{p.type}</div>
                        <div className="text-muted small">{p.description}</div>
                      </td>
                      <td>
                        <span className="badge bg-light text-navy border">{p.paymentMethod}</span>
                      </td>
                      <td className="fw-bold text-navy fs-6">
                        {formatCurrency(p.amount, p.currency)}
                      </td>
                      <td className="text-muted small">{formatDateTime(p.date)}</td>
                      <td>
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-secondary p-1"
                          title="View Digital Receipt"
                          onClick={() => openReceipt(p)}
                        >
                          <Eye size={16} />
                        </button>
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

        {/* RECEIPT PREVIEW MODAL */}
        {showReceiptModal && selectedPayment && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content card-custom border-0 p-4">
                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                  <div>
                    <h5 className="font-heading fw-bold text-navy mb-0">Official Digital Receipt</h5>
                    <span className="text-muted small font-monospace">
                      {selectedPayment.paymentReference}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowReceiptModal(false)}
                  ></button>
                </div>

                <div className="d-flex flex-column gap-2 mb-4 small">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Member Name:</span>
                    <span className="fw-bold text-navy">{selectedPayment.member?.name}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Member Email:</span>
                    <span className="text-navy">{selectedPayment.member?.email}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Payment Category:</span>
                    <span className="fw-bold text-capitalize text-lime">{selectedPayment.type}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Payment Method:</span>
                    <span className="text-navy">{selectedPayment.paymentMethod}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Timestamp:</span>
                    <span className="text-navy">{formatDateTime(selectedPayment.date)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Transaction Type:</span>
                    <span className="badge bg-secondary-subtle text-secondary">Verified Demo Gateway</span>
                  </div>
                </div>

                <div className="p-3 bg-surface-subtle rounded-3 text-center mb-4">
                  <div className="text-muted small">Total Settled</div>
                  <div className="font-heading fs-2 fw-bold text-navy">
                    {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                  </div>
                  <StatusBadge status={selectedPayment.status} />
                </div>

                <Button
                  variant="outline-navy"
                  size="sm"
                  className="w-100"
                  onClick={() => setShowReceiptModal(false)}
                >
                  Close Receipt
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Payments;
