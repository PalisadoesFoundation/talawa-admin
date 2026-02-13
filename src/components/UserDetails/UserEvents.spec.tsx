import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import UserEvents from './UserEvents';
import {
  useQuery,
  QueryResult,
  OperationVariables,
  ApolloError,
} from '@apollo/client';
import {
  InterfacePeopleTabNavbarProps,
  InterfacePeopletabUserEventsProps,
} from 'types/PeopleTab/interface';
import { InterfaceGetUserEventsData } from 'types/AdminPortal/UserDetails/UserEvent/interface';
import dayjs from 'dayjs';

/* ---------------- MOCK DATA ---------------- */
const now = dayjs();

const mockEvents: InterfaceGetUserEventsData['eventsByOrganizationId'] = [
  {
    id: '1',
    name: 'React Workshop',
    description: 'Learn React',
    startAt: now.add(1, 'day').hour(10).minute(0).second(0).toISOString(),
    endAt: now.add(1, 'day').hour(12).minute(0).second(0).toISOString(),
    allDay: false,
    location: null,
    isPublic: true,
    isRecurringEventTemplate: false,
    isRegisterable: true,
    createdAt: now.subtract(30, 'day').toISOString(),
    updatedAt: now.subtract(30, 'day').toISOString(),
    attendees: [],
    creator: {
      id: 'user1',
      name: 'John Doe',
      eventsAttended: [],
    },
    organization: {
      id: 'org1',
      name: 'Test Org',
    },
  },
  {
    id: '2',
    name: 'Node.js Seminar',
    description: 'Learn Node',
    startAt: now.add(2, 'day').hour(10).minute(0).second(0).toISOString(),
    endAt: now.add(2, 'day').hour(12).minute(0).second(0).toISOString(),
    allDay: false,
    location: null,
    isPublic: true,
    isRecurringEventTemplate: false,
    isRegisterable: true,
    createdAt: now.subtract(30, 'day').toISOString(),
    updatedAt: now.subtract(30, 'day').toISOString(),
    attendees: [],
    creator: {
      id: 'user2',
      name: 'Jane Smith',
      eventsAttended: [],
    },
    organization: {
      id: 'org1',
      name: 'Test Org',
    },
  },
  {
    id: '3',
    name: 'Angular Bootcamp',
    description: null,
    startAt: now.add(3, 'day').hour(14).minute(0).second(0).toISOString(),
    endAt: now.add(3, 'day').hour(16).minute(0).second(0).toISOString(),
    allDay: false,
    location: null,
    isPublic: true,
    isRecurringEventTemplate: true,
    isRegisterable: true,
    createdAt: now.subtract(30, 'day').toISOString(),
    updatedAt: now.subtract(30, 'day').toISOString(),
    attendees: [],
    creator: {
      id: 'user1',
      name: 'John Doe',
      eventsAttended: [],
    },
    organization: {
      id: 'org1',
      name: 'Test Org',
    },
  },
];

/* ---------------- HELPER MOCK ---------------- */
function createMockQueryResult(
  overrides: Partial<
    QueryResult<InterfaceGetUserEventsData, OperationVariables>
  >,
): QueryResult<InterfaceGetUserEventsData, OperationVariables> {
  return {
    data: undefined,
    loading: false,
    error: undefined,
    called: true,
    client: {} as QueryResult<
      InterfaceGetUserEventsData,
      OperationVariables
    >['client'],
    observable: {} as QueryResult<
      InterfaceGetUserEventsData,
      OperationVariables
    >['observable'],
    networkStatus: 7,
    variables: {},
    refetch: vi.fn(),
    fetchMore: vi.fn(),
    startPolling: vi.fn(),
    stopPolling: vi.fn(),
    subscribeToMore: vi.fn(),
    updateQuery: vi.fn(),
    reobserve: vi.fn(),
    ...overrides,
  } as QueryResult<InterfaceGetUserEventsData, OperationVariables>;
}

/* ---------------- MOCKS ---------------- */

// Navbar
vi.mock('shared-components/PeopleTabNavbar/PeopleTabNavbar', () => ({
  default: (props: InterfacePeopleTabNavbarProps) => (
    <div>
      {props.search && (
        <input
          data-testid="events-search"
          placeholder={props.search.placeholder}
          onChange={(e) => props.search?.onSearch(e.target.value)}
        />
      )}
      {props.sorting?.map((sort) => (
        <select
          key={sort.testIdPrefix}
          data-testid={`${sort.testIdPrefix}-select`}
          value={sort.selected}
          onChange={(e) => sort.onChange(e.target.value)}
        >
          {sort.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  ),
}));

// Event Card
vi.mock('shared-components/PeopleTabUserEvents/PeopleTabUserEvents', () => ({
  default: (props: InterfacePeopletabUserEventsProps) => (
    <div data-testid="event-card">
      <div>{props.eventName}</div>
      <div>{props.eventDescription}</div>
      <div>{props.startDate}</div>
      <div>{props.startTime}</div>
      <div>{props.endDate}</div>
      <div>{props.endTime}</div>
      {props.actionIcon}
      <div>{props.actionName}</div>
    </div>
  ),
}));

// Translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Apollo
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

const mockedUseQuery = vi.mocked(
  useQuery<InterfaceGetUserEventsData, OperationVariables>,
);

/* ---------------- TESTS ---------------- */
describe('UserEvents', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('shows loading state', () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        loading: true,
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const apolloError = new ApolloError({
      graphQLErrors: [],
      networkError: new Error('GraphQL error'),
    });

    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        error: apolloError,
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);
    expect(screen.getByText('somethingWentWrong')).toBeInTheDocument();
  });

  it('renders events correctly', () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);
    expect(screen.getByText('React Workshop')).toBeInTheDocument();
    expect(screen.getByText('Node.js Seminar')).toBeInTheDocument();
    expect(screen.getByText('Angular Bootcamp')).toBeInTheDocument();
  });

  it('handles events with null description correctly', () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);
    // Angular Bootcamp has null description, should render as empty string
    const cards = screen.getAllByTestId('event-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('filters events using search by name', async () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);
    await userEvent.type(screen.getByTestId('events-search'), 'React');

    expect(screen.getByText('React Workshop')).toBeInTheDocument();
    expect(screen.queryByText('Node.js Seminar')).not.toBeInTheDocument();
    expect(screen.queryByText('Angular Bootcamp')).not.toBeInTheDocument();
  });

  it('filters events using search by description', async () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);
    await userEvent.type(screen.getByTestId('events-search'), 'Learn Node');

    expect(screen.queryByText('React Workshop')).not.toBeInTheDocument();
    expect(screen.getByText('Node.js Seminar')).toBeInTheDocument();
    expect(screen.queryByText('Angular Bootcamp')).not.toBeInTheDocument();
  });

  it('shows empty state when search has no matches', async () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);
    await userEvent.type(screen.getByTestId('events-search'), 'Python');

    expect(screen.getByText('noeventsAttended')).toBeInTheDocument();
  });

  it('sorts events ASC (A → Z)', async () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);
    const sortSelect = screen.getByTestId('eventsSort-select');
    await userEvent.selectOptions(sortSelect, 'ASC');

    const cards = screen.getAllByTestId('event-card');
    // Alphabetically: Angular Bootcamp, Node.js Seminar, React Workshop
    expect(cards[0]).toHaveTextContent('Angular Bootcamp');
    expect(cards[1]).toHaveTextContent('Node.js Seminar');
    expect(cards[2]).toHaveTextContent('React Workshop');
  });

  it('sorts events DESC (Z → A)', async () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);
    const sortSelect = screen.getByTestId('eventsSort-select');
    await userEvent.selectOptions(sortSelect, 'DESC');

    const cards = screen.getAllByTestId('event-card');
    // Reverse alphabetically: React Workshop, Node.js Seminar, Angular Bootcamp
    expect(cards[0]).toHaveTextContent('React Workshop');
    expect(cards[1]).toHaveTextContent('Node.js Seminar');
    expect(cards[2]).toHaveTextContent('Angular Bootcamp');
  });

  it('maintains default Sort option when not changed', () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);

    // When sortOption is 'Sort' (not 'ASC'), the ternary defaults to DESC sorting
    // sortOption === 'ASC' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
    const cards = screen.getAllByTestId('event-card');
    // Should be sorted DESC by default (React Workshop, Node.js Seminar, Angular Bootcamp)
    expect(cards[0]).toHaveTextContent('React Workshop');
    expect(cards[1]).toHaveTextContent('Node.js Seminar');
    expect(cards[2]).toHaveTextContent('Angular Bootcamp');
  });

  it('filters ADMIN_CREATOR events', async () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);
    const filterSelect = screen.getByTestId('eventsParticipationFilter-select');
    await userEvent.selectOptions(filterSelect, 'ADMIN_CREATOR');

    // Only events created by user1
    expect(screen.getByText('React Workshop')).toBeInTheDocument();
    expect(screen.getByText('Angular Bootcamp')).toBeInTheDocument();
    expect(screen.queryByText('Node.js Seminar')).not.toBeInTheDocument();
  });

  it('shows all events when participation filter is ALL', async () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);
    const filterSelect = screen.getByTestId('eventsParticipationFilter-select');

    // First set to ADMIN_CREATOR
    await userEvent.selectOptions(filterSelect, 'ADMIN_CREATOR');
    expect(screen.queryByText('Node.js Seminar')).not.toBeInTheDocument();

    // Then switch back to ALL
    await userEvent.selectOptions(filterSelect, 'ALL');
    expect(screen.getByText('React Workshop')).toBeInTheDocument();
    expect(screen.getByText('Node.js Seminar')).toBeInTheDocument();
    expect(screen.getByText('Angular Bootcamp')).toBeInTheDocument();
  });

  it('combines search and participation filter', async () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);

    // Set participation filter to ADMIN_CREATOR
    const filterSelect = screen.getByTestId('eventsParticipationFilter-select');
    await userEvent.selectOptions(filterSelect, 'ADMIN_CREATOR');

    // Search for React
    await userEvent.type(screen.getByTestId('events-search'), 'React');

    // Should only show React Workshop (created by user1 and matches search)
    expect(screen.getByText('React Workshop')).toBeInTheDocument();
    expect(screen.queryByText('Angular Bootcamp')).not.toBeInTheDocument();
    expect(screen.queryByText('Node.js Seminar')).not.toBeInTheDocument();
  });

  it('combines search, sort, and participation filter', async () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);

    // Set participation filter to ADMIN_CREATOR
    const filterSelect = screen.getByTestId('eventsParticipationFilter-select');
    await userEvent.selectOptions(filterSelect, 'ADMIN_CREATOR');

    // Sort DESC
    const sortSelect = screen.getByTestId('eventsSort-select');
    await userEvent.selectOptions(sortSelect, 'DESC');

    // Both events created by user1, sorted DESC
    const cards = screen.getAllByTestId('event-card');
    expect(cards[0]).toHaveTextContent('React Workshop');
    expect(cards[1]).toHaveTextContent('Angular Bootcamp');
  });

  it('handles empty data array', () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: [] },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);
    expect(screen.getByText('noeventsAttended')).toBeInTheDocument();
  });

  it('handles undefined data', () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: undefined,
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);
    expect(screen.getByText('noeventsAttended')).toBeInTheDocument();
  });

  it('skips query when orgId is not provided', () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents userId="user1" />);

    expect(mockedUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        skip: true,
      }),
    );
  });

  it('does not skip query when orgId is provided', () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);

    expect(mockedUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        skip: false,
        variables: {
          organizationId: 'org1',
        },
      }),
    );
  });

  it('renders without orgId and userId', () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: [] },
      }),
    );

    render(<UserEvents />);
    expect(screen.getByText('noeventsAttended')).toBeInTheDocument();
  });

  it('properly formats date and time from ISO string', () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents.slice(0, 1) },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);

    const expectedDate = now.add(1, 'day').format('YYYY-MM-DD');

    const dateElements = screen.getAllByText(expectedDate);
    expect(dateElements.length).toBeGreaterThan(0);

    const cards = screen.getAllByTestId('event-card');
    expect(cards[0]).toBeInTheDocument();
  });

  it('case-insensitive search works correctly', async () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);

    // Search with different case
    await userEvent.type(screen.getByTestId('events-search'), 'REACT');

    expect(screen.getByText('React Workshop')).toBeInTheDocument();
    expect(screen.queryByText('Node.js Seminar')).not.toBeInTheDocument();
  });

  it('search works with partial matches', async () => {
    mockedUseQuery.mockReturnValue(
      createMockQueryResult({
        data: { eventsByOrganizationId: mockEvents },
      }),
    );

    render(<UserEvents orgId="org1" userId="user1" />);

    // Partial search
    await userEvent.type(screen.getByTestId('events-search'), 'work');

    expect(screen.getByText('React Workshop')).toBeInTheDocument();
    expect(screen.queryByText('Node.js Seminar')).not.toBeInTheDocument();
  });
});
