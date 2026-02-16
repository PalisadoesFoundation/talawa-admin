import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { vi, afterEach, describe, it, expect } from 'vitest';
import OrganizationPeople from './OrganizationPeople';
import i18nForTest from 'utils/i18nForTest';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { PAGE_SIZE } from 'types/ReportingTable/utils';

dayjs.extend(utc);

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

vi.mock(
  'shared-components/SearchFilterBar/SearchFilterBar',
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import('shared-components/SearchFilterBar/SearchFilterBar')
      >();
    return {
      default: (props: React.ComponentProps<typeof actual.default>) => (
        <actual.default {...props} />
      ),
    };
  },
);

const mockOrgId = 'org123';
const fixedDate = dayjs()
  .year(2023)
  .month(0)
  .date(1)
  .startOf('day')
  .toISOString();

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
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const mocks = [
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
      <MockedProvider mocks={mocks} addTypename={false}>
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
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Verify Add Member button is NOT present
    const addMemberBtn = screen.queryByTestId('add-member-button');
    expect(addMemberBtn).not.toBeInTheDocument();
  });

  it('hides "Action" column in User Portal', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Check Action is missing
    expect(screen.queryByText(/action/i)).not.toBeInTheDocument();
  });

  it('does not show "Users" filter option', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Verify "Users" option is not present in the document
    // Note: This relies on the text not being visible if the dropdown is open OR closed (if mostly unrendered).
    // In this specific component, options are passed to SearchFilterBar.
    // We assert that the text "Users" (which corresponds to the option label) is not found.
    expect(screen.queryByText('Users')).not.toBeInTheDocument();
  });
});
