import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import 'jest-localstorage-mock';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import EventActionItems from './EventActionItems';
import { store } from 'state/store';
import 'jest-location-mock';
import { toast } from 'react-toastify';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  CREATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
  DELETE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/ActionItemMutations';
import {
  ACTION_ITEM_CATEGORY_LIST,
  MEMBERS_LIST,
} from 'GraphQl/Queries/Queries';
import { ACTION_ITEM_LIST_BY_EVENTS } from 'GraphQl/Queries/ActionItemQueries';

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const MOCKS = [
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        assigneeId: '658930fd2caa9d8d6908745c',
        actionItemCategoryId: '65f069a53b63ad266db32b3f',
        eventId: '123',
        preCompletionNotes: 'task to be done with high priority',
        dueDate: '2024-04-05',
      },
    },
    result: {
      data: {
        createActionItem: {
          _id: 'newly_created_action_item_id',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: '_6613ef741677gygwuyu',
        assigneeId: '658930fd2caa9d8d690sfhgush',
        preCompletionNotes: 'pre completion notes edited',
        postCompletionNotes: 'Post Completion Notes',
        dueDate: '2024-02-14',
        completionDate: '2024-02-21',
        isCompleted: false,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: '_6613ef741677gygwuyu',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: '_6613ef741677gygwuyu',
        assigneeId: '658930fd2caa9d8d6908745c',
        preCompletionNotes: 'Pre Completion Notes',
        postCompletionNotes: 'this action item has been completed successfully',
        dueDate: '2024-02-21',
        completionDate: '2024-02-21',
        isCompleted: true,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: '_6613ef741677gygwuyu',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItem2',
        assigneeId: 'user1',
        preCompletionNotes: 'this action item has been made active again',
        postCompletionNotes: 'Post Completion Notes',
        dueDate: '2024-02-21',
        completionDate: '2024-02-21',
        isCompleted: false,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: '_6613ef741677gygwuyu',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: '_6613ef741677gygwuyu',
      },
    },
    result: {
      data: {
        removeActionItem: {
          _id: '_6613ef741677gygwuyu',
          __typename: 'ActionItem',
        },
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: {
        organizationId: '111',
      },
    },
    result: {
      data: {
        actionItemCategoriesByOrganization: [
          {
            _id: '65f069a53b63ad266db32b3f',
            name: 'Default',
            isDisabled: false,
            __typename: 'ActionItemCategory',
          },
        ],
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: {
        id: '111',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '111',
            members: [
              {
                createdAt: '2023-04-13',
                email: 'testuser4@example.com',
                firstName: 'Teresa',
                image: null,
                lastName: 'Bradley',
                organizationsBlockedBy: [],
                __typename: 'User',
                _id: '658930fd2caa9d8d6908745c',
              },
              {
                createdAt: '2024-04-13',
                email: 'testuser2@example.com',
                firstName: 'Anna',
                image: null,
                lastName: 'Bradley',
                organizationsBlockedBy: [],
                __typename: 'User',
                _id: '658930fd2caa9d8d690sfhgush',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_LIST_BY_EVENTS,
      variables: {
        eventId: '123',
      },
    },
    result: {
      data: {
        actionItemsByEvent: [
          {
            _id: '_6613ef741677gygwuyu',
            actionItemCategory: {
              __typename: 'ActionItemCategory',
              _id: '65f069a53b63ad266db32b3j',
              name: 'Default',
            },
            assignee: {
              __typename: 'User',
              _id: '658930fd2caa9d8d6908745c',
              firstName: 'Burton',
              lastName: 'Sanders',
            },
            assigner: {
              __typename: 'User',
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            assignmentDate: new Date('2024-02-14'),
            dueDate: new Date('2024-02-21'),
            completionDate: new Date('2024-02-21'),
            creator: {
              __typename: 'User',
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              __typename: 'Event',
              _id: '123',
              title: 'Adult Painting Lessons',
            },
            isCompleted: false,
            postCompletionNotes: 'Post Completion Notes',
            preCompletionNotes: 'Pre Completion Notes',
          },
          {
            _id: 'actionItem2',
            assignee: {
              _id: '658930fd2caa9d8d6908745c',
              firstName: 'Harve',
              lastName: 'Lance',
            },
            actionItemCategory: {
              _id: 'actionItemCategory1',
              name: 'ActionItemCategory 1',
            },
            preCompletionNotes:
              'Long Pre Completion Notes Text that exceeds 25 characters',
            postCompletionNotes:
              'Long Post Completion Notes Text that exceeds 25 characters',
            assignmentDate: new Date('2024-02-14'),
            dueDate: new Date('2024-02-21'),
            completionDate: new Date('2024-02-21'),
            isCompleted: true,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              _id: 'event1',
              title: 'event 1',
            },
            creator: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
          {
            _id: 'actionItem3',
            assignee: {
              _id: '658930fd2caa9d8d6908745c',
              firstName: 'Harve',
              lastName: 'Lance',
            },
            actionItemCategory: {
              _id: 'actionItemCategory1',
              name: 'ActionItemCategory 1',
            },
            preCompletionNotes: 'Pre Completion Text',
            postCompletionNotes: 'Post Completion Text',
            assignmentDate: new Date('2024-02-14'),
            dueDate: new Date('2024-02-21'),
            completionDate: new Date('2024-02-21'),
            isCompleted: true,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              _id: 'event1',
              title: 'event 1',
            },
            creator: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
        ],
      },
      refetch: jest.fn(),
    },
  },
];

const CREATE_ACTION_ITEM_ERROR_MOCK = [
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        assigneeId: '658930fd2caa9d8d6908745c',
        actionItemCategoryId: '65f069a53b63ad266db32b3f',
        eventId: '123',
        preCompletionNotes: 'task to be done with high priority',
        dueDate: '2024-04-05',
      },
    },
    result: {
      data: {
        createActionItem: {
          _id: undefined,
        },
      },
    },
  },
];

const UPDATE_ACTION_ITEM_ERROR_MOCK = [
  {
    request: {
      query: ACTION_ITEM_LIST_BY_EVENTS,
      variables: {
        eventId: '123',
      },
    },
    result: {
      data: {
        actionItemsByEvent: [
          {
            _id: '_6613ef741677gygwuyu',
            actionItemCategory: {
              __typename: 'ActionItemCategory',
              _id: '65f069a53b63ad266db32b3j',
              name: 'Default',
            },
            assignee: {
              __typename: 'User',
              _id: '658930fd2caa9d8d6908745c',
              firstName: 'Burton',
              lastName: 'Sanders',
            },
            assigner: {
              __typename: 'User',
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            assignmentDate: new Date('2024-02-14'),
            dueDate: new Date('2024-02-21'),
            completionDate: new Date('2024-02-21'),
            creator: {
              __typename: 'User',
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              __typename: 'Event',
              _id: '123',
              title: 'Adult Painting Lessons',
            },
            isCompleted: false,
            postCompletionNotes: 'Post Completion Note',
            preCompletionNotes: 'Pre Completion Note',
          },
        ],
      },
      refetch: jest.fn(),
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: {
        id: '111',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '111',
            members: [
              {
                createdAt: '2023-04-13',
                email: 'testuser4@example.com',
                firstName: 'Teresa',
                image: null,
                lastName: 'Bradley',
                organizationsBlockedBy: [],
                __typename: 'User',
                _id: '658930fd2caa9d8d6908745c',
              },
              {
                createdAt: '2024-04-13',
                email: 'testuser2@example.com',
                firstName: 'Anna',
                image: null,
                lastName: 'Bradley',
                organizationsBlockedBy: [],
                __typename: 'User',
                _id: '658930fd2caa9d8d690sfhgush',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: DELETE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: '_6613ef741677gygwuyu',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: '_6613ef741677gygwuyu',
        assigneeId: '658930fd2caa9d8d690sfhgush',
        preCompletionNotes: 'pre completion notes edited',
        postCompletionNotes: '',
        dueDate: '2024-02-14',
        completionDate: '2024-02-21',
        isCompleted: false,
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];

const NO_ACTION_ITEMS_ERROR_MOCK = [
  {
    request: {
      query: ACTION_ITEM_LIST_BY_EVENTS,
      variables: {
        eventId: '123',
      },
    },
    result: {
      data: {
        actionItemsByEvent: [],
      },
      refetch: jest.fn(),
    },
  },
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(CREATE_ACTION_ITEM_ERROR_MOCK, true);
const link3 = new StaticMockLink(UPDATE_ACTION_ITEM_ERROR_MOCK, true);
const link4 = new StaticMockLink(NO_ACTION_ITEMS_ERROR_MOCK, true);

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.eventActionItems,
  ),
);

describe('Event Action Items Page', () => {
  const formData = {
    assignee: 'Anna Bradley',
    preCompletionNotes: 'pre completion notes edited',
    dueDate: '02/14/2024',
    completionDate: '02/21/2024',
  };
  test('Testing add new action item modal', async () => {
    window.location.assign('/event/111/123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<EventActionItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByTestId('createEventActionItemBtn'));

    await wait();
    expect(
      screen.getByText(translations.actionItemDetails),
    ).toBeInTheDocument();

    const categoryDropdown = screen.getByTestId('formSelectActionItemCategory');
    userEvent.selectOptions(categoryDropdown, 'Default');

    expect(categoryDropdown).toHaveValue('65f069a53b63ad266db32b3f');

    const assigneeDropdown = screen.getByTestId('formSelectAssignee');
    userEvent.selectOptions(assigneeDropdown, 'Teresa Bradley');

    expect(assigneeDropdown).toHaveValue('658930fd2caa9d8d6908745c');

    fireEvent.change(
      screen.getByPlaceholderText(translations.preCompletionNotes),
      {
        target: { value: 'task to be done with high priority' },
      },
    );
    expect(
      screen.getByPlaceholderText(translations.preCompletionNotes),
    ).toHaveValue('task to be done with high priority');

    fireEvent.change(screen.getByLabelText(translations.dueDate), {
      target: { value: '04/05/2024' },
    });
    expect(screen.getByLabelText(translations.dueDate)).toHaveValue(
      '04/05/2024',
    );

    userEvent.click(screen.getByTestId('createActionItemFormSubmitBtn'));

    await wait();

    expect(toast.success).toBeCalledWith(translations.successfulCreation);
  });

  test('Display all the action items', async () => {
    window.location.assign('/event/111/123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<EventActionItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();

    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText(translations.assignee)).toBeInTheDocument();
    expect(
      screen.getByText(translations.actionItemCategory),
    ).toBeInTheDocument();
    expect(
      screen.getByText(translations.preCompletionNotes),
    ).toBeInTheDocument();
    expect(
      screen.getByText(translations.postCompletionNotes),
    ).toBeInTheDocument();

    await wait();
    const asigneeAnchorElement = screen.getByText('Burton Sanders');
    expect(asigneeAnchorElement.tagName).toBe('A');
    expect(asigneeAnchorElement).toHaveAttribute('href', '/member/123');

    expect(screen.getByText('Burton Sanders')).toBeInTheDocument();
    const updateButtons = screen.getAllByTestId('editActionItemModalBtn');
    const previewButtons = screen.getAllByTestId('previewActionItemModalBtn');
    const updateStatusButtons = screen.getAllByTestId(
      'actionItemStatusChangeCheckbox',
    );
    expect(updateButtons[0]).toBeInTheDocument();
    expect(previewButtons[0]).toBeInTheDocument();
    expect(updateStatusButtons[0]).toBeInTheDocument();

    // Truncate notes and long completion notes txt
    expect(
      screen.getAllByTestId('actionItemPreCompletionNotesOverlay')[1],
    ).toHaveTextContent('Long Pre Completion Notes...');
    expect(
      screen.getAllByTestId('actionItemPostCompletionNotesOverlay')[0],
    ).toHaveTextContent('Long Post Completion Note...');
    expect(
      screen.getAllByTestId('actionItemPostCompletionNotesOverlay')[1],
    ).toHaveTextContent('Post Completion Text');
    expect(
      screen.getAllByTestId('actionItemPreCompletionNotesOverlay')[2],
    ).toHaveTextContent('Pre Completion Text');
  });

  test('opens and closes the update and delete modals through the preview modal', async () => {
    window.location.assign('/event/111/123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<EventActionItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    expect(
      screen.getAllByTestId('previewActionItemModalBtn')[0],
    ).toBeInTheDocument();
    userEvent.click(screen.getAllByTestId('previewActionItemModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewActionItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteActionItemPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteActionItemPreviewModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('actionItemDeleteModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('actionItemDeleteModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('actionItemDeleteModalCloseBtn'),
    );

    expect(
      screen.getByTestId('editActionItemPreviewModalBtn'),
    ).toBeInTheDocument();
    userEvent.click(screen.getByTestId('editActionItemPreviewModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('updateActionItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('updateActionItemModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('updateActionItemModalCloseBtn'),
    );
  });
  test('opens and closes the action item status change modal correctly', async () => {
    window.location.assign('/event/111/123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<EventActionItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('actionItemStatusChangeCheckbox')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('actionItemStatusChangeCheckbox')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('actionItemStatusChangeModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('actionItemStatusChangeModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('actionItemStatusChangeModalCloseBtn'),
    );
  });

  test('updates an action item status through the action item status change modal', async () => {
    window.location.assign('/event/111/123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<EventActionItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('actionItemStatusChangeCheckbox')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('actionItemStatusChangeCheckbox')[0]);

    await waitFor(() => {
      expect(
        screen.getByTestId('actionItemsStatusChangeNotes'),
      ).toBeInTheDocument();
    });

    const postCompletionNotes = screen.getByTestId(
      'actionItemsStatusChangeNotes',
    );
    fireEvent.change(postCompletionNotes, { target: { value: '' } });
    userEvent.type(
      postCompletionNotes,
      'this action item has been completed successfully',
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('actionItemStatusChangeSubmitBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('actionItemStatusChangeSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulUpdation);
    });

    await waitFor(() => {
      expect(
        screen.getAllByTestId('actionItemStatusChangeCheckbox')[1],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('actionItemStatusChangeCheckbox')[1]);

    await waitFor(() => {
      expect(
        screen.getByTestId('actionItemsStatusChangeNotes'),
      ).toBeInTheDocument();
    });

    const preCompletionNotes = screen.getByTestId(
      'actionItemsStatusChangeNotes',
    );
    fireEvent.change(preCompletionNotes, { target: { value: '' } });
    userEvent.type(
      preCompletionNotes,
      'this action item has been made active again',
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('actionItemStatusChangeSubmitBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('actionItemStatusChangeSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulUpdation);
    });
  });

  test('Testing update action item modal', async () => {
    window.location.assign('/event/111/123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<EventActionItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editActionItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('editActionItemModalBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('formUpdateAssignee')).toBeInTheDocument();
    });

    userEvent.selectOptions(
      screen.getByTestId('formUpdateAssignee'),
      formData.assignee,
    );

    const preCompletionNotes = screen.getByPlaceholderText(
      translations.preCompletionNotes,
    );
    fireEvent.change(preCompletionNotes, { target: { value: '' } });
    userEvent.type(preCompletionNotes, formData.preCompletionNotes);

    const dueDatePicker = screen.getByLabelText(translations.dueDate);
    fireEvent.change(dueDatePicker, {
      target: { value: formData.dueDate },
    });

    const completionDatePicker = screen.getByLabelText(
      translations.completionDate,
    );
    fireEvent.change(completionDatePicker, {
      target: { value: formData.completionDate },
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('updateActionItemFormSubmitBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('updateActionItemFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulUpdation);
    });
  });
  test('Testing delete action item modal and delete the record', async () => {
    window.location.assign('/event/111/123');
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<EventActionItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    expect(
      screen.getAllByTestId('previewActionItemModalBtn')[0],
    ).toBeInTheDocument();
    userEvent.click(screen.getAllByTestId('previewActionItemModalBtn')[0]);

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteActionItemPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteActionItemPreviewModalBtn'));
    await wait();
    expect(
      screen.getByText(translations.deleteActionItemMsg),
    ).toBeInTheDocument();
    userEvent.click(screen.getByText('Yes'));
    await wait();

    expect(toast.success).toBeCalledWith(translations.successfulDeletion);
  });

  test('Testing delete action item modal and does not delete the record', async () => {
    window.location.assign('/event/111/123');
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<EventActionItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    expect(
      screen.getAllByTestId('previewActionItemModalBtn')[0],
    ).toBeInTheDocument();
    userEvent.click(screen.getAllByTestId('previewActionItemModalBtn')[0]);

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteActionItemPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteActionItemPreviewModalBtn'));
    await wait();
    expect(
      screen.getByText(translations.deleteActionItemMsg),
    ).toBeInTheDocument();
    userEvent.click(screen.getByText('No'));
    await wait();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByText(translations.actionItemDetails),
    ).toBeInTheDocument();
  });

  test('toasts error on unsuccessful deletion', async () => {
    window.location.assign('/event/111/123');
    render(
      <MockedProvider link={link3}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<EventActionItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();

    expect(
      screen.getAllByTestId('previewActionItemModalBtn')[0],
    ).toBeInTheDocument();
    userEvent.click(screen.getAllByTestId('previewActionItemModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewActionItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteActionItemPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteActionItemPreviewModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('actionItemDeleteModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteActionItemBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('toasts error on unsuccessful updation', async () => {
    window.location.assign('/event/111/123');
    render(
      <MockedProvider link={link3}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<EventActionItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editActionItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('editActionItemModalBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('formUpdateAssignee')).toBeInTheDocument();
    });

    userEvent.selectOptions(
      screen.getByTestId('formUpdateAssignee'),
      formData.assignee,
    );

    const preCompletionNotes = screen.getByPlaceholderText(
      translations.preCompletionNotes,
    );
    fireEvent.change(preCompletionNotes, { target: { value: '' } });
    userEvent.type(preCompletionNotes, formData.preCompletionNotes);

    const dueDatePicker = screen.getByLabelText(translations.dueDate);
    fireEvent.change(dueDatePicker, {
      target: { value: formData.dueDate },
    });

    const completionDatePicker = screen.getByLabelText(
      translations.completionDate,
    );
    fireEvent.change(completionDatePicker, {
      target: { value: formData.completionDate },
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('updateActionItemFormSubmitBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('updateActionItemFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('Raises an error when incorrect information is filled while creation', async () => {
    window.location.assign('/event/111/123');
    render(
      <MockedProvider link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<EventActionItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByTestId('createEventActionItemBtn'));

    await wait();
    expect(
      screen.getByText(translations.actionItemDetails),
    ).toBeInTheDocument();

    fireEvent.change(
      screen.getByPlaceholderText(translations.preCompletionNotes),
      {
        target: { value: 'task to be done with high priority' },
      },
    );
    expect(
      screen.getByPlaceholderText(translations.preCompletionNotes),
    ).toHaveValue('task to be done with high priority');

    fireEvent.change(screen.getByLabelText(translations.dueDate), {
      target: { value: '04/05/2024' },
    });
    expect(screen.getByLabelText(translations.dueDate)).toHaveValue(
      '04/05/2024',
    );

    userEvent.click(screen.getByTestId('createActionItemFormSubmitBtn'));
    await wait();

    expect(toast.error).toBeCalled();
  });

  test('Raises an error when incorrect information is filled while updation', async () => {
    window.location.assign('/event/111/123');
    render(
      <MockedProvider link={link3}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<EventActionItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    const updateButtons = screen.getAllByTestId('editActionItemModalBtn');
    userEvent.click(updateButtons[0]);

    expect(
      screen.getByText(translations.actionItemDetails),
    ).toBeInTheDocument();

    userEvent.click(screen.getByTestId('updateActionItemFormSubmitBtn'));

    await wait();

    expect(toast.error).toBeCalled();
  });

  test('Displays message when no data is available', async () => {
    window.location.assign('/event/111/123');
    render(
      <MockedProvider link={link4}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<EventActionItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    expect(screen.getByText('Nothing Found !!')).toBeInTheDocument();
  });

  test('Testing update action modal to have correct initial values', async () => {
    window.location.assign('/event/111/123');
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<EventActionItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    const updateButtons = screen.getAllByTestId('editActionItemModalBtn');
    userEvent.click(updateButtons[0]);

    expect(screen.getByText('Action Item Details')).toBeInTheDocument();
    const assigneeDropdown = screen.getByTestId(
      'formUpdateAssignee',
    ) as HTMLSelectElement;
    expect(assigneeDropdown.value).toBe('658930fd2caa9d8d6908745c');
    expect(assigneeDropdown).toHaveTextContent('Teresa Bradley');

    expect(
      screen.getByPlaceholderText(translations.preCompletionNotes),
    ).toHaveValue('Pre Completion Notes');
    const editActionItem = screen.getByRole('button', {
      name: translations.editActionItem,
    });
    expect(editActionItem).toBeInTheDocument();
  });
});
