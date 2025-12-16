import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import Notification from './Notification';
import {
  GET_USER_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
} from 'GraphQl/Queries/NotificationQueries';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { toast } from 'react-toastify';

vi.mock('utils/useLocalstorage', () => ({
  __esModule: true,
  default: () => ({
    getItem: vi.fn().mockReturnValue('user-1'),
  }),
}));

interface InterfaceNotification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  navigation?: string;
}

const mocks = (
  notifications: InterfaceNotification[],
  markAsReadError = false,
) => [
  // duplicate first page response to be resilient to double rendering in tests
  {
    request: {
      query: GET_USER_NOTIFICATIONS,
      variables: {
        userId: 'user-1',
        input: {
          first: 6,
          skip: 0,
        },
      },
    },
    result: {
      data: {
        user: {
          notifications: notifications.slice(0, 6),
        },
      },
    },
  },
  {
    request: {
      query: GET_USER_NOTIFICATIONS,
      variables: {
        userId: 'user-1',
        input: {
          first: 6,
          skip: 0,
        },
      },
    },
    result: {
      data: {
        user: {
          notifications: notifications.slice(0, 6),
        },
      },
    },
  },
  {
    request: {
      query: GET_USER_NOTIFICATIONS,
      variables: {
        userId: 'user-1',
        input: {
          first: 6,
          skip: 6,
        },
      },
    },
    result: {
      data: {
        user: {
          notifications: notifications.slice(6, 14),
        },
      },
    },
  },
  // duplicate second page as well to be resilient to double renders on page change
  {
    request: {
      query: GET_USER_NOTIFICATIONS,
      variables: {
        userId: 'user-1',
        input: {
          first: 6,
          skip: 6,
        },
      },
    },
    result: {
      data: {
        user: {
          notifications: notifications.slice(6, 14),
        },
      },
    },
  },
  {
    request: {
      query: MARK_NOTIFICATION_AS_READ,
      variables: {
        input: { notificationIds: ['1'] },
      },
    },
    result: markAsReadError
      ? { errors: [new Error('An error occurred')] }
      : { data: { markNotificationsAsRead: { success: true } } },
  },
];

const generateNotifications = (
  count: number,
  isRead: boolean,
): InterfaceNotification[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    title: `Notification ${i + 1}`,
    body: `This is notification ${i + 1}`,
    isRead,
    navigation: `/notification/${i + 1}`,
  }));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Notification Component', () => {
  it('should render skeleton loader while loading', () => {
    const { container } = render(
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );
    // CSS modules hash class names, so match by substring
    const skeletons = container.querySelectorAll('[class*="skeletonTitle"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render "You\'re all caught up!" when there are no notifications', async () => {
    render(
      <MockedProvider mocks={mocks([])}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("You're all caught up!")).toBeInTheDocument();
    });
  });

  it('should render a list of notifications', async () => {
    const notifications = generateNotifications(5, false);
    render(
      <MockedProvider mocks={mocks(notifications)}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Notification 1')).toBeInTheDocument();
      expect(screen.getByText('Notification 5')).toBeInTheDocument();
    });
  });

  it('should handle marking a notification as read', async () => {
    const notifications = generateNotifications(1, false);
    const refetchMock = {
      request: {
        query: GET_USER_NOTIFICATIONS,
        variables: { userId: 'user-1', input: { first: 6, skip: 0 } },
      },
      result: {
        data: {
          user: {
            notifications: [{ ...notifications[0], isRead: true }],
          },
        },
      },
    };

    // Use an explicit mock order: initial query -> mutation -> refetch
    const initialGet = {
      request: {
        query: GET_USER_NOTIFICATIONS,
        variables: { userId: 'user-1', input: { first: 6, skip: 0 } },
      },
      result: {
        data: { user: { notifications: notifications.slice(0, 6) } },
      },
    };

    const markMock = {
      request: {
        query: MARK_NOTIFICATION_AS_READ,
        variables: { input: { notificationIds: ['1'] } },
      },
      result: { data: { markNotificationsAsRead: { success: true } } },
    };

    render(
      <MockedProvider mocks={[initialGet, markMock, refetchMock]}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Mark as Read')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Mark as Read'));

    await waitFor(() => {
      expect(screen.queryByText('Mark as Read')).not.toBeInTheDocument();
    });
  });

  it('should handle pagination', async () => {
    const notifications = generateNotifications(10, false);
    render(
      <MockedProvider mocks={mocks(notifications)}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );
    // wait for first page to load
    await screen.findByText('Notification 1');

    fireEvent.click(await screen.findByText('Next'));

    // second page should contain Notification 8 (index 6)
    await screen.findByText('Notification 8');

    fireEvent.click(await screen.findByText('Prev'));

    await screen.findByText('Notification 1');
  });

  it('should disable prev button on first page and next button on last page', async () => {
    const notifications = generateNotifications(3, false);
    render(
      <MockedProvider mocks={mocks(notifications)}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Prev')).toBeDisabled();
      expect(screen.getByText('Next')).toBeDisabled();
    });
  });

  it('should render empty list items to fill the space', async () => {
    const notifications = generateNotifications(3, true);
    const { container } = render(
      <MockedProvider mocks={mocks(notifications)}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );

    // wait for the real notifications to appear
    await screen.findByText('Notification 1');

    await waitFor(() => {
      // 3 notifications + 4 empty = 6
      const items = container.querySelectorAll('[class*="notificationItem"]');
      expect(items.length).toBe(6);
    });
  });

  it('should handle error when marking notification as read', async () => {
    const notifications = generateNotifications(1, false);
    const toastErrorSpy = vi
      .spyOn(toast, 'error')
      .mockImplementation(() => 1 as unknown as string);

    render(
      <MockedProvider mocks={mocks(notifications, true)}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Mark as Read')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Mark as Read'));

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error marking notifications as read'), // or the exact message from tErrors
      );
    });

    toastErrorSpy.mockRestore();
  });
});

describe('Pagination Visibility', () => {
  it('should hide pagination when there are 0 notifications', async () => {
    render(
      <MockedProvider mocks={mocks([])}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("You're all caught up!")).toBeInTheDocument();
    });

    expect(screen.queryByText('Prev')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('should hide pagination when there is exactly 1 notification and page is 0', async () => {
    const notifications = generateNotifications(1, false);
    render(
      <MockedProvider mocks={mocks(notifications)}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Notification 1')).toBeInTheDocument();
    });

    expect(screen.queryByText('Prev')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('should show pagination when there are more than 1 notifications', async () => {
    const notifications = generateNotifications(3, false);
    render(
      <MockedProvider mocks={mocks(notifications)}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Notification 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should show pagination when page > 0 even with 0 or 1 notifications on current page', async () => {
    const notifications = generateNotifications(10, false);
    render(
      <MockedProvider mocks={mocks(notifications)}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );

    // Navigate to page 2
    await screen.findByText('Notification 1');
    fireEvent.click(await screen.findByText('Next'));
    await screen.findByText('Notification 7');

    // Pagination should still be visible
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});
