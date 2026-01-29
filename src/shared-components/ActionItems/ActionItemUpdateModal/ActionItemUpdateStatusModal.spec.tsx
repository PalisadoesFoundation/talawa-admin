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
import { MOCKS, MOCKS_ERROR } from '../ActionItem.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import ItemUpdateStatusModal, {
  type IItemUpdateStatusModalProps,
} from './ActionItemUpdateStatusModal';
import { vi, it, describe, afterEach, expect, beforeEach } from 'vitest';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
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

    await waitFor(() => {
      expect(screen.getByText(t.actionItemStatus)).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        /Are you sure you want to mark this action item as pending/i,
      ),
    ).toBeInTheDocument();

    const yesBtn = screen.getByTestId('yesBtn');
    await userEvent.click(yesBtn);

    await waitFor(() => {
      expect(itemProps[0].actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps[0].hide).toHaveBeenCalled();
    });
  });

  it('Update Status of Pending ActionItem', async () => {
    renderItemUpdateStatusModal(link1, itemProps[1]);

    await waitFor(() => {
      expect(screen.getByText(t.actionItemStatus)).toBeInTheDocument();
    });

    const notesInput = screen.getByLabelText(/completion notes/i);
    await userEvent.clear(notesInput);
    await userEvent.type(notesInput, 'Cmp Notes 1');

    const createBtn = screen.getByTestId('createBtn');
    await userEvent.click(createBtn);

    await waitFor(() => {
      expect(itemProps[1].actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps[1].hide).toHaveBeenCalled();
    });
  });

  it('should fail to Update status of Action Item', async () => {
    renderItemUpdateStatusModal(link2, itemProps[2]);

    await waitFor(() => {
      expect(screen.getByText(t.actionItemStatus)).toBeInTheDocument();
    });

    const yesBtn = screen.getByTestId('yesBtn');
    await userEvent.click(yesBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith({
        key: 'unknownError',
        namespace: 'errors',
      });
    });
  });

  it('should show error when trying to mark as completed with only whitespace in post completion notes', async () => {
    renderItemUpdateStatusModal(link1, itemProps[1]);

    await waitFor(() => {
      expect(screen.getByText(t.actionItemStatus)).toBeInTheDocument();
    });

    const notesInput = screen.getByLabelText(/completion notes/i);
    await userEvent.clear(notesInput);
    await userEvent.type(notesInput, '   ');

    const createBtn = screen.getByTestId('createBtn');
    await userEvent.click(createBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith({
        key: 'postCompletionNotesRequired',
        namespace: 'translation',
      });
    });

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

      await waitFor(() => {
        expect(screen.getByLabelText(/completion notes/i)).toBeInTheDocument();
      });

      const notesInput = screen.getByLabelText(/completion notes/i);
      await userEvent.clear(notesInput);

      const completeBtn = screen.getByText(t.completeForInstance);
      await userEvent.click(completeBtn);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith({
          key: 'postCompletionNotesRequired',
          namespace: 'translation',
        });
      });
    });

    it('should successfully complete action for instance with valid notes', async () => {
      renderItemUpdateStatusModal(link1, recurringProps);

      await waitFor(() => {
        expect(screen.getByLabelText(/completion notes/i)).toBeInTheDocument();
      });

      const notesInput = screen.getByLabelText(/completion notes/i);
      await userEvent.clear(notesInput);
      await userEvent.type(notesInput, 'Valid completion notes');

      const completeBtn = screen.getByText(t.completeForInstance);
      await userEvent.click(completeBtn);

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

      await waitFor(() => {
        expect(screen.getByLabelText(/completion notes/i)).toBeInTheDocument();
      });

      const notesInput = screen.getByLabelText(/completion notes/i);
      await userEvent.clear(notesInput);
      await userEvent.type(notesInput, 'Valid completion notes');

      const completeBtn = screen.getByText(t.completeForInstance);
      await userEvent.click(completeBtn);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith({
          key: 'unknownError',
          namespace: 'errors',
        });
      });
    });

    it('renders StatusBadge when action item is completed', async () => {
      renderItemUpdateStatusModal(link1, itemProps[0]);

      await waitFor(() => {
        expect(screen.getByTestId('update-status-badge')).toBeInTheDocument();
      });
    });

    it('renders StatusBadge when action item is pending', async () => {
      renderItemUpdateStatusModal(link1, itemProps[1]);

      await waitFor(() => {
        expect(screen.getByTestId('update-status-badge')).toBeInTheDocument();
      });
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

      await waitFor(() => {
        expect(screen.getByText(t.pendingForInstance)).toBeInTheDocument();
      });

      const pendingBtn = screen.getByText(t.pendingForInstance);
      await userEvent.click(pendingBtn);

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

      await waitFor(() => {
        expect(screen.getByText(t.pendingForInstance)).toBeInTheDocument();
      });

      const pendingBtn = screen.getByText(t.pendingForInstance);
      await userEvent.click(pendingBtn);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith({
          key: 'unknownError',
          namespace: 'errors',
        });
      });
    });
  });

  describe('Keyboard Interactions', () => {
    it('should close modal when Escape key is pressed', async () => {
      const mockHide = vi.fn();
      renderItemUpdateStatusModal(link1, { ...itemProps[0], hide: mockHide });

      await waitFor(() => {
        expect(screen.getByText(t.actionItemStatus)).toBeInTheDocument();
      });

      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        expect(mockHide).toHaveBeenCalled();
      });
    });
  });
});
