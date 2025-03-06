// src/screens/OrganizationActionItems/organizationActionItems.spec.tsx

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import OrganizationActionItems from './OrganizationActionItems';
import { ACTION_ITEM_FOR_ORGANIZATION } from 'GraphQl/Queries/ActionItemQueries';
import { GET_USERS_BY_IDS, GET_EVENTS_BY_IDS } from 'GraphQl/Queries/Queries';
import { toast } from 'react-toastify';
import type { Mock } from 'vitest';

// --- Global Mocks ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: unknown): string =>
      opts ? `${key} ${JSON.stringify(opts)}` : key,
    tCommon: (key: string): string => key,
    tErrors: (key: string): string => key,
  }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

// --- Sample Data ---
const sampleActionItemsData = {
  actionItemsByOrganization: [
    {
      id: '1',
      isCompleted: false,
      assignedAt: '2025-03-06T00:00:00.000Z',
      completionAt: '',
      preCompletionNotes: 'Pre note 1',
      postCompletionNotes: null,
      createdAt: '2025-03-01T00:00:00.000Z',
      updatedAt: '2025-03-01T00:00:00.000Z',
      organizationId: 'org1',
      categoryId: 'cat1',
      eventId: 'evt1',
      assigneeId: 'user1',
      creatorId: 'user2',
      updaterId: 'user2',
      actionItemCategory: { id: 'cat1', name: 'General' },
    },
    {
      id: '2',
      isCompleted: true,
      assignedAt: '2025-03-05T00:00:00.000Z',
      completionAt: '2025-03-06T00:00:00.000Z',
      preCompletionNotes: 'Pre note 2',
      postCompletionNotes: 'Post note 2',
      createdAt: '2025-03-01T00:00:00.000Z',
      updatedAt: '2025-03-06T00:00:00.000Z',
      organizationId: 'org1',
      categoryId: 'cat1',
      eventId: 'evt2',
      assigneeId: 'user3',
      creatorId: 'user2',
      updaterId: 'user2',
      actionItemCategory: { id: 'cat1', name: 'General' },
    },
  ],
};

const sampleUsersData = {
  usersByIds: [
    { id: 'user1', name: 'User One' },
    { id: 'user2', name: 'User Two' },
    { id: 'user3', name: 'User Three' },
  ],
};

const sampleEventsData = {
  eventsByIds: [
    { id: 'evt1', name: 'Event One' },
    { id: 'evt2', name: 'Event Two' },
  ],
};

// --- GraphQL Mocks ---
const actionItemsMock: MockedResponse = {
  request: {
    query: ACTION_ITEM_FOR_ORGANIZATION,
    variables: { organizationId: 'org1' },
  },
  result: {
    data: sampleActionItemsData,
  },
};

const usersMock: MockedResponse = {
  request: {
    query: GET_USERS_BY_IDS,
    variables: { input: { ids: ['user1', 'user2', 'user3'] } },
  },
  result: {
    data: sampleUsersData,
  },
};

const eventsMock: MockedResponse = {
  request: {
    query: GET_EVENTS_BY_IDS,
    variables: { ids: ['evt1', 'evt2'] },
  },
  result: {
    data: sampleEventsData,
  },
};

// --- Custom Render Helper ---
function renderWithProviders(
  ui: React.ReactElement,
  { route = '/orgdash/org1' } = {},
): ReturnType<typeof render> {
  return render(
    <MockedProvider
      mocks={[actionItemsMock, usersMock, eventsMock]}
      addTypename={false}
    >
      <MemoryRouter initialEntries={[route]}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Routes>
            <Route path="/orgdash/:orgId" element={ui} />
            <Route path="*" element={<div>Fallback</div>} />
          </Routes>
        </LocalizationProvider>
      </MemoryRouter>
    </MockedProvider>,
  );
}

beforeEach((): void => {
  (toast.success as Mock).mockClear();
  (toast.error as Mock).mockClear();
  (toast.warning as Mock).mockClear();
});

// --- Tests ---
describe('OrganizationActionItems Component', () => {
  it('redirects to "/" if orgId is not provided', () => {
    renderWithProviders(<OrganizationActionItems />, { route: '/orgdash/' });
    expect(screen.getByText('Fallback')).toBeInTheDocument();
  });

  it('renders a Loader when action items are loading', async () => {
    // Create a delayed mock to simulate loading.
    const loadingActionItemsMock: MockedResponse = {
      request: {
        query: ACTION_ITEM_FOR_ORGANIZATION,
        variables: { organizationId: 'org1' },
      },
      result: { data: sampleActionItemsData },
      delay: 1000,
    };

    render(
      <MockedProvider mocks={[loadingActionItemsMock]} addTypename={false}>
        <MemoryRouter initialEntries={['/orgdash/org1']}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <OrganizationActionItems />
          </LocalizationProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Check for Loader element by test id.
    expect(screen.getByTestId('spinner-wrapper')).toBeTruthy();
  });

  it('renders an error message when the action items query fails', async () => {
    const errorMock: MockedResponse = {
      request: {
        query: ACTION_ITEM_FOR_ORGANIZATION,
        variables: { organizationId: 'org1' },
      },
      error: new Error('Query failed'),
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <MemoryRouter initialEntries={['/orgdash/org1']}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <OrganizationActionItems />
          </LocalizationProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('renders the DataGrid with action items and header buttons', async () => {
    renderWithProviders(<OrganizationActionItems />);

    await waitFor(() => {
      expect(screen.getByText(/Assignee/i)).toBeInTheDocument();
    });

    expect(screen.getByTestId('createActionItemBtn')).toBeInTheDocument();
    expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    expect(screen.getByTestId('sort')).toBeInTheDocument();
  });

  it('opens the Create modal when the create button is clicked', async () => {
    renderWithProviders(<OrganizationActionItems />);

    await waitFor(() => {
      expect(screen.getByTestId('createActionItemBtn')).toBeInTheDocument();
    });

    const createBtn = screen.getByTestId('createActionItemBtn');
    fireEvent.click(createBtn);

    // If multiple elements contain "createActionItem", get the first header.
    await waitFor(() => {
      const headers = screen.getAllByText(/createActionItem/i);
      expect(headers.length).toBeGreaterThan(0);
    });
  });

  it('renders the DataGrid rows correctly', async () => {
    renderWithProviders(<OrganizationActionItems />);

    await waitFor(() => {
      const assigneeElements = screen.getAllByTestId('assigneeName');
      expect(assigneeElements.length).toEqual(
        sampleActionItemsData.actionItemsByOrganization.length,
      );

      const categoryElements = screen.getAllByTestId('categoryName');
      expect(categoryElements.length).toEqual(
        sampleActionItemsData.actionItemsByOrganization.length,
      );
    });
  });
});
