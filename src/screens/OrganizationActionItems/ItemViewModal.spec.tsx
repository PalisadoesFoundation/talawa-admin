import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { render, screen, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18nForTest from '../../utils/i18nForTest';
import { MOCKS } from './OrganizationActionItem.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import ItemViewModal, { type InterfaceViewModalProps } from './ItemViewModal';
import type {
  InterfaceEventVolunteerInfo,
  InterfaceUserInfo,
  InterfaceVolunteerGroupInfo,
} from 'utils/interfaces';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const t = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems,
  ),
);

const createUser = (
  id: string,
  firstName: string,
  lastName: string,
  image?: string,
): InterfaceUserInfo => ({
  _id: id,
  firstName,
  lastName,
  image,
});

const createAssignee = (
  user: ReturnType<typeof createUser>,
  hasAccepted = true,
): InterfaceEventVolunteerInfo => ({
  _id: `${user._id}-assignee`,
  user,
  assignments: [],
  groups: [],
  hasAccepted,
  hoursVolunteered: 0,
});

const createAssigneeGroup = (
  id: string,
  name: string,
  leader: ReturnType<typeof createUser>,
): InterfaceVolunteerGroupInfo => ({
  _id: id,
  name,
  description: `${name} description`,
  event: { _id: 'eventId1' },
  volunteers: [],
  assignments: [],
  volunteersRequired: 10,
  leader,
  creator: leader,
  createdAt: '2024-08-27',
});

const userWithImage = createUser('userId', 'Wilt', 'Shepherd', 'wilt-image');
const userWithoutImage = createUser('userId', 'Wilt', 'Shepherd');
const assigneeWithImage = createUser('userId1', 'John', 'Doe', 'image-url');
const assigneeWithoutImage = createUser('userId1', 'John', 'Doe');
const actionItemCategory = {
  _id: 'actionItemCategoryId2',
  name: 'Category 2',
};

const itemProps: InterfaceViewModalProps[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    item: {
      _id: 'actionItemId1',
      assignee: createAssignee(assigneeWithoutImage),
      assigneeGroup: null,
      assigneeType: 'EventVolunteer',
      assigneeUser: null,
      actionItemCategory,
      preCompletionNotes: 'Notes 1',
      postCompletionNotes: 'Cmp Notes 1',
      assignmentDate: new Date('2024-08-27'),
      dueDate: new Date('2044-08-30'),
      completionDate: new Date('2044-09-03'),
      isCompleted: true,
      event: null,
      allottedHours: 24,
      assigner: userWithoutImage,
      creator: userWithoutImage,
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    item: {
      _id: 'actionItemId2',
      assignee: createAssignee(assigneeWithImage),
      assigneeGroup: null,
      assigneeType: 'EventVolunteer',
      assigneeUser: null,
      actionItemCategory,
      preCompletionNotes: 'Notes 2',
      postCompletionNotes: null,
      assignmentDate: new Date('2024-08-27'),
      dueDate: new Date('2044-09-30'),
      completionDate: new Date('2044-10-03'),
      isCompleted: false,
      event: null,
      allottedHours: null,
      assigner: userWithImage,
      creator: userWithoutImage,
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    item: {
      _id: 'actionItemId2',
      assignee: null,
      assigneeGroup: null,
      assigneeType: 'User',
      assigneeUser: assigneeWithImage,
      actionItemCategory,
      preCompletionNotes: 'Notes 2',
      postCompletionNotes: null,
      assignmentDate: new Date('2024-08-27'),
      dueDate: new Date('2044-09-30'),
      completionDate: new Date('2044-10-03'),
      isCompleted: false,
      event: null,
      allottedHours: null,
      assigner: userWithImage,
      creator: userWithoutImage,
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    item: {
      _id: 'actionItemId2',
      assignee: null,
      assigneeGroup: null,
      assigneeType: 'User',
      assigneeUser: createUser('userId1', 'Jane', 'Doe'),
      actionItemCategory,
      preCompletionNotes: 'Notes 2',
      postCompletionNotes: null,
      assignmentDate: new Date('2024-08-27'),
      dueDate: new Date('2044-09-30'),
      completionDate: new Date('2044-10-03'),
      isCompleted: false,
      event: null,
      allottedHours: null,
      assigner: userWithoutImage,
      creator: userWithoutImage,
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    item: {
      _id: 'actionItemId2',
      assignee: null,
      assigneeGroup: createAssigneeGroup(
        'groupId1',
        'Group 1',
        assigneeWithoutImage,
      ),
      assigneeType: 'EventVolunteerGroup',
      assigneeUser: null,
      actionItemCategory,
      preCompletionNotes: 'Notes 2',
      postCompletionNotes: null,
      assignmentDate: new Date('2024-08-27'),
      dueDate: new Date('2044-09-30'),
      completionDate: new Date('2044-10-03'),
      isCompleted: false,
      event: null,
      allottedHours: null,
      assigner: userWithoutImage,
      creator: userWithoutImage,
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

    const assigneeInput = screen.getByTestId('assignee_input');
    expect(assigneeInput).toBeInTheDocument();

    const inputElement = within(assigneeInput).getByRole('textbox');
    expect(inputElement).toHaveValue('John Doe');

    expect(screen.getByTestId('assignee_avatar')).toBeInTheDocument();
    expect(screen.getByTestId('assigner_avatar')).toBeInTheDocument();
    expect(screen.getByLabelText(t.postCompletionNotes)).toBeInTheDocument();
    expect(screen.getByLabelText(t.allottedHours)).toBeInTheDocument();
    expect(screen.getByLabelText(t.allottedHours)).toHaveValue('24');
  });

  it('should render ItemViewModal with completed item & assignee with image', () => {
    renderItemViewModal(link1, itemProps[1]);
    expect(screen.getByText(t.actionItemDetails)).toBeInTheDocument();
    expect(screen.getByTestId('assignee_image')).toBeInTheDocument();
    expect(screen.getByTestId('assigner_image')).toBeInTheDocument();
    expect(
      screen.queryByLabelText(t.postCompletionNotes),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText(t.allottedHours)).toBeInTheDocument();
    expect(screen.getByLabelText(t.allottedHours)).toHaveValue('-');
  });

  it('should render ItemViewModal with assigneeUser with image', () => {
    renderItemViewModal(link1, itemProps[2]);
    expect(screen.getByText(t.actionItemDetails)).toBeInTheDocument();
    expect(screen.getByTestId('assignee_image')).toBeInTheDocument();
    expect(screen.getByTestId('assigner_image')).toBeInTheDocument();
    const assigneeInput = screen.getByTestId('assignee_input');
    expect(assigneeInput).toBeInTheDocument();

    const inputElement = within(assigneeInput).getByRole('textbox');
    expect(inputElement).toHaveValue('John Doe');
  });

  it('should render ItemViewModal with assigneeUser without image', () => {
    renderItemViewModal(link1, itemProps[3]);
    expect(screen.getByText(t.actionItemDetails)).toBeInTheDocument();
    expect(screen.getByTestId('assignee_avatar')).toBeInTheDocument();
    expect(screen.getByTestId('assigner_avatar')).toBeInTheDocument();
    const assigneeInput = screen.getByTestId('assignee_input');
    expect(assigneeInput).toBeInTheDocument();

    const inputElement = within(assigneeInput).getByRole('textbox');
    expect(inputElement).toHaveValue('Jane Doe');
  });

  it('should render ItemViewModal with assigneeGroup', () => {
    renderItemViewModal(link1, itemProps[4]);
    expect(screen.getByText(t.actionItemDetails)).toBeInTheDocument();
    expect(screen.getByTestId('assigneeGroup_avatar')).toBeInTheDocument();
    expect(screen.getByTestId('assigner_avatar')).toBeInTheDocument();
    const assigneeInput = screen.getByTestId('assignee_input');
    expect(assigneeInput).toBeInTheDocument();

    const inputElement = within(assigneeInput).getByRole('textbox');
    expect(inputElement).toHaveValue('Group 1');
  });
});
