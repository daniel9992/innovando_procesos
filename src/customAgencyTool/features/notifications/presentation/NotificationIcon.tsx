import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { notificationService } from '../infrastructure/composition-root';
import { Box, Text } from '@chakra-ui/react';

export const NotificationIcon: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(notificationService.getUnreadCount());

  useEffect(() => {
    const unsubscribe = notificationService.subscribeToUnreadCount(setUnreadCount);
    return () => unsubscribe();
  }, []);

  return (
    <Box position="relative" cursor="pointer">
      <FaBell size={24} />
      {unreadCount > 0 && (
        <Text
          as="span"
          position="absolute"
          top="-5px"
          right="-5px"
          bg="red"
          color="white"
          borderRadius="50%"
          px="6px"
          py="2px"
          fontSize="12px"
        >
          {unreadCount}
        </Text>
      )}
    </Box>
  );
};
