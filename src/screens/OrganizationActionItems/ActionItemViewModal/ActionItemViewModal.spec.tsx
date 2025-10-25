import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18nForTest from '../../../utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import ItemViewModal, { type IViewModalProps } from './ActionItemViewModal';
import type { IActionItemInfo } from 'types/ActionItems/interface';
import type { InterfaceEvent } from 'types/Event/interface';
import { GET_ACTION_ITEM_CATEGORY } from 'GraphQl/Queries/ActionItemCategoryQueries';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { vi, it } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const t = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems,
  ),
);

const tCommon = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.common),
);

// Mock data for GraphQL queries
const mockCategory = {
  id: 'categoryId1',
  name: 'Test Category',
  description: 'Test category description',
  isDisabled: false,
  organizationId: 'orgId1',
  creatorId: 'userId1',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockMembers = [
  {
    id: 'userId1',
    name: 'John Doe',
    emailAddress: 'john@example.com', // Fixed: changed from emailAddress to emailAddress
    avatarURL: 'https://example.com/avatar1.jpg',
  },
  {
    id: 'userId2',
    name: 'Jane Smith',
    emailAddress: 'jane@example.com',
    role: 'ADMIN',
    avatarURL: null,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
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
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  },
];

const mockEvent: InterfaceEvent = {
  id: 'eventId1',
  name: 'Test Event',
  description: 'Test event description',
  startAt: '2024-01-01T10:00:00Z',
  endAt: '2024-01-02T18:00:00Z',
  startTime: '10:00',
  endTime: '18:00',
  location: 'Test Location',
  allDay: false,
  isPublic: true,
  isRegisterable: true,
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
      query: MEMBERS_LIST,
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
  assignedAt: new Date('2024-01-01T10:00:00.000Z'),
  completionAt: new Date('2024-01-10T15:30:00.000Z'),
  createdAt: new Date('2024-01-01T10:00:00.000Z'),
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
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  ...overrides,
});

const renderItemViewModal = (
  link: ApolloLink,
  props: IViewModalProps,
): RenderResult => {
  return render(
    <MockedProvider link={link} addTypename={false}>
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

describe('Testing ItemViewModal', () => {
  const mockHide = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

    it('should call hide function when close button is clicked', () => {
      const item = createActionItem();
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      const closeButton = screen.getByTestId('modalCloseBtn');
      fireEvent.click(closeButton);

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
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
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
        const inputElement = assigneeInput.querySelector('input');
        expect(inputElement).toHaveValue('John Doe');
        expect(inputElement).toBeDisabled();
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
      const inputElement = assigneeInput.querySelector('input');
      expect(inputElement).toHaveValue('John Doe');
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
        const inputElement = assigneeInput.querySelector('input');
        expect(inputElement).toHaveValue('Test Volunteer Group');
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
      const inputElement = assigneeInput.querySelector('input');
      expect(inputElement).toHaveValue('No assignment');
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

      const statusInput = screen.getByDisplayValue(tCommon.completed);
      expect(statusInput).toBeInTheDocument();
      expect(statusInput).toBeDisabled();

      // Check for TaskAlt icon (success icon)
      const successIcon = screen.getByTestId('TaskAltIcon');
      expect(successIcon).toBeInTheDocument();
    });

    it('should display pending status with warning icon', () => {
      const item = createActionItem({ isCompleted: false });
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      const statusInput = screen.getByDisplayValue(tCommon.pending);
      expect(statusInput).toBeInTheDocument();
      expect(statusInput).toBeDisabled();

      // Check for HistoryToggleOff icon (warning icon)
      const warningIcon = screen.getByTestId('HistoryToggleOffIcon');
      expect(warningIcon).toBeInTheDocument();
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
    it('should display assignment date', () => {
      const item = createActionItem();
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      // Assignment date should be displayed in DD/MM/YYYY format
      const assignmentDateInput = screen.getByDisplayValue('01/01/2024');
      expect(assignmentDateInput).toBeInTheDocument();
      expect(assignmentDateInput).toBeDisabled();
    });

    it('should display completion date when item is completed', () => {
      const item = createActionItem({
        isCompleted: true,
        completionAt: new Date('2024-01-10T15:30:00.000Z'),
      });
      renderItemViewModal(link1, {
        isOpen: true,
        hide: mockHide,
        item,
      });

      // Completion date should be displayed in DD/MM/YYYY format
      const completionDateInput = screen.getByDisplayValue('10/01/2024');
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
      expect(screen.queryByDisplayValue('10/01/2024')).not.toBeInTheDocument();
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
      expect(screen.getByLabelText(t.status)).toBeInTheDocument();
      expect(screen.getByLabelText(t.event)).toBeInTheDocument();
      expect(screen.getByLabelText(t.assignmentDate)).toBeInTheDocument();
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
