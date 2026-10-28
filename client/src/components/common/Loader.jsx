import React from 'react';

const Loader = ({ message = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-surface-light">
        <div className="spinner-athletic mb-3"></div>
        <p className="text-muted fw-semibold">{message}</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-athletic mb-3"></div>
      <p className="text-muted fw-semibold mb-0">{message}</p>
    </div>
  );
};

export default Loader;
