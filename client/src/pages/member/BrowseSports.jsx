import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Trophy, Search, ArrowRight, Building2, Users } from 'lucide-react';
import MemberHeader from '../../components/layout/MemberHeader';
import SearchInput from '../../components/common/SearchInput';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { sportService } from '../../services/sportService';
import { formatCurrency } from '../../utils/formatCurrency';

const BrowseSports = () => {
  const { onToggleMobile } = useOutletContext();
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Outdoor', 'Indoor', 'Aquatic', 'Fitness', 'Racket'];

  useEffect(() => {
    const fetchSports = async () => {
      setLoading(true);
      try {
        const params = {};
        if (categoryFilter !== 'All') params.category = categoryFilter;
        if (search) params.search = search;
        const res = await sportService.getSports(params);
        setSports(res.sports || []);
      } catch (err) {
        console.error('Failed to load sports', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSports();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, categoryFilter]);

  return (
    <>
      <MemberHeader title="Sports Directory" breadcrumb="Browse Sports" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="mb-4">
          <h4 className="font-heading fw-bold text-navy mb-1">Browse Available Sports</h4>
          <span className="text-muted small">Select any sport to explore venues, assign coaches, and book private court slots</span>
        </div>

        {/* Filter Controls */}
        <div className="filter-bar">
          <div className="row g-3 align-items-center">
            <div className="col-lg-6">
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm px-3 rounded-pill fw-semibold ${
                      categoryFilter === cat ? 'btn-athletic-lime' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <SearchInput
                placeholder="Search sports by title..."
                value={search}
                onChange={(val) => setSearch(val)}
              />
            </div>
          </div>
        </div>

        {/* Sports Cards */}
        <div className="row g-4">
          {loading ? (
            <div className="col-12">
              <Loader message="Loading available sports..." />
            </div>
          ) : sports.length === 0 ? (
            <div className="col-12">
              <EmptyState title="No sports match criteria" />
            </div>
          ) : (
            sports.map((sport) => (
              <div key={sport._id} className="col-lg-4 col-md-6">
                <div className="sport-card h-100">
                  <div className="sport-card-img-wrapper" style={{ height: 210 }}>
                    <img
                      src={sport.image}
                      alt={sport.name}
                      className="sport-card-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <span className="sport-card-category">{sport.category}</span>
                    <span className="sport-card-price">{formatCurrency(sport.price)} / hr</span>
                  </div>
                  <div className="sport-card-body">
                    <h5 className="font-heading fw-bold text-navy mb-1">{sport.name}</h5>
                    <p className="text-muted small line-clamp-2 mb-3">{sport.description}</p>

                    <div className="small text-muted mb-3 d-flex flex-column gap-1">
                      <div className="d-flex align-items-center gap-2">
                        <Building2 size={16} className="text-lime flex-shrink-0" />
                        <span>
                          {sport.facilities && sport.facilities.length > 0
                            ? sport.facilities.map((f) => f.name).join(', ')
                            : 'Club Arena'}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Users size={16} className="text-orange flex-shrink-0" />
                        <span>Max Capacity: {sport.capacity} athletes</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-3 border-top d-flex gap-2">
                      <Link
                        to={`/member/sports/${sport._id}`}
                        className="btn btn-sm btn-outline-secondary flex-grow-1"
                      >
                        Details
                      </Link>
                      <Link
                        to={`/member/book?sportId=${sport._id}`}
                        className="btn btn-sm btn-athletic-lime flex-grow-1 text-center"
                      >
                        Book Slot <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default BrowseSports;
