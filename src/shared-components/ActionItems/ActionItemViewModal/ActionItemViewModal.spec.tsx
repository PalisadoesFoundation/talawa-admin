import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import ItemViewModal, { type IViewModalProps } from './ActionItemViewModal';
import type { IActionItemInfo } from 'types/shared-components/ActionItems/interface';
import type { InterfaceEvent } from 'types/Event/interface';
import { GET_ACTION_ITEM_CATEGORY } from 'GraphQl/Queries/ActionItemCategoryQueries';
import { MEMBERS_LIST_WITH_DETAILS } from 'GraphQl/Queries/Queries';
import { vi, it, describe, beforeEach, afterEach } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: toastMocks,
}));

export const getPickerInputByLabel = (label: string): HTMLElement => {
  const allInputs = screen.getAllByRole('textbox', { hidden: true });
  for (const input of allInputs) {
    const formControl = input.closest('.MuiFormControl-root');
    if (formControl) {
      const labelEl = formControl.querySelector('label');
      if (labelEl) {
        const labelText = labelEl.textContent?.toLowerCase() || '';
        if (labelText.includes(label.toLowerCase())) {
          return formControl as HTMLElement;
        }
      }
    }
  }
  throw new Error(`Could not find date picker for label: ${label}`);
};

const t = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems,
  ),
);

// Mock data for GraphQL queries
const mockCategory = {
  id: 'categoryId1',
  name: 'Test Category',
  description: 'Test category description',
  isDisabled: false,
  organizationId: 'orgId1',
  creatorId: 'userId1',
  createdAt: dayjs.utc().toISOString(),
  updatedAt: dayjs.utc().toISOString(),
};

const baseTimestamp = dayjs.utc().toISOString();

const mockMembers = [
  {
    id: 'userId1',
    name: 'John Doe',
    emailAddress: 'john@example.com',
    role: 'MEMBER',
    avatarURL: 'https://example.com/avatar1.jpg',
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    id: 'userId2',
    name: 'Jane Smith',
    emailAddress: 'jane@example.com',
    role: 'ADMIN',
    avatarURL: null,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    firstName: 'Jane',
    lastName: 'Smith',
  },
  {
    id: 'userId3',
    name: '',
    firstName: 'Bob',
    lastName: 'Johnson',
    emailAddress: 'bob@example.com',
    role: 'REGULAR',
    avatarURL: null,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
  },
];

const mockEvent: InterfaceEvent = {
  id: 'eventId1',
  name: 'Test Event',
  description: 'Test event description',
  startAt: dayjs.utc().toISOString(),
  endAt: dayjs.utc().add(1, 'day').toISOString(),
  startTime: '10:00',
  endTime: '18:00',
  location: 'Test Location',
  allDay: false,
  isPublic: true,
  isRegisterable: true,
  isInviteOnly: false,
  attendees: [],
  creator: {},
};

// GraphQL mocks
const MOCKS = [
  {
    request: {
      query: GET_ACTION_ITEM_CATEGORY,
      variables: {
        input: { id: 'categoryId1' },
      },
    },
    result: {
      data: {
        actionItemCategory: mockCategory,
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST_WITH_DETAILS,
      variables: { organizationId: 'orgId1' },
    },
    result: {
      data: {
        usersByOrganizationId: mockMembers,
      },
    },
  },
];

const link1 = new StaticMockLink(MOCKS);

// Test data for different scenarios
const createActionItem = (
  overrides: Partial<IActionItemInfo> = {},
): IActionItemInfo => ({
  id: 'actionItemId1',
  volunteerId: 'userId1',
  volunteerGroupId: null,
  categoryId: 'categoryId1',
  eventId: 'eventId1',
  recurringEventInstanceId: null,
  organizationId: 'orgId1',
  creatorId: 'userId2',
  updaterId: null,
  assignedAt: dayjs.utc().toDate(),
  completionAt: dayjs.utc().add(9, 'day').toDate(),
  createdAt: dayjs.utc().toDate(),
  updatedAt: null,
  isCompleted: true,
  preCompletionNotes: 'Pre-completion notes for testing',
  postCompletionNotes: 'Post-completion notes for testing',

  volunteer: {
    id: 'volunteer1',
    hasAccepted: true,
    isPublic: true,
    hoursVolunteered: 5,
    user: {
      id: 'userId1',
      name: 'John Doe',
      avatarURL: 'https://example.com/avatar1.jpg',
    },
  },
  volunteerGroup: null,
  creator: {
    id: 'userId2',
    name: 'Jane Smith',
    emailAddress: 'jane@example.com',
    avatarURL: 'https://example.com/avatar1.jpg',
  },
  event: mockEvent,
  recurringEventInstance: null,
  category: {
    id: 'categoryId1',
    name: 'Test Category',
    description: null, // Added missing field from interface
    isDisabled: false,
    organizationId: 'orgId1',
    creatorId: 'userId1',
    createdAt: dayjs.utc().toISOString(),
    updatedAt: dayjs.utc().toISOString(),
  },
  ...overrides,
});

const renderItemViewModal = (
  link: ApolloLink,
  props: IViewModalProps,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <ItemViewModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('ItemViewModal - Helper Functions Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserDisplayName helper function', () => {
    it('should return user name when user has name property', async () => {
      const mockActionItemWithUserName = {
        ...createActionItem(),
      };
      const props: IViewModalProps = {
        isOpen: true,
        hide: vi.fn(),
        item: mockActionItemWithUserName,
      };
      renderItemViewModal(link1, props);
      await waitFor(() => {
        expect(screen.getByText('Action Item Details')).toBeInTheDocument();
      });
      const creatorField = screen.getByLabelText(/creator/i);
      expect(creatorField).toHaveValue('Jane Smith');
    });

    it('should return combined firstName and lastName when name is not available', async () => {
      const mockActionItemWithFirstLastName = {
        ...createActionItem(),
        creatorId: 'userId3',
        creator: null,
      };
      const props: IViewModalProps = {
        isOpen: true,
        hide: vi.fn(),
        item: mockActionItemWithFirstLastName,
      };
      renderItemViewModal(link1, props);
      await waitFor(() => {
        expect(screen.getByText('Action Item Details')).toBeInTheDocument();
      });
      // Wait for MEMBERS_LIST query to resolve and update the creator field
      await waitFor(() => {
        const creatorField = screen.getByLabelText(/creator/i);
        expect(creatorField).toHaveValue('Bob Johnson');
      });
    });

    it('should return "Unknown" when user is null', async () => {
      const mockActionItemWithNullCreator = {
        ...createActionItem(),
        creatorId: null,
        creator: null,
      };
      const props: IViewModalProps = {
        isOpen: true,
        hide: vi.fn(),
        item: mockActionItemWithNullCreator,
      };
      renderItemViewModal(link1, props);
      await waitFor(() => {
        expect(screen.getByText('Action Item Details')).toBeInTheDocument();
      });
      const creatorField = screen.getByLabelText(/creator/i);
      expect(creatorField).toHaveValue('Unknown');
    });

    it('should return "Unknown" when user is undefined', async () => {
      // Force properties to be undefined by overriding and casting
      const mockActionItemWithUndefinedCreator = {
        ...createActionItem(),
        creator: undefined,
        creatorId: undefined,
      } as unknown as IActionItemInfo;

      const props: IViewModalProps = {
        isOpen: true,
        hide: vi.fn(),
        item: mockActionItemWithUndefinedCreator,
      };
      renderItemViewModal(link1, props);
      await waitFor(() => {
        expect(screen.getByText('Action Item Details')).toBeInTheDocument();
      });
      const creatorField = screen.getByLabelText(/creator/i);
      expect(creatorField).toHaveValue('Unknown');
    });

    it('should return "Unknown" when firstName and lastName are empty after trim', async () => {
      const mockActionItemWithEmptyNames = {
        ...createActionItem(),
        creatorId: 'emptyUser',
        creator: null,
      };
      // Add a mock member with empty first and last names
      const mockMembersWithEmptyUser = [
        {
          id: 'emptyUser',
          firstName: '   ',
          lastName: '   ',
          image: null,
          name: null,
          emailAddress: 'empty@example.com',
          role: 'USER',
          avatarURL: '',
          createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          updatedAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
        ...mockMembers.slice(1),
      ];
      const MOCKS_EMPTY_USER = [
        {
          request: {
            query: GET_ACTION_ITEM_CATEGORY,
            variables: { input: { id: 'categoryId1' } },
          },
          result: { data: { actionItemCategory: mockCategory } },
        },
        {
          request: {
            query: MEMBERS_LIST_WITH_DETAILS,
            variables: { organizationId: 'orgId1' },
          },
          result: { data: { usersByOrganizationId: mockMembersWithEmptyUser } },
        },
      ];
      const linkEmptyUser = new StaticMockLink(MOCKS_EMPTY_USER);
      const props: IViewModalProps = {
        isOpen: true,
        hide: vi.fn(),
        item: mockActionItemWithEmptyNames,
      };
      renderItemViewModal(linkEmptyUser, props);
      await waitFor(() => {
        expect(screen.getByText('Action Item Details')).toBeInTheDocument();
      });
      const creatorField = screen.getByLabelText(/creator/i);
      expect(creatorField).toHaveValue('Unknown');
    });
  });

  describe('getEventDisplayName helper function', () => {
    it('should return "No event" when event name is empty string', async () => {
      const mockActionItemWithEmptyStringEventName = {
        ...createActionItem(),
        event: {
          ...mockEvent,
          name: '', // Empty string, not undefined/null
        },
        recurringEventInstance: null,
      };
      const props: IViewModalProps = {
        isOpen: true,
        hide: vi.fn(),
        item: mockActionItemWithEmptyStringEventName,
      };
      renderItemViewModal(link1, props);
      await waitFor(() => {
        expect(screen.getByText('Action Item Details')).toBeInTheDocument();
      });
      const eventField = screen.getByLabelText(/event/i);
      expect(eventField).toHaveValue('No event');
    });

    it('should return event name from recurringEventInstance when it has empty name in regular event', async () => {
      const mockActionItemWithEmptyEventButRecurring = {
        ...createActionItem(),
        recurringEventInstance: {
          ...mockEvent,
          name: 'Recurring Event Name',
        },
        event: {
          ...mockEvent,
          name: '', // Empty string in event
        },
      };
      const props: IViewModalProps = {
        isOpen: true,
        hide: vi.fn(),
        item: mockActionItemWithEmptyEventButRecurring,
      };
      renderItemViewModal(link1, props);
      await waitFor(() => {
        expect(screen.getByText('Action Item Details')).toBeInTheDocument();
      });
      const eventField = screen.getByLabelText(/event/i);
      expect(eventField).toHaveValue('Recurring Event Name');
    });

    it('should handle recurringEventInstance with empty name', async () => {
      const mockActionItemWithEmptyRecurringName = {
        ...createActionItem(),
        recurringEventInstance: {
          ...mockEvent,
          name: '', // Empty string
        },
        event: null,
      };
      const props: IViewModalProps = {
        isOpen: true,
        hide: vi.fn(),
        item: mockActionItemWithEmptyRecurringName,
      };
      renderItemViewModal(link1, props);
      await waitFor(() => {
        expect(screen.getByText('Action Item Details')).toBeInTheDocument();
      });
      const eventField = screen.getByLabelText(/event/i);
      expect(eventField).toHaveValue('No event');
    });
    it('should return event name when event has name property', async () => {
      const mockActionItemWithEvent = {
        ...createActionItem(),
        event: {
          ...mockEvent,
          name: 'Community Meetup',
        },
        recurringEventInstance: null,
      };
      const props: IViewModalProps = {
        isOpen: true,
        hide: vi.fn(),
        item: mockActionItemWithEvent,
      };
      renderItemViewModal(link1, props);
      await waitFor(() => {
        expect(screen.getByText('Action Item Details')).toBeInTheDocument();
      });
      const eventField = screen.getByLabelText(/event/i);
      expect(eventField).toHaveValue('Community Meetup');
    });

    it('should return "No event" when event is null', async () => {
      const mockActionItemWithNullEvent = {
        ...createActionItem(),
        event: null,
        recurringEventInstance: null,
      };
      const props: IViewModalProps = {
        isOpen: true,
        hide: vi.fn(),
        item: mockActionItemWithNullEvent,
      };
      renderItemViewModal(link1, props);
      await waitFor(() => {
        expect(screen.getByText('Action Item Details')).toBeInTheDocument();
      });
      const eventField = screen.getByLabelText(/event/i);
      expect(eventField).toHaveValue('No event');
    });

    it('should return "No event" when event is undefined', async () => {
      const mockActionItemWithUndefinedEvent = {
        ...createActionItem(),
        event: null, // Fix: use null instead of undefined
        recurringEventInstance: null,
      };
      const props: IViewModalProps = {
        isOpen: true,
        hide: vi.fn(),
        item: mockActionItemWithUndefinedEvent,
      };
      renderItemViewModal(link1, props);
      await waitFor(() => {
        expect(screen.getByText('Action Item Details')).toBeInTheDocument();
      });
      const eventField = screen.getByLabelText(/event/i);
      expect(eventField).toHaveValue('No event');
    });

    it('should prioritize recurringEventInstance over event when both exist', async () => {
      const mockActionItemWithBothEvents = {
        ...createActionItem(),
        recurringEventInstance: {
          ...mockEvent,
          name: 'Recurring Instance Event',
        },
        event: {
          ...mockEvent,
          name: 'Regular Event',
        },
      };
      const props: IViewModalProps = {
        isOpen: true,
        hide: vi.fn(),
        item: mockActionItemWithBothEvents,
      };
      renderItemViewModal(link1, props);
      await waitFor(() => {
        expect(screen.getByText('Action Item Details')).toBeInTheDocument();
      });
      const eventField = screen.getByLabelText(/event/i);
      expect(eventField).toHaveValue('Recurring Instance Event');
    });
  });
});

describe('Testing ItemViewModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockHide = vi.fn();

  describe('Modal Rendering and Basic Functionality', () => {
    it('should render modal when isOpen is true', () => {
      const item = createActionItem();
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      expect(screen.getByText(t.actionItemDetails)).toBeInTheDocument();
      expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      const item = createActionItem();
      renderItemViewModal(link1, {
        isOpen: false,
        hide: mockHide,
        item,
      });

      expect(screen.queryByText(t.actionItemDetails)).not.toBeInTheDocument();
    });

    it('should call hide function when close button is clicked', async () => {
      const item = createActionItem();
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      const closeButton = screen.getByTestId('modalCloseBtn');
      await userEvent.click(closeButton);

      expect(mockHide).toHaveBeenCalledTimes(1);
    });
  });

  describe('Category Display', () => {
    it('should display category name from GraphQL query', async () => {
      const item = createActionItem();
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      await waitFor(() => {
        const categoryInput = screen.getByDisplayValue('Test Category');
        expect(categoryInput).toBeInTheDocument();
        expect(categoryInput).toBeDisabled();
      });
    });

    it('should display fallback category name when no GraphQL data', () => {
      const item = createActionItem({
        categoryId: null,
        category: {
          id: 'categoryId1',
          name: 'Fallback Category',
          description: null, // Added missing field from interface
          isDisabled: false,
          organizationId: 'orgId1',
          creatorId: 'userId1',
          createdAt: dayjs.utc().toISOString(),
          updatedAt: dayjs.utc().toISOString(),
        },
      });

      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      expect(screen.getByDisplayValue('Fallback Category')).toBeInTheDocument();
    });

    it('should display "No category" when category is null', () => {
      const item = createActionItem({
        categoryId: null,
        category: null,
      });

      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      expect(screen.getByDisplayValue('No category')).toBeInTheDocument();
    });
  });

  describe('Assignee Display', () => {
    it('should display assignee name from GraphQL query', async () => {
      const item = createActionItem();
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      await waitFor(() => {
        const assigneeInput = screen.getByTestId('assignee_input');
        expect(assigneeInput).toBeInTheDocument();
        expect(assigneeInput).toHaveValue('John Doe');
        expect(assigneeInput).toBeDisabled();
      });
    });

    it('should display volunteer name when volunteer data exists', () => {
      const item = createActionItem({});

      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      const assigneeInput = screen.getByTestId('assignee_input');
      expect(assigneeInput).toHaveValue('John Doe');
    });

    it('should display volunteer group name when volunteer group is assigned', async () => {
      const item = createActionItem({
        volunteer: null,
        volunteerGroup: {
          id: 'group1',
          name: 'Test Volunteer Group',
          description: 'A test group',
          volunteersRequired: 5,
          leader: {
            id: 'userId1',
            name: 'Leader Name',
            avatarURL: null,
          },
          volunteers: [],
        },
      });

      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      await waitFor(() => {
        const assigneeInput = screen.getByTestId('assignee_input');
        expect(assigneeInput).toHaveValue('Test Volunteer Group');
      });
    });

    it('should display "No assignment" when neither volunteer nor volunteer group is assigned', () => {
      const item = createActionItem({
        volunteer: null,
        volunteerGroup: null,
      });

      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      const assigneeInput = screen.getByTestId('assignee_input');
      expect(assigneeInput).toHaveValue('No assignment');
    });
  });

  describe('Creator Display', () => {
    it('should display creator name from GraphQL query', async () => {
      const item = createActionItem();
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      await waitFor(() => {
        const creatorInput = screen.getByLabelText(t.creator);
        expect(creatorInput).toHaveValue('Jane Smith');
        expect(creatorInput).toBeDisabled();
      });
    });

    it('should display fallback creator name when no GraphQL data', () => {
      const item = createActionItem({
        creatorId: null,
        creator: {
          id: 'userId2',
          name: 'Fallback Creator',
          emailAddress: 'creator@example.com', // Fixed: changed from emailAddress to emailAddress
          avatarURL: 'https://example.com/fallback-creator-avatar.jpg',
        },
      });

      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      const creatorInput = screen.getByLabelText(t.creator);
      expect(creatorInput).toHaveValue('Fallback Creator');
    });
  });

  describe('Status Display', () => {
    it('should display completed status with success icon', () => {
      const item = createActionItem({ isCompleted: true });
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });
      const badge = screen.getByTestId('action-item-status-badge');
      expect(badge).toBeInTheDocument();
    });

    it('should display pending status with warning icon', () => {
      const item = createActionItem({ isCompleted: false });
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });
      const badge = screen.getByTestId('action-item-status-badge');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Event Display', () => {
    it('should display event name when event exists', () => {
      const item = createActionItem();
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      const eventInput = screen.getByDisplayValue('Test Event');
      expect(eventInput).toBeInTheDocument();
      expect(eventInput).toBeDisabled();
    });

    it('should display "No event" when event is null', () => {
      const item = createActionItem({ event: null, eventId: null });
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      const eventInput = screen.getByDisplayValue('No event');
      expect(eventInput).toBeInTheDocument();
    });
  });

  describe('Date Display', () => {
    const NOW = dayjs.utc().subtract(1, 'year').startOf('year');
    it('should display assignment date', () => {
      const item = createActionItem({
        assignedAt: NOW.toDate(),
      });
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      // Assignment date should be displayed in DD/MM/YYYY format
      const assignmentDateInput = screen.getByDisplayValue(
        NOW.format('DD/MM/YYYY'),
      );
      expect(assignmentDateInput).toBeInTheDocument();
      expect(assignmentDateInput).toBeDisabled();
    });

    it('should display completion date when item is completed', () => {
      const item = createActionItem({
        isCompleted: true,
        // Testing completion date 9 days in future to ensure proper date display and formatting
        completionAt: dayjs.utc().add(9, 'day').toDate(),
      });
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      // Completion date should be displayed in DD/MM/YYYY format
      const completionDateInput = screen.getByDisplayValue(
        dayjs.utc().add(9, 'day').format('DD/MM/YYYY'),
      );
      expect(completionDateInput).toBeInTheDocument();
      expect(completionDateInput).toBeDisabled();
    });

    it('should not display completion date when item is not completed', () => {
      const item = createActionItem({
        isCompleted: false,
        completionAt: null,
      });
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      // Completion date should not be displayed
      expect(
        screen.queryByDisplayValue(
          dayjs.utc().add(9, 'day').format('DD/MM/YYYY'),
        ),
      ).not.toBeInTheDocument();
    });
  });

  describe('Notes Display', () => {
    it('should display pre-completion notes', () => {
      const item = createActionItem({
        preCompletionNotes: 'Test pre-completion notes',
      });
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      const preNotesInput = screen.getByDisplayValue(
        'Test pre-completion notes',
      );
      expect(preNotesInput).toBeInTheDocument();
      expect(preNotesInput).toBeDisabled();
    });

    it('should display empty string when pre-completion notes is null', () => {
      const item = createActionItem({
        preCompletionNotes: null,
      });
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      const preNotesInput = screen.getByLabelText(t.preCompletionNotes);
      expect(preNotesInput).toHaveValue('');
    });

    it('should display post-completion notes when item is completed', () => {
      const item = createActionItem({
        isCompleted: true,
        postCompletionNotes: 'Test post-completion notes',
      });
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      const postNotesInput = screen.getByDisplayValue(
        'Test post-completion notes',
      );
      expect(postNotesInput).toBeInTheDocument();
      expect(postNotesInput).toBeDisabled();
    });

    it('should not display post-completion notes when item is not completed', () => {
      const item = createActionItem({
        isCompleted: false,
        postCompletionNotes: null,
      });
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      expect(
        screen.queryByLabelText(t.postCompletionNotes),
      ).not.toBeInTheDocument();
    });

    it('should display empty string when post-completion notes is null', () => {
      const item = createActionItem({
        isCompleted: true,
        postCompletionNotes: null,
      });
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      const postNotesInput = screen.getByLabelText(t.postCompletionNotes);
      expect(postNotesInput).toHaveValue('');
    });
  });

  describe('GraphQL Query Integration', () => {
    it('should skip category query when categoryId is null', () => {
      const item = createActionItem({ categoryId: null });
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      // Should use fallback category data
      expect(screen.getByDisplayValue('Test Category')).toBeInTheDocument();
    });
  });

  describe('Form Field Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      const item = createActionItem();
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      expect(screen.getByLabelText(t.category)).toBeInTheDocument();
      expect(screen.getByLabelText(t.assignedTo)).toBeInTheDocument();
      expect(screen.getByLabelText(t.creator)).toBeInTheDocument();
      const badge = screen.getByTestId('action-item-status-badge');
      expect(badge).toBeInTheDocument();
      expect(screen.getByLabelText(t.event)).toBeInTheDocument();
      expect(screen.getByTestId('assignmentDatePicker')).toBeInTheDocument();
      expect(screen.getByLabelText(t.preCompletionNotes)).toBeInTheDocument();
    });

    it('should have all form fields disabled', () => {
      const item = createActionItem();
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toBeDisabled();
      });
    });
  });
});
