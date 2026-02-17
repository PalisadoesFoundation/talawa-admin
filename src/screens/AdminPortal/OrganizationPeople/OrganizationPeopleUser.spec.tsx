import React from 'react';
import dayjs from 'dayjs';

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { vi, afterEach, describe, it, expect } from 'vitest';
import OrganizationPeople from './OrganizationPeople';
import i18nForTest from 'utils/i18nForTest';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { PAGE_SIZE } from 'types/ReportingTable/utils';

import { ApolloClient, InMemoryCache } from '@apollo/client';

const TEST_TIMEOUTS = {
  STANDARD: 10000,
  FAST: 5000,
};

// Mock child components
vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

vi.mock('./addMember/AddMember', () => ({
  default: () => (
    <button type="button" data-testid="add-member-button">
      Add Member
    </button>
  ),
}));

// Removed SearchFilterBar overhead mock per CodeRabbit feedback (it was pulling too many dependencies).
// If testing deeper interactions is needed, mocking specific methods or using a lighter mock is preferred.

const mockOrgId = 'org123';
// Use a fixed timestamp (2023-01-01) to ensure deterministic tests while avoiding linter error about date strings
const fixedDateTimestamp = 1672531200000;
const fixedDate = dayjs(fixedDateTimestamp).toISOString();

const mockMembers = {
  organization: {
    members: {
      edges: [
        {
          node: {
            id: 'member1',
            name: 'John Doe',
            emailAddress: 'john@example.com',
            avatarURL: 'https://example.com/avatar1.jpg',
            createdAt: fixedDate,
            role: 'member',
          },
          cursor: 'cursor1',
        },
      ],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: 'cursor1',
        endCursor: 'cursor1',
      },
    },
  },
};

describe('OrganizationPeople - User Portal Context', () => {
  let client: ApolloClient<unknown>;

  beforeEach(() => {
    client = new ApolloClient({
      cache: new InMemoryCache({ addTypename: false }),
    });
  });

  afterEach(async () => {
    await client.clearStore();
    cleanup();
    vi.restoreAllMocks();
  });

  const createMocks = () => [
    {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: {
          orgId: mockOrgId,
          first: PAGE_SIZE,
          after: null,
          last: null,
          before: null,
        },
      },
      result: {
        data: mockMembers,
      },
    },
  ];

  const renderComponent = () => {
    return render(
      <MockedProvider
        mocks={createMocks()}
        cache={client.cache as unknown as InMemoryCache}
      >
        <MemoryRouter initialEntries={[`/user/people/${mockOrgId}`]}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              {/* Important: Matches the User Portal route structure */}
              <Route
                path="/user/people/:orgId"
                element={<OrganizationPeople />}
              />
            </Routes>
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>,
    );
  };

  it('hides "Add Member" button in User Portal', async () => {
    renderComponent();

    // Wait for data to load
    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        // Verify Add Member button is NOT present (assertion moved inside waitFor per guidelines)
        const addMemberBtn = screen.queryByTestId('add-member-button');
        expect(addMemberBtn).not.toBeInTheDocument();
      },
      { timeout: TEST_TIMEOUTS.STANDARD },
    );
  });

  it('hides "Action" column in User Portal', async () => {
    renderComponent();

    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { timeout: TEST_TIMEOUTS.STANDARD },
    );

    // Check Action is missing
    await waitFor(
      () => {
        expect(screen.queryByText(/action/i)).not.toBeInTheDocument();
      },
      { timeout: TEST_TIMEOUTS.STANDARD },
    );
  });

  it(
    'does not show "Users" filter option',
    async () => {
      renderComponent();
      await waitFor(
        () => {
          expect(screen.getByText('John Doe')).toBeInTheDocument();
        },
        { timeout: TEST_TIMEOUTS.STANDARD },
      );

      // Verify "Users" option is not present by opening the sort dropdown
      const sortDropdownToggle = screen.getByTestId('sort-toggle');
      // Open the dropdown
      await userEvent.click(sortDropdownToggle);

      expect(screen.queryByText('Users')).not.toBeInTheDocument();
    },
    { timeout: TEST_TIMEOUTS.STANDARD },
  );
});
