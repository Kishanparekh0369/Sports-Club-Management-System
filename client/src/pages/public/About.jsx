import React from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Eye,
  ShieldCheck,
  Award,
  Users,
  Building2,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

const About = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <PublicNavbar />

      <main className="flex-grow-1">
        {/* About Hero Header */}
        <section className="bg-navy text-white py-5 text-center">
          <div className="container py-4">
            <span className="text-lime fw-bold text-uppercase small letter-spacing-1">
              About Elite Sports Club
            </span>
            <h1 className="hero-title mt-2 mb-3">Our Legacy Of Athletic Excellence</h1>
            <p className="text-light fs-5 mx-auto" style={{ maxWidth: '700px' }}>
              Established to nurture talent, promote lifelong wellness, and provide international championship sporting infrastructure for our community.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-5 bg-white">
          <div className="container py-4">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <span className="section-tag">Purpose & Purpose</span>
                <h2 className="section-title mb-4">Empowering Athletes Through Science & Passion</h2>
                <p className="text-muted mb-4">
                  Elite Sports Club is more than a fitness facility — it is an athletic ecosystem where grassroots enthusiasts and professional competitors train alongside each other in an inspiring environment.
                </p>

                <div className="d-flex gap-3 mb-4">
                  <div className="bg-lime-subtle p-3 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52 }}>
                    <Target size={26} className="text-lime" />
                  </div>
                  <div>
                    <h5 className="font-heading fw-bold mb-1">Our Mission</h5>
                    <p className="text-muted small mb-0">
                      To deliver world-class sports facilities, ethical athletic guidance, and structured competition pathways accessible to all age groups and skill levels.
                    </p>
                  </div>
                </div>

                <div className="d-flex gap-3 mb-4">
                  <div className="bg-orange-subtle p-3 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52 }}>
                    <Eye size={26} className="text-orange" />
                  </div>
                  <div>
                    <h5 className="font-heading fw-bold mb-1">Our Vision</h5>
                    <p className="text-muted small mb-0">
                      To stand as the gold standard of sports management, producing regional and international champions while fostering lifelong community health.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="position-relative">
                  <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
                    alt="Club Facilities"
                    className="img-fluid rounded-4 shadow-lg w-100"
                    style={{ maxHeight: '440px', objectFit: 'cover' }}
                  />
                  <div className="card-custom position-absolute bottom-0 start-0 m-3 p-3 bg-white shadow-lg border-0 d-none d-sm-flex align-items-center gap-3">
                    <Award size={36} className="text-lime flex-shrink-0" />
                    <div>
                      <div className="fw-bold text-navy">Ranked #1 Sports Academy</div>
                      <div className="text-muted small">Regional Athletics Board 2025 - 2026</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
          <div className="container py-4">
            <div className="section-header text-center mx-auto" style={{ maxWidth: '640px' }}>
              <span className="section-tag">Core Principles</span>
              <h2 className="section-title">The Values That Guide Our Club</h2>
            </div>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="card-custom p-4 h-100 bg-white">
                  <ShieldCheck size={36} className="text-lime mb-3" />
                  <h5 className="font-heading fw-bold mb-2">Integrity & Sportsmanship</h5>
                  <p className="text-muted small mb-0">
                    We play by the rules, celebrate fair competition, and cultivate deep mutual respect among players, coaches, and staff.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card-custom p-4 h-100 bg-white">
                  <Award size={36} className="text-orange mb-3" />
                  <h5 className="font-heading fw-bold mb-2">Pursuit Of Mastery</h5>
                  <p className="text-muted small mb-0">
                    Continuous learning and rigorous training. We provide athletes the scientific resources and coaching to shatter their personal bests.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card-custom p-4 h-100 bg-white">
                  <Users size={36} className="text-lime mb-3" />
                  <h5 className="font-heading fw-bold mb-2">Inclusive Community</h5>
                  <p className="text-muted small mb-0">
                    From junior grassroots prodigies to senior recreational leagues, every member finds an encouraging home on our courts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Club Achievements Counter */}
        <section className="py-5 bg-navy text-white">
          <div className="container py-4">
            <div className="row g-4 text-center">
              <div className="col-6 col-md-3">
                <div className="hero-stat-number text-lime">15+</div>
                <div className="text-light small text-uppercase fw-semibold mt-1">State Titles Won</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="hero-stat-number text-orange">250+</div>
                <div className="text-light small text-uppercase fw-semibold mt-1">Annual Tournaments</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="hero-stat-number text-lime">2,400+</div>
                <div className="text-light small text-uppercase fw-semibold mt-1">Active Athletes</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="hero-stat-number text-orange">99.8%</div>
                <div className="text-light small text-uppercase fw-semibold mt-1">Member Satisfaction</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default About;
