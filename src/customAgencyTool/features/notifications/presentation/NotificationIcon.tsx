import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { notificationService } from '../infrastructure/composition-root';

export const NotificationIcon: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(notificationService.getUnreadCount());

  useEffect(() => {
    const unsubscribe = notificationService.subscribeToUnreadCount(setUnreadCount);
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ position: 'relative', cursor: 'pointer' }}>
      <FaBell size={24} />
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: -5,
          right: -5,
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '50%',
          padding: '2px 6px',
          fontSize: '12px',
        }}>
          {unreadCount}
        </span>
      )}
    </div>
  );
};
