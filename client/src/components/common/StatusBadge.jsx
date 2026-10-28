import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  const config = {
    active: { label: 'Active', bg: 'bg-success-subtle text-success border border-success-subtle' },
    inactive: { label: 'Inactive', bg: 'bg-secondary-subtle text-secondary border border-secondary-subtle' },
    confirmed: { label: 'Confirmed', bg: 'bg-success-subtle text-success border border-success-subtle' },
    pending: { label: 'Pending', bg: 'bg-warning-subtle text-warning border border-warning-subtle' },
    rejected: { label: 'Rejected', bg: 'bg-danger-subtle text-danger border border-danger-subtle' },
    cancelled: { label: 'Cancelled', bg: 'bg-danger-subtle text-danger border border-danger-subtle' },
    completed: { label: 'Completed', bg: 'bg-success-subtle text-success border border-success-subtle' },
    upcoming: { label: 'Upcoming', bg: 'bg-primary-subtle text-primary border border-primary-subtle' },
    available: { label: 'Available', bg: 'bg-success-subtle text-success border border-success-subtle' },
    maintenance: { label: 'Maintenance', bg: 'bg-warning-subtle text-warning border border-warning-subtle' },
    expired: { label: 'Expired', bg: 'bg-secondary-subtle text-secondary border border-secondary-subtle' }
  }[normalized] || { label: status, bg: 'bg-light text-dark' };

  return (
    <span className={`badge-pill ${config.bg}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
