import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Activity, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const PublicNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Sports', path: '/sports' },
    { name: 'Coaches', path: '/coaches' },
    { name: 'Tournaments', path: '/events' },
    { name: 'Memberships', path: '/membership-plans' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="public-navbar">
      <div className="container d-flex align-items-center justify-content-between">
        {/* Logo */}
        <Link to="/" className="public-navbar-brand">
          <Activity size={28} className="text-lime" />
          <span>ELITE</span> SPORTS CLUB
        </Link>

        {/* Desktop Nav Links */}
        <div className="d-none d-lg-flex align-items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `public-nav-link ${isActive ? 'active' : ''}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Auth CTA or Dashboard Link */}
        <div className="d-none d-lg-flex align-items-center gap-3">
          {isAuthenticated ? (
            <div className="dropdown">
              <button
                className="btn btn-athletic-outline-light btn-athletic-sm dropdown-toggle d-flex align-items-center gap-2"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <User size={16} className="text-lime" />
                <span>{user?.name?.split(' ')[0]}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 py-2">
                <li className="px-3 py-2 border-bottom">
                  <div className="fw-bold">{user?.name}</div>
                  <div className="text-muted small">{user?.email}</div>
                  <span className="badge-pill bg-lime-subtle mt-1 d-inline-block text-capitalize">
                    {user?.role}
                  </span>
                </li>
                <li>
                  <Link
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                    className="dropdown-item py-2 d-flex align-items-center gap-2"
                  >
                    <LayoutDashboard size={16} />
                    <span>Go to Dashboard</span>
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
          ) : (
            <>
              <Link to="/login" className="btn-athletic btn-athletic-outline-light btn-athletic-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn-athletic btn-athletic-lime btn-athletic-sm">
                Join Club
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="btn btn-link text-white d-lg-none p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="d-lg-none bg-navy-dark border-top border-secondary py-3 px-4 animate-fade-in">
          <div className="d-flex flex-column gap-2 mb-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `public-nav-link text-white py-2 ${isActive ? 'active' : ''}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-top border-secondary d-flex flex-column gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-athletic btn-athletic-lime text-center"
                >
                  <LayoutDashboard size={18} className="me-2" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="btn-athletic btn-athletic-outline-light text-center"
                >
                  <LogOut size={18} className="me-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-athletic btn-athletic-outline-light text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-athletic btn-athletic-lime text-center"
                >
                  Join Club
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
