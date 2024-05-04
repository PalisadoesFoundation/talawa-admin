import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionItemUpdateModal from './ActionItemUpdateModal';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { InterfaceMemberInfo } from 'utils/interfaces';
import { t } from 'i18next';

const mockMembersData: InterfaceMemberInfo[] = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    image: 'https://example.com/john-doe.jpg',
    createdAt: '2022-01-01T00:00:00.000Z',
    organizationsBlockedBy: [],
  },
  {
    _id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    image: 'https://example.com/jane-smith.jpg',
    createdAt: '2022-02-01T00:00:00.000Z',
    organizationsBlockedBy: [],
  },
];

const mockFormState = {
  assigneeId: '1',
  assignee: 'John Doe',
  assigner: 'Jane Smith',
  isCompleted: false,
  preCompletionNotes: 'Test pre-completion notes',
  postCompletionNotes: '',
};

const mockDueDate = new Date('2023-05-01');
const mockCompletionDate = new Date('2023-05-15');

const mockHideUpdateModal = jest.fn();
const mockSetFormState = jest.fn();
const mockUpdateActionItemHandler = jest.fn();
const mockSetDueDate = jest.fn();
const mockSetCompletionDate = jest.fn();
const mockT = (key: string): string => key;

describe('ActionItemUpdateModal', () => {
  test('renders modal correctly', () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ActionItemUpdateModal
                  actionItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateActionItemHandler={mockUpdateActionItemHandler}
                  t={mockT}
                  membersData={mockMembersData}
                  dueDate={mockDueDate}
                  setDueDate={mockSetDueDate}
                  completionDate={mockCompletionDate}
                  setCompletionDate={mockSetCompletionDate}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    expect(screen.getByText('actionItemDetails')).toBeInTheDocument();
    expect(
      screen.getByTestId('updateActionItemModalCloseBtn'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('formUpdateAssignee')).toBeInTheDocument();
    expect(screen.getByLabelText('preCompletionNotes')).toBeInTheDocument();
    expect(screen.getByLabelText('dueDate')).toBeInTheDocument();
    expect(screen.getByLabelText('completionDate')).toBeInTheDocument();
    expect(screen.getByTestId('editActionItemBtn')).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ActionItemUpdateModal
                  actionItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateActionItemHandler={mockUpdateActionItemHandler}
                  t={mockT}
                  membersData={mockMembersData}
                  dueDate={mockDueDate}
                  setDueDate={mockSetDueDate}
                  completionDate={mockCompletionDate}
                  setCompletionDate={mockSetCompletionDate}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('updateActionItemModalCloseBtn'));
    expect(mockHideUpdateModal).toHaveBeenCalled();
  });

  test('updates form state when assignee is changed', () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ActionItemUpdateModal
                  actionItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateActionItemHandler={mockUpdateActionItemHandler}
                  t={mockT}
                  membersData={mockMembersData}
                  dueDate={mockDueDate}
                  setDueDate={mockSetDueDate}
                  completionDate={mockCompletionDate}
                  setCompletionDate={mockSetCompletionDate}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    const assigneeSelect = screen.getByTestId('formUpdateAssignee');
    userEvent.selectOptions(assigneeSelect, '2');
    expect(mockSetFormState).toHaveBeenCalledWith({
      ...mockFormState,
      assigneeId: '2',
    });
  });

  test('tests the condition for formState.preCompletionNotes', () => {
    const mockFormState = {
      assigneeId: '1',
      assignee: 'John Doe',
      assigner: 'Jane Smith',
      isCompleted: false,
      preCompletionNotes: '',
      postCompletionNotes: '',
    };
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ActionItemUpdateModal
                  actionItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateActionItemHandler={mockUpdateActionItemHandler}
                  t={mockT}
                  membersData={mockMembersData}
                  dueDate={mockDueDate}
                  setDueDate={mockSetDueDate}
                  completionDate={mockCompletionDate}
                  setCompletionDate={mockSetCompletionDate}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    const preCompletionNotesInput = screen.getByLabelText('preCompletionNotes');
    fireEvent.change(preCompletionNotesInput, {
      target: { value: 'New pre-completion notes' },
    });
    expect(mockSetFormState).toHaveBeenCalledWith({
      ...mockFormState,
      preCompletionNotes: 'New pre-completion notes',
    });
  });

  test('calls updateActionItemHandler when form is submitted', () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ActionItemUpdateModal
                  actionItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateActionItemHandler={mockUpdateActionItemHandler}
                  t={mockT}
                  membersData={mockMembersData}
                  dueDate={mockDueDate}
                  setDueDate={mockSetDueDate}
                  completionDate={mockCompletionDate}
                  setCompletionDate={mockSetCompletionDate}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    fireEvent.submit(screen.getByTestId('editActionItemBtn'));
    expect(mockUpdateActionItemHandler).toHaveBeenCalled();
  });
});
