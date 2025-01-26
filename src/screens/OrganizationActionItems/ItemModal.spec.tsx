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
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
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
    hide: vi.fn(),
    orgId: 'orgId',
    eventId: undefined,
    actionItemsRefetch: vi.fn(),
    editMode: false,
    actionItem: null,
  },
  {
    isOpen: true,
    hide: vi.fn(),
    orgId: 'orgId',
    eventId: 'eventId',
    actionItemsRefetch: vi.fn(),
    editMode: false,
    actionItem: null,
  },
  {
    isOpen: true,
    hide: vi.fn(),
    orgId: 'orgId',
    eventId: undefined,
    actionItemsRefetch: vi.fn(),
    editMode: true,
    actionItem: {
      _id: 'actionItemId1',
      assignee: null,
      assigneeGroup: null,
      assigneeType: 'User',
      assigneeUser: {
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
      allottedHours: 24,
      assigner: {
        _id: 'userId2',
        firstName: 'Wilt',
        lastName: 'Shepherd',
        image: undefined,
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
    hide: vi.fn(),
    orgId: 'orgId',
    eventId: undefined,
    actionItemsRefetch: vi.fn(),
    editMode: true,
    actionItem: {
      _id: 'actionItemId2',
      assignee: null,
      assigneeGroup: null,
      assigneeType: 'User',
      assigneeUser: {
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
      allottedHours: null,
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
  {
    isOpen: true,
    hide: vi.fn(),
    orgId: 'orgId',
    eventId: 'eventId',
    actionItemsRefetch: vi.fn(),
    editMode: true,
    actionItem: {
      _id: 'actionItemId2',
      assigneeType: 'EventVolunteer',
      assignee: {
        _id: 'volunteerId1',
        hasAccepted: true,
        hoursVolunteered: 0,
        user: {
          _id: 'userId1',
          firstName: 'Teresa',
          lastName: 'Bradley',
          image: null,
        },
        assignments: [],
        groups: [],
      },
      assigneeGroup: null,
      assigneeUser: null,
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
      event: {
        _id: 'eventId',
        title: 'Event 1',
      },
      allottedHours: null,
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
  {
    isOpen: true,
    hide: vi.fn(),
    orgId: 'orgId',
    eventId: 'eventId',
    actionItemsRefetch: vi.fn(),
    editMode: true,
    actionItem: {
      _id: 'actionItemId2',
      assigneeType: 'EventVolunteerGroup',
      assigneeGroup: {
        _id: 'groupId1',
        name: 'group1',
        description: 'desc',
        volunteersRequired: 10,
        createdAt: '2024-10-27T15:34:15.889Z',
        creator: {
          _id: 'userId2',
          firstName: 'Wilt',
          lastName: 'Shepherd',
          image: null,
        },
        leader: {
          _id: 'userId1',
          firstName: 'Teresa',
          lastName: 'Bradley',
          image: null,
        },
        volunteers: [
          {
            _id: 'volunteerId1',
            user: {
              _id: 'userId1',
              firstName: 'Teresa',
              lastName: 'Bradley',
              image: null,
            },
          },
        ],
        assignments: [],
        event: {
          _id: 'eventId',
        },
      },
      assignee: null,
      assigneeUser: null,
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
      event: {
        _id: 'eventId',
        title: 'Event 1',
      },
      allottedHours: null,
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
  it('Create Action Item (for Member)', async () => {
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
    const allottedHours = screen.getByLabelText(t.allottedHours);
    const allottedHoursOptions = ['', '-1', '9'];

    allottedHoursOptions.forEach((option) => {
      fireEvent.change(allottedHours, { target: { value: option } });
      expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
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

  it('Create Action Item (for Volunteer)', async () => {
    renderItemModal(link1, itemProps[1]);
    expect(screen.getAllByText(t.createActionItem)).toHaveLength(2);

    // Select Category 1
    const categorySelect = await screen.findByTestId('categorySelect');
    expect(categorySelect).toBeInTheDocument();
    const inputField = within(categorySelect).getByRole('combobox');
    fireEvent.mouseDown(inputField);

    const categoryOption = await screen.findByText('Category 1');
    expect(categoryOption).toBeInTheDocument();
    fireEvent.click(categoryOption);

    // Select Volunteer Role
    const groupRadio = await screen.findByText(t.groups);
    const individualRadio = await screen.findByText(t.individuals);
    expect(groupRadio).toBeInTheDocument();
    expect(individualRadio).toBeInTheDocument();
    fireEvent.click(individualRadio);

    // Select Individual Volunteer
    const volunteerSelect = await screen.findByTestId('volunteerSelect');
    expect(volunteerSelect).toBeInTheDocument();
    const volunteerInputField = within(volunteerSelect).getByRole('combobox');
    fireEvent.mouseDown(volunteerInputField);

    const volunteerOption = await screen.findByText('Teresa Bradley');
    expect(volunteerOption).toBeInTheDocument();
    fireEvent.click(volunteerOption);

    // Select Due Date
    fireEvent.change(screen.getByLabelText(t.dueDate), {
      target: { value: '02/01/2044' },
    });

    // Select Allotted Hours (try all options)
    const allottedHours = screen.getByLabelText(t.allottedHours);
    const allottedHoursOptions = ['', '-1', '9'];

    allottedHoursOptions.forEach((option) => {
      fireEvent.change(allottedHours, { target: { value: option } });
      expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
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
      expect(itemProps[1].actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps[1].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
    });
  });

  it('Create Action Item (for Group)', async () => {
    renderItemModal(link1, itemProps[1]);
    expect(screen.getAllByText(t.createActionItem)).toHaveLength(2);

    // Select Category 1
    const categorySelect = await screen.findByTestId('categorySelect');
    expect(categorySelect).toBeInTheDocument();
    const inputField = within(categorySelect).getByRole('combobox');
    fireEvent.mouseDown(inputField);

    const categoryOption = await screen.findByText('Category 1');
    expect(categoryOption).toBeInTheDocument();
    fireEvent.click(categoryOption);

    // Select Volunteer Role
    const groupRadio = await screen.findByText(t.groups);
    const individualRadio = await screen.findByText(t.individuals);
    expect(groupRadio).toBeInTheDocument();
    expect(individualRadio).toBeInTheDocument();
    fireEvent.click(groupRadio);

    // Select Individual Volunteer
    const groupSelect = await screen.findByTestId('volunteerGroupSelect');
    expect(groupSelect).toBeInTheDocument();
    const groupInputField = within(groupSelect).getByRole('combobox');
    fireEvent.mouseDown(groupInputField);

    const groupOption = await screen.findByText('group1');
    expect(groupOption).toBeInTheDocument();
    fireEvent.click(groupOption);

    // Select Due Date
    fireEvent.change(screen.getByLabelText(t.dueDate), {
      target: { value: '02/01/2044' },
    });

    // Select Allotted Hours (try all options)
    const allottedHours = screen.getByLabelText(t.allottedHours);
    const allottedHoursOptions = ['', '-1', '9'];

    allottedHoursOptions.forEach((option) => {
      fireEvent.change(allottedHours, { target: { value: option } });
      expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
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
      expect(itemProps[1].actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps[1].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
    });
  });

  it('Update Action Item (completed)', async () => {
    renderItemModal(link1, itemProps[2]);
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
    const allottedHours = screen.getByLabelText(t.allottedHours);
    const allottedHoursOptions = ['', '-1', '19'];

    allottedHoursOptions.forEach((option) => {
      fireEvent.change(allottedHours, { target: { value: option } });
      expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
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
      expect(itemProps[2].actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps[2].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.successfulUpdation);
    });
  });

  it('Update Action Item (Volunteer)', async () => {
    renderItemModal(link1, itemProps[4]);
    expect(screen.getAllByText(t.updateActionItem)).toHaveLength(2);

    // Update Category
    const categorySelect = await screen.findByTestId('categorySelect');
    expect(categorySelect).toBeInTheDocument();
    const inputField = within(categorySelect).getByRole('combobox');
    fireEvent.mouseDown(inputField);

    const categoryOption = await screen.findByText('Category 1');
    expect(categoryOption).toBeInTheDocument();
    fireEvent.click(categoryOption);

    // Select Volunteer Role
    const groupRadio = await screen.findByText(t.groups);
    const individualRadio = await screen.findByText(t.individuals);
    expect(groupRadio).toBeInTheDocument();
    expect(individualRadio).toBeInTheDocument();
    fireEvent.click(individualRadio);

    // Select Individual Volunteer
    const volunteerSelect = await screen.findByTestId('volunteerSelect');
    expect(volunteerSelect).toBeInTheDocument();
    const volunteerInputField = within(volunteerSelect).getByRole('combobox');
    fireEvent.mouseDown(volunteerInputField);

    // Select Invalid User with no _id
    const invalidVolunteerOption = await screen.findByText('Invalid User');
    expect(invalidVolunteerOption).toBeInTheDocument();
    fireEvent.click(invalidVolunteerOption);

    fireEvent.mouseDown(volunteerInputField);
    const volunteerOption = await screen.findByText('Bruce Graza');
    expect(volunteerOption).toBeInTheDocument();
    fireEvent.click(volunteerOption);

    // Update Allotted Hours (try all options)
    const allottedHours = screen.getByLabelText(t.allottedHours);
    const allottedHoursOptions = ['', '-1', '19'];

    allottedHoursOptions.forEach((option) => {
      fireEvent.change(allottedHours, { target: { value: option } });
      expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
    });

    // Click Submit
    const submitButton = screen.getByTestId('submitBtn');
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(itemProps[4].actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps[4].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.successfulUpdation);
    });
  });

  it('Update Action Item (Group)', async () => {
    renderItemModal(link1, itemProps[5]);
    expect(screen.getAllByText(t.updateActionItem)).toHaveLength(2);

    // Update Category
    const categorySelect = await screen.findByTestId('categorySelect');
    expect(categorySelect).toBeInTheDocument();
    const inputField = within(categorySelect).getByRole('combobox');
    fireEvent.mouseDown(inputField);

    // Select Invalid Category with no _id
    const invalidCategoryOption = await screen.findByText('Category 3');
    expect(invalidCategoryOption).toBeInTheDocument();
    fireEvent.click(invalidCategoryOption);

    fireEvent.mouseDown(inputField);
    const categoryOption = await screen.findByText('Category 1');
    expect(categoryOption).toBeInTheDocument();
    fireEvent.click(categoryOption);

    // Select Volunteer Role
    const groupRadio = await screen.findByText(t.groups);
    const individualRadio = await screen.findByText(t.individuals);
    expect(groupRadio).toBeInTheDocument();
    expect(individualRadio).toBeInTheDocument();
    fireEvent.click(groupRadio);

    // Select Individual Volunteer
    const groupSelect = await screen.findByTestId('volunteerGroupSelect');
    expect(groupSelect).toBeInTheDocument();
    const groupInputField = within(groupSelect).getByRole('combobox');
    fireEvent.mouseDown(groupInputField);

    // Select Invalid Group with no _id
    const invalidGroupOption = await screen.findByText('group3');
    expect(invalidGroupOption).toBeInTheDocument();
    fireEvent.click(invalidGroupOption);

    fireEvent.mouseDown(groupInputField);
    const groupOption = await screen.findByText('group2');
    expect(groupOption).toBeInTheDocument();
    fireEvent.click(groupOption);

    // Update Allotted Hours (try all options)
    const allottedHours = screen.getByLabelText(t.allottedHours);
    const allottedHoursOptions = ['', '-1', '19'];

    allottedHoursOptions.forEach((option) => {
      fireEvent.change(allottedHours, { target: { value: option } });
      expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
    });

    // Click Submit
    const submitButton = screen.getByTestId('submitBtn');
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(itemProps[5].actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps[5].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.successfulUpdation);
    });
  });

  it('Update Action Item (Volunteer -> Group)', async () => {
    renderItemModal(link1, itemProps[4]);
    expect(screen.getAllByText(t.updateActionItem)).toHaveLength(2);

    // Update Category
    const categorySelect = await screen.findByTestId('categorySelect');
    expect(categorySelect).toBeInTheDocument();
    const inputField = within(categorySelect).getByRole('combobox');
    fireEvent.mouseDown(inputField);

    const categoryOption = await screen.findByText('Category 1');
    expect(categoryOption).toBeInTheDocument();
    fireEvent.click(categoryOption);

    // Select Volunteer Role
    const groupRadio = await screen.findByText(t.groups);
    const individualRadio = await screen.findByText(t.individuals);
    expect(groupRadio).toBeInTheDocument();
    expect(individualRadio).toBeInTheDocument();
    fireEvent.click(groupRadio);

    // Select Individual Volunteer
    const groupSelect = await screen.findByTestId('volunteerGroupSelect');
    expect(groupSelect).toBeInTheDocument();
    const groupInputField = within(groupSelect).getByRole('combobox');
    fireEvent.mouseDown(groupInputField);

    const groupOption = await screen.findByText('group2');
    expect(groupOption).toBeInTheDocument();
    fireEvent.click(groupOption);

    // Update Allotted Hours (try all options)
    const allottedHours = screen.getByLabelText(t.allottedHours);
    const allottedHoursOptions = ['', '-1', '19'];

    allottedHoursOptions.forEach((option) => {
      fireEvent.change(allottedHours, { target: { value: option } });
      expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
    });

    // Click Submit
    const submitButton = screen.getByTestId('submitBtn');
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(itemProps[4].actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps[4].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.successfulUpdation);
    });
  });

  it('Update Action Item (not completed)', async () => {
    renderItemModal(link1, itemProps[3]);
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

    // Select invalid member with no _id
    const invalidMemberOption = await screen.findByText('Invalid User');
    expect(invalidMemberOption).toBeInTheDocument();
    fireEvent.click(invalidMemberOption);

    fireEvent.mouseDown(memberInputField);
    const memberOption = await screen.findByText('Harve Lance');
    expect(memberOption).toBeInTheDocument();
    fireEvent.click(memberOption);

    // Update Allotted Hours (try all options)
    const allottedHours = screen.getByLabelText(t.allottedHours);
    const allottedHoursOptions = ['', '-1', '19'];

    allottedHoursOptions.forEach((option) => {
      fireEvent.change(allottedHours, { target: { value: option } });
      expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
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
      expect(itemProps[3].actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps[3].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.successfulUpdation);
    });
  });

  it('Try adding negative Allotted Hours', async () => {
    renderItemModal(link1, itemProps[0]);
    expect(screen.getAllByText(t.createActionItem)).toHaveLength(2);
    const allottedHours = screen.getByLabelText(t.allottedHours);
    fireEvent.change(allottedHours, { target: { value: '-1' } });

    await waitFor(() => {
      expect(allottedHours).toHaveValue('');
    });

    fireEvent.change(allottedHours, { target: { value: '' } });

    await waitFor(() => {
      expect(allottedHours).toHaveValue('');
    });

    fireEvent.change(allottedHours, { target: { value: '0' } });
    await waitFor(() => {
      expect(allottedHours).toHaveValue('0');
    });

    fireEvent.change(allottedHours, { target: { value: '19' } });
    await waitFor(() => {
      expect(allottedHours).toHaveValue('19');
    });
  });

  it('handles infinite for allottedHours', async () => {
    renderItemModal(link1, itemProps[0]);
    const hoursInput = screen.getByLabelText(t.allottedHours);

    // Test Infinity
    fireEvent.change(hoursInput, { target: { value: Infinity } });
    expect(hoursInput).toHaveValue('');

    // Test -Infinity
    fireEvent.change(hoursInput, { target: { value: -Infinity } });
    expect(hoursInput).toHaveValue('');
  });

  it('should not allow letters or negative values in allotted hours', async () => {
    renderItemModal(link1, itemProps[0]);

    const allottedHours = screen.getByLabelText(t.allottedHours);
    expect(allottedHours).toBeInTheDocument();

    // Test letter input
    fireEvent.change(allottedHours, { target: { value: 'abc' } });
    await waitFor(() => {
      expect(allottedHours).toHaveValue('');
    });

    // Test negative value
    fireEvent.change(allottedHours, { target: { value: '-5' } });
    await waitFor(() => {
      expect(allottedHours).toHaveValue('');
    });

    // Test valid positive number
    fireEvent.change(allottedHours, { target: { value: '5' } });
    await waitFor(() => {
      expect(allottedHours).toHaveValue('5');
    });
  });

  it('validates allottedHours edge cases', async () => {
    renderItemModal(link1, itemProps[0]);
    const allottedHours = screen.getByLabelText(t.allottedHours);

    // Test invalid string
    fireEvent.change(allottedHours, { target: { value: 'invalid' } });
    expect(allottedHours).toHaveValue('');

    // Test NaN
    fireEvent.change(allottedHours, { target: { value: NaN } });
    expect(allottedHours).toHaveValue('');

    // Test negative number
    fireEvent.change(allottedHours, { target: { value: -5 } });
    expect(allottedHours).toHaveValue('');
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

  it('handles empty strings in all text fields', async () => {
    renderItemModal(link1, itemProps[0]);

    const preCompletionNotes = screen.getByLabelText(t.preCompletionNotes);
    fireEvent.change(preCompletionNotes, { target: { value: '' } });

    const submitButton = screen.getByTestId('submitBtn');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
    });
  });

  it('handles whitespace-only strings', async () => {
    renderItemModal(link1, itemProps[0]);

    const preCompletionNotes = screen.getByLabelText(t.preCompletionNotes);
    fireEvent.change(preCompletionNotes, { target: { value: '   ' } });

    const submitButton = screen.getByTestId('submitBtn');
    fireEvent.click(submitButton);
  });

  it('handles special characters in text fields', async () => {
    renderItemModal(link1, itemProps[0]);

    const preCompletionNotes = screen.getByLabelText(t.preCompletionNotes);
    fireEvent.change(preCompletionNotes, {
      target: { value: '!@#$%^&*()_+-=[]{}|;:,.<>?' },
    });
  });

  it('handles extremely long text input', async () => {
    renderItemModal(link1, itemProps[0]);

    const preCompletionNotes = screen.getByLabelText(t.preCompletionNotes);
    fireEvent.change(preCompletionNotes, {
      target: { value: 'a'.repeat(1000) },
    });
  });

  it('handles rapid form field changes', async () => {
    renderItemModal(link1, itemProps[0]);

    const hoursInput = screen.getByLabelText(t.allottedHours);
    const values = ['1', '2', '3', '4', '5'];

    values.forEach((value) => {
      fireEvent.change(hoursInput, { target: { value } });
    });
  });

  it('handles floating point numbers for allottedHours', async () => {
    renderItemModal(link1, itemProps[0]);

    const hoursInput = screen.getByLabelText(t.allottedHours);
    fireEvent.change(hoursInput, { target: { value: '1.5' } });
    fireEvent.change(hoursInput, { target: { value: '0.001' } });
    fireEvent.change(hoursInput, { target: { value: '99.999' } });
  });

  it('handles scientific notation for allottedHours', async () => {
    renderItemModal(link1, itemProps[0]);

    const hoursInput = screen.getByLabelText(t.allottedHours);
    fireEvent.change(hoursInput, { target: { value: '1e2' } });
    fireEvent.change(hoursInput, { target: { value: '1e-2' } });
  });

  it('No Fields Updated while Updating', async () => {
    renderItemModal(link2, itemProps[2]);
    // Click Submit
    const submitButton = screen.getByTestId('submitBtn');
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith(t.noneUpdated);
    });
  });

  //checking for empty and null values
  it('handles empty and null form values correctly', async () => {
    renderItemModal(link1, itemProps[0]);

    await waitFor(async () => {
      const allottedHours = screen.getByLabelText(t.allottedHours);
      const preCompletionNotes = screen.getByLabelText(t.preCompletionNotes);

      fireEvent.change(allottedHours, { target: { value: '' } });
      expect(allottedHours).toHaveValue('');

      fireEvent.change(preCompletionNotes, { target: { value: '' } });
      expect(preCompletionNotes).toHaveValue('');

      fireEvent.change(allottedHours, { target: { value: null } });
      expect(allottedHours).toHaveValue('');
    });
  });

  // validation of catergory selection
  it('validates category selection', async () => {
    renderItemModal(link1, itemProps[0]);

    await waitFor(async () => {
      const categorySelect = await screen.findByTestId('categorySelect');
      const inputField = within(categorySelect).getByRole('combobox');

      const submitButton = screen.getByTestId('submitBtn');
      fireEvent.click(submitButton);
      expect(inputField).toBeRequired();

      fireEvent.mouseDown(inputField);
      const categoryOption = await screen.findByText('Category 1');
      fireEvent.click(categoryOption);
      expect(inputField).toHaveValue('Category 1');

      fireEvent.change(inputField, { target: { value: '' } });
      expect(inputField).toHaveValue('');
    });
  });

  // changing of assignee type handling
  it('handles assignee type changes correctly', async () => {
    renderItemModal(link1, itemProps[1]);

    await waitFor(async () => {
      const groupRadio = await screen.findByText(t.groups);
      const individualRadio = await screen.findByText(t.individuals);

      fireEvent.click(individualRadio);
      expect(await screen.findByTestId('volunteerSelect')).toBeInTheDocument();

      fireEvent.click(groupRadio);
      expect(
        await screen.findByTestId('volunteerGroupSelect'),
      ).toBeInTheDocument();

      fireEvent.click(individualRadio);
      expect(await screen.findByTestId('volunteerSelect')).toBeInTheDocument();
    });
  });

  // validating when dates are due
  it('validates due date handling', async () => {
    renderItemModal(link1, itemProps[0]);

    await waitFor(async () => {
      const dateInput = screen.getByLabelText(t.dueDate);

      fireEvent.change(dateInput, { target: { value: 'invalid date' } });
      expect(dateInput).toHaveValue('');

      fireEvent.change(dateInput, { target: { value: '01/01/2020' } });
      expect(dateInput).toHaveValue('01/01/2020');

      fireEvent.change(dateInput, { target: { value: '01/01/2025' } });
      expect(dateInput).toHaveValue('01/01/2025');
    });
  });

  // for testing network handling
  it('handles network errors gracefully', async () => {
    renderItemModal(link2, itemProps[0]);

    await waitFor(async () => {
      const categorySelect = await screen.findByTestId('categorySelect');
      const inputField = within(categorySelect).getByRole('combobox');
      fireEvent.mouseDown(inputField);
      const categoryOption = await screen.findByText('Category 1');
      fireEvent.click(categoryOption);

      const memberSelect = await screen.findByTestId('memberSelect');
      const memberInput = within(memberSelect).getByRole('combobox');
      fireEvent.mouseDown(memberInput);
      const memberOption = await screen.findByText('Harve Lance');
      fireEvent.click(memberOption);

      const submitButton = screen.getByTestId('submitBtn');
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
    });
  });

  // for handling null change of date
  it('handles null date change', async () => {
    renderItemModal(link1, itemProps[0]);

    const dateInput = screen.getByLabelText(t.dueDate);
    fireEvent.change(dateInput, { target: { value: null } });

    await waitFor(() => {
      expect(dateInput).toHaveValue('');
    });
  });

  // for handling form state changes and validations
  it('handles all form state changes and validations', async () => {
    renderItemModal(link1, itemProps[1]);

    // Test category selection
    const categorySelect = screen.getByTestId('categorySelect');
    fireEvent.mouseDown(within(categorySelect).getByRole('combobox'));
    fireEvent.click(await screen.findByText('Category 1'));

    // Test assignee type changes
    const groupRadio = screen.getByLabelText(t.groups);
    fireEvent.click(groupRadio);

    const groupSelect = await screen.getByTestId('volunteerGroupSelect');
    fireEvent.mouseDown(within(groupSelect).getByRole('combobox'));
    fireEvent.click(await screen.findByText('group1'));

    // Test date changes
    const dateInput = screen.getByLabelText(t.dueDate);
    fireEvent.change(dateInput, { target: { value: '' } });
    fireEvent.change(dateInput, { target: { value: '01/01/2024' } });

    // Test allotted hours with various inputs
    const hoursInput = screen.getByLabelText(t.allottedHours);
    ['abc', '-5', '', '0', '10'].forEach((value) => {
      fireEvent.change(hoursInput, { target: { value } });
    });

    // Test notes
    const notesInput = screen.getByLabelText(t.preCompletionNotes);
    fireEvent.change(notesInput, { target: { value: 'Test notes' } });

    const submitButton = screen.getByTestId('submitBtn');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
    });
  });

  // for handling edge cases in timezone
  it('handles timezone edge cases', async () => {
    renderItemModal(link1, itemProps[0]);

    await waitFor(async () => {
      const dateInput = screen.getByLabelText(t.dueDate);

      // Test dates around DST changes
      const dstDates = [
        '03/12/2025', // Spring forward
        '11/05/2025', // Fall back
      ];

      for (const date of dstDates) {
        fireEvent.change(dateInput, { target: { value: date } });
        expect(dateInput).toHaveValue(date);
      }

      // Test midnight boundary dates
      fireEvent.change(dateInput, { target: { value: '01/01/2025' } });
      expect(dateInput).toHaveValue('01/01/2025');
    });
  });

  // For testing failure of updating action item
  it('should fail to Update Action Item', async () => {
    renderItemModal(link2, itemProps[2]);
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
