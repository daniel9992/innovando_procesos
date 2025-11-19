import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Notifications } from './Notifications';
import * as compositionRoot from '../infrastructure/composition-root';
import { ChakraProvider } from '@chakra-ui/react';
import { HelmetProvider } from 'react-helmet-async';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

const mockNotifications = [
  { uid: '1', title: 'Notification 1', message: 'Message 1', isRead: false, date: new Date(), url: '', urlName: '', sender: { uid: '', name: '', email: '' }, receiver: [], searchTerms: [] },
  { uid: '2', title: 'Notification 2', message: 'Message 2', isRead: true, date: new Date(), url: '', urlName: '', sender: { uid: '', name: '', email: '' }, receiver: [], searchTerms: [] },
];

vi.mock('../infrastructure/composition-root', () => ({
  notificationService: {
    subscribeToNotifications: vi.fn((callback) => {
      callback(mockNotifications);
      return () => {}; // Return an unsubscribe function
    }),
  },
  markNotificationAsRead: {
    execute: vi.fn(),
  },
  createNotification: {
    execute: vi.fn(),
  },
}));

describe('Notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders notifications and handles marking as read', async () => {
    render(
      <ChakraProvider>
        <HelmetProvider>
          <Notifications />
        </HelmetProvider>
      </ChakraProvider>
    );

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Notification 1')).toBeInTheDocument();
    expect(screen.getByText('Notification 2')).toBeInTheDocument();

    const markAsReadButton = screen.getByText('Mark as Read');
    fireEvent.click(markAsReadButton);

    await waitFor(() => {
      expect(compositionRoot.markNotificationAsRead.execute).toHaveBeenCalledWith('1');
    });
  });

  it('handles creating a new notification', async () => {
    render(
      <ChakraProvider>
        <HelmetProvider>
          <Notifications />
        </HelmetProvider>
      </ChakraProvider>
    );

    const createButton = screen.getByText('Create Notification');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(compositionRoot.createNotification.execute).toHaveBeenCalled();
    });
  });
});
