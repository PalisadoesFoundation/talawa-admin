import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import Notification from './Notification';
import {
  GET_USER_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
} from 'GraphQl/Queries/NotificationQueries';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import i18nForTest from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

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
    navigation: `/admin/notification/${i + 1}`,
  }));

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  user = userEvent.setup(); // applies to all tests
});

afterEach(() => {
  vi.clearAllMocks();
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
      expect(
        screen.getByTestId('notifications-empty-state'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('notifications-empty-state-icon'),
      ).toBeInTheDocument();
      expect(screen.getByText(/you're all caught up!/i)).toBeInTheDocument();
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
      expect(screen.getByText(/mark as read/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/mark as read/i));

    await waitFor(() => {
      expect(screen.queryByText(/mark as read/i)).not.toBeInTheDocument();
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

    await user.click(await screen.findByText(/next/i));

    // second page should contain Notification 8 (index 6)
    await screen.findByText('Notification 8');

    await user.click(await screen.findByText(/prev/i));

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
      expect(screen.getByText(/prev/i)).toBeDisabled();
      expect(screen.getByText(/next/i)).toBeDisabled();
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

    render(
      <MockedProvider mocks={mocks(notifications, true)}>
        <MemoryRouter>
          <Notification />
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/mark as read/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/mark as read/i));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        i18nForTest.t('markAsReadError', { ns: 'errors' }),
      );
    });
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
      expect(
        screen.getByTestId('notifications-empty-state'),
      ).toBeInTheDocument();
      expect(screen.getByText(/you're all caught up!/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/prev/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/next/i)).not.toBeInTheDocument();
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

    expect(screen.queryByText(/prev/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/next/i)).not.toBeInTheDocument();
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

    expect(screen.getByText(/prev/i)).toBeInTheDocument();
    expect(screen.getByText(/next/i)).toBeInTheDocument();
  });

  it('should keep pagination visible when navigating beyond first page', async () => {
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
    await user.click(await screen.findByText(/next/i));
    await screen.findByText('Notification 7');

    // Pagination should still be visible
    expect(screen.getByText(/prev/i)).toBeInTheDocument();
    expect(screen.getByText(/next/i)).toBeInTheDocument();
  });

  it('should show pagination when there are exactly 2 notifications', async () => {
    const notifications = generateNotifications(2, false);
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

    expect(screen.getByText(/prev/i)).toBeInTheDocument();
    expect(screen.getByText(/next/i)).toBeInTheDocument();
  });
});
