import React, { useState, useEffect } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  CreditCard,
  CheckCircle,
  Clock,
  ShieldCheck,
  Sparkles,
  Receipt,
  QrCode,
  ArrowRight
} from 'lucide-react';
import MemberHeader from '../../components/layout/MemberHeader';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import { membershipService } from '../../services/membershipService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { getErrorMessage } from '../../services/api';

const Membership = () => {
  const { onToggleMobile } = useOutletContext();
  const location = useLocation();

  const [currentMembership, setCurrentMembership] = useState(null);
  const [plans, setPlans] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Checkout modal
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Demo)');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const fetchMembershipData = async () => {
    setLoading(true);
    try {
      const [memRes, plansRes] = await Promise.all([
        membershipService.getMyMembership(),
        membershipService.getPlans()
      ]);
      setCurrentMembership(memRes.currentMembership);
      setHistory(memRes.history || []);
      setPlans(plansRes.plans || []);

      // Check if planId was passed in query param
      const searchParams = new URLSearchParams(location.search);
      const planIdFromQuery = searchParams.get('selectedPlan');
      if (planIdFromQuery && plansRes.plans) {
        const found = plansRes.plans.find((p) => p._id === planIdFromQuery);
        if (found) {
          setSelectedPlan(found);
          setShowCheckoutModal(true);
        }
      }
    } catch (err) {
      toast.error('Failed to load membership details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembershipData();
  }, [location.search]);

  const handleStartCheckout = (plan) => {
    setSelectedPlan(plan);
    setReceiptData(null);
    setShowCheckoutModal(true);
  };

  const handleProcessDemoCheckout = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setCheckoutLoading(true);
    try {
      // Simulate realistic payment gateway processing delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const res = await membershipService.checkoutMembership({
        planId: selectedPlan._id,
        paymentMethod
      });

      toast.success(res.message || 'Membership activated successfully!');
      setReceiptData({
        membership: res.membership,
        payment: res.payment
      });
      // Refresh current membership
      fetchMembershipData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCheckoutLoading(false);
    }
  };

  let daysRemaining = 0;
  if (currentMembership?.endDate) {
    const diff = new Date(currentMembership.endDate) - new Date();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <>
      <MemberHeader title="Membership Pass" breadcrumb="My Subscription" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        {/* Active Membership Status Card */}
        <div className="card-custom p-4 bg-white mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <span className="text-muted small text-uppercase fw-bold letter-spacing-1">
                Current Subscription Status
              </span>
              <h3 className="font-heading fw-bold text-navy mb-1 mt-1">
                {currentMembership ? currentMembership.planName : 'No Active Membership'}
              </h3>
              <p className="text-muted small mb-0">
                {currentMembership ? (
                  <>
                    Valid from {formatDate(currentMembership.startDate)} until{' '}
                    <strong>{formatDate(currentMembership.endDate)}</strong> ({daysRemaining} days left)
                  </>
                ) : (
                  <>Choose a membership plan below to unlock full club amenities and court slots.</>
                )}
              </p>
            </div>

            <div>
              {currentMembership ? (
                <div className="text-md-end">
                  <span className="badge bg-success-subtle text-success py-2 px-3 fs-6 d-inline-flex align-items-center gap-1 mb-2">
                    <CheckCircle size={16} /> Tier Active
                  </span>
                  <div className="small text-muted font-monospace">
                    Ref: {currentMembership.paymentReference}
                  </div>
                </div>
              ) : (
                <span className="badge bg-warning-subtle text-warning py-2 px-3 fs-6">
                  Inactive / Unsubscribed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade / Choose Plans */}
        <div className="mb-4">
          <h4 className="font-heading fw-bold text-navy mb-1">
            {currentMembership ? 'Renew or Upgrade Plan' : 'Select Your Membership Plan'}
          </h4>
          <span className="text-muted small">
            Choose duration and perks. Checkout is processed safely via our demo payment gateway.
          </span>
        </div>

        <div className="row g-4 mb-5">
          {loading ? (
            <div className="col-12">
              <Loader message="Loading membership tiers..." />
            </div>
          ) : (
            plans.map((plan) => {
              const isCurrent = currentMembership?.plan?._id === plan._id;
              return (
                <div key={plan._id} className="col-lg-3 col-md-6">
                  <div className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
                    {plan.badge && <span className="pricing-badge">{plan.badge}</span>}
                    <h5 className="font-heading fw-bold text-navy mb-1">{plan.name}</h5>
                    <p className="text-muted small mb-0">{plan.tagline}</p>

                    <div className="pricing-price">
                      {formatCurrency(plan.price)}
                      <span className="fs-6"> / {plan.durationMonths} mo</span>
                    </div>

                    <ul className="pricing-features">
                      {plan.benefits.map((b, idx) => (
                        <li key={idx} className="pricing-feature-item">
                          <CheckCircle size={16} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={isCurrent ? 'outline-navy' : plan.isPopular ? 'lime' : 'navy'}
                      className="w-100 mt-auto"
                      onClick={() => handleStartCheckout(plan)}
                    >
                      {isCurrent ? 'Renew Current Plan' : `Choose ${plan.name}`}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Membership History */}
        <div className="card-custom p-4 bg-white">
          <h5 className="font-heading fw-bold text-navy mb-3">Subscription History</h5>
          {history.length === 0 ? (
            <p className="text-muted small mb-0">No past membership history logged.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle small mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Plan</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Amount Paid</th>
                    <th>Status</th>
                    <th>Reference Code</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h._id}>
                      <td className="fw-bold text-navy">{h.planName}</td>
                      <td>{formatDate(h.startDate)}</td>
                      <td>{formatDate(h.endDate)}</td>
                      <td className="fw-semibold text-navy">{formatCurrency(h.pricePaid)}</td>
                      <td><StatusBadge status={h.status} /></td>
                      <td className="font-monospace text-muted">{h.paymentReference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* DEMO CHECKOUT MODAL */}
        {showCheckoutModal && selectedPlan && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content card-custom border-0 p-4">
                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                  <h5 className="font-heading fw-bold text-navy mb-0">
                    {receiptData ? 'Subscription Activated!' : 'Demo Checkout & Activation'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCheckoutModal(false)}
                    disabled={checkoutLoading}
                  ></button>
                </div>

                {receiptData ? (
                  // Success Receipt View
                  <div>
                    <div className="text-center py-3">
                      <div className="bg-lime-subtle p-3 rounded-circle d-inline-flex mb-2">
                        <CheckCircle size={48} className="text-lime" />
                      </div>
                      <h4 className="font-heading fw-bold text-navy mb-1">Payment Verified</h4>
                      <p className="text-muted small">
                        Your {selectedPlan.name} membership has been activated!
                      </p>
                    </div>

                    <div className="p-3 bg-surface-subtle rounded-3 small mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Payment Ref:</span>
                        <span className="font-monospace fw-bold">{receiptData.payment.paymentReference}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Settled Amount:</span>
                        <span className="fw-bold text-navy">{formatCurrency(receiptData.payment.amount)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Method:</span>
                        <span>{receiptData.payment.paymentMethod}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Valid Until:</span>
                        <span className="fw-bold text-lime">{formatDate(receiptData.membership.endDate)}</span>
                      </div>
                    </div>

                    <Button
                      variant="lime"
                      className="w-100"
                      onClick={() => setShowCheckoutModal(false)}
                    >
                      Done & Return To Dashboard
                    </Button>
                  </div>
                ) : (
                  // Checkout Form
                  <form onSubmit={handleProcessDemoCheckout}>
                    <div className="p-3 bg-surface-subtle rounded-3 mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold text-navy">{selectedPlan.name}</span>
                        <span className="font-heading fs-5 fw-bold text-navy">
                          {formatCurrency(selectedPlan.price)}
                        </span>
                      </div>
                      <div className="text-muted small">
                        Duration: {selectedPlan.durationMonths} month(s) • VIP Court Privileges
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label-custom">Select Demo Payment Method</label>
                      <select
                        className="form-select-custom mb-3"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="Credit Card (Demo)">Credit Card (Demo Gateway)</option>
                        <option value="Debit Card (Demo)">Debit Card (Demo Gateway)</option>
                        <option value="UPI / QR (Demo)">UPI / QR Instant Pay (Demo)</option>
                        <option value="Net Banking (Demo)">Net Banking (Demo)</option>
                      </select>
                    </div>

                    <div className="alert alert-info py-2 px-3 small rounded-3 mb-4 d-flex align-items-center gap-2">
                      <ShieldCheck size={20} className="text-info flex-shrink-0" />
                      <span>
                        Demo sandbox environment: Real card details are <strong>never</strong> required or stored.
                      </span>
                    </div>

                    <Button
                      type="submit"
                      variant="lime"
                      className="w-100 py-3"
                      loading={checkoutLoading}
                    >
                      Pay & Activate {formatCurrency(selectedPlan.price)}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Membership;
