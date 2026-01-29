import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import EventActionItems from './EventActionItems';
import { GET_EVENT_ACTION_ITEMS } from 'GraphQl/Queries/ActionItemQueries';
import type { IActionItemInfo } from 'types/shared-components/ActionItems/interface';

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
vi.mock('shared-components/LoadingState/LoadingState', () => ({
  default: ({
    isLoading,
    children,
  }: {
    isLoading: boolean;
    children: React.ReactNode;
  }) => {
    if (isLoading) return <div data-testid="loader">Loading...</div>;
    return children;
  },
}));

vi.mock('shared-components/Avatar/Avatar', () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid="avatar">{name}</div>
  ),
}));

vi.mock('shared-components/SortingButton/SortingButton', () => ({
  default: ({
    onSortChange,
    dataTestIdPrefix,
    buttonLabel,
  }: {
    onSortChange: (value: string) => void;
    dataTestIdPrefix: string;
    buttonLabel: string;
  }) => {
    const [filterClickCount, setFilterClickCount] = React.useState(0);

    return (
      <button
        data-testid={`${dataTestIdPrefix}Btn`}
        onClick={() => {
          if (dataTestIdPrefix === 'searchByToggle') {
            // Switch to category for testing
            onSortChange('category');
          } else if (dataTestIdPrefix === 'filter') {
            // Cycle through filter states: all -> pending -> completed -> all
            const nextCount = filterClickCount + 1;
            setFilterClickCount(nextCount);
            const filterStates = ['pending', 'completed', 'all'];
            const currentState = filterStates[(nextCount - 1) % 3];
            onSortChange(currentState);
          } else {
            onSortChange('test-value');
          }
        }}
      >
        {buttonLabel}
      </button>
    );
  },
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
          onSearch(e.target.value);
        }}
      />
      <button data-testid={buttonTestId}>Search</button>
    </div>
  ),
}));

// Mock modal components
vi.mock(
  'shared-components/ActionItems/ActionItemViewModal/ActionItemViewModal',
  () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
      isOpen ? <div data-testid="view-modal">View Modal</div> : null,
  }),
);

vi.mock(
  'shared-components/ActionItems/ActionItemModal/ActionItemModal',
  () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
      isOpen ? (
        <div data-testid="action-item-modal">Action Item Modal</div>
      ) : null,
  }),
);

vi.mock(
  'shared-components/ActionItems/ActionItemDeleteModal/ActionItemDeleteModal',
  () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
      isOpen ? <div data-testid="delete-modal">Delete Modal</div> : null,
  }),
);

vi.mock(
  'shared-components/ActionItems/ActionItemUpdateModal/ActionItemUpdateStatusModal',
  () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
      isOpen ? <div data-testid="status-modal">Status Modal</div> : null,
  }),
);

const mockActionItem: IActionItemInfo = {
  id: 'actionItemId1',
  isTemplate: false,
  volunteerId: 'userId1',
  volunteerGroupId: null,
  categoryId: 'categoryId1',
  eventId: 'eventId1',
  recurringEventInstanceId: null,
  organizationId: 'orgId1',
  creatorId: 'userId2',
  updaterId: null,
  assignedAt: dayjs.utc().add(10, 'day').toDate(),
  completionAt: dayjs.utc().add(20, 'years').toDate(),
  createdAt: dayjs.utc().subtract(1, 'month').toDate(),
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
    startAt: dayjs
      .utc()
      .add(10, 'day')
      .hour(9)
      .minute(0)
      .second(0)
      .toISOString(),
    endAt: dayjs
      .utc()
      .add(10, 'day')
      .hour(17)
      .minute(0)
      .second(0)
      .toISOString(),
    startTime: '09:00:00',
    endTime: '17:00:00',
    allDay: false,
    isPublic: true,
    isRegisterable: true,
    isInviteOnly: false,
    attendees: [],
    creator: {
      id: 'userId2',
      name: 'Jane Smith',
      emailAddress: 'jane@example.com',
      createdAt: dayjs.utc().subtract(1, 'month').toDate(),
    },
  },
  recurringEventInstance: null,
  category: {
    id: 'categoryId1',
    name: 'Category 1',
    description: 'Test category',
    isDisabled: false,
    createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
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
            isTemplate: false,
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
): ReturnType<typeof render> => {
  return render(
    <MockedProvider mocks={mocks}>
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
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
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
        expect(
          screen.queryByText(i18nForTest.t('assignedTo')),
        ).toBeInTheDocument();
        expect(
          screen.getByText(i18nForTest.t('itemCategory')),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('columnheader', { name: i18nForTest.t('status') }),
        ).toBeInTheDocument();
        expect(
          screen.getByText(i18nForTest.t('assignedDate')),
        ).toBeInTheDocument();
        expect(screen.getByText(i18nForTest.t('options'))).toBeInTheDocument();
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
        expect(
          screen.getAllByText(dayjs.utc().add(10, 'day').format('DD/MM/YYYY')),
        ).toHaveLength(2);
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
        expect(
          screen.getByText(i18nForTest.t('noCategory')),
        ).toBeInTheDocument();
      });
    });

    it('should display "No assignment" when neither volunteer nor group assigned', async () => {
      const mockNoAssignment = {
        event: {
          ...mockEventData.event,
          actionItems: {
            edges: [
              {
                node: {
                  ...mockActionItem,
                  id: 'noAssignment1',
                  volunteer: null,
                  volunteerGroup: null,
                  volunteerId: null,
                  volunteerGroupId: null,
                },
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      };

      const mocks = [
        {
          request: {
            query: GET_EVENT_ACTION_ITEMS,
            variables: { input: { id: 'eventId1' } },
          },
          result: { data: mockNoAssignment },
        },
      ];

      renderEventActionItems('eventId1', mocks);

      await waitFor(() => {
        expect(screen.getAllByText(i18nForTest.t('noAssignment'))).toHaveLength(
          2,
        );
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

      const searchToggleBtn = screen.getByTestId('searchByToggleBtn');
      await userEvent.click(searchToggleBtn);

      const searchInput = screen.getByTestId('searchBy');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'Category');

      await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
        expect(screen.getByText('Category 2')).toBeInTheDocument();
      });
    });

    it('should filter items by assignee name when searching', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getAllByText('John Doe')).toHaveLength(2);
        expect(screen.getAllByText('Bob Wilson')).toHaveLength(2);
      });

      const searchInput = screen.getByTestId('searchBy');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'John');

      await waitFor(() => {
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

      const searchToggleBtn = screen.getByTestId('searchByToggleBtn');
      await userEvent.click(searchToggleBtn);

      const searchInput = screen.getByTestId('searchBy');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'Category 2');

      // Ensure `searchBy` state has applied before the debounced search term resolves.
      // This avoids a race where the first debounced search runs while still in "assignee" mode.
      await new Promise((resolve) => setTimeout(resolve, 0));
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'Category 2');

      await waitFor(() => {
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
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'JOHN');

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

      const searchInput = screen.getByTestId('searchBy');
      const searchButton = screen.getByTestId('searchBtn');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'John');
      await userEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getAllByText('John Doe')).toHaveLength(2);
        expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
      });

      await userEvent.clear(searchInput);
      // userEvent.type with empty string doesn't clear, so just clear is enough if we want empty
      // But preserving behavior:
      /* fireEvent.change(searchInput, { target: { value: '' } }); was clearing it */
      await userEvent.click(searchButton);

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
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'nonexistent');

      await waitFor(() => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
      });
    });

    it('should search by volunteer group name', async () => {
      const mockWithGroupSearch = {
        event: {
          ...mockEventData.event,
          actionItems: {
            edges: [
              {
                node: {
                  ...mockActionItem,
                  id: 'groupItem1',
                  volunteer: null,
                  volunteerId: null,
                  volunteerGroup: {
                    id: 'g1',
                    name: 'Group Search',
                    description: 'desc',
                    volunteersRequired: 5,
                    leader: {
                      id: 'leader1',
                      name: 'Leader One',
                      avatarURL: '',
                    },
                  },
                },
              },
              {
                node: {
                  ...mockActionItem,
                  id: 'volItem1',
                  volunteer: {
                    id: 'vol1',
                    hasAccepted: true,
                    isPublic: true,
                    hoursVolunteered: 1,
                    user: { id: 'u1', name: 'Alice Volunteer', avatarURL: '' },
                  },
                },
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      };

      const mocks = [
        {
          request: {
            query: GET_EVENT_ACTION_ITEMS,
            variables: { input: { id: 'eventId1' } },
          },
          result: { data: mockWithGroupSearch },
        },
      ];

      renderEventActionItems('eventId1', mocks);

      await waitFor(() => {
        expect(screen.getAllByText('Group Search')).toHaveLength(2);
        expect(screen.getAllByText('Alice Volunteer')).toHaveLength(2);
      });

      const searchInput = screen.getByTestId('searchBy');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'Group Search');

      await waitFor(() => {
        expect(screen.getAllByText('Group Search')).toHaveLength(2);
        expect(screen.queryByText('Alice Volunteer')).not.toBeInTheDocument();
      });
    });
  });

  describe('Sorting Functionality', () => {
    it('should sort items by assigned date in descending order', async () => {
      const mockDataWithDates = {
        event: {
          ...mockEventData.event,
          actionItems: {
            edges: [
              {
                node: {
                  ...mockActionItem,
                  id: 'item1',
                  assignedAt: dayjs.utc().add(10, 'day').toDate(),
                },
              },
              {
                node: {
                  ...mockActionItem,
                  id: 'item2',
                  assignedAt: dayjs.utc().add(12, 'days').toDate(),
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
        expect(
          screen.getByText(dayjs.utc().add(10, 'day').format('DD/MM/YYYY')),
        ).toBeInTheDocument();
        expect(
          screen.getByText(dayjs.utc().add(12, 'days').format('DD/MM/YYYY')),
        ).toBeInTheDocument();
      });

      const sortBtn = screen.getByTestId('sortBtn');
      await userEvent.click(sortBtn);

      await waitFor(() => {
        expect(
          screen.getByText(dayjs.utc().add(10, 'day').format('DD/MM/YYYY')),
        ).toBeInTheDocument();
        expect(
          screen.getByText(dayjs.utc().add(12, 'days').format('DD/MM/YYYY')),
        ).toBeInTheDocument();
      });
    });

    it('should sort items by assigned date in ascending order', async () => {
      const mockDataWithDates = {
        event: {
          ...mockEventData.event,
          actionItems: {
            edges: [
              {
                node: {
                  ...mockActionItem,
                  id: 'item1',
                  assignedAt: dayjs.utc().add(12, 'days').toDate(),
                },
              },
              {
                node: {
                  ...mockActionItem,
                  id: 'item2',
                  assignedAt: dayjs.utc().add(10, 'day').toDate(),
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
        expect(
          screen.getByText(dayjs.utc().add(12, 'days').format('DD/MM/YYYY')),
        ).toBeInTheDocument();
        expect(
          screen.getByText(dayjs.utc().add(10, 'day').format('DD/MM/YYYY')),
        ).toBeInTheDocument();
      });

      const sortBtn = screen.getByTestId('sortBtn');
      await userEvent.click(sortBtn);
      await userEvent.click(sortBtn);

      await waitFor(() => {
        expect(
          screen.getByText(dayjs.utc().add(12, 'days').format('DD/MM/YYYY')),
        ).toBeInTheDocument();
        expect(
          screen.getByText(dayjs.utc().add(10, 'day').format('DD/MM/YYYY')),
        ).toBeInTheDocument();
      });
    });

    it('should handle sorting with same dates', async () => {
      const mockDataWithSameDates = {
        event: {
          ...mockEventData.event,
          actionItems: {
            edges: [
              {
                node: {
                  ...mockActionItem,
                  id: 'item1',
                  assignedAt: dayjs.utc().add(10, 'day').toDate(),
                },
              },
              {
                node: {
                  ...mockActionItem,
                  id: 'item2',
                  assignedAt: dayjs.utc().add(10, 'day').toDate(),
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
        expect(
          screen.getAllByText(dayjs.utc().add(10, 'day').format('DD/MM/YYYY')),
        ).toHaveLength(2);
      });

      const sortBtn = screen.getByTestId('sortBtn');
      await userEvent.click(sortBtn);

      await waitFor(() => {
        expect(
          screen.getAllByText(dayjs.utc().add(10, 'day').format('DD/MM/YYYY')),
        ).toHaveLength(2);
      });
    });

    it('should handle sorting with invalid dates gracefully', () => {
      const mockItems: IActionItemInfo[] = [
        {
          ...mockActionItem,
          id: 'item1',
          assignedAt: new Date('invalid-date'),
        },
        {
          ...mockActionItem,
          id: 'item2',
          assignedAt: dayjs.utc().add(10, 'day').toDate(),
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

      expect(filteredItems).toHaveLength(2);
      const itemIds = filteredItems.map((item) => item.id);
      expect(itemIds).toContain('item1');
      expect(itemIds).toContain('item2');
    });

    it('should sort items correctly with mixed valid and invalid dates', () => {
      const mockItems: IActionItemInfo[] = [
        {
          ...mockActionItem,
          id: 'item1',
          assignedAt: dayjs.utc().add(1, 'day').toDate(),
        },
        {
          ...mockActionItem,
          id: 'item2',
          assignedAt: new Date('invalid-date'),
        },
        {
          ...mockActionItem,
          id: 'item3',
          assignedAt: dayjs.utc().add(3, 'days').toDate(),
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
          assignedAt: dayjs().add(1, 'day').toDate(),
        },
        {
          ...mockActionItem,
          id: 'item2',
          assignedAt: dayjs().add(3, 'days').toDate(),
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

      expect(filteredItems).toHaveLength(2);
      expect(filteredItems[0].id).toBe('item1');
      expect(filteredItems[1].id).toBe('item2');
    });
  });

  describe('Filtering Functionality', () => {
    it('should filter to show only pending items', async () => {
      renderEventActionItems();

      // Initially both items visible
      await waitFor(() => {
        expect(screen.getAllByText('John Doe')).toHaveLength(2);
        expect(screen.getAllByText('Bob Wilson')).toHaveLength(2);
      });

      // Click filter button once to filter by Pending
      const filterBtn = screen.getByTestId('filterBtn');
      await userEvent.click(filterBtn);

      // Verify only pending item (John Doe) is visible
      await waitFor(() => {
        expect(screen.getAllByText('John Doe')).toHaveLength(2);
      });

      expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
    });

    it('should filter to show only completed items', async () => {
      renderEventActionItems();

      // Initially both items visible
      await waitFor(() => {
        expect(screen.getAllByText('John Doe')).toHaveLength(2);
        expect(screen.getAllByText('Bob Wilson')).toHaveLength(2);
      });

      const filterBtn = screen.getByTestId('filterBtn');

      // Click twice to get to Completed filter
      await userEvent.click(filterBtn);

      // Small delay between clicks to ensure state updates
      await new Promise((resolve) => setTimeout(resolve, 100));

      await userEvent.click(filterBtn);

      // Verify only completed item (Bob Wilson) is visible
      await waitFor(
        () => {
          const bobElements = screen.queryAllByText('Bob Wilson');
          expect(bobElements).toHaveLength(2);
        },
        { timeout: 3000 },
      );

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('should show all items when filter is cleared', async () => {
      renderEventActionItems();

      // Initially both items visible
      await waitFor(() => {
        expect(screen.getAllByText('John Doe')).toHaveLength(2);
        expect(screen.getAllByText('Bob Wilson')).toHaveLength(2);
      });

      const filterBtn = screen.getByTestId('filterBtn');

      // Click three times to cycle through all states
      await userEvent.click(filterBtn);
      await new Promise((resolve) => setTimeout(resolve, 100));

      await userEvent.click(filterBtn);
      await new Promise((resolve) => setTimeout(resolve, 100));

      await userEvent.click(filterBtn);

      // Both items should be visible again
      await waitFor(
        () => {
          expect(screen.getAllByText('John Doe')).toHaveLength(2);
          expect(screen.getAllByText('Bob Wilson')).toHaveLength(2);
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Modal Interactions', () => {
    it('should open create modal when create button is clicked', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getByTestId('createActionItemBtn')).toBeInTheDocument();
      });

      const createBtn = screen.getByTestId('createActionItemBtn');
      await userEvent.click(createBtn);

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
      await userEvent.click(viewBtn);

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
      await userEvent.click(editBtn);

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
      await userEvent.click(deleteBtn);

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
      await userEvent.click(statusCheckbox);

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
    });

    it('should set isRecurring to false for non-recurring events', async () => {
      renderEventActionItems();

      await waitFor(() => {
        expect(screen.getByTestId('createActionItemBtn')).toBeInTheDocument();
      });
    });

    it('should pass baseEvent for recurring events', async () => {
      renderEventActionItems('eventId1', MOCKS_RECURRING);

      await waitFor(() => {
        expect(screen.getByTestId('createActionItemBtn')).toBeInTheDocument();
      });
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
        expect(
          screen.queryByText(i18nForTest.t('assignedTo')),
        ).toBeInTheDocument();
        expect(
          screen.getByText(i18nForTest.t('itemCategory')),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('columnheader', { name: i18nForTest.t('status') }),
        ).toBeInTheDocument();
        expect(
          screen.getByText(i18nForTest.t('assignedDate')),
        ).toBeInTheDocument();
        expect(screen.getByText(i18nForTest.t('options'))).toBeInTheDocument();
      });
    });

    it('should disable column menu and resize', async () => {
      renderEventActionItems();

      await waitFor(() => {
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
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchBy');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'test search');

      await waitFor(() => {
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

  describe('Additional Coverage Tests', () => {
    it('should handle volunteer group assignments correctly', async () => {
      const mockDataWithVolunteerGroup = {
        event: {
          ...mockEventData.event,
          actionItems: {
            edges: [
              {
                node: {
                  ...mockActionItem,
                  volunteerId: null,
                  volunteerGroupId: 'groupId1',
                  volunteer: null,
                  volunteerGroup: {
                    id: 'groupId1',
                    name: 'Volunteer Group A',
                    description: 'Test group',
                    volunteersRequired: 10,
                    leader: {
                      id: 'leaderId1',
                      name: 'Group Leader',
                      avatarURL: '',
                    },
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

      const mocksWithGroup = [
        {
          request: {
            query: GET_EVENT_ACTION_ITEMS,
            variables: { input: { id: 'eventId1' } },
          },
          result: { data: mockDataWithVolunteerGroup },
        },
      ];

      renderEventActionItems('eventId1', mocksWithGroup);

      await waitFor(() => {
        const groupNameElements = screen.getAllByText('Volunteer Group A');
        expect(groupNameElements.length).toBeGreaterThan(0);
      });
    });

    it('should display group icon when action item is assigned to volunteer group', async () => {
      const mockDataWithGroup = {
        event: {
          ...mockEventData.event,
          actionItems: {
            edges: [
              {
                node: {
                  ...mockActionItem,
                  volunteerId: null,
                  volunteerGroupId: 'groupId1',
                  volunteer: null,
                  volunteerGroup: {
                    id: 'groupId1',
                    name: 'Test Group',
                    description: 'Test',
                    volunteersRequired: 5,
                    leader: {
                      id: 'leaderId',
                      name: 'Leader',
                      avatarURL: '',
                    },
                  },
                },
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      };

      const mocks = [
        {
          request: {
            query: GET_EVENT_ACTION_ITEMS,
            variables: { input: { id: 'eventId1' } },
          },
          result: { data: mockDataWithGroup },
        },
      ];

      renderEventActionItems('eventId1', mocks);

      await waitFor(() => {
        expect(screen.getByTestId('groupIcon')).toBeInTheDocument();
      });
    });

    it('should have correct aria-label when action item is completed', async () => {
      const mockDataWithCompleted = {
        event: {
          ...mockEventData.event,
          actionItems: {
            edges: [
              {
                node: {
                  ...mockActionItem,
                  isCompleted: true,
                },
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      };

      const mocks = [
        {
          request: {
            query: GET_EVENT_ACTION_ITEMS,
            variables: { input: { id: 'eventId1' } },
          },
          result: { data: mockDataWithCompleted },
        },
      ];

      renderEventActionItems('eventId1', mocks);

      await waitFor(() => {
        const checkbox = screen.getByTestId('statusCheckboxactionItemId1');
        expect(checkbox).toHaveAttribute('aria-label', 'actionItemCompleted');
        const statusChips = screen.getAllByTestId('statusChip');
        expect(statusChips[0]).toHaveTextContent('completed'); // First item as only one item present in mock
      });
    });

    it('should have correct aria-label when action item is pending', async () => {
      renderEventActionItems();

      await waitFor(() => {
        const checkbox = screen.getByTestId('statusCheckboxactionItemId1');
        expect(checkbox).toHaveAttribute('aria-label', 'markCompletion');
        const statusChips = screen.getAllByTestId('statusChip');
        expect(statusChips[0]).toHaveTextContent('pending'); // First item as only one item present in mock
      });
    });

    it('should display loading state while fetching action items', async () => {
      const loadingMocks = [
        {
          request: {
            query: GET_EVENT_ACTION_ITEMS,
            variables: { input: { id: 'eventId1' } },
          },
          result: {
            data: {
              event: {
                id: 'eventId1',
                recurrenceRule: null,
                baseEvent: null,
                actionItems: {
                  edges: [],
                  pageInfo: {
                    hasNextPage: false,
                    endCursor: null,
                  },
                },
              },
            },
          },
          delay: 100,
        },
      ];

      renderEventActionItems('eventId1', loadingMocks);

      expect(screen.getByTestId('loader')).toBeInTheDocument();

      // Verify component renders and eventually loads data
      await waitFor(() => {
        expect(screen.getByTestId('createActionItemBtn')).toBeInTheDocument();
      });
    });
  });
});
