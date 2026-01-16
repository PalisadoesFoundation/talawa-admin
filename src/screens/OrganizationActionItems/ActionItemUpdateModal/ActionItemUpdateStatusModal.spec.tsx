import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from '../../../utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from '../OrganizationActionItem.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import ItemUpdateStatusModal, {
  type IItemUpdateStatusModalProps,
} from './ActionItemUpdateStatusModal';
import { vi, it, describe, afterEach } from 'vitest';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_ERROR);

// Get translation keys
const t = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems,
  ),
);

const itemProps: IItemUpdateStatusModalProps[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    actionItemsRefetch: vi.fn(),
    actionItem: {
      id: 'actionItemId1',
      volunteerId: 'userId1',
      volunteerGroupId: null,
      categoryId: 'actionItemCategoryId1',
      eventId: null,
      recurringEventInstanceId: null,
      organizationId: 'orgId1',
      creatorId: 'userId2',
      updaterId: null,
      assignedAt: dayjs.utc().toDate(),
      completionAt: dayjs.utc().toDate(),
      createdAt: dayjs.utc().toDate(),
      updatedAt: null,
      isCompleted: true,
      preCompletionNotes: 'Notes 1',
      postCompletionNotes: 'Cmp Notes 1',

      // Related entities (populated via GraphQL)

      volunteer: {
        id: 'volunteer1',
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
        name: 'Wilt Shepherd',
        avatarURL: '',
        emailAddress: 'wilt.shepherd@example.com',
      },
      event: null,
      recurringEventInstance: null,
      category: {
        id: 'actionItemCategoryId1',
        name: 'Category 1',
        description: null,
        isDisabled: false,
        createdAt: dayjs.utc().toISOString(),
        organizationId: 'orgId1',
      },
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    actionItemsRefetch: vi.fn(),
    actionItem: {
      id: 'actionItemId1',
      volunteerId: 'userId1',
      volunteerGroupId: null,
      categoryId: 'actionItemCategoryId1',
      eventId: null,
      recurringEventInstanceId: null,
      organizationId: 'orgId1',
      creatorId: 'userId2',
      updaterId: null,
      assignedAt: dayjs.utc().toDate(),
      completionAt: null,
      createdAt: dayjs.utc().toDate(),
      updatedAt: null,
      isCompleted: false,
      preCompletionNotes: 'Notes 1',
      postCompletionNotes: null,

      // Related entities (populated via GraphQL)
      volunteer: {
        id: 'volunteer1',
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
        name: 'Wilt Shepherd',
        avatarURL: '',
        emailAddress: 'wilt.shepherd@example.com',
      },
      event: null,
      recurringEventInstance: null,
      category: {
        id: 'actionItemCategoryId1',
        name: 'Category 1',
        description: null,
        isDisabled: false,
        createdAt: dayjs.utc().toISOString(),
        organizationId: 'orgId1',
      },
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    actionItemsRefetch: vi.fn(),
    actionItem: {
      id: 'actionItemId1',
      volunteerId: 'userId1',
      volunteerGroupId: null,
      categoryId: 'actionItemCategoryId1',
      eventId: null,
      recurringEventInstanceId: null,
      organizationId: 'orgId1',
      creatorId: 'userId2',
      updaterId: null,
      assignedAt: dayjs.utc().toDate(),
      completionAt: dayjs.utc().toDate(),
      createdAt: dayjs.utc().toDate(),
      updatedAt: null,
      isCompleted: true,
      preCompletionNotes: 'Notes 1',
      postCompletionNotes: null,

      // Related entities (populated via GraphQL)
      volunteer: {
        id: 'volunteer1',
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
        name: 'Wilt Shepherd',
        avatarURL: '',
        emailAddress: 'wilt.shepherd@example.com',
      },
      event: null,
      recurringEventInstance: null,
      category: {
        id: 'actionItemCategoryId1',
        name: 'Category 1',
        description: null,
        isDisabled: false,
        createdAt: dayjs.utc().toISOString(),
        organizationId: 'orgId1',
      },
    },
  },
];

const renderItemUpdateStatusModal = (
  link: ApolloLink,
  props: IItemUpdateStatusModalProps,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <ItemUpdateStatusModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('Testing ItemUpdateStatusModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Update Status of Completed ActionItem', async () => {
    renderItemUpdateStatusModal(link1, itemProps[0]);

    // Check if the modal shows up with the right title
    expect(screen.getByText(t.actionItemStatus)).toBeInTheDocument();

    // Check if we have the text asking if user wants to mark item as pending
    expect(
      screen.getByText(
        /Are you sure you want to mark this action item as pending/i,
      ),
    ).toBeInTheDocument();

    // Find the Yes button and click it
    const yesBtn = screen.getByTestId('yesBtn');
    fireEvent.click(yesBtn);

    // Wait for the mutation to complete and check if the refetch and hide functions are called
    await waitFor(() => {
      expect(itemProps[0].actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps[0].hide).toHaveBeenCalled();
    });
  });

  it('Update Status of Pending ActionItem', async () => {
    renderItemUpdateStatusModal(link1, itemProps[1]);

    // Check if the modal shows up with the right title
    expect(screen.getByText(t.actionItemStatus)).toBeInTheDocument();

    // Find the completion notes input and change its value
    const notesInput = screen.getByLabelText(/completion notes/i);
    fireEvent.change(notesInput, { target: { value: 'Cmp Notes 1' } });

    // Find the Mark Completion button and click it
    const createBtn = screen.getByTestId('createBtn');
    fireEvent.click(createBtn);

    // Wait for the mutation to complete and check if the refetch and hide functions are called
    await waitFor(() => {
      expect(itemProps[1].actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps[1].hide).toHaveBeenCalled();
    });
  });

  it('should fail to Update status of Action Item', async () => {
    renderItemUpdateStatusModal(link2, itemProps[2]);

    // Check if the modal shows up with the right title
    expect(screen.getByText(t.actionItemStatus)).toBeInTheDocument();

    // Find the Yes button and click it
    const yesBtn = screen.getByTestId('yesBtn');
    fireEvent.click(yesBtn);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith({
        key: 'unknownError',
        namespace: 'errors',
      });
    });
  });

  it('should show error when trying to mark as completed with only whitespace in post completion notes', async () => {
    renderItemUpdateStatusModal(link1, itemProps[1]);

    // Check if the modal shows up with the right title
    expect(screen.getByText(t.actionItemStatus)).toBeInTheDocument();

    // Find the completion notes input and set it to only whitespace
    const notesInput = screen.getByLabelText(/completion notes/i);
    fireEvent.change(notesInput, { target: { value: '   \n\t   ' } });

    // Find the Mark Completion button and click it
    const createBtn = screen.getByTestId('createBtn');
    fireEvent.click(createBtn);

    // Check that error toast is shown for required post completion notes
    expect(NotificationToast.error).toHaveBeenCalledWith({
      key: 'postCompletionNotesRequired',
      namespace: 'translation',
    });

    // Verify that the modal is still open (hide function not called)
    expect(itemProps[1].hide).not.toHaveBeenCalled();
  });

  describe('Testing completeActionForInstanceHandler', () => {
    const recurringProps: IItemUpdateStatusModalProps = {
      isOpen: true,
      hide: vi.fn(),
      actionItemsRefetch: vi.fn(),
      actionItem: {
        id: 'actionItemId1',
        volunteerId: 'userId1',
        volunteerGroupId: null,
        categoryId: 'actionItemCategoryId1',
        eventId: 'eventId1',
        recurringEventInstanceId: 'instanceId1',
        organizationId: 'orgId1',
        creatorId: 'userId2',
        updaterId: null,
        assignedAt: dayjs.utc().toDate(),
        completionAt: null,
        createdAt: dayjs.utc().toDate(),
        updatedAt: null,
        isCompleted: false,
        preCompletionNotes: 'Notes 1',
        postCompletionNotes: null,
        isTemplate: true,
        volunteer: {
          id: 'volunteer1',
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
          name: 'Wilt Shepherd',
          avatarURL: '',
          emailAddress: 'wilt.shepherd@example.com',
        },
        event: null,
        recurringEventInstance: null,
        category: {
          id: 'actionItemCategoryId1',
          name: 'Category 1',
          description: null,
          isDisabled: false,
          createdAt: dayjs.utc().toISOString(),
          organizationId: 'orgId1',
        },
      },
      isRecurring: true,
      eventId: 'instanceId1',
    };

    it('should show error when post completion notes are empty', async () => {
      renderItemUpdateStatusModal(link1, recurringProps);

      // Find the completion notes input and set it to empty
      const notesInput = screen.getByLabelText(/completion notes/i);
      fireEvent.change(notesInput, { target: { value: '' } });

      // Find the Complete for Instance button and click it
      const completeBtn = screen.getByText(t.completeForInstance);
      fireEvent.click(completeBtn);

      // Check that error toast is shown
      expect(NotificationToast.error).toHaveBeenCalledWith({
        key: 'postCompletionNotesRequired',
        namespace: 'translation',
      });
    });

    it('should successfully complete action for instance with valid notes', async () => {
      renderItemUpdateStatusModal(link1, recurringProps);

      // Find the completion notes input and set valid notes
      const notesInput = screen.getByLabelText(/completion notes/i);
      fireEvent.change(notesInput, {
        target: { value: 'Valid completion notes' },
      });

      // Find the Complete for Instance button and click it
      const completeBtn = screen.getByText(t.completeForInstance);
      fireEvent.click(completeBtn);

      // Wait for success
      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith({
          key: 'isCompleted',
          namespace: 'translation',
        });

        expect(recurringProps.actionItemsRefetch).toHaveBeenCalled();
        expect(recurringProps.hide).toHaveBeenCalled();
      });
    });

    it('should handle error when completing action for instance fails', async () => {
      renderItemUpdateStatusModal(link2, recurringProps);

      // Find the completion notes input and set valid notes
      const notesInput = screen.getByLabelText(/completion notes/i);
      fireEvent.change(notesInput, {
        target: { value: 'Valid completion notes' },
      });

      // Find the Complete for Instance button and click it
      const completeBtn = screen.getByText(t.completeForInstance);
      fireEvent.click(completeBtn);

      // Wait for error
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith({
          key: 'unknownError',
          namespace: 'errors',
        });
      });
    });

    it('renders StatusBadge with completed variant when isCompleted is true', () => {
      renderItemUpdateStatusModal(link1, itemProps[0]); // isCompleted = true

      const badge = screen.getByTestId('update-status-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('aria-label', 'Completed');
    });

    it('renders StatusBadge with pending variant when isCompleted is false', () => {
      renderItemUpdateStatusModal(link1, itemProps[1]); // isCompleted = false

      const badge = screen.getByTestId('update-status-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('aria-label', 'Pending');
    });
  });

  describe('Testing markActionAsPendingForInstanceHandler', () => {
    const completedRecurringProps: IItemUpdateStatusModalProps = {
      isOpen: true,
      hide: vi.fn(),
      actionItemsRefetch: vi.fn(),
      actionItem: {
        id: 'actionItemId1',
        volunteerId: 'userId1',
        volunteerGroupId: null,
        categoryId: 'actionItemCategoryId1',
        eventId: 'eventId1',
        recurringEventInstanceId: 'instanceId1',
        organizationId: 'orgId1',
        creatorId: 'userId2',
        updaterId: null,
        assignedAt: dayjs.utc().toDate(),
        completionAt: dayjs.utc().toDate(),
        createdAt: dayjs.utc().toDate(),
        updatedAt: null,
        isCompleted: true,
        preCompletionNotes: 'Notes 1',
        postCompletionNotes: 'Completion notes',
        isTemplate: true,
        volunteer: {
          id: 'volunteer1',
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
          name: 'Wilt Shepherd',
          avatarURL: '',
          emailAddress: 'wilt.shepherd@example.com',
        },
        event: null,
        recurringEventInstance: null,
        category: {
          id: 'actionItemCategoryId1',
          name: 'Category 1',
          description: null,
          isDisabled: false,
          createdAt: dayjs.utc().toISOString(),
          organizationId: 'orgId1',
        },
      },
      isRecurring: true,
      eventId: 'instanceId1',
    };

    it('should successfully mark action as pending for instance', async () => {
      renderItemUpdateStatusModal(link1, completedRecurringProps);

      // Find the Pending for Instance button and click it
      const pendingBtn = screen.getByText(t.pendingForInstance);
      fireEvent.click(pendingBtn);

      // Wait for success
      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith({
          key: 'isPending',
          namespace: 'translation',
        });

        expect(completedRecurringProps.actionItemsRefetch).toHaveBeenCalled();
        expect(completedRecurringProps.hide).toHaveBeenCalled();
      });
    });

    it('should handle error when marking action as pending for instance fails', async () => {
      renderItemUpdateStatusModal(link2, completedRecurringProps);

      // Find the Pending for Instance button and click it
      const pendingBtn = screen.getByText(t.pendingForInstance);
      fireEvent.click(pendingBtn);

      // Wait for error
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith({
          key: 'unknownError',
          namespace: 'errors',
        });
      });
    });
  });
});
