import React, { useState, useEffect } from 'react';
import { Award, Star, Mail, Phone, Calendar } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { coachService } from '../../services/coachService';

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await coachService.getCoaches({ status: 'active' });
        setCoaches(res.coaches || []);
      } catch (err) {
        console.error('Failed to load coaches', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <PublicNavbar />

      <main className="flex-grow-1">
        {/* Banner */}
        <section className="bg-navy text-white py-5 text-center">
          <div className="container py-3">
            <span className="text-lime fw-bold text-uppercase small">Certified Faculty</span>
            <h1 className="hero-title mt-2 mb-2">Our World-Class Coaching Staff</h1>
            <p className="text-light fs-5 mx-auto" style={{ maxWidth: '640px' }}>
              Train under former national champions, certified performance trainers, and sport scientists committed to developing your full athletic potential.
            </p>
          </div>
        </section>

        {/* Coaches Grid */}
        <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
          <div className="container py-3">
            {loading ? (
              <Loader message="Loading coaches..." />
            ) : coaches.length === 0 ? (
              <EmptyState title="No coaches available" />
            ) : (
              <div className="row g-4">
                {coaches.map((coach) => (
                  <div key={coach._id} className="col-lg-4 col-md-6">
                    <div className="card-custom h-100 overflow-hidden d-flex flex-column">
                      <div style={{ height: 260, position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={coach.photo}
                          alt={coach.name}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div
                          className="position-absolute bottom-0 start-0 m-3 px-3 py-1 rounded-pill bg-navy text-white small fw-bold d-flex align-items-center gap-1"
                          style={{ opacity: 0.95 }}
                        >
                          <Star size={14} className="text-warning fill-warning" />
                          <span>{coach.rating} / 5.0</span>
                        </div>
                      </div>

                      <div className="p-4 d-flex flex-column flex-grow-1">
                        <div className="mb-2">
                          <h4 className="font-heading fw-bold text-navy mb-1">{coach.name}</h4>
                          <span className="text-lime fw-bold small">{coach.specialization}</span>
                        </div>

                        <div className="badge bg-light text-navy border align-self-start mb-3 py-1 px-2 small">
                          {coach.experience} Years Coaching Experience
                        </div>

                        <p className="text-muted small mb-3 flex-grow-1">
                          {coach.bio}
                        </p>

                        {/* Certifications */}
                        {coach.certifications && coach.certifications.length > 0 && (
                          <div className="mb-3">
                            <div className="fw-semibold small text-navy mb-1">Accreditations:</div>
                            <div className="d-flex flex-wrap gap-1">
                              {coach.certifications.map((cert, idx) => (
                                <span key={idx} className="badge bg-surface-subtle text-muted border small">
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Sports Assigned */}
                        {coach.sports && coach.sports.length > 0 && (
                          <div className="pt-2 border-top small text-muted">
                            <span className="fw-semibold text-navy">Sports: </span>
                            {coach.sports.map((s) => s.name).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Coaches;
