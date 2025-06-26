import React, { useState } from 'react';
import Notification from './Notification';

type NotificationData = {
  id: number;
  type: 'info' | 'success' | 'error' | 'warning';
  title: string;
  message: string;
};

let idCounter = 0;

export const addNotification = (notif: Omit<NotificationData, 'id'>) => {
  window.dispatchEvent(new CustomEvent('add-notification', { detail: notif }));
};

export default function NotificationsContainer() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  React.useEffect(() => {
    const handler = (e: CustomEvent<Omit<NotificationData, 'id'>>) => {
      setNotifications((prev) => [...prev, { id: ++idCounter, ...e.detail }]);
    };
    window.addEventListener('add-notification', handler as EventListener);
    return () => window.removeEventListener('add-notification', handler as EventListener);
  }, []);

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="notifications-container" style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>
      {notifications.map((n) => (
        <Notification
          key={n.id}
          type={n.type}
          title={n.title}
          message={n.message}
          onClose={() => removeNotification(n.id)}
        />
      ))}
    </div>
  );
}
