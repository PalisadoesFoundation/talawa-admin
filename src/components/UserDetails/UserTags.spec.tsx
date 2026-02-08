import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import UserTags from './UserTags';
import { InterfacePeopleTabNavbarProps } from 'types/PeopleTab/interface';
import dayjs from 'dayjs';
import { OperationVariables } from '@apollo/client/core/types';
import * as apolloClient from '@apollo/client';
import {
  ApolloError,
  ApolloClient,
  NormalizedCacheObject,
  ObservableQuery,
} from '@apollo/client';

const mockTags = [
  {
    id: '1',
    name: 'Marketing Campaign',
    createdAt: dayjs().subtract(2, 'day').toISOString(),
    assignees: { edges: [{}, {}] },
    creator: { name: 'John Doe' },
  },
  {
    id: '2',
    name: 'Product Launch',
    createdAt: dayjs().subtract(3, 'day').toISOString(),
    assignees: { edges: [{}] },
    creator: { name: 'Sarah Smith' },
  },
  {
    id: '3',
    name: 'Security Audit',
    createdAt: dayjs().subtract(1, 'day').toISOString(),
    assignees: { edges: [] },
    creator: { name: 'Mike Johnson' },
  },
];

/* -------------------- Mocks -------------------- */

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('shared-components/PeopleTabNavbar/PeopleTabNavbar', () => ({
  default: (props: InterfacePeopleTabNavbarProps) => (
    <div>
      {props.search && (
        <input
          data-testid={props.search.inputTestId}
          placeholder={props.search.placeholder}
          onChange={(e) => props.search?.onSearch(e.target.value)}
        />
      )}

      {props.sorting?.map((sort) => (
        <select
          key={sort.title}
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

// Mock @apollo/client with factory function
vi.mock('@apollo/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client')>();

  // Create mock function inside the factory with default return value
  const mockUseQuery = vi.fn(() => ({
    data: { userTags: mockTags },
    loading: false,
    error: undefined,
  }));

  return {
    ...actual,
    useQuery: mockUseQuery,
  };
});

describe('UserTags', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    render(<UserTags id="user-123" />);
  };

  /* -------------------- Tests -------------------- */

  it('renders table headers', () => {
    renderComponent();

    expect(screen.getByText('peopleTabTagName')).toBeInTheDocument();
    expect(screen.getByText('assignedTo')).toBeInTheDocument();
    expect(screen.getByText('createdOn')).toBeInTheDocument();
    expect(screen.getByText('createdBy')).toBeInTheDocument();
  });

  it('renders tags from API', () => {
    renderComponent();

    expect(screen.getByText('Marketing Campaign')).toBeInTheDocument();
    expect(screen.getByText('Product Launch')).toBeInTheDocument();
    expect(screen.getByText('Security Audit')).toBeInTheDocument();
  });

  it('formats created date correctly', () => {
    renderComponent();

    const firstTagDate = dayjs().subtract(2, 'day').format('HH:mm DD MMM YYYY');
    expect(screen.getByText(firstTagDate)).toBeInTheDocument();

    const secondTagDate = dayjs()
      .subtract(3, 'day')
      .format('HH:mm DD MMM YYYY');
    expect(screen.getByText(secondTagDate)).toBeInTheDocument();

    const thirdTagDate = dayjs().subtract(1, 'day').format('HH:mm DD MMM YYYY');
    expect(screen.getByText(thirdTagDate)).toBeInTheDocument();
  });

  it('filters tags by name', async () => {
    renderComponent();

    const searchInput = screen.getByTestId('tagsSearchInput');

    await userEvent.type(searchInput, 'Marketing');

    expect(screen.getByText('Marketing Campaign')).toBeInTheDocument();
    expect(screen.queryByText('Product Launch')).not.toBeInTheDocument();
  });

  it('filters tags by creator name', async () => {
    renderComponent();

    const searchInput = screen.getByTestId('tagsSearchInput');

    await userEvent.type(searchInput, 'Sarah');

    expect(screen.getByText('Product Launch')).toBeInTheDocument();
    expect(screen.queryByText('Marketing Campaign')).not.toBeInTheDocument();
  });

  it('sorts tags when selecting latest', async () => {
    renderComponent();

    const sortSelect = screen.getByTestId('tagsSort-select');

    await userEvent.selectOptions(sortSelect, 'latest');

    const rows = screen.getAllByRole('row');

    // Header row + latest first
    expect(rows[1]).toHaveTextContent('Security Audit');
  });

  it('shows correct assignedTo count', () => {
    renderComponent();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders createdBy as clickable text', () => {
    renderComponent();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sarah Smith')).toBeInTheDocument();
    expect(screen.getByText('Mike Johnson')).toBeInTheDocument();
  });
});

describe('UserTags - loading and error states', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    // Mock useQuery to return loading=true
    vi.mocked(apolloClient.useQuery).mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
      refetch: vi.fn(),
      networkStatus: 1,
      called: true,
      client: {} as ApolloClient<NormalizedCacheObject>,
      observable: {} as ObservableQuery<unknown, OperationVariables>,
      previousData: undefined,
      variables: undefined,
      fetchMore: vi.fn(),
      subscribeToMore: vi.fn(),
      updateQuery: vi.fn(),
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
      reobserve: vi.fn(),
    });

    render(<UserTags id="user-123" />);

    // Should render the loading text
    expect(screen.getByText('loading')).toBeInTheDocument();

    // Table should NOT be rendered
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    // Mock useQuery to return an error
    vi.mocked(apolloClient.useQuery).mockReturnValue({
      data: undefined,
      loading: false,
      error: new ApolloError({ errorMessage: 'GraphQL error' }),
      refetch: vi.fn(),
      networkStatus: 8,
      called: true,
      client: {} as ApolloClient<NormalizedCacheObject>,
      observable: {} as ObservableQuery<unknown, OperationVariables>,
      previousData: undefined,
      variables: undefined,
      fetchMore: vi.fn(),
      subscribeToMore: vi.fn(),
      updateQuery: vi.fn(),
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
      reobserve: vi.fn(),
    });

    render(<UserTags id="user-123" />);

    // Should render the error text
    expect(screen.getByText('somethingWentWrong')).toBeInTheDocument();

    // Table should NOT be rendered
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
