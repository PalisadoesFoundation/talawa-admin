import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserOrganizations from './UserOrganizations';
import { MemoryRouter } from 'react-router';
import React from 'react';
import {
  InterfacePageHeaderProps,
  InterfacePeopleTabUserOrganizationProps,
} from 'types/PeopleTab/interface';

// ---- MOCKS ---- //

vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: vi.fn(() => 'user-1'),
  }),
}));

vi.mock(
  'shared-components/PeopleTabUserOrganizations/PeopleTabUserOrganizations',
  () => ({
    default: (props: InterfacePeopleTabUserOrganizationProps) => (
      <div data-testid="org-card">
        <h3>{props.title}</h3>
        <p>{props.description}</p>
      </div>
    ),
  }),
);

vi.mock('shared-components/Navbar/Navbar', () => ({
  default: (props: InterfacePageHeaderProps) => (
    <div>
      {props.search && (
        <input
          data-testid={props.search.inputTestId ?? 'search-input'}
          placeholder={props.search.placeholder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.search?.onSearch(e.target.value)
          }
        />
      )}
      {props.sorting &&
        props.sorting.map((s) => (
          <select
            key={s.title}
            data-testid={s.testIdPrefix}
            value={s.selected}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              s.onChange(e.target.value)
            }
          >
            {s.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}
    </div>
  ),
}));

// ---- DATA ---- //

interface InterfaceOrgEdge {
  node: { id: string; name: string };
}

interface InterfaceMockUserData {
  user: {
    createdOrganizations: { id: string; name: string }[];
    organizationsWhereMember: { edges: InterfaceOrgEdge[] };
    joinedOrganizations: { edges: InterfaceOrgEdge[] };
  };
}

const mockUserData: InterfaceMockUserData = {
  user: {
    createdOrganizations: [{ id: '1', name: 'Created Org' }],
    organizationsWhereMember: {
      edges: [{ node: { id: '2', name: 'Belong Org' } }],
    },
    joinedOrganizations: {
      edges: [{ node: { id: '3', name: 'Joined Org' } }],
    },
  },
};

const mockUseQuery = async () => {
  const { useQuery } = await import('@apollo/client');
  (useQuery as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    (query: { loc?: { source?: { body: string } } }) => {
      if (query?.loc?.source?.body?.includes('user')) {
        return { data: mockUserData };
      }
      return { data: {} };
    },
  );
};

// ---- TESTS ---- //

describe('UserOrganizations', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    await mockUseQuery();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <UserOrganizations />
      </MemoryRouter>,
    );

  it('renders all organization types', () => {
    renderComponent();

    expect(screen.getByText('Created Org')).toBeInTheDocument();
    expect(screen.getByText('Belong Org')).toBeInTheDocument();
    expect(screen.getByText('Joined Org')).toBeInTheDocument();
  });

  it('filters organizations by search', () => {
    renderComponent();

    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'created' },
    });

    expect(screen.getByText('Created Org')).toBeInTheDocument();
    expect(screen.queryByText('Belong Org')).not.toBeInTheDocument();
  });

  it('filters organizations by type', () => {
    renderComponent();

    fireEvent.change(screen.getByTestId('orgFilter'), {
      target: { value: 'JOINED' },
    });

    expect(screen.getByText('Joined Org')).toBeInTheDocument();
    expect(screen.queryByText('Created Org')).not.toBeInTheDocument();
  });

  it('shows empty state when no orgs match filter', () => {
    renderComponent();

    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'xyz' },
    });

    expect(screen.getByText('No organizations found.')).toBeInTheDocument();
  });

  it('handles missing user data safely', async () => {
    const { useQuery } = await import('@apollo/client');

    (useQuery as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => ({
        data: undefined,
      }),
    );

    render(
      <MemoryRouter>
        <UserOrganizations />
      </MemoryRouter>,
    );

    expect(screen.getByText('No organizations found.')).toBeInTheDocument();
  });

  it('changes sort order when sort option is changed', () => {
    renderComponent();

    const orgsAsc = screen.getAllByTestId('org-card');
    expect(orgsAsc[0]).toHaveTextContent('Belong Org');
    expect(orgsAsc[1]).toHaveTextContent('Created Org');
    expect(orgsAsc[2]).toHaveTextContent('Joined Org');

    fireEvent.change(screen.getByTestId('orgSort'), {
      target: { value: 'DESC' },
    });

    const orgsDesc = screen.getAllByTestId('org-card');
    expect(orgsDesc[0]).toHaveTextContent('Joined Org');
    expect(orgsDesc[2]).toHaveTextContent('Belong Org');
  });
});
