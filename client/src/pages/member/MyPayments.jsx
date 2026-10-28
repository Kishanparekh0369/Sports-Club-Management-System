import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Receipt, Eye, ShieldCheck, CreditCard } from 'lucide-react';
import MemberHeader from '../../components/layout/MemberHeader';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { paymentService } from '../../services/paymentService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';

const MyPayments = () => {
  const { onToggleMobile } = useOutletContext();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await paymentService.getMyPayments();
        setPayments(res.payments || []);
      } catch (err) {
        toast.error('Failed to load your payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <>
      <MemberHeader title="Payment History" breadcrumb="Billing & Invoices" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="mb-4">
          <h4 className="font-heading fw-bold text-navy mb-1">Billing & Payment Transactions</h4>
          <span className="text-muted small">
            Review completed demo receipts for membership passes and tournament entries
          </span>
        </div>

        {/* Payments Table */}
        <div className="table-custom-wrapper">
          {loading ? (
            <Loader message="Loading transactions..." />
          ) : payments.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No payment records found"
              description="You have not made any payments or subscription purchases yet."
            />
          ) : (
            <div className="table-responsive">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Reference Code</th>
                    <th>Description</th>
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
                        <div className="fw-semibold text-navy">{p.description}</div>
                        <div className="text-muted small text-capitalize">{p.type}</div>
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
                          title="View Receipt"
                          onClick={() => setSelectedReceipt(p)}
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

        {/* RECEIPT MODAL */}
        {selectedReceipt && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content card-custom border-0 p-4">
                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                  <div>
                    <h5 className="font-heading fw-bold text-navy mb-0">Member Receipt</h5>
                    <span className="text-muted small font-monospace">
                      {selectedReceipt.paymentReference}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedReceipt(null)}
                  ></button>
                </div>

                <div className="d-flex flex-column gap-2 mb-4 small">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Item / Description:</span>
                    <span className="fw-bold text-navy">{selectedReceipt.description}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Payment Category:</span>
                    <span className="text-capitalize">{selectedReceipt.type}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Gateway Method:</span>
                    <span>{selectedReceipt.paymentMethod}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Timestamp:</span>
                    <span>{formatDateTime(selectedReceipt.date)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Gateway Type:</span>
                    <span className="badge bg-secondary-subtle text-secondary">Verified Demo Sandbox</span>
                  </div>
                </div>

                <div className="p-3 bg-surface-subtle rounded-3 text-center mb-4">
                  <div className="text-muted small">Amount Charged</div>
                  <div className="font-heading fs-2 fw-bold text-navy">
                    {formatCurrency(selectedReceipt.amount, selectedReceipt.currency)}
                  </div>
                  <StatusBadge status={selectedReceipt.status} />
                </div>

                <Button
                  variant="outline-navy"
                  size="sm"
                  className="w-100"
                  onClick={() => setSelectedReceipt(null)}
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

export default MyPayments;
