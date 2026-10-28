import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Users,
  Trophy,
  UserCheck,
  CalendarDays,
  BookmarkCheck,
  CreditCard,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend
} from 'recharts';
import AdminHeader from '../../components/layout/AdminHeader';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import { reportService } from '../../services/reportService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#94a3b8'];

const Dashboard = () => {
  const { onToggleMobile } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await reportService.getDashboardStats();
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <AdminHeader title="Executive Overview" breadcrumb="Dashboard" onToggleMobile={onToggleMobile} />
        <Loader fullScreen message="Loading club performance metrics..." />
      </>
    );
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};
  const recent = data?.recent || {};

  return (
    <>
      <AdminHeader
        title="Admin Control Center"
        breadcrumb="Analytics & Live Operations"
        onToggleMobile={onToggleMobile}
      />

      <div className="dashboard-content">
        {/* Quick Actions Bar */}
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
          <div>
            <h4 className="font-heading fw-bold text-navy mb-1">Club Operational Health</h4>
            <span className="text-muted small">Real-time database metrics as of today</span>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <Link to="/admin/members" className="btn btn-sm btn-athletic-lime">
              <PlusCircle size={16} /> New Member
            </Link>
            <Link to="/admin/bookings" className="btn btn-sm btn-athletic-navy">
              <BookmarkCheck size={16} /> Manage Bookings
            </Link>
            <Link to="/admin/reports" className="btn btn-sm btn-outline-secondary">
              <FileText size={16} /> Export Reports
            </Link>
          </div>
        </div>

        {/* 6 Key Stat Cards */}
        <div className="row g-3 mb-4">
          <div className="col-xl-2 col-md-4 col-6">
            <div className="stat-card">
              <div>
                <div className="stat-label">Total Members</div>
                <div className="stat-value">{stats.totalMembers ?? 0}</div>
                <span className="text-success small fw-semibold">
                  {stats.activeMembers ?? 0} Active
                </span>
              </div>
              <div className="stat-icon bg-blue-subtle text-primary">
                <Users size={22} />
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-md-4 col-6">
            <div className="stat-card">
              <div>
                <div className="stat-label">Total Sports</div>
                <div className="stat-value">{stats.totalSports ?? 0}</div>
                <span className="text-muted small">Active programs</span>
              </div>
              <div className="stat-icon bg-lime-subtle text-success">
                <Trophy size={22} />
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-md-4 col-6">
            <div className="stat-card">
              <div>
                <div className="stat-label">Pro Coaches</div>
                <div className="stat-value">{stats.totalCoaches ?? 0}</div>
                <span className="text-muted small">Active faculty</span>
              </div>
              <div className="stat-icon bg-orange-subtle text-orange">
                <UserCheck size={22} />
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-md-4 col-6">
            <div className="stat-card">
              <div>
                <div className="stat-label">Tournaments</div>
                <div className="stat-value">{stats.upcomingEvents ?? 0}</div>
                <span className="text-primary small fw-semibold">Upcoming</span>
              </div>
              <div className="stat-icon bg-purple-subtle text-purple" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
                <CalendarDays size={22} />
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-md-4 col-6">
            <div className="stat-card">
              <div>
                <div className="stat-label">Bookings</div>
                <div className="stat-value">{stats.confirmedBookings ?? 0}</div>
                <span className="text-warning small fw-semibold">
                  {stats.pendingBookings ?? 0} Pending
                </span>
              </div>
              <div className="stat-icon bg-lime-subtle text-success">
                <BookmarkCheck size={22} />
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-md-4 col-6">
            <div className="stat-card">
              <div>
                <div className="stat-label">Recorded Revenue</div>
                <div className="stat-value text-navy" style={{ fontSize: '1.4rem' }}>
                  {formatCurrency(stats.totalRevenue ?? 0)}
                </div>
                <span className="text-success small fw-semibold">Demo Audited</span>
              </div>
              <div className="stat-icon bg-orange-subtle text-orange">
                <CreditCard size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="row g-4 mb-4">
          {/* Monthly Registrations Bar Chart */}
          <div className="col-lg-8">
            <div className="card-custom p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="font-heading fw-bold text-navy mb-0">Member Registration Growth</h6>
                  <span className="text-muted small">Monthly athlete sign-ups</span>
                </div>
                <span className="badge bg-lime-subtle text-success">Live MongoDB Data</span>
              </div>
              <div style={{ height: 280, width: '100%' }}>
                {charts.monthlyRegistrations && charts.monthlyRegistrations.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.monthlyRegistrations}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0b132b',
                          borderColor: '#1c2541',
                          color: '#fff',
                          borderRadius: 8
                        }}
                      />
                      <Bar dataKey="members" fill="#10b981" radius={[6, 6, 0, 0]} barSize={34} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-100 d-flex align-items-center justify-content-center text-muted small">
                    No historical registrations yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Status Pie Chart */}
          <div className="col-lg-4">
            <div className="card-custom p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="font-heading fw-bold text-navy mb-0">Booking Status Split</h6>
                  <span className="text-muted small">Confirmed vs Pending</span>
                </div>
              </div>
              <div style={{ height: 280, width: '100%' }}>
                {charts.bookingStatus && charts.bookingStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={charts.bookingStatus}
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {charts.bookingStatus.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-100 d-flex align-items-center justify-content-center text-muted small">
                    No bookings logged yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Tables */}
        <div className="row g-4">
          {/* Recent Members */}
          <div className="col-lg-6">
            <div className="card-custom p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="font-heading fw-bold text-navy mb-0">Recent Member Registrations</h6>
                <Link to="/admin/members" className="small text-lime fw-semibold text-decoration-none">
                  View All ({stats.totalMembers ?? 0})
                </Link>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th>Member</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.members && recent.members.length > 0 ? (
                      recent.members.map((m) => (
                        <tr key={m._id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={
                                  m.avatar ||
                                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                                }
                                alt={m.name}
                                className="rounded-circle"
                                style={{ width: 32, height: 32, objectFit: 'cover' }}
                              />
                              <div>
                                <div className="fw-bold text-navy">{m.name}</div>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                  {m.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-muted">{m.phone}</td>
                          <td>
                            <StatusBadge status={m.status} />
                          </td>
                          <td className="text-muted">{formatDate(m.createdAt)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-3 text-muted">
                          No recent members found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="col-lg-6">
            <div className="card-custom p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="font-heading fw-bold text-navy mb-0">Recent Facility Bookings</h6>
                <Link to="/admin/bookings" className="small text-lime fw-semibold text-decoration-none">
                  Manage All Bookings
                </Link>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th>Member</th>
                      <th>Sport / Court</th>
                      <th>Date & Slot</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.bookings && recent.bookings.length > 0 ? (
                      recent.bookings.map((b) => (
                        <tr key={b._id}>
                          <td>
                            <div className="fw-bold text-navy">{b.member?.name || 'Member'}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              {b.member?.email}
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold text-navy">{b.sport?.name}</div>
                            <div className="text-muted small">{b.facility?.name}</div>
                          </td>
                          <td>
                            <div>{formatDate(b.date)}</div>
                            <div className="text-muted small">
                              {b.startTime} - {b.endTime}
                            </div>
                          </td>
                          <td>
                            <StatusBadge status={b.status} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-3 text-muted">
                          No recent bookings logged.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
