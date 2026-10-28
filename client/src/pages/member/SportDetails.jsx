import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import {
  Trophy,
  Building2,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import MemberHeader from '../../components/layout/MemberHeader';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { sportService } from '../../services/sportService';
import { formatCurrency } from '../../utils/formatCurrency';

const SportDetails = () => {
  const { onToggleMobile } = useOutletContext();
  const { id } = useParams();
  const [sport, setSport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSport = async () => {
      try {
        const res = await sportService.getSportById(id);
        setSport(res.sport);
      } catch (err) {
        console.error('Failed to load sport details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSport();
  }, [id]);

  if (loading) {
    return (
      <>
        <MemberHeader title="Sport Profile" breadcrumb="Sports Details" onToggleMobile={onToggleMobile} />
        <Loader fullScreen message="Loading sport information..." />
      </>
    );
  }

  if (!sport) {
    return (
      <>
        <MemberHeader title="Sport Profile" breadcrumb="Sports Details" onToggleMobile={onToggleMobile} />
        <div className="dashboard-content">
          <ErrorState message="Sport record not found" />
          <Link to="/member/sports" className="btn btn-sm btn-outline-secondary mt-2">
            <ChevronLeft size={16} /> Back To Sports Directory
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <MemberHeader title={sport.name} breadcrumb="Sport Details" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="mb-3">
          <Link to="/member/sports" className="text-muted small fw-semibold d-inline-flex align-items-center gap-1">
            <ChevronLeft size={16} /> Back To Sports Directory
          </Link>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card-custom overflow-hidden mb-4 bg-white">
              <img
                src={sport.image}
                alt={sport.name}
                className="w-100"
                style={{ maxHeight: '380px', objectFit: 'cover' }}
              />
              <div className="p-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge bg-lime-subtle text-success py-1 px-3 fs-6">
                    {sport.category}
                  </span>
                  <span className="badge bg-light text-navy border py-1 px-3 fs-6">
                    Max Capacity: {sport.capacity} Players
                  </span>
                </div>
                <h3 className="font-heading fw-bold text-navy mb-3">{sport.name}</h3>
                <p className="text-muted leading-relaxed mb-4">{sport.description}</p>

                {/* Rules */}
                {sport.rules && sport.rules.length > 0 && (
                  <div className="mb-4">
                    <h6 className="font-heading fw-bold text-navy mb-2">Court Guidelines</h6>
                    <div className="d-flex flex-column gap-2">
                      {sport.rules.map((rule, idx) => (
                        <div key={idx} className="d-flex align-items-start gap-2">
                          <CheckCircle size={16} className="text-lime flex-shrink-0 mt-1" />
                          <span className="text-muted small">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Linked Facilities */}
            {sport.facilities && sport.facilities.length > 0 && (
              <div className="card-custom p-4 mb-4 bg-white">
                <h6 className="font-heading fw-bold text-navy mb-3 d-flex align-items-center gap-2">
                  <Building2 className="text-lime" /> Available Court Grounds
                </h6>
                <div className="row g-3">
                  {sport.facilities.map((fac) => (
                    <div key={fac._id} className="col-md-6">
                      <div className="p-3 border rounded-3 bg-surface-subtle">
                        <div className="fw-bold text-navy">{fac.name}</div>
                        <div className="text-muted small">{fac.courtNumber} • Capacity: {fac.capacity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="card-custom p-4 bg-white sticky-top" style={{ top: '6rem' }}>
              <div className="text-muted small text-uppercase fw-bold">Slot Reservation</div>
              <div className="pricing-price my-2">
                {formatCurrency(sport.price)}
                <span className="fs-6"> / slot</span>
              </div>
              <p className="text-muted small mb-4">
                Instant confirmation and real-time conflict checking against other club members.
              </p>

              <Link
                to={`/member/book?sportId=${sport._id}`}
                className="btn-athletic btn-athletic-lime w-100 py-3 text-center"
              >
                Proceed To Booking <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SportDetails;
