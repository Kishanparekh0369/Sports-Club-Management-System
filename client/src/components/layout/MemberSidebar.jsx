import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  Compass,
  CreditCard,
  CalendarPlus,
  BookmarkCheck,
  Trophy,
  Receipt,
  Bell,
  User,
  KeyRound,
  LogOut,
  X
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const MemberSidebar = ({ mobileOpen, onCloseMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'My Dashboard', path: '/member/dashboard', icon: LayoutDashboard },
    { name: 'Browse Sports', path: '/member/sports', icon: Compass },
    { name: 'Membership Plan', path: '/member/membership', icon: CreditCard },
    { name: 'Book a Sport', path: '/member/book', icon: CalendarPlus },
    { name: 'My Bookings', path: '/member/my-bookings', icon: BookmarkCheck },
    { name: 'Tournaments', path: '/member/events', icon: Trophy },
    { name: 'Payment History', path: '/member/my-payments', icon: Receipt },
    { name: 'Notifications', path: '/member/notifications', icon: Bell },
    { name: 'My Profile', path: '/member/profile', icon: User },
    { name: 'Change Password', path: '/member/change-password', icon: KeyRound }
  ];

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-backdrop d-lg-none" onClick={onCloseMobile}></div>
      )}

      <aside className={`dashboard-sidebar ${mobileOpen ? 'show-mobile' : ''}`}>
        <div className="sidebar-header">
          <Link to="/member/dashboard" className="sidebar-brand text-decoration-none">
            <Activity size={24} className="text-lime" />
            <span>ELITE</span> <small className="text-muted fw-normal fs-6">MEMBER</small>
          </Link>
          <button
            className="btn btn-link text-white d-lg-none p-0"
            onClick={onCloseMobile}
            aria-label="Close Sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <ul className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name} className="sidebar-item">
                <NavLink
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 btn-sm d-flex align-items-center justify-content-center gap-2 py-2"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default MemberSidebar;
