import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is currently no data to display here.',
  actionText,
  onAction
}) => {
  return (
    <div className="empty-state-card my-3">
      <div className="empty-state-icon">
        <Icon size={32} />
      </div>
      <h5 className="font-heading fw-bold mb-1">{title}</h5>
      <p className="text-muted mb-3 mx-auto" style={{ maxWidth: '420px' }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="lime" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
