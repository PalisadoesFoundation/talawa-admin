import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18nForTest from '../../../utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from '../OrganizationActionItem.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import ItemUpdateStatusModal, {
  type IItemUpdateStatusModalProps,
} from './ActionItemUpdateStatusModal';
import { vi, it, describe } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
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
      assigneeId: 'userId1',
      categoryId: 'actionItemCategoryId1',
      eventId: null,
      organizationId: 'orgId1',
      creatorId: 'userId2',
      updaterId: null,
      assignedAt: new Date('2024-08-27'),
      completionAt: new Date('2044-09-03'),
      createdAt: new Date('2024-08-27'),
      updatedAt: null,
      isCompleted: true,
      preCompletionNotes: 'Notes 1',
      postCompletionNotes: 'Cmp Notes 1',

      // Related entities (populated via GraphQL)
      assignee: {
        id: 'userId1',
        name: 'John Doe',
        avatarURL: '',
        emailAddress: 'john.doe@example.com',
      },
      creator: {
        id: 'userId2',
        name: 'Wilt Shepherd',
        avatarURL: '',
        emailAddress: 'wilt.shepherd@example.com',
      },
      event: null,
      category: {
        id: 'actionItemCategoryId1',
        name: 'Category 1',
        description: null,
        isDisabled: false,
        createdAt: '2024-08-27',
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
      assigneeId: 'userId1',
      categoryId: 'actionItemCategoryId1',
      eventId: null,
      organizationId: 'orgId1',
      creatorId: 'userId2',
      updaterId: null,
      assignedAt: new Date('2024-08-27'),
      completionAt: null,
      createdAt: new Date('2024-08-27'),
      updatedAt: null,
      isCompleted: false,
      preCompletionNotes: 'Notes 1',
      postCompletionNotes: null,

      // Related entities (populated via GraphQL)
      assignee: {
        id: 'userId1',
        name: 'John Doe',
        avatarURL: '',
        emailAddress: 'john.doe@example.com',
      },
      creator: {
        id: 'userId2',
        name: 'Wilt Shepherd',
        avatarURL: '',
        emailAddress: 'wilt.shepherd@example.com',
      },
      event: null,
      category: {
        id: 'actionItemCategoryId1',
        name: 'Category 1',
        description: null,
        isDisabled: false,
        createdAt: '2024-08-27',
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
      assigneeId: 'userId1',
      categoryId: 'actionItemCategoryId1',
      eventId: null,
      organizationId: 'orgId1',
      creatorId: 'userId2',
      updaterId: null,
      assignedAt: new Date('2024-08-27'),
      completionAt: new Date('2044-09-03'),
      createdAt: new Date('2024-08-27'),
      updatedAt: null,
      isCompleted: true,
      preCompletionNotes: 'Notes 1',
      postCompletionNotes: null,

      // Related entities (populated via GraphQL)
      assignee: {
        id: 'userId1',
        name: 'John Doe',
        avatarURL: '',
        emailAddress: 'john.doe@example.com',
      },
      creator: {
        id: 'userId2',
        name: 'Wilt Shepherd',
        avatarURL: '',
        emailAddress: 'wilt.shepherd@example.com',
      },
      event: null,
      category: {
        id: 'actionItemCategoryId1',
        name: 'Category 1',
        description: null,
        isDisabled: false,
        createdAt: '2024-08-27',
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
    <MockedProvider link={link} addTypename={false}>
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
      expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
    });
  });
});
