import { MockedProvider } from '@apollo/react-testing';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { StaticMockLink } from 'utils/StaticMockLink';
import type {
  IItemModalProps,
  IUpdateActionItemForInstanceVariables,
  ICreateActionItemVariables,
} from 'types/ActionItems/interface.ts';
import ItemModal from './ActionItemModal';
import { vi, it, describe, expect, beforeEach, afterEach } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import {
  ACTION_ITEM_LIST,
  GET_EVENT_ACTION_ITEMS,
} from 'GraphQl/Queries/ActionItemQueries';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import {
  GET_EVENT_VOLUNTEERS,
  GET_EVENT_VOLUNTEER_GROUPS,
} from 'GraphQl/Queries/EventVolunteerQueries';
import {
  CREATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_FOR_INSTANCE,
} from 'GraphQl/Mutations/ActionItemMutations';
import userEvent from '@testing-library/user-event';
import type { IActionItemInfo } from 'types/ActionItems/interface';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => Promise.resolve(),
    },
  }),
}));

const matchesInputSubset = (
  variables: { input: unknown },
  expectedInput: Record<string, unknown>,
) => {
  const actualInput = variables.input as Record<string, unknown> | undefined;
  if (!actualInput) return false;
  return Object.entries(expectedInput).every(
    ([key, value]) => actualInput[key] === value,
  );
};

const createVolunteer = (
  eventId: string,
  {
    id = 'volunteer1',
    name = 'John Doe',
    isTemplate = true,
  }: { id?: string; name?: string; isTemplate?: boolean } = {},
) => ({
  id,
  hasAccepted: true,
  volunteerStatus: 'accepted',
  hoursVolunteered: 10,
  isPublic: true,
  isTemplate,
  isInstanceException: false,
  createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
  updatedAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
  user: {
    id: `user-${id}`,
    name,
    avatarURL: null,
  },
  event: {
    id: eventId,
    name: 'Test Event',
  },
  creator: {
    id: `user-${id}`,
    name,
    avatarURL: null,
  },
  updater: {
    id: `user-${id}`,
    name,
    avatarURL: null,
  },
  groups: [],
});

const createVolunteerGroup = (
  eventId: string,
  {
    id = 'group1',
    name = 'Test Group 1',
    description = 'Test volunteer group 1',
    isTemplate = true,
  }: {
    id?: string;
    name?: string;
    description?: string;
    isTemplate?: boolean;
  } = {},
) => ({
  id,
  name,
  description,
  volunteersRequired: 5,
  isTemplate,
  isInstanceException: false,
  createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
  creator: {
    id: 'user1',
    name: 'John Doe',
    avatarURL: null,
  },
  leader: {
    id: 'user1',
    name: 'John Doe',
    avatarURL: null,
  },
  volunteers: [
    {
      id: 'volunteer1',
      hasAccepted: true,
      user: {
        id: 'user-volunteer1',
        name: 'John Doe',
        avatarURL: null,
      },
    },
  ],
  event: {
    id: eventId,
  },
});

const createActionItemNode = (eventId: string) => ({
  id: '1',
  isCompleted: false,
  assignedAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
  completionAt: null,
  createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
  updatedAt: dayjs().utc().add(1, 'day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
  preCompletionNotes: 'Test notes',
  postCompletionNotes: null,
  isInstanceException: false,
  isTemplate: false,
  volunteer: {
    ...createVolunteer(eventId),
  },
  volunteerGroup: {
    ...createVolunteerGroup(eventId),
  },
  category: {
    id: 'cat1',
    name: 'Category 1',
  },
  event: {
    id: eventId,
    name: 'Test Event',
  },
  recurringEventInstance: {
    id: `recur-${eventId}`,
    name: 'Recurring Event',
  },
  organization: {
    id: 'orgId',
    name: 'Test Organization',
  },
  creator: {
    id: 'creator1',
    name: 'Creator 1',
  },
  updater: {
    id: 'creator1',
    name: 'Creator 1',
  },
});

const buildEventActionItemsData = (eventId: string) => ({
  event: {
    id: eventId,
    recurrenceRule: { id: `rec-${eventId}` },
    baseEvent: { id: `base-${eventId}` },
    actionItems: {
      edges: [
        {
          node: {
            ...createActionItemNode(eventId),
          },
        },
      ],
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
    },
  },
});

const buildActionItemsByOrgData = (eventId: string) => ({
  actionItemsByOrganization: [
    {
      ...createActionItemNode(eventId),
    },
  ],
});

const mockQueries = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: {
        input: {
          organizationId: 'orgId',
        },
      },
    },
    result: {
      data: {
        actionCategoriesByOrganization: [
          {
            id: 'cat1',
            name: 'Category 1',
            isDisabled: false,
            description: 'Test category 1',
            creator: { id: 'creator1', name: 'Creator 1' },
            createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
            updatedAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          },
          {
            id: 'cat2',
            name: 'Category 2',
            isDisabled: false,
            description: 'Test category 2',
            creator: { id: 'creator2', name: 'Creator 2' },
            createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
            updatedAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          },
        ],
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: { organizationId: 'orgId' },
    },
    result: {
      data: {
        usersByOrganizationId: [
          {
            id: 'user1',
            firstName: 'John',
            lastName: 'Doe',
            image: null,
            name: 'John Doe',
            emailAddress: 'john@example.com',
            role: 'USER',
            avatarURL: '',
            createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
            updatedAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          },
          {
            id: 'user2',
            firstName: 'Jane',
            lastName: 'Smith',
            image: null,
            name: 'Jane Smith',
            emailAddress: 'jane@example.com',
            role: 'USER',
            avatarURL: '',
            createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
            updatedAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          },
        ],
      },
    },
  },
  {
    request: {
      query: GET_EVENT_VOLUNTEERS,
      variables: {
        input: { id: 'eventId' },
        where: {},
      },
    },
    newData: () => ({
      data: {
        event: {
          id: 'eventId',
          recurrenceRule: { id: 'rec-eventId' },
          baseEvent: { id: 'base-eventId' },
          volunteers: [
            createVolunteer('eventId', {
              id: 'volunteer1',
              name: 'John Doe',
              isTemplate: true,
            }),
            createVolunteer('eventId', {
              id: 'volunteer2',
              name: 'Jane Smith',
              isTemplate: false,
            }),
          ],
        },
      },
    }),
  },
  {
    request: {
      query: GET_EVENT_VOLUNTEERS,
      variables: {
        input: { id: 'event123' },
        where: {},
      },
    },
    newData: () => ({
      data: {
        event: {
          id: 'event123',
          recurrenceRule: { id: 'rec-event123' },
          baseEvent: { id: 'base-event123' },
          volunteers: [
            {
              ...createVolunteer('event123', {
                id: 'volunteer1',
                name: 'John Doe',
                isTemplate: true,
              }),
              groups: [
                {
                  id: 'group1',
                  name: 'Test Group 1',
                  description: 'Test volunteer group 1',
                  volunteers: [{ id: 'volunteer1' }],
                },
              ],
            },
            createVolunteer('event123', {
              id: 'volunteer2',
              name: 'Jane Smith',
              isTemplate: false,
            }),
          ],
        },
      },
    }),
  },
  {
    request: {
      query: GET_EVENT_VOLUNTEER_GROUPS,
      variables: {
        input: { id: 'eventId' },
      },
    },
    newData: () => ({
      data: {
        event: {
          id: 'eventId',
          recurrenceRule: { id: 'rec-eventId' },
          baseEvent: { id: 'base-eventId' },
          volunteerGroups: [
            createVolunteerGroup('eventId', { id: 'group1', isTemplate: true }),
            createVolunteerGroup('eventId', {
              id: 'group2',
              name: 'Test Group 2',
              description: 'Test volunteer group 2',
              isTemplate: false,
            }),
          ],
        },
      },
    }),
  },
  {
    request: {
      query: GET_EVENT_VOLUNTEER_GROUPS,
      variables: {
        input: { id: 'event123' },
      },
    },
    newData: () => ({
      data: {
        event: {
          id: 'event123',
          recurrenceRule: { id: 'rec-event123' },
          baseEvent: { id: 'base-event123' },
          volunteerGroups: [
            createVolunteerGroup('event123', {
              id: 'group1',
              isTemplate: true,
            }),
            createVolunteerGroup('event123', {
              id: 'group2',
              name: 'Test Group 2',
              description: 'Test volunteer group 2',
              isTemplate: false,
            }),
          ],
        },
      },
    }),
  },
  {
    request: {
      query: ACTION_ITEM_LIST,
    },
    variableMatcher: () => true,
    newData: () => ({
      data: buildActionItemsByOrgData('eventId'),
    }),
  },
  {
    request: {
      query: GET_EVENT_ACTION_ITEMS,
      variables: { input: { id: 'eventId' } },
    },
    newData: () => ({
      data: buildEventActionItemsData('eventId'),
    }),
  },
  {
    request: {
      query: GET_EVENT_ACTION_ITEMS,
      variables: { input: { id: 'event123' } },
    },
    newData: () => ({
      data: buildEventActionItemsData('event123'),
    }),
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
    },
    variableMatcher: () => true,
    result: {
      data: {
        createActionItem: {
          id: 'created-action-item',
          isCompleted: false,
          assignedAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          preCompletionNotes: 'Test notes',
          postCompletionNotes: null,
          isInstanceException: false,
          isTemplate: false,
          __typename: 'ActionItem',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
    },
    variableMatcher: () => true,
    result: {
      data: {
        updateActionItem: {
          id: '1',
          isCompleted: false,
          assignedAt: dayjs()
            .utc()
            .add(1, 'day')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
          completionAt: null,
          createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          preCompletionNotes: 'Test notes',
          postCompletionNotes: null,
          isInstanceException: false,
          isTemplate: false,
          __typename: 'ActionItem',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_FOR_INSTANCE,
    },
    variableMatcher: () => true,
    result: {
      data: {
        updateActionItemForInstance: {
          id: '1',
        },
      },
    },
  },
];

const renderWithProviders = (props: IItemModalProps) => {
  return render(
    <MockedProvider mocks={mockQueries}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ItemModal {...props} />
      </LocalizationProvider>
    </MockedProvider>,
  );
};

const mockActionItem = {
  id: '1',
  volunteerId: 'volunteer1',
  volunteerGroupId: null,
  categoryId: 'cat1',
  eventId: null,
  recurringEventInstanceId: null,
  organizationId: 'org1',
  creatorId: 'creator1',
  updaterId: null,
  assignedAt: dayjs().utc().toDate(),
  completionAt: null,
  createdAt: dayjs().utc().toDate(),
  updatedAt: null,
  isCompleted: false,
  preCompletionNotes: 'Test notes',
  postCompletionNotes: null,
  isTemplate: true,
  isInstanceException: false,
  volunteer: {
    id: 'volunteer1',
    hasAccepted: true,
    isPublic: true,
    hoursVolunteered: 5,
    user: {
      id: 'user1',
      name: 'John Doe',
      avatarURL: '',
    },
  },
  volunteerGroup: null,
  creator: {
    id: 'creator1',
    name: 'Creator',
    avatarURL: '',
    emailAddress: 'creator@example.com',
  },
  updater: null,
  event: null,
  recurringEventInstance: null,
  category: {
    id: 'cat1',
    name: 'Category 1',
    description: '',
    isDisabled: false,
    createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
    organizationId: 'org1',
  },
  organization: {
    id: 'org1',
    name: 'Test Organization',
  },
};

const mockActionItemWithGroup = {
  ...mockActionItem,
  volunteerId: null,
  volunteerGroupId: 'group1',
  volunteer: null,
  volunteerGroup: {
    id: 'group1',
    name: 'Test Group 1',
    description: 'Test volunteer group 1',
    volunteersRequired: 5,
    isTemplate: true,
    isInstanceException: false,
    createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
    creator: {
      id: 'user1',
      name: 'John Doe',
      avatarURL: null,
    },
    leader: {
      id: 'user1',
      name: 'John Doe',
      avatarURL: null,
    },
    volunteers: [
      {
        id: 'volunteer1',
        hasAccepted: true,
        user: {
          id: 'user1',
          name: 'John Doe',
          avatarURL: null,
        },
      },
    ],
    event: {
      id: 'event123',
      name: 'Test Event',
    },
  },
  event: {
    id: 'event123',
    name: 'Test Event',
  },
};

const getPickerInputByLabel = (label: string) =>
  screen.getByLabelText(label, { selector: 'input' });

describe('ItemModal - Additional Test Cases', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe('Modal Visibility and Basic Rendering', () => {
    it('should not render modal when isOpen is false', () => {
      const props: IItemModalProps = {
        isOpen: false,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };
      renderWithProviders(props);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render modal when isOpen is true', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };
      renderWithProviders(props);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should call hide function when close button is clicked', () => {
      const mockHide = vi.fn();
      const props: IItemModalProps = {
        isOpen: true,
        hide: mockHide,
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };
      renderWithProviders(props);
      const closeButton = screen.getByTestId('modalCloseBtn');
      fireEvent.click(closeButton);
      expect(mockHide).toHaveBeenCalledTimes(1);
    });

    it('should preselect volunteer group when editing a group assignment', async () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: 'event123',
        actionItemsRefetch: vi.fn(),
        editMode: true,
        actionItem: mockActionItemWithGroup as unknown as IActionItemInfo,
      };

      renderWithProviders(props);

      await screen.findByRole('dialog');

      const volunteerGroupSelect = await screen.findByTestId(
        'volunteerGroupSelect',
        {},
        { timeout: 5000 },
      );

      expect(volunteerGroupSelect).toBeInTheDocument();

      const volunteerGroupInput = screen.getByLabelText(/volunteerGroup/i);

      await waitFor(
        () => {
          expect(volunteerGroupInput).toHaveValue('Test Group 1');
        },
        { timeout: 3000 },
      );

      expect(screen.queryByTestId('volunteerSelect')).not.toBeInTheDocument();
    });
  });

  describe('Form Initialization', () => {
    it('should initialize form with default values for create mode', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
      };
      renderWithProviders(props);
      const submitButton = screen.getByTestId('submitBtn');
      expect(submitButton).toHaveTextContent(/create/i);
    });

    it('should initialize form with action item data for edit mode', () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: undefined,
        actionItemsRefetch: vi.fn(),
        editMode: true,
        actionItem: mockActionItem,
      };
      renderWithProviders(props);
      const notesFields = screen.getAllByRole('textbox');
      const hasFieldWithValue = notesFields.some(
        (field) =>
          field.getAttribute('value') === 'Test notes' ||
          field.textContent?.includes('Test notes'),
      );
      expect(hasFieldWithValue).toBe(true);
    });
  });

  describe('applyTo dependent selection clearing', () => {
    it('should clear non-template volunteer when switching applyTo to series', async () => {
      const props: IItemModalProps = {
        isOpen: true,
        hide: vi.fn(),
        orgId: 'orgId',
        eventId: 'eventId',
        actionItemsRefetch: vi.fn(),
        editMode: false,
        actionItem: null,
        isRecurring: true,
      };

      renderWithProviders(props);
      await screen.findByRole('dialog');

      const volunteerInput = screen.getByLabelText('volunteer *');
      await userEvent.click(volunteerInput);
      await userEvent.type(volunteerInput, 'Jane Smith');

      const option = await screen.findByText('Jane Smith');
      await userEvent.click(option);

      await waitFor(() => {
        expect(screen.getByLabelText('volunteer *')).toHaveValue('Jane Smith');
      });

      const seriesRadio = screen.getByLabelText('entireSeries');
      await userEvent.click(seriesRadio);

      await waitFor(() => {
        expect(screen.getByLabelText('volunteer *')).toHaveValue('');
      });
    });
  });
});
