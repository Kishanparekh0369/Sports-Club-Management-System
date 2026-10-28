import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, KeyRound, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';

const MemberHeader = ({ title = 'Member Dashboard', breadcrumb = 'Overview', onToggleMobile }) => {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await notificationService.getNotifications();
        setUnreadCount(res.unreadCount || 0);
      } catch {
        // Silently catch
      }
    };
    fetchUnread();
  }, []);

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
            Member <span>/ {breadcrumb}</span>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Notification Bell */}
        <Link
          to="/member/notifications"
          className="btn btn-light position-relative p-2 rounded-circle border"
          title="Notifications"
        >
          <Bell size={20} className="text-navy" />
          {unreadCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {unreadCount}
              <span className="visually-hidden">unread messages</span>
            </span>
          )}
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
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
              }
              alt={user?.name}
              className="user-avatar-sm"
            />
            <div className="text-start d-none d-md-block">
              <div className="fw-bold small text-navy lh-1 mb-1">{user?.name}</div>
              <span className="badge bg-success-subtle text-success py-0 px-1 font-monospace small">
                ACTIVE MEMBER
              </span>
            </div>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 py-2">
            <li className="px-3 py-2 border-bottom">
              <div className="fw-bold">{user?.name}</div>
              <div className="text-muted small">{user?.email}</div>
            </li>
            <li>
              <Link to="/member/profile" className="dropdown-item py-2 d-flex align-items-center gap-2">
                <User size={16} />
                <span>My Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/member/change-password" className="dropdown-item py-2 d-flex align-items-center gap-2">
                <KeyRound size={16} />
                <span>Change Password</span>
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

export default MemberHeader;
