import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit2,
  CheckCircle,
  XCircle,
  Shield,
  Phone,
  Mail,
  Calendar,
  X
} from 'lucide-react';
import AdminHeader from '../../components/layout/AdminHeader';
import SearchInput from '../../components/common/SearchInput';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import { memberService } from '../../services/memberService';
import { formatDate } from '../../utils/formatDate';
import { getErrorMessage } from '../../services/api';

const Members = () => {
  const { onToggleMobile } = useOutletContext();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('member');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals state
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewDetailsLoading, setViewDetailsLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [memberActivity, setMemberActivity] = useState({ bookings: [], memberships: [] });

  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'member',
    status: 'active'
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editData, setEditData] = useState({
    _id: '',
    name: '',
    email: '',
    phone: '',
    role: 'member',
    status: 'active'
  });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        role: roleFilter,
        status: statusFilter,
        search
      };
      const res = await memberService.getMembers(params);
      setMembers(res.members || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);
    } catch (err) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, roleFilter, page]);

  // View member modal
  const handleViewDetails = async (memberId) => {
    setViewDetailsLoading(true);
    setShowViewModal(true);
    try {
      const res = await memberService.getMemberById(memberId);
      setSelectedMember(res.member);
      setMemberActivity({
        bookings: res.bookings || [],
        memberships: res.memberships || []
      });
    } catch (err) {
      toast.error('Failed to load member profile details');
      setShowViewModal(false);
    } finally {
      setViewDetailsLoading(false);
    }
  };

  // Toggle status (Active / Inactive)
  const handleToggleStatus = async (member) => {
    const nextStatus = member.status === 'active' ? 'inactive' : 'active';
    try {
      await memberService.updateMemberStatus(member._id, nextStatus);
      toast.success(`Member status updated to ${nextStatus}`);
      fetchMembers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Create member
  const handleCreateMember = async (e) => {
    e.preventDefault();
    if (!newMemberData.name || !newMemberData.email || !newMemberData.phone) {
      toast.warning('Please fill in all required fields.');
      return;
    }
    setAddLoading(true);
    try {
      await memberService.createMember(newMemberData);
      toast.success('Member created successfully!');
      setShowAddModal(false);
      setNewMemberData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'member',
        status: 'active'
      });
      fetchMembers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAddLoading(false);
    }
  };

  // Edit member
  const openEditModal = (member) => {
    setEditData({
      _id: member._id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      status: member.status
    });
    setShowEditModal(true);
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await memberService.updateMember(editData._id, editData);
      toast.success('Member details updated!');
      setShowEditModal(false);
      fetchMembers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      <AdminHeader
        title="Member Management"
        breadcrumb="Members"
        onToggleMobile={onToggleMobile}
      />

      <div className="dashboard-content">
        {/* Top Controls */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h4 className="font-heading fw-bold text-navy mb-1">Club Members ({totalCount})</h4>
            <span className="text-muted small">Manage athlete rosters, accounts, and club access privileges</span>
          </div>

          <Button
            variant="lime"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
          >
            Add New Member
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="row g-3 align-items-center">
            <div className="col-md-6 col-lg-5">
              <SearchInput
                placeholder="Search member by name, email, or phone..."
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  setPage(1);
                }}
              />
            </div>

            <div className="col-md-3 col-lg-3">
              <select
                className="form-select-custom"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Statuses</option>
                <option value="active">Active Members</option>
                <option value="inactive">Inactive Members</option>
              </select>
            </div>

            <div className="col-md-3 col-lg-3">
              <select
                className="form-select-custom"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="member">Members Only</option>
                <option value="admin">Administrators</option>
                <option value="">All Roles</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="table-custom-wrapper">
          {loading ? (
            <Loader message="Loading member records..." />
          ) : members.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No members found"
              description="No user records matched your search query or filter parameters."
              actionText="Reset Search"
              onAction={() => {
                setSearch('');
                setStatusFilter('');
                setRoleFilter('member');
              }}
            />
          ) : (
            <div className="table-responsive">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Member Profile</th>
                    <th>Contact Phone</th>
                    <th>Role</th>
                    <th>Account Status</th>
                    <th>Join Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={
                              member.avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                            }
                            alt={member.name}
                            className="rounded-circle"
                            style={{ width: 40, height: 40, objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-bold text-navy">{member.name}</div>
                            <div className="text-muted small">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted">{member.phone || 'N/A'}</td>
                      <td>
                        <span className={`badge ${member.role === 'admin' ? 'bg-danger-subtle text-danger' : 'bg-secondary-subtle text-secondary'}`}>
                          {member.role.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={member.status} />
                      </td>
                      <td className="text-muted">{formatDate(member.createdAt)}</td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-secondary p-1"
                            title="View Activity & Profile"
                            onClick={() => handleViewDetails(member._id)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary p-1"
                            title="Edit Member"
                            onClick={() => openEditModal(member)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className={`btn btn-sm p-1 ${
                              member.status === 'active'
                                ? 'btn-outline-danger'
                                : 'btn-outline-success'
                            }`}
                            title={member.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                            onClick={() => handleToggleStatus(member)}
                          >
                            {member.status === 'active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                          </button>
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
          onPageChange={(newPage) => setPage(newPage)}
        />

        {/* MODAL 1: VIEW MEMBER DETAILS */}
        {showViewModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content card-custom border-0 p-3">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title font-heading fw-bold">Member Information</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowViewModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {viewDetailsLoading || !selectedMember ? (
                    <Loader message="Loading activity history..." />
                  ) : (
                    <div>
                      {/* Bio card */}
                      <div className="d-flex align-items-center gap-3 p-3 bg-surface-subtle rounded-3 mb-4">
                        <img
                          src={
                            selectedMember.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={selectedMember.name}
                          className="rounded-circle"
                          style={{ width: 64, height: 64, objectFit: 'cover' }}
                        />
                        <div>
                          <h5 className="fw-bold text-navy mb-0">{selectedMember.name}</h5>
                          <div className="text-muted small">{selectedMember.email} • {selectedMember.phone}</div>
                          <div className="d-flex gap-2 mt-1">
                            <StatusBadge status={selectedMember.status} />
                            <span className="badge bg-light text-navy border">{selectedMember.role}</span>
                          </div>
                        </div>
                      </div>

                      {/* Active Memberships */}
                      <h6 className="font-heading fw-bold text-navy mb-2">Membership History</h6>
                      {memberActivity.memberships.length === 0 ? (
                        <p className="text-muted small mb-4">No active or past membership subscriptions.</p>
                      ) : (
                        <div className="table-responsive mb-4">
                          <table className="table table-sm table-bordered small">
                            <thead className="table-light">
                              <tr>
                                <th>Plan</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {memberActivity.memberships.map((m) => (
                                <tr key={m._id}>
                                  <td>{m.planName || m.plan?.name}</td>
                                  <td>{formatDate(m.startDate)}</td>
                                  <td>{formatDate(m.endDate)}</td>
                                  <td><StatusBadge status={m.status} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Recent Bookings */}
                      <h6 className="font-heading fw-bold text-navy mb-2">Recent Court Bookings</h6>
                      {memberActivity.bookings.length === 0 ? (
                        <p className="text-muted small">No facility bookings made yet.</p>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered small">
                            <thead className="table-light">
                              <tr>
                                <th>Sport / Facility</th>
                                <th>Date & Slot</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {memberActivity.bookings.map((b) => (
                                <tr key={b._id}>
                                  <td>{b.sport?.name} - {b.facility?.name}</td>
                                  <td>{formatDate(b.date)} ({b.startTime} - {b.endTime})</td>
                                  <td><StatusBadge status={b.status} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: ADD NEW MEMBER */}
        {showAddModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content card-custom border-0 p-3">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title font-heading fw-bold">Create New Member</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleCreateMember}>
                  <div className="modal-body py-3">
                    <FormInput
                      label="Full Name"
                      name="name"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={newMemberData.name}
                      onChange={(e) => setNewMemberData({ ...newMemberData, name: e.target.value })}
                    />
                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      required
                      placeholder="alex.m@example.com"
                      value={newMemberData.email}
                      onChange={(e) => setNewMemberData({ ...newMemberData, email: e.target.value })}
                    />
                    <FormInput
                      label="Phone Number"
                      name="phone"
                      required
                      placeholder="+1 555-123-4567"
                      value={newMemberData.phone}
                      onChange={(e) => setNewMemberData({ ...newMemberData, phone: e.target.value })}
                    />
                    <FormInput
                      label="Initial Password"
                      name="password"
                      type="password"
                      placeholder="Defaults to Member@12345 if blank"
                      value={newMemberData.password}
                      onChange={(e) => setNewMemberData({ ...newMemberData, password: e.target.value })}
                    />
                    <FormSelect
                      label="Role"
                      name="role"
                      value={newMemberData.role}
                      onChange={(e) => setNewMemberData({ ...newMemberData, role: e.target.value })}
                      options={[
                        { label: 'Member', value: 'member' },
                        { label: 'Administrator', value: 'admin' }
                      ]}
                    />
                  </div>
                  <div className="modal-footer border-0 pt-0 gap-2">
                    <Button
                      variant="outline-navy"
                      size="sm"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="lime"
                      size="sm"
                      loading={addLoading}
                    >
                      Save Member
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: EDIT MEMBER */}
        {showEditModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content card-custom border-0 p-3">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title font-heading fw-bold">Edit Member Account</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleUpdateMember}>
                  <div className="modal-body py-3">
                    <FormInput
                      label="Full Name"
                      name="name"
                      required
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      required
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                    <FormInput
                      label="Phone Number"
                      name="phone"
                      required
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                    <FormSelect
                      label="Role"
                      name="role"
                      value={editData.role}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                      options={[
                        { label: 'Member', value: 'member' },
                        { label: 'Administrator', value: 'admin' }
                      ]}
                    />
                    <FormSelect
                      label="Status"
                      name="status"
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      options={[
                        { label: 'Active', value: 'active' },
                        { label: 'Inactive', value: 'inactive' }
                      ]}
                    />
                  </div>
                  <div className="modal-footer border-0 pt-0 gap-2">
                    <Button
                      variant="outline-navy"
                      size="sm"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="lime"
                      size="sm"
                      loading={editLoading}
                    >
                      Save Changes
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

export default Members;
