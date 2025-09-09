import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18nForTest from '../../../utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from '../OrganizationActionItem.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import ItemDeleteModal, {
  type IItemDeleteModalProps,
} from './ActionItemDeleteModal';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_ERROR);
const t = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems,
  ),
);

// Updated itemProps to match the new interface
const itemProps: IItemDeleteModalProps = {
  isOpen: true,
  hide: vi.fn(),
  actionItemsRefetch: vi.fn(),
  actionItem: {
    id: 'actionItemId1',
    assigneeId: null,
    categoryId: 'categoryId1',
    eventId: null,
    recurringEventInstanceId: null,
    organizationId: 'orgId1',
    creatorId: 'userId2',
    updaterId: null,
    assignedAt: new Date('2024-08-27'),
    completionAt: new Date('2044-09-03'),
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: null,
    isCompleted: true,
    preCompletionNotes: 'Notes 1',
    postCompletionNotes: 'Cmp Notes 1',

    // Related entities updated according to the new interfaces
    assignee: null,
    creator: {
      id: 'userId2',
      name: 'Wilt Shepherd',
      emailAddress: '',
      avatarURL: '',
    },
    event: null,
    recurringEventInstance: null,
    category: {
      id: 'categoryId1',
      name: 'Category 1',
      description: null, // Added required field
      isDisabled: false, // Added required field
      createdAt: '2024-01-01T00:00:00.000Z', // Added required field
      organizationId: 'orgId1', // Added required field
    },
  },
};

const renderItemDeleteModal = (
  link: ApolloLink,
  props: IItemDeleteModalProps,
): RenderResult => {
  return render(
    <MockedProvider link={link} addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <ItemDeleteModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('Testing ItemDeleteModal', () => {
  it('should render ItemDeleteModal', () => {
    renderItemDeleteModal(link1, itemProps);
    expect(screen.getByText(t.deleteActionItem)).toBeInTheDocument();
  });

  it('should successfully Delete Action Item', async () => {
    renderItemDeleteModal(link1, itemProps);
    expect(screen.getByTestId('deleteyesbtn')).toBeInTheDocument();

    await act(() => {
      fireEvent.click(screen.getByTestId('deleteyesbtn'));
    });

    await waitFor(() => {
      expect(itemProps.actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps.hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.successfulDeletion);
    });
  });

  it('should fail to Delete Action Item', async () => {
    renderItemDeleteModal(link2, itemProps);
    expect(screen.getByTestId('deleteyesbtn')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('deleteyesbtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
    });
  });
});
