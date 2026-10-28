import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import Button from '../../components/common/Button';

const NotFound = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <PublicNavbar />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5 text-center bg-white">
        <div className="container py-5">
          <div className="bg-lime-subtle p-3 rounded-circle d-inline-flex mb-4">
            <Compass size={64} className="text-lime" />
          </div>
          <h1 className="display-3 font-heading fw-bold text-navy mb-2">404</h1>
          <h3 className="font-heading fw-bold text-navy mb-3">Page Out Of Bounds</h3>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: 460 }}>
            The page or court resource you are looking for does not exist or has been relocated to another championship venue.
          </p>
          <Link to="/" className="btn-athletic btn-athletic-lime btn-athletic-lg">
            <ArrowLeft size={18} /> Return To Homepage
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default NotFound;
