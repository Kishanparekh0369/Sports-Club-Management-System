import React from 'react';
import Button from './Button';

const ConfirmDialog = ({
  show,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'orange',
  loading = false,
  onConfirm,
  onCancel
}) => {
  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(3px)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content card-custom p-3 border-0">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title font-heading fw-bold">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onCancel}
              disabled={loading}
            ></button>
          </div>
          <div className="modal-body py-3">
            <p className="text-muted mb-0">{message}</p>
          </div>
          <div className="modal-footer border-0 pt-0 gap-2">
            <Button variant="outline-navy" size="sm" onClick={onCancel} disabled={loading}>
              {cancelText}
            </Button>
            <Button
              variant={confirmVariant}
              size="sm"
              loading={loading}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
