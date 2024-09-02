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
  within,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18n from '../../utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from './OrganizationActionItem.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { InterfaceItemModalProps } from './ItemModal';
import ItemModal from './ItemModal';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_ERROR);
const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.organizationActionItems ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const itemProps: InterfaceItemModalProps[] = [
  {
    isOpen: true,
    hide: jest.fn(),
    orgId: 'orgId',
    actionItemsRefetch: jest.fn(),
    editMode: false,
    actionItem: null,
  },
  {
    isOpen: true,
    hide: jest.fn(),
    orgId: 'orgId',
    actionItemsRefetch: jest.fn(),
    editMode: true,
    actionItem: {
      _id: 'actionItemId1',
      assignee: {
        _id: 'userId1',
        firstName: 'Harve',
        lastName: 'Lance',
        image: '',
      },
      actionItemCategory: {
        _id: 'categoryId1',
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
    orgId: 'orgId',
    actionItemsRefetch: jest.fn(),
    editMode: true,
    actionItem: {
      _id: 'actionItemId2',
      assignee: {
        _id: 'userId2',
        firstName: 'Wilt',
        lastName: 'Shepherd',
        image: '',
      },
      actionItemCategory: {
        _id: 'categoryId2',
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

const renderItemModal = (
  link: ApolloLink,
  props: InterfaceItemModalProps,
): RenderResult => {
  return render(
    <MockedProvider link={link} addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <ItemModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('Testing ItemModal', () => {
  it('Create Action Item', async () => {
    renderItemModal(link1, itemProps[0]);
    expect(screen.getAllByText(t.createActionItem)).toHaveLength(2);

    // Select Category 1
    const categorySelect = await screen.findByTestId('categorySelect');
    expect(categorySelect).toBeInTheDocument();
    const inputField = within(categorySelect).getByRole('combobox');
    fireEvent.mouseDown(inputField);

    const categoryOption = await screen.findByText('Category 1');
    expect(categoryOption).toBeInTheDocument();
    fireEvent.click(categoryOption);

    // Select Assignee
    const memberSelect = await screen.findByTestId('memberSelect');
    expect(memberSelect).toBeInTheDocument();
    const memberInputField = within(memberSelect).getByRole('combobox');
    fireEvent.mouseDown(memberInputField);

    const memberOption = await screen.findByText('Harve Lance');
    expect(memberOption).toBeInTheDocument();
    fireEvent.click(memberOption);

    // Select Due Date
    fireEvent.change(screen.getByLabelText(t.dueDate), {
      target: { value: '02/01/2044' },
    });

    // Select Allotted Hours (try all options)
    const allotedHours = screen.getByLabelText(t.allotedHours);
    const allotedHoursOptions = ['', '-1', '9'];

    allotedHoursOptions.forEach((option) => {
      fireEvent.change(allotedHours, { target: { value: option } });
      expect(allotedHours).toHaveValue(parseInt(option) > 0 ? option : '');
    });

    // Add Pre Completion Notes
    fireEvent.change(screen.getByLabelText(t.preCompletionNotes), {
      target: { value: 'Notes' },
    });

    // Click Submit
    const submitButton = screen.getByTestId('submitBtn');
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(itemProps[0].actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps[0].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
    });
  });

  it('Update Action Item (completed)', async () => {
    renderItemModal(link1, itemProps[1]);
    expect(screen.getAllByText(t.updateActionItem)).toHaveLength(2);

    // Update Category
    const categorySelect = await screen.findByTestId('categorySelect');
    expect(categorySelect).toBeInTheDocument();
    const inputField = within(categorySelect).getByRole('combobox');
    fireEvent.mouseDown(inputField);

    const categoryOption = await screen.findByText('Category 2');
    expect(categoryOption).toBeInTheDocument();
    fireEvent.click(categoryOption);

    // Update Allotted Hours (try all options)
    const allotedHours = screen.getByLabelText(t.allotedHours);
    const allotedHoursOptions = ['', '-1', '19'];

    allotedHoursOptions.forEach((option) => {
      fireEvent.change(allotedHours, { target: { value: option } });
      expect(allotedHours).toHaveValue(parseInt(option) > 0 ? option : '');
    });

    // Update Post Completion Notes
    fireEvent.change(screen.getByLabelText(t.postCompletionNotes), {
      target: { value: 'Cmp Notes 2' },
    });

    // Click Submit
    const submitButton = screen.getByTestId('submitBtn');
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(itemProps[1].actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps[1].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.successfulUpdation);
    });
  });

  it('Update Action Item (not completed)', async () => {
    renderItemModal(link1, itemProps[2]);
    expect(screen.getAllByText(t.updateActionItem)).toHaveLength(2);

    // Update Category
    const categorySelect = await screen.findByTestId('categorySelect');
    expect(categorySelect).toBeInTheDocument();
    const inputField = within(categorySelect).getByRole('combobox');
    fireEvent.mouseDown(inputField);

    const categoryOption = await screen.findByText('Category 1');
    expect(categoryOption).toBeInTheDocument();
    fireEvent.click(categoryOption);

    // Update Assignee
    const memberSelect = await screen.findByTestId('memberSelect');
    expect(memberSelect).toBeInTheDocument();
    const memberInputField = within(memberSelect).getByRole('combobox');
    fireEvent.mouseDown(memberInputField);

    const memberOption = await screen.findByText('Harve Lance');
    expect(memberOption).toBeInTheDocument();
    fireEvent.click(memberOption);

    // Update Allotted Hours (try all options)
    const allotedHours = screen.getByLabelText(t.allotedHours);
    const allotedHoursOptions = ['', '-1', '19'];

    allotedHoursOptions.forEach((option) => {
      fireEvent.change(allotedHours, { target: { value: option } });
      expect(allotedHours).toHaveValue(parseInt(option) > 0 ? option : '');
    });

    // Update Due Date
    fireEvent.change(screen.getByLabelText(t.dueDate), {
      target: { value: '02/01/2044' },
    });

    // Update Pre Completion Notes
    fireEvent.change(screen.getByLabelText(t.preCompletionNotes), {
      target: { value: 'Notes 3' },
    });

    // Click Submit
    const submitButton = screen.getByTestId('submitBtn');
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(itemProps[2].actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps[2].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.successfulUpdation);
    });
  });

  it('Try adding negative Allotted Hours', async () => {
    renderItemModal(link1, itemProps[0]);
    expect(screen.getAllByText(t.createActionItem)).toHaveLength(2);
    const allotedHours = screen.getByLabelText(t.allotedHours);
    fireEvent.change(allotedHours, { target: { value: '-1' } });

    await waitFor(() => {
      expect(allotedHours).toHaveValue('');
    });

    fireEvent.change(allotedHours, { target: { value: '' } });

    await waitFor(() => {
      expect(allotedHours).toHaveValue('');
    });

    fireEvent.change(allotedHours, { target: { value: '0' } });
    await waitFor(() => {
      expect(allotedHours).toHaveValue('0');
    });

    fireEvent.change(allotedHours, { target: { value: '19' } });
    await waitFor(() => {
      expect(allotedHours).toHaveValue('19');
    });
  });

  it('should fail to Create Action Item', async () => {
    renderItemModal(link2, itemProps[0]);
    // Click Submit
    const submitButton = screen.getByTestId('submitBtn');
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
    });
  });

  it('No Fields Updated while Updating', async () => {
    renderItemModal(link2, itemProps[1]);
    // Click Submit
    const submitButton = screen.getByTestId('submitBtn');
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith(t.noneUpdated);
    });
  });

  it('should fail to Update Action Item', async () => {
    renderItemModal(link2, itemProps[1]);
    expect(screen.getAllByText(t.updateActionItem)).toHaveLength(2);

    // Update Post Completion Notes
    fireEvent.change(screen.getByLabelText(t.postCompletionNotes), {
      target: { value: 'Cmp Notes 2' },
    });

    // Click Submit
    const submitButton = screen.getByTestId('submitBtn');
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
    });
  });
});
