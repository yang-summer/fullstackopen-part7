import { useContext } from 'react';
import { NotificationContext } from '../contexts/notificationContext';

const Notification = () => {
  const notification = useContext(NotificationContext);

  if (!notification || !notification.content) {
    return null;
  }

  return <div className={notification.type}>{notification.content}</div>;
};

export default Notification;
