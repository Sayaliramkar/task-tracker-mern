import React from 'react';
import { useTask } from '../context/TaskContext';

const icons = {
  success: '✓',
  error: '✕',
  info: 'i',
  warning: '⚠',
};

export default function NotificationStack() {
  const { notifications, dismissNotification } = useTask();

  if (!notifications.length) return null;

  return (
    <div className="notification-stack" aria-live="polite" aria-label="Notifications">
      {notifications.map((n) => (
        <div key={n.id} className={`notification notification--${n.type}`} role="alert">
          <span className="notification__icon">{icons[n.type] || icons.info}</span>
          <span className="notification__message">{n.message}</span>
          <button
            className="notification__close"
            onClick={() => dismissNotification(n.id)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
