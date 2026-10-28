import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trophy, Filter, ArrowRight, Users, Building2 } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { sportService } from '../../services/sportService';
import { formatCurrency } from '../../utils/formatCurrency';

const Sports = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Outdoor', 'Indoor', 'Aquatic', 'Fitness', 'Racket'];

  useEffect(() => {
    const fetchSports = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (search) {
          params.search = search;
        }
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
  }, [search, selectedCategory]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <PublicNavbar />

      <main className="flex-grow-1">
        {/* Banner */}
        <section className="bg-navy text-white py-5 text-center">
          <div className="container py-3">
            <span className="text-lime fw-bold text-uppercase small">Athletic Catalogue</span>
            <h1 className="hero-title mt-2 mb-2">Explore Our Sports Disciplines</h1>
            <p className="text-light fs-5 mx-auto" style={{ maxWidth: '640px' }}>
              International-grade courts, dedicated equipment, certified coaching, and flexible reservation slots.
            </p>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section className="py-4 border-bottom bg-white">
          <div className="container">
            <div className="row g-3 align-items-center justify-content-between">
              {/* Category Pills */}
              <div className="col-lg-7">
                <div className="d-flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`btn btn-sm px-3 py-2 fw-semibold rounded-pill ${
                        selectedCategory === cat
                          ? 'btn-athletic-lime'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Box */}
              <div className="col-lg-4">
                <div className="search-input-wrapper">
                  <Search size={18} />
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="Search by sport name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sports Cards Grid */}
        <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
          <div className="container py-3">
            {loading ? (
              <Loader message="Loading available sports..." />
            ) : sports.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title="No sports match your filter"
                description="Try clearing your search term or selecting another category."
                actionText="Reset Filters"
                onAction={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}
              />
            ) : (
              <div className="row g-4">
                {sports.map((sport) => (
                  <div key={sport._id} className="col-lg-4 col-md-6">
                    <div className="sport-card">
                      <div className="sport-card-img-wrapper" style={{ height: 230 }}>
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
                        <span className="sport-card-price">{formatCurrency(sport.price)} / slot</span>
                      </div>
                      <div className="sport-card-body">
                        <div className="d-flex justify-content-between align-items-baseline mb-2">
                          <h4 className="font-heading fw-bold text-navy mb-0">{sport.name}</h4>
                          <span className="badge bg-success-subtle text-success small">Available</span>
                        </div>
                        <p className="text-muted small line-clamp-3 mb-3">
                          {sport.description}
                        </p>

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
                            <span>Capacity: Up to {sport.capacity} players/slot</span>
                          </div>
                        </div>

                        <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                          <Link
                            to={`/sports/${sport._id}`}
                            className="btn-athletic btn-athletic-lime btn-athletic-sm w-100"
                          >
                            Explore & Book <ArrowRight size={16} />
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
      </main>

      <PublicFooter />
    </div>
  );
};

export default Sports;
