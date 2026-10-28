import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreditCard, Search, Calendar, ShieldCheck, User } from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import SearchInput from '../../components/common/SearchInput';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import { membershipService } from '../../services/membershipService';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const Memberships = () => {
  const { onToggleMobile } = useOutletContext();
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const res = await membershipService.getAllMemberships({ status: statusFilter });
      setMemberships(res.memberships || []);
    } catch (err) {
      toast.error('Failed to load memberships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, [statusFilter]);

  const filteredMemberships = memberships.filter((m) => {
    if (!search) return true;
    const nameMatch = m.user?.name?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = m.user?.email?.toLowerCase().includes(search.toLowerCase());
    const planMatch = m.planName?.toLowerCase().includes(search.toLowerCase());
    return nameMatch || emailMatch || planMatch;
  });

  return (
    <>
      <AdminHeader title="Active Subscriptions" breadcrumb="Memberships" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="mb-4">
          <h4 className="font-heading fw-bold text-navy mb-1">Member Subscriptions ({memberships.length})</h4>
          <span className="text-muted small">Monitor active, expiring, and historical club memberships</span>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <SearchInput
                placeholder="Search by member name, email, or plan..."
                value={search}
                onChange={(val) => setSearch(val)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select-custom"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="active">Active Memberships</option>
                <option value="expired">Expired Memberships</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Memberships Table */}
        <div className="table-custom-wrapper">
          {loading ? (
            <Loader message="Loading membership ledger..." />
          ) : filteredMemberships.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No subscriptions found"
              description="No membership records match the chosen search or status criteria."
            />
          ) : (
            <div className="table-responsive">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Plan Name</th>
                    <th>Duration</th>
                    <th>Start Date</th>
                    <th>Expiry Date</th>
                    <th>Price Paid</th>
                    <th>Status</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMemberships.map((m) => (
                    <tr key={m._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={
                              m.user?.avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'
                            }
                            alt=""
                            className="rounded-circle"
                            style={{ width: 34, height: 34, objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-bold text-navy">{m.user?.name || 'Member'}</div>
                            <div className="text-muted small">{m.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="fw-semibold text-navy">{m.planName}</span>
                      </td>
                      <td className="text-muted">
                        {m.plan?.durationMonths ? `${m.plan.durationMonths} Months` : 'N/A'}
                      </td>
                      <td className="text-muted">{formatDate(m.startDate)}</td>
                      <td>
                        <div className="fw-semibold text-navy">{formatDate(m.endDate)}</div>
                      </td>
                      <td className="fw-bold text-navy">{formatCurrency(m.pricePaid)}</td>
                      <td>
                        <StatusBadge status={m.status} />
                      </td>
                      <td className="small text-muted font-monospace">{m.paymentReference || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Memberships;
