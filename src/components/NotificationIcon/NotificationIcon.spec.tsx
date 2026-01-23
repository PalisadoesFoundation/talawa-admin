import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Routes, Route } from 'react-router';
import NotificationIcon from './NotificationIcon';
import { GET_USER_NOTIFICATIONS } from 'GraphQl/Queries/NotificationQueries';

vi.mock('react-i18next', () => ({
  useTranslation: (_ns: unknown, options: { keyPrefix: string }) => ({
    t: (key: string) =>
      options?.keyPrefix ? `${options.keyPrefix}.${key}` : key,
    i18n: {
      changeLanguage: () => Promise.resolve(),
    },
  }),
}));

// Mock useLocalStorage
vi.mock('utils/useLocalstorage', () => ({
  __esModule: true,
  default: () => ({
    getItem: vi.fn().mockReturnValue('user-1'),
  }),
}));

let mockNavigate: ReturnType<typeof vi.fn>;
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

interface InterfaceNotification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  navigation?: string;
}

const mocks = (
  notifications: InterfaceNotification[],
  error = false,
  delay = 0,
) => [
  {
    request: {
      query: GET_USER_NOTIFICATIONS,
      variables: {
        userId: 'user-1',
        input: {
          first: 5,
          skip: 0,
        },
      },
    },
    result: error
      ? { errors: [new Error('An error occurred')] }
      : {
          data: {
            user: {
              notifications: notifications,
            },
          },
        },
    delay,
  },
];

const generateNotifications = (
  count: number,
  isRead: boolean,
  longBody = false,
): InterfaceNotification[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    title: `Notification ${i + 1}`,
    body: longBody
      ? `This is a very long notification body that should be truncated ${i + 1}`
      : `This is notification ${i + 1}`,
    isRead,
    navigation: `/notification/${i + 1}`,
  }));

describe('NotificationIcon Component', () => {
  beforeEach(() => {
    mockNavigate = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render loading state', async () => {
    render(
      <MockedProvider mocks={mocks([], false, 500)}>
        <MemoryRouter>
          <NotificationIcon />
        </MemoryRouter>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('notification.loading')).toBeInTheDocument();
    });
  });

  it('should render error state', async () => {
    render(
      <MockedProvider mocks={mocks([], true)}>
        <MemoryRouter>
          <NotificationIcon />
        </MemoryRouter>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(
        screen.getByText('notification.errorFetching'),
      ).toBeInTheDocument();
    });
  });

  it('should render no new notifications message', async () => {
    render(
      <MockedProvider mocks={mocks([])}>
        <MemoryRouter>
          <NotificationIcon />
        </MemoryRouter>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(
        screen.getByText('notification.noNewNotifications'),
      ).toBeInTheDocument();
    });
  });

  it('should display unread count badge', async () => {
    const notifications = generateNotifications(3, false);
    render(
      <MockedProvider mocks={mocks(notifications)}>
        <MemoryRouter>
          <NotificationIcon />
        </MemoryRouter>
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('should display 9+ when unread count is greater than 9', async () => {
    const notifications = generateNotifications(10, false);
    render(
      <MockedProvider mocks={mocks(notifications)}>
        <MemoryRouter>
          <NotificationIcon />
        </MemoryRouter>
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText('9+')).toBeInTheDocument();
    });
  });

  it('should navigate to notification page on click', async () => {
    const notifications = generateNotifications(1, false);
    render(
      <MockedProvider mocks={mocks(notifications)}>
        <MemoryRouter>
          <NotificationIcon />
        </MemoryRouter>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText(/This is notification 1/)).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText(/This is notification 1/));
    expect(mockNavigate).toHaveBeenCalledWith('/notification/1');
  });

  it('should navigate to all notifications page', async () => {
    render(
      <MockedProvider mocks={mocks([])}>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route path="/admin/dashboard" element={<NotificationIcon />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(
      screen.getByText('notification.viewAllNotifications'),
    );
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/notification');
    });
  });

  it('should navigate to user notification page from user portal', async () => {
    render(
      <MockedProvider mocks={mocks([])}>
        <MemoryRouter initialEntries={['/user/dashboard']}>
          <Routes>
            <Route path="/user/dashboard" element={<NotificationIcon />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(
      screen.getByText('notification.viewAllNotifications'),
    );
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/user/notification');
    });
  });

  it('should navigate to default notification page when navigation is not provided', async () => {
    const notifications = [
      { id: '1', title: 'Test', body: 'Test body', isRead: false },
    ];
    render(
      <MockedProvider mocks={mocks(notifications)}>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route path="/admin/dashboard" element={<NotificationIcon />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Test body'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/notification');
    });
  });

  it('should show unread dot for unread notifications', async () => {
    const notifications = [
      generateNotifications(1, false)[0],
      generateNotifications(1, true)[0],
    ];
    notifications[1].id = '2';
    render(
      <MockedProvider mocks={mocks(notifications)}>
        <MemoryRouter>
          <NotificationIcon />
        </MemoryRouter>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByTitle('notification.unread')).toBeInTheDocument();
    });
  });

  it('should truncate long notification bodies', async () => {
    const notifications = generateNotifications(1, false, true);
    render(
      <MockedProvider mocks={mocks(notifications)}>
        <MemoryRouter>
          <NotificationIcon />
        </MemoryRouter>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(
        screen.getByText(/This is a very long notification body that shoul.../),
      ).toBeInTheDocument();
    });
  });
  it('should not truncate short notification bodies', async () => {
    const notifications = generateNotifications(1, false, false);
    render(
      <MockedProvider mocks={mocks(notifications)}>
        <MemoryRouter>
          <NotificationIcon />
        </MemoryRouter>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('This is notification 1')).toBeInTheDocument();
    });
  });

  it('should navigate to user notification page from user portal root', async () => {
    render(
      <MockedProvider mocks={mocks([])}>
        <MemoryRouter initialEntries={['/user']}>
          <Routes>
            <Route path="/user" element={<NotificationIcon />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(
      screen.getByText('notification.viewAllNotifications'),
    );
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/user/notification');
    });
  });
});
