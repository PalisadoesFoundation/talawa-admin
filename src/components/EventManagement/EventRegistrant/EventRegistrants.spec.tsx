import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import EventRegistrants from './EventRegistrants';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import { REGISTRANTS_MOCKS } from './Registrations.mocks';
import { MOCKS as ATTENDEES_MOCKS } from '../EventAttendance/EventAttendanceMocks';
import { vi } from 'vitest';
import { EVENT_REGISTRANTS, EVENT_ATTENDEES } from 'GraphQl/Queries/Queries';
import styles from 'style/app-fixed.module.css';

const COMBINED_MOCKS = [...REGISTRANTS_MOCKS, ...ATTENDEES_MOCKS];

const link = new StaticMockLink(COMBINED_MOCKS, true);

async function wait(): Promise<void> {
  await waitFor(() => {
    return Promise.resolve();
  });
}

const renderEventRegistrants = (): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <EventRegistrants />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('Event Registrants Component', () => {
  beforeEach(() => {
    vi.mock('react-router', async () => {
      const actual = await vi.importActual('react-router');
      return {
        ...actual,
        useParams: () => ({ eventId: 'event123', orgId: 'org123' }),
        useNavigate: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  test('Component loads correctly with table headers', async () => {
    renderEventRegistrants();

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('table-header-serial')).toBeInTheDocument();
      expect(screen.getByTestId('table-header-registrant')).toBeInTheDocument();
      expect(screen.getByTestId('table-header-created-at')).toBeInTheDocument();
      expect(screen.getByTestId('table-header-options')).toBeInTheDocument();
    });
  });

  test('Renders registrants button correctly', async () => {
    renderEventRegistrants();

    await waitFor(() => {
      expect(screen.getByTestId('stats-modal')).toBeInTheDocument();
      expect(screen.getByTestId('filter-button')).toBeInTheDocument();
    });
  });

  test('Handles empty registrants list', async () => {
    const emptyMocks = [
      {
        request: {
          query: EVENT_REGISTRANTS,
          variables: { eventId: '660fdf7d2c1ef6c7db1649ad' },
        },
        result: { data: { getEventAttendeesByEventId: [] } },
      },
      {
        request: {
          query: EVENT_ATTENDEES,
          variables: { id: '660fdf7d2c1ef6c7db1649ad' },
        },
        result: { data: { event: { attendees: [] } } },
      },
    ];

    const customLink = new StaticMockLink(emptyMocks, true);
    render(
      <MockedProvider link={customLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <EventRegistrants />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('no-registrants')).toBeInTheDocument();
    });
  });

  test('Successfully combines and displays registrant and attendee data', async () => {
    const mockData = [
      {
        request: {
          query: EVENT_REGISTRANTS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            getEventAttendeesByEventId: [
              {
                id: '1',
                user: {
                  id: 'user1',
                  name: 'John Doe',
                  emailAddress: 'john@example.com',
                },
                isRegistered: true,
                isInvited: false,
                createdAt: '2023-09-25T10:00:00.000Z',
                __typename: 'EventAttendee',
              },
            ],
          },
        },
      },
      {
        request: { query: EVENT_ATTENDEES, variables: { eventId: 'event123' } },
        result: {
          data: {
            event: {
              attendees: [
                {
                  id: 'user1',
                  name: 'John Doe',
                  emailAddress: 'john@example.com',
                  createdAt: '2023-09-25T10:00:00.000Z',
                  __typename: 'User',
                },
              ],
            },
          },
        },
      },
    ];

    const customLink = new StaticMockLink(mockData, true);
    render(
      <MockedProvider link={customLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <EventRegistrants />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('registrant-row-0')).toBeInTheDocument();
    });

    // Validate mapped data
    expect(screen.getByTestId('attendee-name-0')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('registrant-registered-at-0')).toHaveTextContent(
      '2023-09-25',
    );
  });

  test('Handles missing attendee data with fallback values', async () => {
    const mocksWithMissingFields = [
      {
        request: {
          query: EVENT_REGISTRANTS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            getEventAttendeesByEventId: [
              {
                id: '1',
                user: {
                  id: 'user1',
                  name: 'Jane Doe',
                  emailAddress: 'jane@example.com',
                },
                isRegistered: true,
                isInvited: false,
                __typename: 'EventAttendee',
              },
            ],
          },
        },
      },
      {
        request: { query: EVENT_ATTENDEES, variables: { eventId: 'event123' } },
        result: {
          data: {
            event: {
              attendees: [
                {
                  id: 'user1',
                  name: 'Jane Doe',
                  emailAddress: 'jane@example.com',
                  createdAt: null,
                  __typename: 'User',
                },
              ],
            },
          },
        },
      },
    ];

    const customLink = new StaticMockLink(mocksWithMissingFields, true);
    render(
      <MockedProvider link={customLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <EventRegistrants />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('registrant-row-0')).toBeInTheDocument();
    });

    // Validate fallback values
    expect(screen.getByTestId('attendee-name-0')).toHaveTextContent('Jane Doe');
    expect(screen.getByTestId('registrant-created-at-0')).toHaveTextContent(
      'N/A',
    );
  });
});

describe('EventRegistrants CSS Tests', () => {
  const renderEventRegistrants = (): RenderResult => {
    return render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <EventRegistrants />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  beforeEach(() => {
    vi.mock('react-router', async () => ({
      ...(await vi.importActual('react-router')),
      useParams: () => ({ eventId: 'event123', orgId: 'org123' }),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should apply correct styles to the filter button', () => {
    renderEventRegistrants();
    const filterButton = screen.getByTestId('filter-button');

    expect(filterButton).toHaveClass('border-1', 'mx-4', styles.createButton);
  });

  it('should apply correct styles to the table container', () => {
    renderEventRegistrants();
    const tableContainer = screen.getByRole('grid').closest('.MuiPaper-root');
    expect(tableContainer).toHaveClass('mt-3');
    expect(tableContainer).toHaveStyle({ borderRadius: '16px' });
  });

  it('should style table header cells with custom cell class', () => {
    renderEventRegistrants();
    const headerCells = [
      screen.getByTestId('table-header-serial'),
      screen.getByTestId('table-header-registrant'),
      screen.getByTestId('table-header-registered-at'),
      screen.getByTestId('table-header-created-at'),
      screen.getByTestId('table-header-options'),
    ];
    headerCells.forEach((cell) => {
      expect(cell).toHaveClass(styles.customcell);
    });
  });

  it('should apply proper spacing between buttons', () => {
    renderEventRegistrants();
    const filterButton = screen.getByTestId('filter-button');
    expect(filterButton).toHaveClass('mx-4');
  });
});
