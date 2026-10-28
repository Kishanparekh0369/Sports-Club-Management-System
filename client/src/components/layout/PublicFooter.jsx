import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, MapPin, Phone, Mail, Clock } from 'lucide-react';

const PublicFooter = () => {
  return (
    <footer className="public-footer">
      <div className="container">
        <div className="row g-4">
          {/* Brand info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Activity size={28} className="text-lime" />
              <span className="font-heading fw-bold fs-4 text-white">
                <span className="text-lime">ELITE</span> SPORTS CLUB
              </span>
            </div>
            <p className="text-muted small pe-lg-4 mb-4">
              Train Better. Play Stronger. Achieve More. The region's premier sports complex offering Olympic-class turf, courts, coaching academies, and athletic conditioning facilities.
            </p>
            <div className="d-flex gap-3 text-lime">
              <i className="bi bi-facebook fs-5"></i>
              <i className="bi bi-instagram fs-5"></i>
              <i className="bi bi-twitter-x fs-5"></i>
              <i className="bi bi-youtube fs-5"></i>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="footer-heading">Sports</h6>
            <Link to="/sports" className="footer-link">Cricket</Link>
            <Link to="/sports" className="footer-link">Football</Link>
            <Link to="/sports" className="footer-link">Tennis</Link>
            <Link to="/sports" className="footer-link">Badminton</Link>
            <Link to="/sports" className="footer-link">Swimming</Link>
            <Link to="/sports" className="footer-link">Gym & Fitness</Link>
          </div>

          {/* Club Info */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="footer-heading">Explore</h6>
            <Link to="/about" className="footer-link">About Club</Link>
            <Link to="/coaches" className="footer-link">Our Coaches</Link>
            <Link to="/events" className="footer-link">Tournaments</Link>
            <Link to="/membership-plans" className="footer-link">Pricing Plans</Link>
            <Link to="/contact" className="footer-link">Contact Us</Link>
            <Link to="/login" className="footer-link">Member Portal</Link>
          </div>

          {/* Contact Details */}
          <div className="col-lg-4 col-md-6">
            <h6 className="footer-heading">Club Headquarters</h6>
            <div className="d-flex gap-3 mb-3 text-muted small">
              <MapPin size={20} className="text-lime flex-shrink-0" />
              <span>Olympic Boulevard, Athletic District, Sports City, SC 40291</span>
            </div>
            <div className="d-flex gap-3 mb-3 text-muted small">
              <Phone size={18} className="text-lime flex-shrink-0" />
              <span>+1 (800) 555-ELITE / +1 (555) 019-2831</span>
            </div>
            <div className="d-flex gap-3 mb-3 text-muted small">
              <Mail size={18} className="text-lime flex-shrink-0" />
              <span>concierge@sportclub.local</span>
            </div>
            <div className="d-flex gap-3 text-muted small">
              <Clock size={18} className="text-lime flex-shrink-0" />
              <span>Monday – Sunday: 05:00 AM – 11:00 PM</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <div>
            &copy; {new Date().getFullYear()} Elite Sports Club Management System. All rights reserved.
          </div>
          <div className="d-flex gap-3">
            <span className="text-muted small">Student Academic Capstone Demonstration</span>
            <span className="text-lime small fw-semibold">MERN Stack 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
