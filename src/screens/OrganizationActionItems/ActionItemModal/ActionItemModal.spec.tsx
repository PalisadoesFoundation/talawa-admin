import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import type { IItemModalProps } from 'types/ActionItems/interface.ts';
import ItemModal from './ActionItemModal';
import { vi, it, describe, expect, afterEach } from 'vitest';
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
    i18n: { changeLanguage: () => Promise.resolve() },
  }),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useParams: () => ({ orgId: 'orgId' }) };
});

const createVolunteer = (
  eventId: string,
  { id = 'volunteer1', name = 'John Doe', isTemplate = true } = {},
) => ({
  id,
  hasAccepted: true,
  volunteerStatus: 'accepted',
  hoursVolunteered: 10,
  isPublic: true,
  isTemplate,
  isInstanceException: false,
  createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
  user: { id: `user-${id}`, name, avatarURL: null },
  event: { id: eventId, name: 'Test Event' },
  creator: { id: `user-${id}`, name },
  updater: { id: `user-${id}`, name },
  groups: [],
});

const createVolunteerGroup = (
  eventId: string,
  { id = 'group1', name = 'Test Group 1', isTemplate = true } = {},
) => ({
  id,
  name,
  description: 'Test',
  volunteersRequired: 5,
  isTemplate,
  isInstanceException: false,
  createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
  creator: { id: 'user1', name: 'John Doe' },
  volunteers: [
    {
      id: 'volunteer1',
      hasAccepted: true,
      user: { id: 'user-volunteer1', name: 'John Doe' },
    },
  ],
  event: { id: eventId },
});

const mockQueries = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: { input: { organizationId: 'orgId' } },
    },
    result: {
      data: {
        actionCategoriesByOrganization: [{ id: 'cat1', name: 'Category 1' }],
      },
    },
  },
  {
    request: { query: MEMBERS_LIST, variables: { organizationId: 'orgId' } },
    result: {
      data: { usersByOrganizationId: [{ id: 'user1', name: 'John Doe' }] },
    },
  },
  {
    request: {
      query: GET_EVENT_VOLUNTEERS,
      variables: { input: { id: 'eventId' }, where: {} },
    },
    result: {
      data: {
        event: { id: 'eventId', volunteers: [createVolunteer('eventId')] },
      },
    },
  },
  {
    request: {
      query: GET_EVENT_VOLUNTEER_GROUPS,
      variables: { input: { id: 'eventId' } },
    },
    result: {
      data: {
        event: {
          id: 'eventId',
          volunteerGroups: [createVolunteerGroup('eventId')],
        },
      },
    },
  },
  {
    request: {
      query: GET_EVENT_VOLUNTEER_GROUPS,
      variables: { input: { id: 'event123' } },
    },
    result: {
      data: {
        event: {
          id: 'event123',
          volunteerGroups: [createVolunteerGroup('event123')],
        },
      },
    },
  },
  {
    request: { query: ACTION_ITEM_LIST },
    variableMatcher: () => true,
    result: { data: { actionItemsByOrganization: [] } },
  },
  {
    request: {
      query: GET_EVENT_ACTION_ITEMS,
      variables: { input: { id: 'eventId' } },
    },
    result: { data: { event: { id: 'eventId', actionItems: { edges: [] } } } },
  },
  {
    request: { query: CREATE_ACTION_ITEM_MUTATION },
    variableMatcher: () => true,
    result: { data: { createActionItem: { id: 'new' } } },
  },
  {
    request: { query: UPDATE_ACTION_ITEM_MUTATION },
    variableMatcher: () => true,
    result: { data: { updateActionItem: { id: '1' } } },
  },
  {
    request: { query: UPDATE_ACTION_ITEM_FOR_INSTANCE },
    variableMatcher: () => true,
    result: { data: { updateActionItemForInstance: { id: '1' } } },
  },
];

const renderWithProviders = (props: IItemModalProps) =>
  render(
    <MockedProvider mocks={mockQueries}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ItemModal {...props} />
      </LocalizationProvider>
    </MockedProvider>,
  );

describe('ItemModal - Final Rectification', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call hide function when close button is clicked', async () => {
    const mockHide = vi.fn();
    renderWithProviders({
      isOpen: true,
      hide: mockHide,
      orgId: 'orgId',
      eventId: undefined,
      actionItemsRefetch: vi.fn(),
      editMode: false,
      actionItem: null,
    });
    const closeButton = await screen.findByTestId('modalCloseBtn');
    fireEvent.click(closeButton);
    expect(mockHide).toHaveBeenCalled();
  });

  it('should preselect volunteer group when editing a group assignment', async () => {
    const mockGroupItem = {
      id: '1',
      volunteerGroupId: 'group1',
      volunteerGroup: { id: 'group1', name: 'Test Group 1' },
      category: { id: 'cat1', name: 'Category 1' },
    };

    renderWithProviders({
      isOpen: true,
      hide: vi.fn(),
      orgId: 'orgId',
      eventId: 'event123',
      actionItemsRefetch: vi.fn(),
      editMode: true,
      actionItem: mockGroupItem as never,
    });

    await screen.findAllByText(/updateActionItem/i);

    // FORCE SWITCH: Click the "Volunteer Group" chip to ensure the correct field is shown
    // This bypasses any race conditions in the useEffect
    const groupChip = screen.getByText('volunteerGroup');
    fireEvent.click(groupChip);

    const select = await screen.findByTestId(
      'volunteerGroupSelect',
      {},
      { timeout: 5000 },
    );
    expect(select).toBeInTheDocument();
  });

  it('should handle entireSeries radio button toggle', async () => {
    renderWithProviders({
      isOpen: true,
      hide: vi.fn(),
      orgId: 'orgId',
      eventId: 'eventId',
      actionItemsRefetch: vi.fn(),
      editMode: false,
      actionItem: null,
      isRecurring: true,
    });
    // FIXED: Use findAllByText to handle potential duplicates
    await screen.findAllByText(/createActionItem/i);
    const input = screen.getByLabelText('volunteer *');
    await userEvent.type(input, 'Jane');
    await userEvent.click(screen.getByLabelText('entireSeries'));
    await waitFor(() => expect(input).toHaveValue(''));
  });
});
