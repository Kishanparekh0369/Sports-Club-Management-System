import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Trophy,
  Building2,
  Users,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { sportService } from '../../services/sportService';
import { formatCurrency } from '../../utils/formatCurrency';

const SportDetails = () => {
  const { id } = useParams();
  const [sport, setSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSport = async () => {
      setLoading(false);
      try {
        const res = await sportService.getSportById(id);
        setSport(res.sport);
      } catch (err) {
        setError('Failed to load sport details. Please verify the URL.');
      } finally {
        setLoading(false);
      }
    };
    fetchSport();
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      // Prompt specification: Redirect unauthenticated users to login and return them to the intended page after successful login
      navigate('/login', { state: { from: `/member/book?sportId=${id}` } });
    } else {
      navigate(`/member/book?sportId=${id}`);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <PublicNavbar />
        <Loader fullScreen message="Loading sport information..." />
        <PublicFooter />
      </div>
    );
  }

  if (error || !sport) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <PublicNavbar />
        <div className="container py-5">
          <ErrorState message={error || 'Sport not found'} />
          <div className="text-center mt-3">
            <Link to="/sports" className="btn-athletic btn-athletic-navy">
              <ChevronLeft size={18} /> Back To Sports
            </Link>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <PublicNavbar />

      <main className="flex-grow-1 py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          {/* Back link */}
          <div className="mb-4">
            <Link to="/sports" className="text-muted d-inline-flex align-items-center gap-1 small fw-semibold">
              <ChevronLeft size={16} /> All Sports Catalogue
            </Link>
          </div>

          <div className="row g-4">
            {/* Left Column: Details */}
            <div className="col-lg-8">
              {/* Main Banner Card */}
              <div className="card-custom overflow-hidden mb-4">
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="w-100"
                  style={{ maxHeight: '420px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="p-4 p-md-5">
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                    <span className="badge bg-lime-subtle text-success py-1 px-3 fs-6">
                      {sport.category}
                    </span>
                    <span className="badge bg-primary-subtle text-primary py-1 px-3 fs-6">
                      Slot Capacity: {sport.capacity} Players
                    </span>
                  </div>

                  <h1 className="font-heading fw-bold text-navy mb-3">{sport.name}</h1>
                  <p className="text-muted fs-5 mb-4 leading-relaxed">
                    {sport.description}
                  </p>

                  {/* Rules & Regulations */}
                  {sport.rules && sport.rules.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-heading fw-bold text-navy mb-3">Court & Match Rules</h5>
                      <div className="d-flex flex-column gap-2">
                        {sport.rules.map((rule, idx) => (
                          <div key={idx} className="d-flex align-items-start gap-2">
                            <CheckCircle size={18} className="text-lime flex-shrink-0 mt-1" />
                            <span className="text-muted small">{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  {sport.amenities && sport.amenities.length > 0 && (
                    <div>
                      <h5 className="font-heading fw-bold text-navy mb-3">Amenities & Gear Provided</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {sport.amenities.map((amenity, idx) => (
                          <span key={idx} className="badge bg-light text-navy border py-2 px-3">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Linked Facilities */}
              {sport.facilities && sport.facilities.length > 0 && (
                <div className="card-custom p-4 mb-4">
                  <h5 className="font-heading fw-bold text-navy mb-3 d-flex align-items-center gap-2">
                    <Building2 className="text-lime" /> Dedicated Venues & Facilities
                  </h5>
                  <div className="row g-3">
                    {sport.facilities.map((fac) => (
                      <div key={fac._id} className="col-md-6">
                        <div className="p-3 border rounded-3 bg-white h-100">
                          <h6 className="fw-bold text-navy mb-1">{fac.name}</h6>
                          <div className="text-muted small mb-2">{fac.courtNumber} • Cap: {fac.capacity}</div>
                          <p className="text-muted small mb-0">{fac.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Coaches */}
              {sport.coaches && sport.coaches.length > 0 && (
                <div className="card-custom p-4">
                  <h5 className="font-heading fw-bold text-navy mb-3 d-flex align-items-center gap-2">
                    <Users className="text-orange" /> Assigned Head Coaches
                  </h5>
                  <div className="row g-3">
                    {sport.coaches.map((coach) => (
                      <div key={coach._id} className="col-md-6">
                        <div className="p-3 border rounded-3 bg-white d-flex gap-3 align-items-center">
                          <img
                            src={coach.photo}
                            alt={coach.name}
                            className="rounded-circle"
                            style={{ width: 60, height: 60, objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-bold text-navy">{coach.name}</div>
                            <div className="text-lime small">{coach.specialization}</div>
                            <div className="text-muted small">{coach.experience} yrs exp</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Pricing & Booking Action */}
            <div className="col-lg-4">
              <div className="card-custom p-4 sticky-top" style={{ top: '6rem' }}>
                <span className="text-muted small text-uppercase fw-bold letter-spacing-1">
                  Session Fee
                </span>
                <div className="pricing-price my-2">
                  {formatCurrency(sport.price)}
                  <span className="fs-6"> / slot</span>
                </div>
                <p className="text-muted small mb-4">
                  Members enjoy complimentary or discounted court reservations based on active membership tier.
                </p>

                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="d-flex justify-content-between small border-bottom pb-2">
                    <span className="text-muted">Standard Slot Duration:</span>
                    <span className="fw-bold text-navy">60 Minutes</span>
                  </div>
                  <div className="d-flex justify-content-between small border-bottom pb-2">
                    <span className="text-muted">Booking Advance:</span>
                    <span className="fw-bold text-navy">Up to 7 Days</span>
                  </div>
                  <div className="d-flex justify-content-between small border-bottom pb-2">
                    <span className="text-muted">Equipment Provided:</span>
                    <span className="fw-bold text-lime">Yes (On Request)</span>
                  </div>
                </div>

                <Button
                  variant="lime"
                  className="w-100 py-3"
                  onClick={handleBookNow}
                >
                  {isAuthenticated ? 'Book Slot Now' : 'Sign In To Reserve Court'}
                </Button>

                {!isAuthenticated && (
                  <p className="text-center text-muted small mt-2 mb-0">
                    Not a member yet? <Link to="/register" className="text-lime fw-bold">Sign up here</Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default SportDetails;
