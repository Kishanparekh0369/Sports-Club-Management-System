import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Bell,
  CheckCircle,
  Clock,
  CalendarDays,
  BookmarkCheck,
  CreditCard,
  Megaphone,
  CheckCheck
} from 'lucide-react';
import MemberHeader from '../../components/layout/MemberHeader';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { notificationService } from '../../services/notificationService';
import { formatDateTime } from '../../utils/formatDate';

const Notifications = () => {
  const { onToggleMobile } = useOutletContext();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch {
      // Silently catch
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      toast.success('All notifications marked as read.');
      fetchNotifications();
    } catch {
      toast.error('Failed to update notifications');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return <BookmarkCheck size={20} className="text-lime" />;
      case 'event':
        return <CalendarDays size={20} className="text-orange" />;
      case 'membership':
        return <CreditCard size={20} className="text-primary" />;
      case 'announcement':
        return <Megaphone size={20} className="text-warning" />;
      default:
        return <Bell size={20} className="text-muted" />;
    }
  };

  return (
    <>
      <MemberHeader title="Alerts & Notifications" breadcrumb="Notifications" onToggleMobile={onToggleMobile} />

      <div className="dashboard-content">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h4 className="font-heading fw-bold text-navy mb-1">
              Notification Center {unreadCount > 0 && `(${unreadCount} unread)`}
            </h4>
            <span className="text-muted small">
              Real-time alerts regarding court bookings, tournament updates, and club announcements
            </span>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline-navy"
              size="sm"
              icon={CheckCheck}
              onClick={handleMarkAllAsRead}
            >
              Mark All As Read
            </Button>
          )}
        </div>

        {/* Notifications Card Feed */}
        <div className="card-custom bg-white overflow-hidden">
          {loading ? (
            <Loader message="Loading your notifications..." />
          ) : notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up! New reservation and tournament notices will appear here."
            />
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                style={{ cursor: !n.isRead ? 'pointer' : 'default' }}
              >
                <div className="notification-icon-wrapper bg-surface-subtle">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-baseline mb-1">
                    <h6 className="fw-bold text-navy mb-0">{n.title}</h6>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      {formatDateTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-muted small mb-0">{n.message}</p>
                </div>

                {!n.isRead && (
                  <span
                    className="badge rounded-pill bg-success p-1"
                    title="Unread"
                    style={{ width: 8, height: 8 }}
                  ></span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
