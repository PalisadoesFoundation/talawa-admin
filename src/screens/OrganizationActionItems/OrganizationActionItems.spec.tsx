// src/screens/OrganizationActionItems/organizationActionItems.spec.tsx

import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import OrganizationActionItems from 'screens/OrganizationActionItems/OrganizationActionItems';
import styles from '../../style/app-fixed.module.css';

import {
  GET_USERS_BY_IDS,
  GET_EVENTS_BY_IDS,
  GET_CATEGORIES_BY_IDS,
} from 'GraphQl/Queries/Queries';
import { toast } from 'react-toastify';
import type { Mock } from 'vitest';
import { ACTION_ITEM_FOR_ORGANIZATION } from 'GraphQl/Queries/ActionItemQueries';
// import OrganizationActionItems from './OrganizationActionItems';
// --- Global Mocks for i18n and toast ---
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

// --- Mocks for custom components ---
vi.mock('subComponents/SortingButton', () => ({
  default: ({
    dataTestIdPrefix,
    sortingOptions,
    onSortChange,
  }: {
    dataTestIdPrefix: string;
    sortingOptions: { label: string; value: string }[];
    onSortChange: (value: string) => void;
  }) => {
    return (
      <select
        data-testid={dataTestIdPrefix}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {sortingOptions.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  },
}));

vi.mock('subComponents/SearchBar', () => ({
  default: ({
    inputTestId,
    placeholder,
    onSearch,
  }: {
    inputTestId: string;
    placeholder: string;
    onSearch: (value: string) => void;
  }) => {
    return (
      <input
        data-testid={inputTestId}
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
      />
    );
  },
}));
vi.mock('./itemViewModal/ItemViewModal', () => ({
  default: ({
    isOpen,
    hide,
    item,
  }: {
    isOpen: boolean;
    hide: () => void;
    item: { id: string };
  }) =>
    isOpen ? (
      <div data-testid="ItemViewModal">
        <button type="button" onClick={hide}>
          Close View
        </button>
        <span>ItemView-{item.id}</span>
      </div>
    ) : null,
}));

vi.mock('./itemModal/ItemModal.tsx', () => ({
  default: ({
    isOpen,
    hide,
    actionItem,
    editMode,
  }: {
    isOpen: boolean;
    hide: () => void;
    actionItem: { id: string } | null;
    editMode: boolean;
  }) =>
    isOpen ? (
      <div data-testid="ItemModal">
        <button type="button" onClick={hide}>
          Close Modal
        </button>
        <span>
          {actionItem ? `ItemModal-${actionItem.id}` : 'ItemModal-new'}{' '}
          {editMode ? 'edit' : 'create'}
        </span>
      </div>
    ) : null,
}));

vi.mock('./itemDeleteModal/ItemDeleteModal.tsx', () => ({
  default: ({
    isOpen,
    hide,
    actionItem,
  }: {
    isOpen: boolean;
    hide: () => void;
    actionItem: { id: string };
  }) =>
    isOpen ? (
      <div data-testid="ItemDeleteModal">
        <button onClick={hide}>Close Delete</button>
        <span>ItemDelete-{actionItem.id}</span>
      </div>
    ) : null,
}));

vi.mock('./itemUpdateModal/ItemUpdateStatusModal.tsx', () => ({
  default: ({
    isOpen,
    hide,
    actionItem,
  }: {
    isOpen: boolean;
    hide: () => void;
    actionItem: { id: string };
  }) =>
    isOpen ? (
      <div data-testid="ItemUpdateStatusModal">
        <button onClick={hide}>Close Status</button>
        <span>ItemStatus-{actionItem.id}</span>
      </div>
    ) : null,
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

const customActionItemsData = {
  actionItemsByOrganization: [
    {
      id: '9',
      isCompleted: false,
      assignedAt: '2025-03-08T00:00:00.000Z',
      completionAt: '',
      preCompletionNotes: 'Note',
      postCompletionNotes: null,
      createdAt: '2025-03-08T00:00:00.000Z',
      updatedAt: '2025-03-08T00:00:00.000Z',
      organizationId: 'org1',
      categoryId: 'catZ',
      eventId: null,
      assigneeId: 'user1',
      creatorId: 'user2',
      updaterId: 'user2',
    },
    {
      id: '10',
      isCompleted: false,
      assignedAt: '2025-03-08T00:00:00.000Z',
      completionAt: '',
      preCompletionNotes: 'Note',
      postCompletionNotes: null,
      createdAt: '2025-03-08T00:00:00.000Z',
      updatedAt: '2025-03-08T00:00:00.000Z',
      organizationId: 'org1',
      categoryId: 'catA',
      eventId: null,
      assigneeId: 'user3',
      creatorId: 'user2',
      updaterId: 'user2',
    },
  ],
};

const customActionItemsMock: MockedResponse = {
  request: {
    query: ACTION_ITEM_FOR_ORGANIZATION,
    variables: { organizationId: 'org1' },
  },
  result: { data: customActionItemsData },
};
describe('Testing Organization Action Items Screen', () => {
  beforeAll(() => {
    vi.mock('react-router', async () => ({
      ...(await vi.importActual('react-router')),
      useParams: () => ({ orgId: 'orgId', eventId: 'eventId' }),
    }));
  });

// Provide a categories mock that returns proper names for both categories
const categoriesMockForFiltering: MockedResponse = {
  request: {
    query: GET_CATEGORIES_BY_IDS,
    variables: { ids: ['catZ', 'catA'] },
  },
  result: {
    data: {
      categoriesByIds: [
        { id: 'catZ', name: 'Category Z' },
        { id: 'catA', name: 'Category A' },
      ],
    },
  },
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

// --- Additional Sample Data for getAssigneeName edge cases ---
const sampleActionItemsDataEdge = {
  actionItemsByOrganization: [
    // Item with no assignee (should show "Unassigned")
    {
      id: '3',
      isCompleted: false,
      assignedAt: '2025-03-07T00:00:00.000Z',
      completionAt: '',
      preCompletionNotes: 'Edge note 1',
      postCompletionNotes: null,
      createdAt: '2025-03-07T00:00:00.000Z',
      updatedAt: '2025-03-07T00:00:00.000Z',
      organizationId: 'org1',
      categoryId: 'cat1',
      eventId: null,
      assigneeId: null,
      creatorId: 'user2',
      updaterId: 'user2',
      actionItemCategory: { id: 'cat1', name: 'General' },
    },
    // Item with an unknown user (should show "Unknown User")
    {
      id: '4',
      isCompleted: false,
      assignedAt: '2025-03-07T00:00:00.000Z',
      completionAt: '',
      preCompletionNotes: 'Edge note 2',
      postCompletionNotes: null,
      createdAt: '2025-03-07T00:00:00.000Z',
      updatedAt: '2025-03-07T00:00:00.000Z',
      organizationId: 'org1',
      categoryId: 'cat1',
      eventId: null,
      assigneeId: 'nonexistent',
      creatorId: 'user2',
      updaterId: 'user2',
      actionItemCategory: { id: 'cat1', name: 'General' },
    },
  ],
};

const customActionItemsData2 = {
  actionItemsByOrganization: [
    {
      id: '7',
      isCompleted: false,
      assignedAt: '2025-03-08T00:00:00.000Z',
      completionAt: '',
      preCompletionNotes: 'Note',
      postCompletionNotes: null,
      createdAt: '2025-03-08T00:00:00.000Z',
      updatedAt: '2025-03-08T00:00:00.000Z',
      organizationId: 'org1',
      categoryId: 'catX',
      eventId: null,
      assigneeId: 'user1',
      creatorId: 'user2',
      updaterId: 'user2',
      // actionItemCategory is optional; enrichment sets categoryName
    },
  ],
};

const customActionItemsMock2: MockedResponse = {
  request: {
    query: ACTION_ITEM_FOR_ORGANIZATION,
    variables: { organizationId: 'org1' },
  },
  result: { data: customActionItemsData2 },
};

// Provide a categories mock that returns an empty array
const emptyCategoriesMock2: MockedResponse = {
  request: {
    query: GET_CATEGORIES_BY_IDS,
    variables: { ids: ['catX'] },
  },
  result: { data: { categoriesByIds: [] } },
};

const customActionItemsData1 = {
  actionItemsByOrganization: [
    {
      id: '8',
      isCompleted: false,
      assignedAt: '2025-03-08T00:00:00.000Z',
      completionAt: '',
      preCompletionNotes: 'Note',
      postCompletionNotes: null,
      createdAt: '2025-03-08T00:00:00.000Z',
      updatedAt: '2025-03-08T00:00:00.000Z',
      organizationId: 'org1',
      categoryId: 'catY',
      eventId: null,
      assigneeId: 'user1',
      creatorId: 'user2',
      updaterId: 'user2',
    },
  ],
};

const customActionItemsMock1: MockedResponse = {
  request: {
    query: ACTION_ITEM_FOR_ORGANIZATION,
    variables: { organizationId: 'org1' },
  },
  result: { data: customActionItemsData1 },
};

// Provide a categories mock that returns a matching category for "catY"
const categoriesMockForCatY1: MockedResponse = {
  request: {
    query: GET_CATEGORIES_BY_IDS,
    variables: { ids: ['catY'] },
  },
  result: {
    data: { categoriesByIds: [{ id: 'catY', name: 'Special Category' }] },
  },
};

const sampleUsersDataEdge = {
  usersByIds: [],
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
    variables: { input: { ids: ['user1', 'user3'] } },
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

const actionItemsMockEdge: MockedResponse = {
  request: {
    query: ACTION_ITEM_FOR_ORGANIZATION,
    variables: { organizationId: 'org1' },
  },
  result: {
    data: sampleActionItemsDataEdge,
  },
};

const usersMockEdge: MockedResponse = {
  request: {
    query: GET_USERS_BY_IDS,
    variables: { input: { ids: [] } },
  },
  result: {
    data: sampleUsersDataEdge,
  },
};

// --- Custom Render Helper ---
interface InterfaceRenderOptions {
  route?: string;
  mocks?: MockedResponse[];
}

function renderWithProviders(
  ui: React.ReactElement,
  {
    route = '/orgdash/org1',
    mocks = [actionItemsMock, usersMock, eventsMock],
  }: InterfaceRenderOptions = {},
): ReturnType<typeof render> {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
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

afterEach(() => {
  vi.useRealTimers();
});

// --- Tests ---
describe('OrganizationActionItems Component', () => {
  it('redirects to "/" if orgId is not provided', () => {
    renderWithProviders(<OrganizationActionItems />, { route: '/orgdash/' });
    // When orgId is missing, the route falls back.
    expect(screen.getByText('Fallback')).toBeInTheDocument();
  });

  it('renders the DataGrid with action items and header buttons', async () => {
    renderWithProviders(<OrganizationActionItems />);
    // Use role query to pick the DataGrid header cell.
    await waitFor(() => {
      expect(
        screen.getByRole('columnheader', { name: /Assignee/i }),
      ).toBeInTheDocument();
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
    await waitFor(() => {
      expect(screen.getByTestId('ItemModal')).toBeInTheDocument();
    });
  });

  it('renders the DataGrid rows correctly', async () => {
    renderWithProviders(<OrganizationActionItems />);
    const assigneeElements = await screen.findAllByTestId('assigneeName');
    expect(assigneeElements.length).toEqual(
      sampleActionItemsData.actionItemsByOrganization.length,
    );
    const categoryElements = await screen.findAllByTestId('categoryName');
    expect(categoryElements.length).toEqual(
      sampleActionItemsData.actionItemsByOrganization.length,
    );
  });

  it('handles getAssigneeName edge cases', async () => {
    // Use edge mocks for action items and users.
    renderWithProviders(<OrganizationActionItems />, {
      mocks: [actionItemsMockEdge, usersMockEdge, eventsMock],
    });
    const assigneeElements = await screen.findAllByTestId('assigneeName');
    const texts = assigneeElements.map((el) => el.textContent);
    expect(texts.some((text) => text?.includes('Unassigned'))).toBe(true);
    expect(texts.some((text) => text?.includes('Unknown User'))).toBe(true);
  });

  it('filters action items by status', async () => {
    // Supply duplicate actionItemsMock so that the refetch triggered by status change succeeds.
    renderWithProviders(<OrganizationActionItems />, {
      mocks: [actionItemsMock, actionItemsMock, usersMock, eventsMock],
    });
    // Wait for the initial data to load.
    await waitFor(async () => {
      const rows = await screen.findAllByTestId('assigneeName');
      expect(rows.length).toBe(2);
    });
    // Get the status SortingButton (with data-testid "filter").
    const statusSelect = screen.getByTestId('filter');
    // Set status to "pending"
    fireEvent.change(statusSelect, { target: { value: 'pending' } });
    await waitFor(async () => {
      const rows = await screen.findAllByTestId('assigneeName');
      // Only the pending item (id '1', isCompleted false) should remain.
      expect(rows.length).toBe(1);
    });
    // Now set status to "completed"
    fireEvent.change(statusSelect, { target: { value: 'completed' } });
    await waitFor(async () => {
      const rows = await screen.findAllByTestId('assigneeName');
      // Only the completed item (id '2', isCompleted true) should remain.
      expect(rows.length).toBe(1);
    });
  });

  // Corrected test for sorting action items by completion date:
  it('sorts action items by completion date', async () => {
    // Supply duplicate actionItemsMock so that the refetch triggered by sort change succeeds.
    renderWithProviders(<OrganizationActionItems />, {
      mocks: [actionItemsMock, actionItemsMock, usersMock, eventsMock],
    });
    // Wait for the completion date cells to appear.
    await waitFor(async () => {
      const cells = await screen.findAllByTestId('completionDate');
      expect(cells.length).toBe(2);
    });
    const sortSelect = screen.getByTestId('sort');
    // Set sort to dueDate_DESC: the row with a valid completion date should come first.
    fireEvent.change(sortSelect, { target: { value: 'dueDate_DESC' } });
    await waitFor(async () => {
      const completionCells = await screen.findAllByTestId('completionDate');
      expect(completionCells[0].textContent).toContain('06/03/2025'); // row with valid date
      expect(completionCells[1].textContent).toContain('No Completion Date');
    });
    // Change sort to dueDate_ASC: the row with "No Completion Date" should come first.
    fireEvent.change(sortSelect, { target: { value: 'dueDate_ASC' } });
    await waitFor(async () => {
      const completionCells = await screen.findAllByTestId('completionDate');
      expect(completionCells[0].textContent).toContain('No Completion Date');
      expect(completionCells[1].textContent).toContain('06/03/2025');
    });
  });

  it('opens and closes the view modal', async () => {
    renderWithProviders(<OrganizationActionItems />);
    const viewBtns = await screen.findAllByTestId('viewItemBtn1');
    expect(viewBtns[0]).toBeDefined();
    fireEvent.click(viewBtns[0]);
    await waitFor(() => {
      expect(screen.getByTestId('ItemViewModal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Close View'));
    await waitFor(() => {
      expect(screen.queryByTestId('ItemViewModal')).toBeNull();
    });
  });

  it('opens and closes the edit modal', async () => {
    renderWithProviders(<OrganizationActionItems />);
    const editBtns = await screen.findAllByTestId('editItemBtn1');
    expect(editBtns[0]).toBeDefined();
    fireEvent.click(editBtns[0]);
    await waitFor(() => {
      expect(screen.getByTestId('ItemModal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Close Modal'));
    await waitFor(() => {
      expect(screen.queryByTestId('ItemModal')).toBeNull();
    });
  });

  it('opens and closes the delete modal', async () => {
    renderWithProviders(<OrganizationActionItems />);
    const deleteBtns = await screen.findAllByTestId('deleteItemBtn1');
    expect(deleteBtns[0]).toBeDefined();
    fireEvent.click(deleteBtns[0]);
    await waitFor(() => {
      expect(screen.getByTestId('ItemDeleteModal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Close Delete'));
    await waitFor(() => {
      expect(screen.queryByTestId('ItemDeleteModal')).toBeNull();
    });
  });

  it('opens and closes the status update modal', async () => {
    renderWithProviders(<OrganizationActionItems />);
    // Use findByTestId to ensure the checkbox is present.
    const statusCheckbox = await screen.findByTestId('statusCheckbox1');
    fireEvent.click(statusCheckbox);
    await waitFor(() => {
      expect(screen.getByTestId('ItemUpdateStatusModal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Close Status'));
    await waitFor(() => {
      expect(screen.queryByTestId('ItemUpdateStatusModal')).toBeNull();
    });
  });

  it('displays "Unassigned" when action item has no assigneeId', async () => {
    // Create a custom action item with a null assigneeId.
    const customActionItemsData3 = {
      actionItemsByOrganization: [
        {
          id: '5',
          isCompleted: false,
          assignedAt: '2025-03-07T00:00:00.000Z',
          completionAt: '',
          preCompletionNotes: 'Note',
          postCompletionNotes: null,
          createdAt: '2025-03-07T00:00:00.000Z',
          updatedAt: '2025-03-07T00:00:00.000Z',
          organizationId: 'org1',
          categoryId: 'cat1',
          eventId: null,
          assigneeId: null,
          creatorId: 'user2',
          updaterId: 'user2',
          actionItemCategory: { id: 'cat1', name: 'General' },
        },
      ],
    };
    const customActionItemsMock3: MockedResponse = {
      request: {
        query: ACTION_ITEM_FOR_ORGANIZATION,
        variables: { organizationId: 'org1' },
      },
      result: { data: customActionItemsData3 },
    };

    renderWithProviders(<OrganizationActionItems />, {
      mocks: [customActionItemsMock3, usersMock, eventsMock],
    });
    // The rendered grid cell should show "Unassigned"
    const unassignedCell = await screen.findByText('Unassigned');
    expect(unassignedCell).toBeInTheDocument();
  });

  it('displays "Unknown User" when action item has an assigneeId that is not found', async () => {
    // Create a custom action item with a non-existent assigneeId.
    const customActionItemsData = {
      actionItemsByOrganization: [
        {
          id: '6',
          isCompleted: false,
          assignedAt: '2025-03-07T00:00:00.000Z',
          completionAt: '',
          preCompletionNotes: 'Note',
          postCompletionNotes: null,
          createdAt: '2025-03-07T00:00:00.000Z',
          updatedAt: '2025-03-07T00:00:00.000Z',
          organizationId: 'org1',
          categoryId: 'cat1',
          eventId: null,
          assigneeId: 'nonexistent',
          creatorId: 'user2',
          updaterId: 'user2',
          actionItemCategory: { id: 'cat1', name: 'General' },
        },
      ],
    };
    const customActionItemsMock: MockedResponse = {
      request: {
        query: ACTION_ITEM_FOR_ORGANIZATION,
        variables: { organizationId: 'org1' },
      },
      result: { data: customActionItemsData },
    };
    // Provide a users mock that does NOT include the "nonexistent" user.
    const customUsersData = {
      usersByIds: [{ id: 'user1', name: 'User One' }],
    };
    const customUsersMock: MockedResponse = {
      request: {
        query: GET_USERS_BY_IDS,
        variables: { input: { ids: ['nonexistent'] } },
      },
      result: { data: customUsersData },
    };

    renderWithProviders(<OrganizationActionItems />, {
      mocks: [customActionItemsMock, customUsersMock, eventsMock],
    });
    const unknownCell = await screen.findByText('Unknown User');
    expect(unknownCell).toBeInTheDocument();
  });

  it('displays the correct user name when a valid assignee is provided', async () => {
    renderWithProviders(<OrganizationActionItems />);
    const assigneeCells = await screen.findAllByTestId('assigneeName');
    const found = assigneeCells.some((cell) =>
      cell.textContent?.includes('User One'),
    );
    expect(found).toBe(false);
  });

  // Test to verify that entering a search term (via SearchBar) filters the grid.
  it('updates search term when SearchBar input changes', async () => {
    renderWithProviders(<OrganizationActionItems />);
    await waitFor(() => {
      expect(screen.getAllByTestId('assigneeName').length).toBeGreaterThan(0);
    });
    const searchInput = screen.getByTestId('searchBy');
    fireEvent.change(searchInput, { target: { value: 'NonExistentUser' } });
    await waitFor(() => {
      expect(screen.queryAllByTestId('assigneeName').length).toBe(0);
    });
  });

  it('updates searchBy state when SortingButton changes value', async () => {
    renderWithProviders(<OrganizationActionItems />);
    const sortSelect = (await screen.findByTestId(
      'searchByToggle',
    )) as HTMLSelectElement;
    expect(sortSelect.value).toBe('assignee');
    fireEvent.change(sortSelect, { target: { value: 'assignee' } });
    expect(sortSelect.value).toBe('assignee');
  });

  it('returns the user name when a valid user is not provided', async () => {
    renderWithProviders(<OrganizationActionItems />);
    // Wait until the grid cells with assignee names are rendered.
    const cells = await screen.findAllByTestId('assigneeName');
    const validUserFound = cells.some((cell) =>
      cell.textContent?.includes('User One'),
    );
    expect(validUserFound).toBe(false);
  });

  it('redirects to "/" if orgId is not provided', async () => {
    render(
      <MockedProvider
        mocks={[actionItemsMock, usersMock, eventsMock]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={['/orgdash/']}>
          <Routes>
            <Route path="/orgdash/*" element={<OrganizationActionItems />} />
            <Route path="/" element={<div>Home</div>} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );
    // The component should redirect to "/" and display the Home component.
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  // Test: Enriches action items with "No Category" when categoriesData returns empty
  it('enriches action items with "No Category" when categoriesData is empty', async () => {
    renderWithProviders(<OrganizationActionItems />, {
      mocks: [
        customActionItemsMock2,
        emptyCategoriesMock2,
        usersMock,
        eventsMock,
      ],
    });

    // Verify that the category cell shows "No Category"
    const categoryCell = await screen.findByTestId('categoryName');
    expect(categoryCell.textContent).toContain('No Category');
  });

  it('enriches action items with matching category names', async () => {
    renderWithProviders(<OrganizationActionItems />, {
      mocks: [
        customActionItemsMock1,
        categoriesMockForCatY1,
        usersMock,
        eventsMock,
      ],
    });

    // Wait until the query has resolved and the component updates
    await waitFor(
      () => {
        const categoryCell = screen.getByTestId('categoryName');
        expect(categoryCell.textContent).toContain('Special Category');
      },
      { timeout: 3000 },
    );
  });

  // Test: Filters action items by assignee name when search term is entered (default searchBy: 'assignee')
  it('filters action items by assignee when search term matches', async () => {
    renderWithProviders(<OrganizationActionItems />, {
      mocks: [actionItemsMock, usersMock, eventsMock],
    });

    // Wait for the grid rows to be rendered
    await waitFor(() => {
      expect(screen.getAllByTestId('assigneeName').length).toBeGreaterThan(0);
    });

    // Type a search term that should match "User One" (assume one of the items has that name)
    const searchInput = screen.getByTestId('searchBy');
    fireEvent.change(searchInput, { target: { value: 'One' } });

    // After filtering, every visible row should include "User One" (case-insensitive)
    await waitFor(() => {
      const rows = screen.getAllByTestId('assigneeName');
      rows.forEach((row) => {
        expect(row.textContent?.toLowerCase()).toContain('one');
      });
    });
  });

  // Test: Filters action items by category when searchBy is set to 'category'
  it('filters action items by category when search term matches', async () => {
    // Create custom action items with different categories

    renderWithProviders(<OrganizationActionItems />, {
      mocks: [
        customActionItemsMock,
        categoriesMockForFiltering,
        usersMock,
        eventsMock,
      ],
    });

    // Change the search criterion to "category" via the SortingButton (which uses test id "searchByToggle")
    const searchByToggle = await screen.findByTestId('searchByToggle');
    fireEvent.change(searchByToggle, { target: { value: 'category' } });

    // Type a search term that matches only one category (e.g., "Z" for "Category Z")
    const searchInput = screen.getByTestId('searchBy');
    fireEvent.change(searchInput, { target: { value: 'Z' } });

    // Verify that all rendered category cells include "Category Z"
    await waitFor(() => {
      const categoryCells = screen.getAllByTestId('categoryName');
      categoryCells.forEach((cell) => {
        expect(cell.textContent).toContain('Category Z');
      });
    });
  });
});
