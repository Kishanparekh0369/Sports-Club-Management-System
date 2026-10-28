import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Users,
  Building2,
  Medal,
  CalendarDays,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { sportService } from '../../services/sportService';
import { coachService } from '../../services/coachService';
import { membershipService } from '../../services/membershipService';
import { eventService } from '../../services/eventService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const Home = () => {
  const [sports, setSports] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [plans, setPlans] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [sportsRes, coachesRes, plansRes, eventsRes] = await Promise.all([
          sportService.getSports({ limit: 4 }),
          coachService.getCoaches(),
          membershipService.getPlans(),
          eventService.getEvents({ status: 'upcoming' })
        ]);
        setSports(sportsRes.sports ? sportsRes.sports.slice(0, 4) : []);
        setCoaches(coachesRes.coaches ? coachesRes.coaches.slice(0, 4) : []);
        setPlans(plansRes.plans ? plansRes.plans.slice(0, 3) : []);
        setEvents(eventsRes.events ? eventsRes.events.slice(0, 3) : []);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <PublicNavbar />

      <main className="flex-grow-1">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-7">
                <div className="hero-tagline">
                  <Flame size={16} /> Official Athletics & Sports Club
                </div>
                <h1 className="hero-title">
                  TRAIN BETTER. <br />
                  <span className="highlight-lime">PLAY STRONGER.</span> <br />
                  <span className="highlight-orange">ACHIEVE MORE.</span>
                </h1>
                <p className="hero-subtitle">
                  Welcome to Elite Sports Club — an international standard sports complex featuring Olympic-size aquatic arenas, FIFA-certified turf, championship clay courts, and certified coaching academies.
                </p>
                <div className="d-flex flex-wrap gap-3 mb-5">
                  <Link to="/register" className="btn-athletic btn-athletic-lime btn-athletic-lg">
                    Join Our Club <ArrowRight size={20} />
                  </Link>
                  <Link to="/sports" className="btn-athletic btn-athletic-outline-light btn-athletic-lg">
                    Explore Sports
                  </Link>
                </div>

                {/* Hero Stat Boxes */}
                <div className="row g-3">
                  <div className="col-4">
                    <div className="hero-stat-box">
                      <div className="hero-stat-number">8+</div>
                      <div className="hero-stat-label">Olympic Sports</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="hero-stat-box">
                      <div className="hero-stat-number">5+</div>
                      <div className="hero-stat-label">Pro Coaches</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="hero-stat-box">
                      <div className="hero-stat-number">100%</div>
                      <div className="hero-stat-label">Championship Turf</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Image Showcase Card */}
              <div className="col-lg-5 d-none d-lg-block">
                <div className="card-custom card-glass p-4 position-relative">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-lime-subtle p-2 rounded-circle">
                      <Award size={28} className="text-lime" />
                    </div>
                    <div>
                      <h6 className="text-white fw-bold mb-0">Elite Athletic League</h6>
                      <span className="text-muted small">Sanctioned & Certified Complex</span>
                    </div>
                  </div>
                  <p className="text-light small mb-3">
                    "State-of-the-art facilities with precision court lighting and certified sports performance mentors."
                  </p>
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary">
                    <span className="text-lime fw-bold small">Open 7 Days (5 AM - 11 PM)</span>
                    <span className="badge bg-success-subtle text-success">Courts Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-5 bg-white">
          <div className="container py-4">
            <div className="section-header text-center mx-auto" style={{ maxWidth: '680px' }}>
              <span className="section-tag">Why Choose Elite</span>
              <h2 className="section-title">Built For Athletes. Designed For Champions.</h2>
              <p className="section-desc mx-auto">
                Whether you are an aspiring professional, competitive athlete, or recreational sports lover, we offer everything needed to elevate your game.
              </p>
            </div>

            <div className="row g-4">
              <div className="col-md-6 col-lg-3">
                <div className="why-us-box">
                  <div className="why-us-icon">
                    <Building2 size={28} />
                  </div>
                  <h5 className="font-heading fw-bold mb-2">Modern Facilities</h5>
                  <p className="text-muted small mb-0">
                    BWF-certified badminton courts, clay tennis, FIFA-grade artificial turf, and an Olympic 50m heated pool.
                  </p>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="why-us-box">
                  <div className="why-us-icon">
                    <Users size={28} />
                  </div>
                  <h5 className="font-heading fw-bold mb-2">Expert Coaching</h5>
                  <p className="text-muted small mb-0">
                    Train with national-level coaches and former circuit athletes specializing in biomechanics and skill refinement.
                  </p>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="why-us-box">
                  <div className="why-us-icon">
                    <CalendarDays size={28} />
                  </div>
                  <h5 className="font-heading fw-bold mb-2">Instant Booking</h5>
                  <p className="text-muted small mb-0">
                    Real-time online court and slot reservations with atomic conflict-prevention and instant confirmation.
                  </p>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="why-us-box">
                  <div className="why-us-icon">
                    <Trophy size={28} />
                  </div>
                  <h5 className="font-heading fw-bold mb-2">Tournaments & Cups</h5>
                  <p className="text-muted small mb-0">
                    Compete in monthly club tournaments, state masters leagues, and championship cash prize showcases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED SPORTS */}
        <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
          <div className="container py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
              <div>
                <span className="section-tag">Our Catalogue</span>
                <h2 className="section-title mb-0">Featured Sports Programs</h2>
              </div>
              <Link to="/sports" className="btn-athletic btn-athletic-outline-navy mt-3 mt-md-0">
                View All 8 Sports <ArrowRight size={18} />
              </Link>
            </div>

            {loading ? (
              <Loader message="Loading sports catalogue..." />
            ) : (
              <div className="row g-4">
                {sports.map((sport) => (
                  <div key={sport._id} className="col-lg-3 col-md-6">
                    <div className="sport-card">
                      <div className="sport-card-img-wrapper">
                        <img
                          src={sport.image}
                          alt={sport.name}
                          className="sport-card-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=900&q=80';
                          }}
                        />
                        <span className="sport-card-category">{sport.category}</span>
                        <span className="sport-card-price">{formatCurrency(sport.price)} / hr</span>
                      </div>
                      <div className="sport-card-body">
                        <h5 className="font-heading fw-bold mb-1">{sport.name}</h5>
                        <p className="text-muted small line-clamp-2 mb-3">
                          {sport.description}
                        </p>
                        <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                          <span className="small text-muted">Cap: {sport.capacity} players</span>
                          <Link
                            to={`/sports/${sport._id}`}
                            className="btn btn-sm btn-athletic-lime py-1 px-3"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* MEMBERSHIP PLANS PREVIEW */}
        <section className="py-5 bg-white">
          <div className="container py-4">
            <div className="section-header text-center mx-auto" style={{ maxWidth: '680px' }}>
              <span className="section-tag">Affordable Memberships</span>
              <h2 className="section-title">Flexible Plans For Every Goal</h2>
              <p className="section-desc mx-auto">
                Enjoy unlimited access to sports courts, athletic training zones, recovery rooms, and exclusive tournament entry discounts.
              </p>
            </div>

            {loading ? (
              <Loader message="Loading membership tiers..." />
            ) : (
              <div className="row g-4 justify-content-center">
                {plans.map((plan) => (
                  <div key={plan._id} className="col-lg-4 col-md-6">
                    <div className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
                      {plan.badge && <span className="pricing-badge">{plan.badge}</span>}
                      <h4 className="font-heading fw-bold text-navy mb-1">{plan.name}</h4>
                      <p className="text-muted small mb-0">{plan.tagline}</p>

                      <div className="pricing-price">
                        {formatCurrency(plan.price)}
                        <span> / {plan.durationMonths} mo</span>
                      </div>

                      <ul className="pricing-features">
                        {plan.benefits.map((b, idx) => (
                          <li key={idx} className="pricing-feature-item">
                            <CheckCircle size={18} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        to="/membership-plans"
                        className={`btn-athletic w-100 ${
                          plan.isPopular ? 'btn-athletic-lime' : 'btn-athletic-navy'
                        }`}
                      >
                        Choose {plan.name}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* UPCOMING EVENTS / TOURNAMENTS */}
        {events.length > 0 && (
          <section className="py-5 bg-navy text-white">
            <div className="container py-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
                <div>
                  <span className="text-orange fw-bold text-uppercase small">Tournament Hub</span>
                  <h2 className="section-title text-white mb-0">Upcoming Club Competitions</h2>
                </div>
                <Link to="/events" className="btn-athletic btn-athletic-outline-light mt-3 mt-md-0">
                  View All Events <ArrowRight size={18} />
                </Link>
              </div>

              <div className="row g-4">
                {events.map((evt) => (
                  <div key={evt._id} className="col-lg-4 col-md-6">
                    <div className="card-custom card-glass p-4 h-100 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-lime-subtle text-success fw-bold">
                          {evt.sport?.name || 'Tournament'}
                        </span>
                        <span className="text-muted small">{formatDate(evt.eventDate)}</span>
                      </div>
                      <h5 className="font-heading fw-bold text-white mb-2">{evt.title}</h5>
                      <p className="text-light small line-clamp-2 mb-3">{evt.description}</p>
                      <div className="mt-auto pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
                        <span className="text-orange fw-bold small">Prize: {evt.prizePool}</span>
                        <Link to="/events" className="btn btn-sm btn-athletic-lime">
                          Register
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* COACHES PREVIEW */}
        <section className="py-5 bg-white">
          <div className="container py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
              <div>
                <span className="section-tag">Mentors</span>
                <h2 className="section-title mb-0">Meet Our Certified Coaches</h2>
              </div>
              <Link to="/coaches" className="btn-athletic btn-athletic-outline-navy mt-3 mt-md-0">
                Meet The Full Team <ArrowRight size={18} />
              </Link>
            </div>

            <div className="row g-4">
              {coaches.map((coach) => (
                <div key={coach._id} className="col-lg-3 col-md-6">
                  <div className="coach-card h-100">
                    <div className="coach-img-wrapper">
                      <img
                        src={coach.photo}
                        alt={coach.name}
                        className="coach-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <span className="coach-rating-tag">★ {coach.rating}</span>
                    </div>
                    <div className="p-3">
                      <h6 className="font-heading fw-bold text-navy mb-1">{coach.name}</h6>
                      <div className="text-lime fw-semibold small mb-2">{coach.specialization}</div>
                      <p className="text-muted small line-clamp-2 mb-0">
                        {coach.experience} years coaching experience. {coach.bio}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-5" style={{ background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 100%)', color: '#fff' }}>
          <div className="container text-center py-4">
            <h2 className="hero-title mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Ready To Take Your Game To The Next Level?
            </h2>
            <p className="text-light fs-5 mx-auto mb-4" style={{ maxWidth: '620px' }}>
              Join hundreds of dedicated athletes at Elite Sports Club. Register today and reserve your first session immediately.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/register" className="btn-athletic btn-athletic-lime btn-athletic-lg">
                Create Member Account <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="btn-athletic btn-athletic-outline-light btn-athletic-lg">
                Schedule a Visit
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Home;
