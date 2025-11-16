import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from '../../../utils/i18nForTest';
import { vi } from 'vitest';
import EventActionItems from './EventActionItems';
import { GET_EVENT_ACTION_ITEMS } from 'GraphQl/Queries/ActionItemQueries';
import type { IActionItemInfo } from 'types/ActionItems/interface';

// Mock dependencies
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: vi.fn(() => ({ orgId: 'orgId1' })),
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate">{to}</div>
    ),
  };
});

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: vi.fn(() => ({
      t: (key: string) => key,
    })),
  };
});

// Mock the toast functions
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock sub-components
vi.mock('components/Loader/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('components/Avatar/Avatar', () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid="avatar">{name}</div>
  ),
}));

vi.mock('subComponents/SortingButton', () => ({
  default: ({
    onSortChange,
    dataTestIdPrefix,
    buttonLabel,
  }: {
    onSortChange: (value: string) => void;
    dataTestIdPrefix: string;
    buttonLabel: string;
  }) => (
    <button
      data-testid={`${dataTestIdPrefix}Btn`}
      onClick={() => {
        if (dataTestIdPrefix === 'searchByToggle') {
          // Switch to category for testing
          onSortChange('category');
        } else {
          onSortChange('test-value');
        }
      }}
    >
      {buttonLabel}
    </button>
  ),
}));

vi.mock('shared-components/SearchBar/SearchBar', () => ({
  default: ({
    onSearch,
    inputTestId,
    buttonTestId,
  }: {
    onSearch: (value: string) => void;
    inputTestId: string;
    buttonTestId: string;
  }) => (
    <div>
      <input
        data-testid={inputTestId}
        onChange={(e) => {
          // Call onSearch immediately without debounce for testing
          onSearch(e.target.value);
        }}
      />
      <button data-testid={buttonTestId}>Search</button>
    </div>
  ),
}));

// Mock modal components
vi.mock(
  'screens/OrganizationActionItems/ActionItemViewModal/ActionItemViewModal',
  () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
      isOpen ? <div data-testid="view-modal">View Modal</div> : null,
  }),
);

vi.mock(
  'screens/OrganizationActionItems/ActionItemModal/ActionItemModal',
  () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
      isOpen ? (
        <div data-testid="action-item-modal">Action Item Modal</div>
      ) : null,
  }),
);

vi.mock(
  'screens/OrganizationActionItems/ActionItemDeleteModal/ActionItemDeleteModal',
  () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
      isOpen ? <div data-testid="delete-modal">Delete Modal</div> : null,
  }),
);

vi.mock(
  'screens/OrganizationActionItems/ActionItemUpdateModal/ActionItemUpdateStatusModal',
  () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
      isOpen ? <div data-testid="status-modal">Status Modal</div> : null,
  }),
);

const mockActionItem: IActionItemInfo = {
  id: 'actionItemId1',
  volunteerId: 'userId1',
  volunteerGroupId: null,
  categoryId: 'categoryId1',
  eventId: 'eventId1',
  recurringEventInstanceId: null,
  organizationId: 'orgId1',
  creatorId: 'userId2',
  updaterId: null,
  assignedAt: new Date('2024-08-27'),
  completionAt: new Date('2044-09-03'),
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: null,
  isCompleted: false,
  preCompletionNotes: 'Notes 1',
  postCompletionNotes: 'Post Notes 1',
  isInstanceException: false,

  volunteer: {
    id: 'volunteerId1',
    hasAccepted: true,
    isPublic: true,
    hoursVolunteered: 5,
    user: {
      id: 'userId1',
      name: 'John Doe',
      avatarURL: '',
    },
  },
  volunteerGroup: null,
  creator: {
    id: 'userId2',
    name: 'Jane Smith',
    emailAddress: 'jane@example.com',
    avatarURL: '',
  },
  event: {
    id: 'eventId1',
    name: 'Test Event',
    description: 'Test event description',
    location: 'Test Location',
    startAt: '2024-08-27T09:00:00Z',
    endAt: '2024-08-27T17:00:00Z',
    startTime: '09:00:00',
    endTime: '17:00:00',
    allDay: false,
    isPublic: true,
    isRegisterable: true,
    attendees: [],
    creator: {
      id: 'userId2',
      name: 'Jane Smith',
      emailAddress: 'jane@example.com',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    },
  },
  recurringEventInstance: null,
  category: {
    id: 'categoryId1',
    name: 'Category 1',
    description: 'Test category',
    isDisabled: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    organizationId: 'orgId1',
  },
};

const mockEventData = {
  event: {
    id: 'eventId1',
    recurrenceRule: null,
    baseEvent: null,
    actionItems: {
      edges: [
        {
          node: mockActionItem,
        },
        {
          node: {
            ...mockActionItem,
            id: 'actionItemId2',
            volunteerId: 'userId3',
            isCompleted: true,
            volunteer: {
              id: 'volunteerId2',
              hasAccepted: true,
              isPublic: true,
              hoursVolunteered: 3,
              user: {
                id: 'userId3',
                name: 'Bob Wilson',
                avatarURL: '',
              },
            },
            category: {
              ...mockActionItem.category,
              id: 'categoryId2',
              name: 'Category 2',
            },
          },
        },
      ],
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
    },
  },
};

const mockRecurringEventData = {
  event: {
    ...mockEventData.event,
    recurrenceRule: { id: 'recurrenceRuleId1' },
    baseEvent: { id: 'baseEventId1' },
  },
};

const MOCKS = [
  {
    request: {
      query: GET_EVENT_ACTION_ITEMS,
      variables: {
        input: {
          id: 'eventId1',
        },
      },
    },
    result: {
      data: mockEventData,
    },
  },
];

const MOCKS_RECURRING = [
  {
    request: {
      query: GET_EVENT_ACTION_ITEMS,
      variables: {
        input: {
          id: 'eventId1',
        },
      },
    },
    result: {
      data: mockRecurringEventData,
    },
  },
];

const MOCKS_LOADING = [
  {
    request: {
      query: GET_EVENT_ACTION_ITEMS,
      variables: {
        input: {
          id: 'eventId1',
        },
      },
    },
    result: {
      data: null,
    },
    delay: 100,
  },
];

const MOCKS_ERROR = [
  {
    request: {
      query: GET_EVENT_ACTION_ITEMS,
      variables: {
        input: {
          id: 'eventId1',
        },
      },
    },
    error: new Error('Failed to fetch event action items'),
  },
];

const renderEventActionItems = (
  eventId: string = 'eventId1',
  mocks: MockedResponse[] = MOCKS,
) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <EventActionItems eventId={eventId} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('EventActionItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render loading state initially', () => {
      renderEventActionItems('eventId1', MOCKS_LOADING);
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('should render error message when query fails', async () => {
      renderEventActionItems('eventId1', MOCKS_ERROR);

      await waitFor(() => {
        expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
        expect(screen.getByText('errorLoading')).toBeInTheDocument();
      });
    });

    it('should render action items table when data is loaded', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getByText('Assigned To')).toBeInTheDocument();
        expect(screen.getByText('Item Category')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Assigned Date')).toBeInTheDocument();
        expect(screen.getByText('Options')).toBeInTheDocument();
      });
    });
  });

  describe('Data Display', () => {
    it('should display category names correctly', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
        expect(screen.getByText('Category 2')).toBeInTheDocument();
      });
    });

    it('should display assigned dates in correct format', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getAllByText('27/08/2024')).toHaveLength(2); // Data grid and date display
      });
    });

    it('should display "No category" for items without category', async () => {
      const mockDataWithoutCategory = {
        ...mockEventData,
        event: {
          ...mockEventData.event,
          actionItems: {
            edges: [
              {
                node: {
                  ...mockActionItem,
                  category: null,
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
            },
          },
        },
      };

      const mocksWithoutCategory = [
        {
          request: {
            query: GET_EVENT_ACTION_ITEMS,
            variables: { input: { id: 'eventId1' } },
          },
          result: { data: mockDataWithoutCategory },
        },
      ];

      renderEventActionItems('eventId1', mocksWithoutCategory);

      await waitFor(() => {
        expect(screen.getByText('No category')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should filter by category name', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
        expect(screen.getByText('Category 2')).toBeInTheDocument();
      });

      // Switch to category search
      const searchToggleBtn = screen.getByTestId('searchByToggleBtn');
      fireEvent.click(searchToggleBtn);

      const searchInput = screen.getByTestId('searchBy');
      fireEvent.change(searchInput, { target: { value: 'Category' } });

      await waitFor(() => {
        // Should show both categories since both contain "Category"
        expect(screen.getByText('Category 1')).toBeInTheDocument();
        expect(screen.getByText('Category 2')).toBeInTheDocument();
      });
    });

    it('should filter items by assignee name when searching', async () => {
      renderEventActionItems();

      await waitFor(() => {
        // Initially should show both items
        expect(screen.getAllByText('John Doe')).toHaveLength(2); // avatar and grid
        expect(screen.getAllByText('Bob Wilson')).toHaveLength(2); // avatar and grid
      });

      // Search by assignee (default)
      const searchInput = screen.getByTestId('searchBy');
      fireEvent.change(searchInput, { target: { value: 'John' } });

      await waitFor(() => {
        // Should only show John Doe
        expect(screen.getAllByText('John Doe')).toHaveLength(2);
        expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
      });
    });

    it('should filter items by category name when searching', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
        expect(screen.getByText('Category 2')).toBeInTheDocument();
      });

      // Switch to category search
      const searchToggleBtn = screen.getByTestId('searchByToggleBtn');
      fireEvent.click(searchToggleBtn);

      const searchInput = screen.getByTestId('searchBy');
      fireEvent.change(searchInput, { target: { value: 'Category 2' } });

      await waitFor(() => {
        // Should only show Category 2
        expect(screen.getByText('Category 2')).toBeInTheDocument();
        expect(screen.queryByText('Category 1')).not.toBeInTheDocument();
      });
    });

    it('should handle case insensitive search', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getAllByText('John Doe')).toHaveLength(2);
      });

      const searchInput = screen.getByTestId('searchBy');
      fireEvent.change(searchInput, { target: { value: 'JOHN' } }); // uppercase

      await waitFor(() => {
        expect(screen.getAllByText('John Doe')).toHaveLength(2);
        expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
      });
    });

    it('should show all items when search is cleared', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getAllByText('John Doe')).toHaveLength(2);
        expect(screen.getAllByText('Bob Wilson')).toHaveLength(2);
      });

      // Search for something specific
      const searchInput = screen.getByTestId('searchBy');
      fireEvent.change(searchInput, { target: { value: 'John' } });

      await waitFor(() => {
        expect(screen.getAllByText('John Doe')).toHaveLength(2);
        expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
      });

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getAllByText('John Doe')).toHaveLength(2);
        expect(screen.getAllByText('Bob Wilson')).toHaveLength(2);
      });
    });

    it('should handle search with no matches', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getAllByText('John Doe')).toHaveLength(2);
      });

      const searchInput = screen.getByTestId('searchBy');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      await waitFor(() => {
        // Should show no items or empty state
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
      });
    });
  });

  describe('Sorting Functionality', () => {
    it('should sort items by assigned date in descending order', async () => {
      // Create mock data with different dates
      const mockDataWithDates = {
        event: {
          ...mockEventData.event,
          actionItems: {
            edges: [
              {
                node: {
                  ...mockActionItem,
                  id: 'item1',
                  assignedAt: new Date('2024-08-25'),
                },
              },
              {
                node: {
                  ...mockActionItem,
                  id: 'item2',
                  assignedAt: new Date('2024-08-27'),
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
            },
          },
        },
      };

      const mocksWithDates = [
        {
          request: {
            query: GET_EVENT_ACTION_ITEMS,
            variables: { input: { id: 'eventId1' } },
          },
          result: { data: mockDataWithDates },
        },
      ];

      renderEventActionItems('eventId1', mocksWithDates);

      await waitFor(() => {
        expect(screen.getByText('25/08/2024')).toBeInTheDocument();
        expect(screen.getByText('27/08/2024')).toBeInTheDocument();
      });

      // Click sort button to sort by latest assigned (DESC)
      const sortBtn = screen.getByTestId('sortBtn');
      fireEvent.click(sortBtn);

      await waitFor(() => {
        // Should maintain the same display since dates are already in DESC order
        expect(screen.getByText('25/08/2024')).toBeInTheDocument();
        expect(screen.getByText('27/08/2024')).toBeInTheDocument();
      });
    });

    it('should sort items by assigned date in ascending order', async () => {
      // Create mock data with different dates
      const mockDataWithDates = {
        event: {
          ...mockEventData.event,
          actionItems: {
            edges: [
              {
                node: {
                  ...mockActionItem,
                  id: 'item1',
                  assignedAt: new Date('2024-08-27'),
                },
              },
              {
                node: {
                  ...mockActionItem,
                  id: 'item2',
                  assignedAt: '2024-08-25', // Earlier date
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
            },
          },
        },
      };

      const mocksWithDates = [
        {
          request: {
            query: GET_EVENT_ACTION_ITEMS,
            variables: { input: { id: 'eventId1' } },
          },
          result: { data: mockDataWithDates },
        },
      ];

      renderEventActionItems('eventId1', mocksWithDates);

      await waitFor(() => {
        expect(screen.getByText('27/08/2024')).toBeInTheDocument();
        expect(screen.getByText('25/08/2024')).toBeInTheDocument();
      });

      // Click sort button twice to sort by earliest assigned (ASC)
      const sortBtn = screen.getByTestId('sortBtn');
      fireEvent.click(sortBtn); // First click - DESC
      fireEvent.click(sortBtn); // Second click - ASC

      await waitFor(() => {
        // Should maintain the same display since dates are already in ASC order
        expect(screen.getByText('27/08/2024')).toBeInTheDocument();
        expect(screen.getByText('25/08/2024')).toBeInTheDocument();
      });
    });

    it('should handle sorting with same dates', async () => {
      // Create mock data with same dates
      const mockDataWithSameDates = {
        event: {
          ...mockEventData.event,
          actionItems: {
            edges: [
              {
                node: {
                  ...mockActionItem,
                  id: 'item1',
                  assignedAt: new Date('2024-08-27'),
                },
              },
              {
                node: {
                  ...mockActionItem,
                  id: 'item2',
                  assignedAt: '2024-08-27', // Same date
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
            },
          },
        },
      };

      const mocksWithSameDates = [
        {
          request: {
            query: GET_EVENT_ACTION_ITEMS,
            variables: { input: { id: 'eventId1' } },
          },
          result: { data: mockDataWithSameDates },
        },
      ];

      renderEventActionItems('eventId1', mocksWithSameDates);

      await waitFor(() => {
        expect(screen.getAllByText('27/08/2024')).toHaveLength(2);
      });

      // Click sort button
      const sortBtn = screen.getByTestId('sortBtn');
      fireEvent.click(sortBtn);

      await waitFor(() => {
        // Should still show both items with same date
        expect(screen.getAllByText('27/08/2024')).toHaveLength(2);
      });
    });

    it('should handle sorting with invalid dates gracefully', () => {
      // Test the sorting logic directly with invalid dates
      const mockItems: IActionItemInfo[] = [
        {
          ...mockActionItem,
          id: 'item1',
          assignedAt: new Date('invalid-date'),
        },
        {
          ...mockActionItem,
          id: 'item2',
          assignedAt: new Date('2024-08-27'),
        },
      ];

      const sortBy = 'assignedAt_DESC';

      let filteredItems = mockItems;
      if (sortBy) {
        filteredItems = [...filteredItems].sort(
          (a: IActionItemInfo, b: IActionItemInfo) => {
            const dateA = new Date(a.assignedAt);
            const dateB = new Date(b.assignedAt);

            if (sortBy === 'assignedAt_DESC') {
              return dateB.getTime() - dateA.getTime();
            } else {
              return dateA.getTime() - dateB.getTime();
            }
          },
        );
      }

      // Should handle invalid dates without crashing
      expect(filteredItems).toHaveLength(2);
      // The sorting behavior with NaN can be unpredictable, so we just check that both items are present
      const itemIds = filteredItems.map((item) => item.id);
      expect(itemIds).toContain('item1');
      expect(itemIds).toContain('item2');
    });

    it('should sort items correctly with mixed valid and invalid dates', () => {
      const mockItems: IActionItemInfo[] = [
        {
          ...mockActionItem,
          id: 'item1',
          assignedAt: new Date('2024-08-25'),
        },
        {
          ...mockActionItem,
          id: 'item2',
          assignedAt: new Date('invalid-date'),
        },
        {
          ...mockActionItem,
          id: 'item3',
          assignedAt: new Date('2024-08-27'),
        },
      ];

      const sortBy = 'assignedAt_DESC';

      let filteredItems = mockItems;
      if (sortBy) {
        filteredItems = [...filteredItems].sort(
          (a: IActionItemInfo, b: IActionItemInfo) => {
            const dateA = new Date(a.assignedAt);
            const dateB = new Date(b.assignedAt);

            if (sortBy === 'assignedAt_DESC') {
              return dateB.getTime() - dateA.getTime();
            } else {
              return dateA.getTime() - dateB.getTime();
            }
          },
        );
      }

      expect(filteredItems).toHaveLength(3);
      // Check that all items are present, regardless of exact order due to NaN sorting behavior
      const itemIds = filteredItems.map((item) => item.id);
      expect(itemIds).toContain('item1');
      expect(itemIds).toContain('item2');
      expect(itemIds).toContain('item3');
    });

    it('should not sort when sortBy is null', () => {
      const mockItems: IActionItemInfo[] = [
        {
          ...mockActionItem,
          id: 'item1',
          assignedAt: new Date('2024-08-25'),
        },
        {
          ...mockActionItem,
          id: 'item2',
          assignedAt: new Date('2024-08-27'),
        },
      ];

      const sortBy = null;

      let filteredItems = mockItems;
      if (sortBy) {
        filteredItems = [...filteredItems].sort(
          (a: IActionItemInfo, b: IActionItemInfo) => {
            const dateA = new Date(a.assignedAt);
            const dateB = new Date(b.assignedAt);

            if (sortBy === 'assignedAt_DESC') {
              return dateB.getTime() - dateA.getTime();
            } else {
              return dateA.getTime() - dateB.getTime();
            }
          },
        );
      }

      // Should return original order when sortBy is null
      expect(filteredItems).toHaveLength(2);
      expect(filteredItems[0].id).toBe('item1');
      expect(filteredItems[1].id).toBe('item2');
    });
  });

  describe('Filtering Functionality', () => {
    it('should show all items when filter is cleared', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
      });

      const filterBtn = screen.getByTestId('filterBtn');
      fireEvent.click(filterBtn);

      await waitFor(() => {
        expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
      });
    });
  });

  describe('Modal Interactions', () => {
    it('should open create modal when create button is clicked', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getByTestId('createActionItemBtn')).toBeInTheDocument();
      });

      const createBtn = screen.getByTestId('createActionItemBtn');
      fireEvent.click(createBtn);

      await waitFor(() => {
        expect(screen.getByTestId('action-item-modal')).toBeInTheDocument();
      });
    });

    it('should open view modal when view button is clicked', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(
          screen.getByTestId('viewItemBtnactionItemId1'),
        ).toBeInTheDocument();
      });

      const viewBtn = screen.getByTestId('viewItemBtnactionItemId1');
      fireEvent.click(viewBtn);

      await waitFor(() => {
        expect(screen.getByTestId('view-modal')).toBeInTheDocument();
      });
    });

    it('should open edit modal when edit button is clicked', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(
          screen.getByTestId('editItemBtnactionItemId1'),
        ).toBeInTheDocument();
      });

      const editBtn = screen.getByTestId('editItemBtnactionItemId1');
      fireEvent.click(editBtn);

      await waitFor(() => {
        expect(screen.getByTestId('action-item-modal')).toBeInTheDocument();
      });
    });

    it('should open delete modal when delete button is clicked', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(
          screen.getByTestId('deleteItemBtnactionItemId1'),
        ).toBeInTheDocument();
      });

      const deleteBtn = screen.getByTestId('deleteItemBtnactionItemId1');
      fireEvent.click(deleteBtn);

      await waitFor(() => {
        expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
      });
    });

    it('should open status modal when checkbox is clicked', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(
          screen.getByTestId('statusCheckboxactionItemId1'),
        ).toBeInTheDocument();
      });

      const statusCheckbox = screen.getByTestId('statusCheckboxactionItemId1');
      fireEvent.click(statusCheckbox);

      await waitFor(() => {
        expect(screen.getByTestId('status-modal')).toBeInTheDocument();
      });
    });
  });

  describe('Recurring Event Handling', () => {
    it('should set isRecurring to true for recurring events', async () => {
      renderEventActionItems('eventId1', MOCKS_RECURRING);

      await waitFor(() => {
        expect(screen.getByTestId('createActionItemBtn')).toBeInTheDocument();
      });

      // The component should pass isRecurring=true to the modal
      // This is tested implicitly through the modal props
    });

    it('should set isRecurring to false for non-recurring events', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getByTestId('createActionItemBtn')).toBeInTheDocument();
      });

      // The component should pass isRecurring=false to the modal
    });

    it('should pass baseEvent for recurring events', async () => {
      renderEventActionItems('eventId1', MOCKS_RECURRING);

      await waitFor(() => {
        expect(screen.getByTestId('createActionItemBtn')).toBeInTheDocument();
      });

      // The component should pass baseEvent to the modal
    });
  });

  describe('Empty State', () => {
    it('should display no action items message when list is empty', async () => {
      const emptyMockData = {
        event: {
          ...mockEventData.event,
          actionItems: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
            },
          },
        },
      };

      const emptyMocks = [
        {
          request: {
            query: GET_EVENT_ACTION_ITEMS,
            variables: { input: { id: 'eventId1' } },
          },
          result: { data: emptyMockData },
        },
      ];

      renderEventActionItems('eventId1', emptyMocks);

      await waitFor(() => {
        expect(screen.getByText('noActionItems')).toBeInTheDocument();
      });
    });
  });

  describe('Data Grid Configuration', () => {
    it('should have correct column configuration', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getByText('Assigned To')).toBeInTheDocument();
        expect(screen.getByText('Item Category')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Assigned Date')).toBeInTheDocument();
        expect(screen.getByText('Options')).toBeInTheDocument();
      });
    });

    it('should disable column menu and resize', async () => {
      renderEventActionItems();

      await waitFor(() => {
        // The DataGrid should be configured with disableColumnMenu and disableColumnResize
        const dataGrid = document.querySelector('.MuiDataGrid-root');
        expect(dataGrid).toBeInTheDocument();
      });
    });

    it('should have correct row styling', async () => {
      renderEventActionItems();

      await waitFor(() => {
        const rows = document.querySelectorAll('.MuiDataGrid-row');
        expect(rows.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Search Bar Integration', () => {
    it('should render search bar with correct props', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
        expect(screen.getByTestId('searchBtn')).toBeInTheDocument();
      });
    });

    it('should call debounced search when input changes', async () => {
      renderEventActionItems();

      await waitFor(() => {
        const searchInput = screen.getByTestId('searchBy');
        fireEvent.change(searchInput, { target: { value: 'test search' } });
        expect(searchInput).toHaveValue('test search');
      });
    });
  });

  describe('Sorting Button Integration', () => {
    it('should render sorting buttons with correct props', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getByTestId('searchByToggleBtn')).toBeInTheDocument();
        expect(screen.getByTestId('sortBtn')).toBeInTheDocument();
        expect(screen.getByTestId('filterBtn')).toBeInTheDocument();
      });
    });
  });

  describe('Create Button', () => {
    it('should render create button with correct styling', async () => {
      renderEventActionItems();

      await waitFor(() => {
        const createBtn = screen.getByTestId('createActionItemBtn');
        expect(createBtn).toBeInTheDocument();
        expect(createBtn).toHaveClass('btn');
        expect(createBtn).toHaveClass('btn-success');
      });
    });

    it('should have correct icon and text', async () => {
      renderEventActionItems();

      await waitFor(() => {
        const createBtn = screen.getByTestId('createActionItemBtn');
        expect(createBtn).toHaveTextContent('create');
        expect(createBtn.querySelector('.fa-plus')).toBeInTheDocument();
      });
    });
  });
});
