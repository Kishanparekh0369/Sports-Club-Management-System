import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  Users,
  Trophy,
  UserCheck,
  CalendarDays,
  BookmarkCheck,
  Building2,
  Tag,
  CreditCard,
  Megaphone,
  FileBarChart,
  User,
  LogOut,
  X
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const AdminSidebar = ({ mobileOpen, onCloseMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Members', path: '/admin/members', icon: Users },
    { name: 'Sports', path: '/admin/sports', icon: Trophy },
    { name: 'Coaches', path: '/admin/coaches', icon: UserCheck },
    { name: 'Tournaments', path: '/admin/events', icon: CalendarDays },
    { name: 'Bookings', path: '/admin/bookings', icon: BookmarkCheck },
    { name: 'Facilities', path: '/admin/facilities', icon: Building2 },
    { name: 'Pricing Plans', path: '/admin/membership-plans', icon: Tag },
    { name: 'Memberships', path: '/admin/memberships', icon: CreditCard },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'Reports', path: '/admin/reports', icon: FileBarChart },
    { name: 'My Profile', path: '/admin/profile', icon: User }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div className="sidebar-backdrop d-lg-none" onClick={onCloseMobile}></div>
      )}

      <aside className={`dashboard-sidebar ${mobileOpen ? 'show-mobile' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <Link to="/admin/dashboard" className="sidebar-brand text-decoration-none">
            <Activity size={24} className="text-lime" />
            <span>ELITE</span> <small className="text-muted fw-normal fs-6">ADMIN</small>
          </Link>
          <button
            className="btn btn-link text-white d-lg-none p-0"
            onClick={onCloseMobile}
            aria-label="Close Sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation list */}
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

        {/* Footer Logout */}
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

export default AdminSidebar;
