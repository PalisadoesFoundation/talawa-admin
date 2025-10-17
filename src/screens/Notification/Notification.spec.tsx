import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import Notification from './Notification';
import {
  GET_USER_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
} from 'GraphQl/Queries/NotificationQueries';

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
          first: 7,
          skip: 0,
        },
      },
    },
    result: {
      data: {
        user: {
          notifications: notifications.slice(0, 7),
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
          first: 7,
          skip: 0,
        },
      },
    },
    result: {
      data: {
        user: {
          notifications: notifications.slice(0, 7),
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
          first: 7,
          skip: 7,
        },
      },
    },
    result: {
      data: {
        user: {
          notifications: notifications.slice(7, 14),
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
          first: 7,
          skip: 7,
        },
      },
    },
    result: {
      data: {
        user: {
          notifications: notifications.slice(7, 14),
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

describe('Notification Component', () => {
  it('should render skeleton loader while loading', () => {
    const { container } = render(
      <MockedProvider mocks={[]} addTypename={false}>
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
      <MockedProvider mocks={mocks([])} addTypename={false}>
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
      <MockedProvider mocks={mocks(notifications)} addTypename={false}>
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
        variables: { userId: 'user-1', input: { first: 7, skip: 0 } },
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
        variables: { userId: 'user-1', input: { first: 7, skip: 0 } },
      },
      result: {
        data: { user: { notifications: notifications.slice(0, 7) } },
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
      <MockedProvider
        mocks={[initialGet, markMock, refetchMock]}
        addTypename={false}
      >
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
      <MockedProvider mocks={mocks(notifications)} addTypename={false}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );
    // wait for first page to load
    await screen.findByText('Notification 1');

    fireEvent.click(await screen.findByText('Next'));

    // second page should contain Notification 8 (index 7)
    await screen.findByText('Notification 8');

    fireEvent.click(await screen.findByText('Prev'));

    await screen.findByText('Notification 1');
  });

  it('should disable prev button on first page and next button on last page', async () => {
    const notifications = generateNotifications(3, false);
    render(
      <MockedProvider mocks={mocks(notifications)} addTypename={false}>
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
      <MockedProvider mocks={mocks(notifications)} addTypename={false}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );

    // wait for the real notifications to appear
    await screen.findByText('Notification 1');

    await waitFor(() => {
      // 3 notifications + 4 empty = 7
      const items = container.querySelectorAll('[class*="notificationItem"]');
      expect(items.length).toBe(7);
    });
  });

  it('should handle error when marking notification as read', async () => {
    const notifications = generateNotifications(1, false);
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <MockedProvider mocks={mocks(notifications, true)} addTypename={false}>
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
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error marking notifications as read:',
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
