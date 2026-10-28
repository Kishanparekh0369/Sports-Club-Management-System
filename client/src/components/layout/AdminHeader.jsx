import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ExternalLink, User, LogOut, Shield } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const AdminHeader = ({ title = 'Dashboard', breadcrumb = 'Overview', onToggleMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="dashboard-header">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-light d-lg-none p-1 border"
          onClick={onToggleMobile}
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>
        <div>
          <h5 className="font-heading fw-bold mb-0 text-navy">{title}</h5>
          <div className="dashboard-breadcrumbs small">
            Admin <span>/ {breadcrumb}</span>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Public Site Link */}
        <Link
          to="/"
          target="_blank"
          className="btn btn-sm btn-outline-secondary d-none d-sm-inline-flex align-items-center gap-1"
          title="Open public website in new tab"
        >
          <ExternalLink size={14} />
          <span>Live Site</span>
        </Link>

        {/* User Dropdown */}
        <div className="dropdown">
          <button
            className="header-user-btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
              }
              alt={user?.name}
              className="user-avatar-sm"
            />
            <div className="text-start d-none d-md-block">
              <div className="fw-bold small text-navy lh-1 mb-1">{user?.name}</div>
              <span className="badge bg-danger-subtle text-danger py-0 px-1 font-monospace small">
                ADMIN
              </span>
            </div>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 py-2">
            <li className="px-3 py-2 border-bottom">
              <div className="fw-bold">{user?.name}</div>
              <div className="text-muted small">{user?.email}</div>
            </li>
            <li>
              <Link to="/admin/profile" className="dropdown-item py-2 d-flex align-items-center gap-2">
                <User size={16} />
                <span>Admin Profile</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="dropdown-item py-2 text-danger d-flex align-items-center gap-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
