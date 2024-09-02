import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18nForTest from '../../utils/i18nForTest';
import { MOCKS } from './OrganizationActionItem.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import ItemViewModal, { type InterfaceViewModalProps } from './ItemViewModal';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const t = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems,
  ),
);

const itemProps: InterfaceViewModalProps[] = [
  {
    isOpen: true,
    hide: jest.fn(),
    item: {
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
  },
  {
    isOpen: true,
    hide: jest.fn(),
    item: {
      _id: 'actionItemId2',
      assignee: {
        _id: 'userId1',
        firstName: 'Jane',
        lastName: 'Doe',
        image: 'image-url',
      },
      actionItemCategory: {
        _id: 'actionItemCategoryId2',
        name: 'Category 2',
      },
      preCompletionNotes: 'Notes 2',
      postCompletionNotes: null,
      assignmentDate: new Date('2024-08-27'),
      dueDate: new Date('2044-09-30'),
      completionDate: new Date('2044-10-03'),
      isCompleted: false,
      event: null,
      allotedHours: null,
      assigner: {
        _id: 'userId2',
        firstName: 'Wilt',
        lastName: 'Shepherd',
        image: 'wilt-image',
      },
      creator: {
        _id: 'userId2',
        firstName: 'Wilt',
        lastName: 'Shepherd',
      },
    },
  },
];

const renderItemViewModal = (
  link: ApolloLink,
  props: InterfaceViewModalProps,
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
  it('should render ItemViewModal with pending item & assignee with null image', () => {
    renderItemViewModal(link1, itemProps[0]);
    expect(screen.getByText(t.actionItemDetails)).toBeInTheDocument();
    expect(screen.getByTestId('John_avatar')).toBeInTheDocument();
    expect(screen.getByTestId('Wilt_avatar')).toBeInTheDocument();
    expect(screen.getByLabelText(t.postCompletionNotes)).toBeInTheDocument();
    expect(screen.getByLabelText(t.allotedHours)).toBeInTheDocument();
    expect(screen.getByLabelText(t.allotedHours)).toHaveValue('24');
  });

  it('should render ItemViewModal with completed item & assignee with null image', () => {
    renderItemViewModal(link1, itemProps[1]);
    expect(screen.getByText(t.actionItemDetails)).toBeInTheDocument();
    expect(screen.getByTestId('Jane_image')).toBeInTheDocument();
    expect(screen.getByTestId('Wilt_image')).toBeInTheDocument();
    expect(
      screen.queryByLabelText(t.postCompletionNotes),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText(t.allotedHours)).toBeInTheDocument();
    expect(screen.getByLabelText(t.allotedHours)).toHaveValue('-');
  });
});
