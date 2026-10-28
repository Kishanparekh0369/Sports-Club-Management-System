import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Shield, Sparkles, ArrowRight } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { membershipService } from '../../services/membershipService';
import { formatCurrency } from '../../utils/formatCurrency';

const MembershipPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await membershipService.getPlans();
        setPlans(res.plans || []);
      } catch (err) {
        console.error('Failed to load plans', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (planId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/member/membership?selectedPlan=${planId}` } });
    } else {
      navigate(`/member/membership?selectedPlan=${planId}`);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <PublicNavbar />

      <main className="flex-grow-1">
        {/* Banner */}
        <section className="bg-navy text-white py-5 text-center">
          <div className="container py-3">
            <span className="text-lime fw-bold text-uppercase small">Transparent Pricing</span>
            <h1 className="hero-title mt-2 mb-2">Club Membership Tiers</h1>
            <p className="text-light fs-5 mx-auto" style={{ maxWidth: '640px' }}>
              Invest in your athletic passion with all-inclusive sports packages tailored for recreational fitness or elite tournament preparation.
            </p>
          </div>
        </section>

        {/* Pricing Grid */}
        <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
          <div className="container py-4">
            {loading ? (
              <Loader message="Loading membership plans..." />
            ) : plans.length === 0 ? (
              <EmptyState title="No plans currently available" />
            ) : (
              <div className="row g-4 justify-content-center">
                {plans.map((plan) => (
                  <div key={plan._id} className="col-lg-3 col-md-6">
                    <div className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
                      {plan.badge && (
                        <span className="pricing-badge">{plan.badge}</span>
                      )}

                      <h4 className="font-heading fw-bold text-navy mb-1">{plan.name}</h4>
                      <p className="text-muted small mb-0">{plan.tagline}</p>

                      <div className="pricing-price">
                        {formatCurrency(plan.price)}
                        <span className="fs-6"> / {plan.durationMonths} mo</span>
                      </div>

                      <div className="border-top my-3"></div>

                      <ul className="pricing-features">
                        {plan.benefits.map((benefit, idx) => (
                          <li key={idx} className="pricing-feature-item">
                            <CheckCircle size={18} />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant={plan.isPopular ? 'lime' : 'navy'}
                        className="w-100 mt-auto"
                        onClick={() => handleSelectPlan(plan._id)}
                      >
                        {isAuthenticated ? 'Subscribe Now' : 'Join With This Plan'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Perks Strip */}
            <div className="card-custom p-4 mt-5 bg-white border-0 shadow-sm">
              <div className="row g-4 text-center">
                <div className="col-md-4">
                  <Shield size={32} className="text-lime mb-2 mx-auto" />
                  <h6 className="fw-bold text-navy">No Hidden Fees</h6>
                  <p className="text-muted small mb-0">Transparent billing with zero surprise maintenance or court surcharges.</p>
                </div>
                <div className="col-md-4">
                  <Sparkles size={32} className="text-orange mb-2 mx-auto" />
                  <h6 className="fw-bold text-navy">VIP Locker & Amenities</h6>
                  <p className="text-muted small mb-0">Complimentary lockers, steam showers, and equipment discounts.</p>
                </div>
                <div className="col-md-4">
                  <CheckCircle size={32} className="text-lime mb-2 mx-auto" />
                  <h6 className="fw-bold text-navy">Instant Digital Activation</h6>
                  <p className="text-muted small mb-0">Membership activates instantly in your portal upon checkout.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default MembershipPlans;
