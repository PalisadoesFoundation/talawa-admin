import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import UserEvents from './UserEvents';
import {
  InterfacePeopleTabNavbarProps,
  InterfacePeopletabUserEventsProps,
} from 'types/PeopleTab/interface';

/* ---------------- MOCKS ---------------- */

// Mock PageHeader
vi.mock('shared-components/PeopleTabNavbar/PeopleTabNavbar', () => ({
  default: (props: InterfacePeopleTabNavbarProps) => (
    <div>
      {props.search && (
        <input
          data-testid={props.search.inputTestId || 'events-search'}
          placeholder={props.search.placeholder}
          onChange={(e) => props.search?.onSearch(e.target.value)}
        />
      )}

      {props.sorting &&
        props.sorting.map((sort, idx) => (
          <select
            key={idx}
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

// Mock Apollo useQuery
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    useQuery: vi.fn(() => ({
      data: {
        user: {
          createdOrganizations: [],
          organizationsWhereMember: { edges: [] },
          joinedOrganizations: { edges: [] },
        },
      },
      loading: false,
      error: undefined,
    })),
  };
});

// Mock useLocation
vi.mock('react-router', () => ({
  useLocation: () => ({ state: { id: '123' } }),
}));

// Mock localStorage hook
vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: () => '123',
  }),
}));

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Event Card component
vi.mock('shared-components/PeopleTabUserEvents/PeopleTabUserEvents', () => ({
  default: (props: InterfacePeopletabUserEventsProps) => (
    <div data-testid="event-card">
      <p>{props.eventName}</p>
      <p>{props.eventDescription}</p>
    </div>
  ),
}));

/* ---------------- TESTS ---------------- */

describe('UserEvents Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders events correctly', () => {
    render(<UserEvents />);
    expect(screen.getByText('React Workshop')).toBeInTheDocument();
    expect(screen.getAllByText('Node.js Seminar').length).toBeGreaterThan(0);
  });

  it('filters events by search input', async () => {
    render(<UserEvents />);
    const searchInput = screen.getByTestId('events-search');

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'react');

    expect(screen.getByText('React Workshop')).toBeInTheDocument();
    expect(screen.queryByText('Node.js Seminar')).not.toBeInTheDocument();
  });

  it('shows empty state when no events match search', async () => {
    render(<UserEvents />);
    const searchInput = screen.getByTestId('events-search');

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'python');

    expect(screen.getByText('noeventsAttended')).toBeInTheDocument();
  });

  it('changes sorting order when sort option changes', async () => {
    render(<UserEvents />);
    const sortSelect = screen.getByTestId('eventsSort-select');

    await userEvent.selectOptions(sortSelect, 'DESC');

    const events = screen.getAllByTestId('event-card');
    expect(events.length).toBeGreaterThan(0);
  });

  it('sorts events by name using localeCompare', async () => {
    render(<UserEvents />);
    const sortSelect = screen.getByTestId('eventsSort-select');

    // ---- ASC (A → Z) ----
    await userEvent.selectOptions(sortSelect, 'ASC');
    let eventCards = screen.getAllByTestId('event-card');
    let firstEventName = eventCards[0].querySelector('p')?.textContent;
    expect(firstEventName).toBe('Node.js Seminar');

    // ---- DESC (Z → A) ----
    await userEvent.selectOptions(sortSelect, 'DESC');
    eventCards = screen.getAllByTestId('event-card');
    firstEventName = eventCards[0].querySelector('p')?.textContent;
    expect(firstEventName).toBe('React Workshop');
  });
});
