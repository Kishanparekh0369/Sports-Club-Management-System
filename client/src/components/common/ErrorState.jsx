import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorState = ({
  message = 'Failed to load content. Please check your connection.',
  onRetry
}) => {
  return (
    <div className="card-custom text-center p-4 my-3 border-danger-subtle bg-danger-subtle">
      <AlertCircle size={40} className="text-danger mb-2 mx-auto" />
      <h6 className="fw-bold text-danger mb-1">Something went wrong</h6>
      <p className="text-muted small mb-3">{message}</p>
      {onRetry && (
        <div>
          <Button variant="outline-navy" size="sm" icon={RefreshCw} onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
