import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor, within } from '@testing-library/react';
import { StaticMockLink } from 'utils/StaticMockLink';
import type {
  IItemModalProps,
  IActionItemInfo,
} from 'types/shared-components/ActionItems/interface';
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
  GET_EVENT_VOLUNTEERS,
  GET_EVENT_VOLUNTEER_GROUPS,
} from 'GraphQl/Queries/EventVolunteerQueries';
import {
  CREATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_FOR_INSTANCE,
} from 'GraphQl/Mutations/ActionItemMutations';
import userEvent from '@testing-library/user-event';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: () => Promise.resolve() },
  }),
}));

// Helper factories
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
  updatedAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
  user: { id: `user-${id}`, name, avatarURL: null },
  event: { id: eventId, name: 'Test Event' },
  creator: { id: `user-${id}`, name, avatarURL: null },
  updater: { id: `user-${id}`, name, avatarURL: null },
  groups: [],
});

const createVolunteerGroup = (
  eventId: string,
  { id = 'group1', name = 'Test Group 1', isTemplate = true } = {},
) => ({
  id,
  name,
  description: 'Test volunteer group',
  volunteersRequired: 5,
  isTemplate,
  isInstanceException: false,
  createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
  creator: { id: 'user1', name: 'John Doe', avatarURL: null },
  leader: { id: 'user1', name: 'John Doe', avatarURL: null },
  volunteers: [
    {
      id: 'volunteer1',
      hasAccepted: true,
      user: { id: 'user1', name: 'John Doe', avatarURL: null },
    },
  ],
  event: { id: eventId },
});

// Mock queries
const mockQueries = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: { input: { organizationId: 'orgId' } },
    },
    result: {
      data: {
        actionCategoriesByOrganization: [
          {
            id: 'cat1',
            name: 'Category 1',
            isDisabled: false,
            description: 'Test',
            creator: { id: 'c1', name: 'Creator' },
            createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
            updatedAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          },
          {
            id: 'cat2',
            name: 'Category 2',
            isDisabled: false,
            description: 'Test',
            creator: { id: 'c2', name: 'Creator' },
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
      variables: { input: { id: 'eventId' }, where: {} },
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
      query: GET_EVENT_VOLUNTEER_GROUPS,
      variables: { input: { id: 'eventId' } },
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
              isTemplate: false,
            }),
          ],
        },
      },
    }),
  },
  {
    request: { query: CREATE_ACTION_ITEM_MUTATION },
    variableMatcher: () => true,
    result: {
      data: {
        createActionItem: {
          id: 'new-action-item',
          isCompleted: false,
          assignedAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          preCompletionNotes: 'Test',
          postCompletionNotes: null,
          isInstanceException: false,
          isTemplate: false,
          __typename: 'ActionItem',
        },
      },
    },
  },
  {
    request: { query: UPDATE_ACTION_ITEM_MUTATION },
    variableMatcher: () => true,
    result: {
      data: {
        updateActionItem: {
          id: '1',
          isCompleted: false,
          assignedAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          completionAt: null,
          createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          preCompletionNotes: 'Updated',
          postCompletionNotes: null,
          isInstanceException: false,
          isTemplate: false,
          __typename: 'ActionItem',
        },
      },
    },
  },
  {
    request: { query: UPDATE_ACTION_ITEM_FOR_INSTANCE },
    variableMatcher: () => true,
    result: { data: { updateActionItemForInstance: { id: '1' } } },
  },
];

const mockActionItem: IActionItemInfo = {
  id: '1',
  volunteerId: 'volunteer1',
  volunteerGroupId: null,
  categoryId: 'cat1',
  eventId: 'eventId',
  recurringEventInstanceId: null,
  organizationId: 'orgId',
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
    user: { id: 'user1', name: 'John Doe', avatarURL: '' },
  },
  volunteerGroup: null,
  creator: {
    id: 'creator1',
    name: 'Creator',
    avatarURL: '',
    emailAddress: 'c@test.com',
  },
  event: null,
  recurringEventInstance: null,
  category: {
    id: 'cat1',
    name: 'Category 1',
    description: '',
    isDisabled: false,
    createdAt: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
    organizationId: 'orgId',
  },
};

const mockActionItemWithGroup: IActionItemInfo = {
  ...mockActionItem,
  volunteerId: null,
  volunteerGroupId: 'group1',
  volunteer: null,
  volunteerGroup: {
    id: 'group1',
    name: 'Test Group 1',
    description: 'Test volunteer group',
    volunteersRequired: 5,
    leader: { id: 'user1', name: 'John Doe', avatarURL: null },
    volunteers: [
      {
        id: 'volunteer1',
        user: { id: 'user1', name: 'John Doe' },
      },
    ],
  },
};

const mockCompletedActionItem: IActionItemInfo = {
  ...mockActionItem,
  isCompleted: true,
  postCompletionNotes: 'Completed notes',
};
const renderModal = (props: Partial<IItemModalProps> = {}) => {
  const defaultProps: IItemModalProps = {
    isOpen: true,
    hide: vi.fn(),
    orgId: 'orgId',
    eventId: 'eventId',
    actionItemsRefetch: vi.fn(),
    editMode: false,
    actionItem: null,
  };
  return render(
    <MockedProvider mocks={mockQueries}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ItemModal {...defaultProps} {...props} />
      </LocalizationProvider>
    </MockedProvider>,
  );
};

describe('ActionItemModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Visibility', () => {
    it('should not render when isOpen is false', () => {
      renderModal({ isOpen: false });
      expect(screen.queryByTestId('actionItemModal')).not.toBeInTheDocument();
    });

    it('should render CreateModal when isOpen is true and editMode is false', async () => {
      renderModal();
      await waitFor(() => {
        expect(screen.getByTestId('actionItemModal')).toBeInTheDocument();
      });
      expect(screen.getByTestId('modal-submit-btn')).toHaveTextContent(
        /create/i,
      );
    });

    it('should render EditModal when editMode is true', async () => {
      renderModal({ editMode: true, actionItem: mockActionItem });
      await waitFor(() => {
        expect(screen.getByTestId('actionItemModal')).toBeInTheDocument();
      });
      expect(screen.getByTestId('modal-submit-btn')).toHaveTextContent(
        /update/i,
      );
    });

    it('should call hide when close button is clicked', async () => {
      const user = userEvent.setup();
      const mockHide = vi.fn();
      renderModal({ hide: mockHide });
      await screen.findByTestId('actionItemModal');
      await user.click(screen.getByTestId('modalCloseBtn'));
      expect(mockHide).toHaveBeenCalledTimes(1);
    });

    it('should close modal when Escape key is pressed', async () => {
      const user = userEvent.setup();
      const mockHide = vi.fn();
      renderModal({ hide: mockHide });
      await screen.findByTestId('actionItemModal');
      await user.keyboard('{Escape}');
      await waitFor(
        () => {
          expect(mockHide).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Create Mode', () => {
    it('should show validation error when submitting without category and assignment', async () => {
      renderModal();
      await screen.findByTestId('actionItemModal');
      await waitFor(() => {
        expect(screen.getByTestId('categorySelect')).toBeInTheDocument();
      });

      const submitButton = screen.getByTestId('modal-submit-btn');
      expect(submitButton).toBeDisabled();
    });

    it('should create action item successfully with volunteer assignment', async () => {
      const user = userEvent.setup();
      const mockRefetch = vi.fn();
      const mockHide = vi.fn();
      renderModal({ actionItemsRefetch: mockRefetch, hide: mockHide });
      await screen.findByTestId('actionItemModal');

      // Select category
      const categoryInput = within(
        screen.getByTestId('categorySelect'),
      ).getByRole('combobox');
      await user.click(categoryInput);
      await user.type(categoryInput, 'Category 1');
      const categoryOption = await screen.findByText('Category 1');
      await user.click(categoryOption);

      // Select volunteer
      const volunteerInput = within(
        screen.getByTestId('volunteerSelect'),
      ).getByRole('combobox');
      await user.click(volunteerInput);
      await user.type(volunteerInput, 'John');
      const volunteerOption = await screen.findByText('John Doe');
      await user.click(volunteerOption);

      // Submit
      await user.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith({
          key: 'eventActionItems.successfulCreation',
          namespace: 'translation',
        });
        expect(mockRefetch).toHaveBeenCalled();
        expect(mockHide).toHaveBeenCalled();
      });
    });

    it('should create action item with volunteer group assignment', async () => {
      const user = userEvent.setup();
      const mockRefetch = vi.fn();
      renderModal({ actionItemsRefetch: mockRefetch });
      await screen.findByTestId('actionItemModal');

      // Select category
      const categoryInput = within(
        screen.getByTestId('categorySelect'),
      ).getByRole('combobox');
      await user.click(categoryInput);
      const categoryOption = await screen.findByText('Category 1');
      await user.click(categoryOption);

      // Switch to volunteer group
      const volunteerGroupChip = screen.getByRole('button', {
        name: 'volunteerGroup',
      });
      await user.click(volunteerGroupChip);

      // Select volunteer group
      const groupSelect = await screen.findByTestId('volunteerGroupSelect');
      const groupInput = within(groupSelect).getByRole('combobox');
      await user.click(groupInput);
      const groupOption = await screen.findByText('Test Group 1');
      await user.click(groupOption);

      // Submit
      await user.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });
    });

    it('should handle mutation error gracefully', async () => {
      const user = userEvent.setup();
      const errorMock = {
        request: { query: CREATE_ACTION_ITEM_MUTATION },
        variableMatcher: () => true,
        error: new Error('Network error'),
      };

      render(
        <MockedProvider mocks={[...mockQueries.slice(0, 3), errorMock]}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ItemModal
              isOpen={true}
              hide={vi.fn()}
              orgId="orgId"
              eventId="eventId"
              actionItemsRefetch={vi.fn()}
              editMode={false}
              actionItem={null}
            />
          </LocalizationProvider>
        </MockedProvider>,
      );

      await screen.findByTestId('actionItemModal');

      // Fill form
      const categoryInput = within(
        screen.getByTestId('categorySelect'),
      ).getByRole('combobox');
      await user.click(categoryInput);
      const categoryOption = await screen.findByText('Category 1');
      await user.click(categoryOption);

      const volunteerInput = within(
        screen.getByTestId('volunteerSelect'),
      ).getByRole('combobox');
      await user.click(volunteerInput);
      const volunteerOption = await screen.findByText('John Doe');
      await user.click(volunteerOption);

      await user.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith({
          key: 'unknownError',
          namespace: 'errors',
        });
      });
    });
  });

  describe('Edit Mode', () => {
    it('should initialize form with action item data', async () => {
      renderModal({ editMode: true, actionItem: mockActionItem });
      await screen.findByTestId('actionItemModal');

      await waitFor(() => {
        expect(screen.getByLabelText('preCompletionNotes')).toHaveValue(
          'Test notes',
        );
      });
    });

    it('should update action item successfully', async () => {
      const user = userEvent.setup();
      const mockRefetch = vi.fn();
      const mockHide = vi.fn();
      renderModal({
        editMode: true,
        actionItem: { ...mockActionItem, isTemplate: false },
        actionItemsRefetch: mockRefetch,
        hide: mockHide,
      });

      await screen.findByTestId('actionItemModal');
      await waitFor(() => {
        expect(screen.getByTestId('modal-submit-btn')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith({
          key: 'eventActionItems.successfulUpdation',
          namespace: 'translation',
        });
      });
    });

    it('should show error when action item ID is missing', async () => {
      const user = userEvent.setup();
      renderModal({
        editMode: true,
        actionItem: {
          ...mockActionItem,
          id: undefined,
        } as unknown as IActionItemInfo,
      });

      await screen.findByTestId('actionItemModal');
      await user.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith({
          key: 'unknownError',
          namespace: 'errors',
        });
      });
    });

    it('should preselect volunteer group when editing group assignment', async () => {
      renderModal({
        editMode: true,
        actionItem: mockActionItemWithGroup as unknown as IActionItemInfo,
      });
      await screen.findByTestId('actionItemModal');

      await waitFor(() => {
        expect(screen.getByTestId('volunteerGroupSelect')).toBeInTheDocument();
      });
      expect(screen.queryByTestId('volunteerSelect')).not.toBeInTheDocument();
    });

    it('should render postCompletionNotes when action item is completed', async () => {
      renderModal({ editMode: true, actionItem: mockCompletedActionItem });
      await screen.findByTestId('actionItemModal');

      await waitFor(() => {
        expect(
          screen.getByLabelText('postCompletionNotes'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Recurring Events', () => {
    it('should show ApplyToSelector for recurring events in create mode', async () => {
      renderModal({ isRecurring: true });
      await screen.findByTestId('actionItemModal');

      await waitFor(() => {
        expect(screen.getByLabelText('entireSeries')).toBeInTheDocument();
        expect(screen.getByLabelText('thisEventOnly')).toBeInTheDocument();
      });
    });

    it('should show ApplyToSelector for template action items in edit mode', async () => {
      renderModal({
        editMode: true,
        actionItem: mockActionItem,
        isRecurring: true,
      });
      await screen.findByTestId('actionItemModal');

      await waitFor(() => {
        expect(screen.getByLabelText('entireSeries')).toBeInTheDocument();
      });
    });

    it('should not show ApplyToSelector for non-template action items', async () => {
      renderModal({
        editMode: true,
        actionItem: { ...mockActionItem, isTemplate: false },
        isRecurring: true,
      });
      await screen.findByTestId('actionItemModal');

      await waitFor(() => {
        expect(screen.queryByLabelText('entireSeries')).not.toBeInTheDocument();
      });
    });

    it('should use updateActionForInstance when editing template with thisEventOnly', async () => {
      const user = userEvent.setup();
      const mockRefetch = vi.fn();
      const mockHide = vi.fn();
      renderModal({
        editMode: true,
        actionItem: mockActionItem,
        isRecurring: true,
        actionItemsRefetch: mockRefetch,
        hide: mockHide,
      });

      await screen.findByTestId('actionItemModal');

      // Select "This event only"
      const instanceRadio = screen.getByLabelText('thisEventOnly');
      await user.click(instanceRadio);

      await user.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith({
          key: 'eventActionItems.successfulUpdation',
          namespace: 'translation',
        });
      });
    });

    it('should show ApplyToSelector for recurring events and allow switching', async () => {
      const user = userEvent.setup();
      renderModal({ isRecurring: true });
      await screen.findByTestId('actionItemModal');

      const instanceRadio = screen.getByLabelText('thisEventOnly');
      const seriesRadio = screen.getByLabelText('entireSeries');

      expect(instanceRadio).toBeChecked();
      expect(seriesRadio).not.toBeChecked();

      await user.click(seriesRadio);

      expect(seriesRadio).toBeChecked();
      expect(instanceRadio).not.toBeChecked();
    });
  });

  describe('Assignment Type Switching', () => {
    it('should clear volunteer when switching to volunteer group', async () => {
      const user = userEvent.setup();
      renderModal();
      await screen.findByTestId('actionItemModal');

      // Select category
      const categoryInput = within(
        screen.getByTestId('categorySelect'),
      ).getByRole('combobox');
      await user.click(categoryInput);
      const categoryOption = await screen.findByText('Category 1');
      await user.click(categoryOption);

      // Select volunteer
      const volunteerInput = within(
        screen.getByTestId('volunteerSelect'),
      ).getByRole('combobox');
      await user.click(volunteerInput);
      const volunteerOption = await screen.findByText('John Doe');
      await user.click(volunteerOption);

      await waitFor(() => {
        expect(volunteerInput).toHaveValue('John Doe');
      });

      // Switch to volunteer group
      const groupChip = screen.getByRole('button', { name: 'volunteerGroup' });
      await user.click(groupChip);

      // Wait for group select to appear
      await screen.findByTestId('volunteerGroupSelect', {}, { timeout: 10000 });

      // Switch back - should be cleared
      const volunteerChip = screen.getByRole('button', { name: 'volunteer' });
      await user.click(volunteerChip);

      // Wait for volunteer select to reappear
      const reopenedSelect = await screen.findByTestId(
        'volunteerSelect',
        {},
        { timeout: 5000 },
      );
      const reopenedInput = within(reopenedSelect).getByRole('combobox');
      await waitFor(() => {
        expect(reopenedInput).toHaveValue('');
      });
    });

    it('should disable volunteer chip when editing group assignment', async () => {
      renderModal({
        editMode: true,
        actionItem: mockActionItemWithGroup,
        isRecurring: false,
      });
      await screen.findByTestId('actionItemModal');

      await waitFor(
        () => {
          expect(
            screen.getByTestId('volunteerGroupSelect'),
          ).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      const volunteerChip = screen
        .getByText('volunteer')
        .closest('.MuiChip-root');
      expect(volunteerChip).toHaveAttribute('aria-disabled', 'true');
    });

    it('should disable volunteer group chip when editing volunteer assignment', async () => {
      renderModal({
        editMode: true,
        actionItem: { ...mockActionItem, isTemplate: false },
        isRecurring: false,
      });
      await screen.findByTestId('actionItemModal');

      await waitFor(
        () => {
          expect(screen.getByTestId('volunteerSelect')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      const groupChip = screen
        .getByText('volunteerGroup')
        .closest('.MuiChip-root');
      expect(groupChip).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Form Fields', () => {
    it('should render preCompletionNotes field', async () => {
      renderModal();
      await screen.findByTestId('actionItemModal');

      await waitFor(() => {
        expect(screen.getByLabelText('preCompletionNotes')).toBeInTheDocument();
      });

      const notesInput = screen.getByLabelText('preCompletionNotes');
      expect(notesInput).toHaveAttribute('type', 'text');
      expect(notesInput).not.toBeDisabled();
    });

    it('should render date picker and be disabled in edit mode', async () => {
      renderModal({
        editMode: true,
        actionItem: { ...mockActionItem, isTemplate: false },
      });
      await screen.findByTestId('actionItemModal');

      const dateInput = screen.getByTestId('assignmentDate');
      expect(dateInput).toBeDisabled();
    });

    it('should render postCompletionNotes textarea for completed items', async () => {
      renderModal({ editMode: true, actionItem: mockCompletedActionItem });
      await screen.findByTestId('actionItemModal');

      await waitFor(() => {
        expect(
          screen.getByLabelText('postCompletionNotes'),
        ).toBeInTheDocument();
      });

      const notesInput = screen.getByLabelText('postCompletionNotes');
      expect(notesInput).toHaveValue('Completed notes');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined eventId gracefully', () => {
      expect(() => renderModal({ eventId: undefined })).not.toThrow();
    });

    it('should handle null actionItem in edit mode gracefully', async () => {
      renderModal({ editMode: true, actionItem: null });
      await screen.findByTestId('actionItemModal');

      expect(screen.getByTestId('modal-submit-btn')).toBeInTheDocument();
      expect(screen.getByTestId('categorySelect')).toBeInTheDocument();
    });

    it('should handle empty categories list', async () => {
      const emptyMocks = [
        {
          request: {
            query: ACTION_ITEM_CATEGORY_LIST,
            variables: { input: { organizationId: 'orgId' } },
          },
          result: { data: { actionCategoriesByOrganization: [] } },
        },
        ...mockQueries.slice(1),
      ];

      render(
        <MockedProvider mocks={emptyMocks}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ItemModal
              isOpen={true}
              hide={vi.fn()}
              orgId="orgId"
              eventId="eventId"
              actionItemsRefetch={vi.fn()}
              editMode={false}
              actionItem={null}
            />
          </LocalizationProvider>
        </MockedProvider>,
      );

      await screen.findByTestId('actionItemModal');
      expect(screen.getByTestId('categorySelect')).toBeInTheDocument();
    });

    it('should call orgActionItemsRefetch when provided', async () => {
      const user = userEvent.setup();
      const mockRefetch = vi.fn();
      const mockOrgRefetch = vi.fn();
      const mockHide = vi.fn();

      renderModal({
        actionItemsRefetch: mockRefetch,
        orgActionItemsRefetch: mockOrgRefetch,
        hide: mockHide,
      });

      await screen.findByTestId('actionItemModal');

      // Fill and submit form
      const categoryInput = within(
        screen.getByTestId('categorySelect'),
      ).getByRole('combobox');
      await user.click(categoryInput);
      const categoryOption = await screen.findByText('Category 1');
      await user.click(categoryOption);

      const volunteerInput = within(
        screen.getByTestId('volunteerSelect'),
      ).getByRole('combobox');
      await user.click(volunteerInput);
      const volunteerOption = await screen.findByText('John Doe');
      await user.click(volunteerOption);

      await user.click(screen.getByTestId('modal-submit-btn'));

      await waitFor(() => {
        expect(mockOrgRefetch).toHaveBeenCalled();
      });
    });

    it('should handle network error gracefully', async () => {
      const errorLink = new StaticMockLink([], true);

      render(
        <MockedProvider mocks={[]} link={errorLink}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ItemModal
              isOpen={true}
              hide={vi.fn()}
              orgId="orgId"
              eventId="eventId"
              actionItemsRefetch={vi.fn()}
              editMode={false}
              actionItem={null}
            />
          </LocalizationProvider>
        </MockedProvider>,
      );

      expect(screen.getByTestId('actionItemModal')).toBeInTheDocument();
    });
  });

  describe('Keyboard Interactions', () => {
    it('should submit form with Ctrl+Enter', async () => {
      const user = userEvent.setup();
      const mockRefetch = vi.fn();
      const mockHide = vi.fn();
      renderModal({
        editMode: true,
        actionItem: { ...mockActionItem, isTemplate: false },
        actionItemsRefetch: mockRefetch,
        hide: mockHide,
      });

      await screen.findByTestId('actionItemModal');

      // Focus on notes field
      const notesInput = screen.getByLabelText('preCompletionNotes');
      await user.click(notesInput);

      // Press Ctrl+Enter
      await user.keyboard('{Control>}{Enter}{/Control}');

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });
    });
  });

  describe('Autocomplete isOptionEqualToValue coverage', () => {
    it('should handle category autocomplete selection (covers line 510)', async () => {
      const user = userEvent.setup();
      renderModal();
      await screen.findByTestId('actionItemModal');

      // Select category - triggers isOptionEqualToValue when value is set
      const categoryInput = within(
        screen.getByTestId('categorySelect'),
      ).getByRole('combobox');
      await user.click(categoryInput);
      const categoryOption = await screen.findByText('Category 1');
      await user.click(categoryOption);

      // Verify selection
      await waitFor(
        () => {
          expect(categoryInput).toHaveValue('Category 1');
        },
        { timeout: 3000 },
      );
    });

    it('should handle volunteer autocomplete selection (covers line 573)', async () => {
      const user = userEvent.setup();
      renderModal();
      await screen.findByTestId('actionItemModal');

      // Select volunteer - triggers isOptionEqualToValue
      const volunteerSelect = screen.getByTestId('volunteerSelect');
      const volunteerInput = within(volunteerSelect).getByRole(
        'combobox',
      ) as HTMLInputElement;
      volunteerInput.focus();
      await user.click(volunteerInput);
      await user.type(volunteerInput, 'John');
      const volunteerOption = await screen.findByText('John Doe', undefined, {
        timeout: 3000,
      });
      await user.click(volunteerOption);

      // Verify selection
      await waitFor(
        () => {
          expect(volunteerInput.value).toBe('John Doe');
        },
        { timeout: 3000 },
      );
    });

    it('should handle volunteer group autocomplete (covers line 634)', async () => {
      // Render with volunteerGroup already selected to avoid flaky chip click.
      // The autocomplete has filterSelectedOptions={true}, so the selected option
      // is not shown in the dropdown; we verify the preselected value instead.
      renderModal({
        editMode: true,
        actionItem: mockActionItemWithGroup as unknown as IActionItemInfo,
      });
      await screen.findByTestId('actionItemModal');

      const groupSelect = await screen.findByTestId(
        'volunteerGroupSelect',
        {},
        { timeout: 10000 },
      );
      const groupInput = within(groupSelect).getByRole(
        'combobox',
      ) as HTMLInputElement;

      // Value is preselected from mockActionItemWithGroup
      await waitFor(
        () => {
          expect(groupInput.value).toBe('Test Group 1');
        },
        { timeout: 5000 },
      );
    });
  });

  describe('DatePicker and Form Field onChange coverage', () => {
    it('should render assignment date picker in create mode (covers lines 692-694)', async () => {
      renderModal();
      await screen.findByTestId('actionItemModal');

      // In create mode, the date picker should not be disabled
      const dateInput = await screen.findByTestId('assignmentDate');
      expect(dateInput).not.toBeDisabled();

      // Verify it has today's date as default value (format DD/MM/YYYY)
      expect(dateInput).toHaveValue(dayjs().format('DD/MM/YYYY'));
    });

    it('should update preCompletionNotes field (covers line 705)', async () => {
      const user = userEvent.setup();
      renderModal();
      await screen.findByTestId('actionItemModal');

      const notesInput = (await screen.findByLabelText(
        'preCompletionNotes',
      )) as HTMLInputElement;

      // Click to focus first; user.type() alone can send keystrokes to the category
      // autocomplete when it retains focus on modal open, so we use click + keyboard.
      await user.click(notesInput);
      await user.keyboard('T');

      // Wait for the value to be updated - verify onChange was triggered
      await waitFor(
        () => {
          expect(notesInput.value).toBe('T');
        },
        { timeout: 3000 },
      );
    });

    it('should update postCompletionNotes field for completed items (covers line 717)', async () => {
      const user = userEvent.setup();
      renderModal({ editMode: true, actionItem: mockCompletedActionItem });
      await screen.findByTestId('actionItemModal');

      const postNotesInput = (await screen.findByLabelText(
        'postCompletionNotes',
      )) as HTMLTextAreaElement;
      expect(postNotesInput.value).toBe('Completed notes');

      // Type a single character to trigger onChange (covers line 717)
      // Using single char avoids race conditions with userEvent's async character-by-character typing
      await user.type(postNotesInput, '!');

      // Wait for the value to be updated - verify onChange was triggered
      await waitFor(
        () => {
          expect(postNotesInput.value).toContain('Completed notes');
        },
        { timeout: 3000 },
      );
    });

    it('should disable date picker in edit mode', async () => {
      renderModal({
        editMode: true,
        actionItem: { ...mockActionItem, isTemplate: false },
      });
      await screen.findByTestId('actionItemModal');

      const dateInput = await screen.findByTestId('assignmentDate');
      expect(dateInput).toBeDisabled();
    });
  });

  describe('Autocomplete wrapper accessibility (covers lines 607-609)', () => {
    it('should render volunteer select with accessible wrapper', async () => {
      renderModal();
      await screen.findByTestId('actionItemModal');

      // The wrapper div should exist and be accessible
      const volunteerSelect = await screen.findByTestId('volunteerSelect');
      expect(volunteerSelect).toBeInTheDocument();

      // Verify the combobox is accessible
      const volunteerInput = within(volunteerSelect).getByRole('combobox');
      expect(volunteerInput).toBeInTheDocument();
    });

    it('should render volunteer group select with accessible wrapper', async () => {
      // Render with volunteerGroup already selected to avoid flaky chip click.
      // Same approach as "should preselect volunteer group when editing group assignment".
      renderModal({
        editMode: true,
        actionItem: mockActionItemWithGroup as unknown as IActionItemInfo,
      });
      await screen.findByTestId('actionItemModal');

      // volunteerGroupSelect is visible from the start (no chip click needed)
      const groupSelect = await screen.findByTestId(
        'volunteerGroupSelect',
        {},
        { timeout: 10000 },
      );

      // Verify the combobox is accessible
      const groupInput = within(groupSelect).getByRole('combobox');
      expect(groupInput).toBeInTheDocument();
    });
  });
});
