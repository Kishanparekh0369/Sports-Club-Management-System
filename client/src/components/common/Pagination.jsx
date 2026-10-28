import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="d-flex justify-content-center align-items-center gap-1 my-4">
      <button
        className="btn btn-sm btn-outline-secondary px-2 py-1"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        title="Previous Page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`btn btn-sm px-3 py-1 fw-bold ${
            currentPage === p
              ? 'btn-athletic-navy'
              : 'btn-outline-secondary'
          }`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="btn btn-sm btn-outline-secondary px-2 py-1"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        title="Next Page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
