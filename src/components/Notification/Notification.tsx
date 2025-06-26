import React from 'react';
import './notification.scss';

type NotificationType = 'info' | 'success' | 'error' | 'warning';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  onClose?: () => void;
}

const Notification = ({ type, title, message, onClose }: NotificationProps) => {
  return (
    <div className={`notification notification--${type}`}>
      <div className="notification__header">
        <span className={`notification__icon notification__icon--${type}`}></span>
        <span className="notification__title">{title}</span>
        <button className="notification__close" onClick={onClose}>×</button>
      </div>
      <div className="notification__message">{message}</div>
    </div>
  );
};

export default Notification;
