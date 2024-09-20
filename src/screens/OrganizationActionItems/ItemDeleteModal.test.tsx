import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18nForTest from '../../utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from './OrganizationActionItem.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import ItemDeleteModal, {
  type InterfaceItemDeleteModalProps,
} from './ItemDeleteModal';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_ERROR);
const t = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems,
  ),
);

const itemProps: InterfaceItemDeleteModalProps = {
  isOpen: true,
  hide: jest.fn(),
  actionItemsRefetch: jest.fn(),
  actionItem: {
    _id: 'actionItemId1',
    assignee: {
      _id: 'userId1',
      firstName: 'John',
      lastName: 'Doe',
      image: null,
    },
    actionItemCategory: {
      _id: 'actionItemCategoryId1',
      name: 'Category 1',
    },
    preCompletionNotes: 'Notes 1',
    postCompletionNotes: 'Cmp Notes 1',
    assignmentDate: new Date('2024-08-27'),
    dueDate: new Date('2044-08-30'),
    completionDate: new Date('2044-09-03'),
    isCompleted: true,
    event: null,
    allotedHours: 24,
    assigner: {
      _id: 'userId2',
      firstName: 'Wilt',
      lastName: 'Shepherd',
      image: null,
    },
    creator: {
      _id: 'userId2',
      firstName: 'Wilt',
      lastName: 'Shepherd',
    },
  },
};

const renderItemDeleteModal = (
  link: ApolloLink,
  props: InterfaceItemDeleteModalProps,
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

    fireEvent.click(screen.getByTestId('deleteyesbtn'));

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
