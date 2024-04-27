import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { act, fireEvent, render, screen } from '@testing-library/react';
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
        assigneeId: '658930fd2caa9d8d6908745c',
        preCompletionNotes: 'task to be done with high priority',
        postCompletionNotes: 'Done',
        dueDate: '2024-04-05',
        completionDate: '2024-04-05',
        isCompleted: false,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: '_6613ef741677gygwuyu',
          __typename: 'ActionItem',
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
                createdAt: '2023-04-13T04:53:17.742Z',
                email: 'testuser4@example.com',
                firstName: 'Teresa',
                image: null,
                lastName: 'Bradley',
                organizationsBlockedBy: [],
                __typename: 'User',
                _id: '658930fd2caa9d8d6908745c',
              },
              {
                createdAt: '2024-04-13T04:53:17.742Z',
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
              _id: '6589387e2caa9d8d69087485',
              firstName: 'Burton',
              lastName: 'Sanders',
            },
            assigner: {
              __typename: 'User',
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            assignmentDate: '2024-04-08',
            completionDate: '2024-04-08',
            creator: {
              __typename: 'User',
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            dueDate: '2024-04-08',
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
              _id: '6589387e2caa9d8d69087485',
              firstName: 'Burton',
              lastName: 'Sanders',
            },
            assigner: {
              __typename: 'User',
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            assignmentDate: '2024-04-08',
            completionDate: '2024-04-08',
            creator: {
              __typename: 'User',
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            dueDate: '2024-04-08',
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
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: '_6613ef741677gygwuyu',
        assigneeId: '658930fd2caa9d8d6908745c',
        preCompletionNotes: 'task to be done with high priority',
        postCompletionNotes: 'Done',
        dueDate: '2024-04-05',
        completionDate: '2024-04-05',
        isCompleted: false,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: undefined,
          __typename: 'ActionItem',
        },
      },
    },
  },
];

const NO_ACTION_ITEMs_ERROR_MOCK = [
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
const link4 = new StaticMockLink(NO_ACTION_ITEMs_ERROR_MOCK, true);

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.eventActionItems,
  ),
);

describe('Event Action Items Page', () => {
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
    expect(screen.getByText('Action Item Details')).toBeInTheDocument();

    const categoryDropdown = screen.getByTestId('formSelectActionItemCategory');
    userEvent.selectOptions(categoryDropdown, 'Default');

    expect(categoryDropdown).toHaveValue('65f069a53b63ad266db32b3f');

    const assigneeDropdown = screen.getByTestId('formSelectAssignee');
    userEvent.selectOptions(assigneeDropdown, 'Teresa Bradley');

    expect(assigneeDropdown).toHaveValue('658930fd2caa9d8d6908745c');

    fireEvent.change(screen.getByPlaceholderText('Notes'), {
      target: { value: 'task to be done with high priority' },
    });
    expect(screen.getByPlaceholderText('Notes')).toHaveValue(
      'task to be done with high priority',
    );

    fireEvent.change(screen.getByLabelText('Due Date'), {
      target: { value: '04/05/2024' },
    });
    expect(screen.getByLabelText('Due Date')).toHaveValue('04/05/2024');

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
    expect(screen.getByText('Assignee')).toBeInTheDocument();
    expect(screen.getByText('Action Item Category')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Completion Notes')).toBeInTheDocument();

    await wait();
    expect(screen.getByText('Burton Sanders')).toBeInTheDocument();
    expect(screen.getByText('Pre Completion Note')).toBeInTheDocument();
    const updateButtons = screen.getAllByText(/Manage Actions/i);
    expect(updateButtons[0]).toBeInTheDocument();
  });

  test('Testing update action item modal', async () => {
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
    const updateButtons = screen.getAllByText(/Manage Actions/i);
    userEvent.click(updateButtons[0]);

    expect(screen.getByText('Action Item Details')).toBeInTheDocument();

    const assigneeDropdown = screen.getByTestId('formUpdateAssignee');
    userEvent.selectOptions(assigneeDropdown, 'Teresa Bradley');

    expect(assigneeDropdown).toHaveValue('658930fd2caa9d8d6908745c');
    fireEvent.change(screen.getByPlaceholderText('Notes'), {
      target: { value: 'task to be done with high priority' },
    });
    expect(screen.getByPlaceholderText('Notes')).toHaveValue(
      'task to be done with high priority',
    );

    fireEvent.change(screen.getByPlaceholderText('Post Completion Notes'), {
      target: { value: 'Done' },
    });
    expect(screen.getByPlaceholderText('Post Completion Notes')).toHaveValue(
      'Done',
    );

    fireEvent.change(screen.getByLabelText('Due Date'), {
      target: { value: '04/05/2024' },
    });
    expect(screen.getByLabelText('Due Date')).toHaveValue('04/05/2024');

    fireEvent.change(screen.getByLabelText('Completion Date'), {
      target: { value: '04/05/2024' },
    });
    expect(screen.getByLabelText('Completion Date')).toHaveValue('04/05/2024');

    userEvent.click(screen.getByTestId('updateActionItemFormSubmitBtn'));

    await wait();

    expect(toast.success).toBeCalledWith(translations.successfulUpdation);
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
    const updateButtons = screen.getAllByText(/Manage Actions/i);
    userEvent.click(updateButtons[0]);

    expect(screen.getByText('Action Item Details')).toBeInTheDocument();

    expect(screen.getByTestId('deleteActionItemBtn')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('deleteActionItemBtn'));
    await wait();
    expect(
      screen.getByText('Do you want to remove this action item?'),
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
    const updateButtons = screen.getAllByText(/Manage Actions/i);
    userEvent.click(updateButtons[0]);

    expect(screen.getByText('Action Item Details')).toBeInTheDocument();

    expect(screen.getByTestId('deleteActionItemBtn')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('deleteActionItemBtn'));
    await wait();
    expect(
      screen.getByText('Do you want to remove this action item?'),
    ).toBeInTheDocument();
    userEvent.click(screen.getByText('No'));
    await wait();
    expect(screen.getByText('Teresa Bradley')).toBeInTheDocument();
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
    expect(screen.getByText('Action Item Details')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Notes'), {
      target: { value: 'task to be done with high priority' },
    });
    expect(screen.getByPlaceholderText('Notes')).toHaveValue(
      'task to be done with high priority',
    );

    fireEvent.change(screen.getByLabelText('Due Date'), {
      target: { value: '04/05/2024' },
    });
    expect(screen.getByLabelText('Due Date')).toHaveValue('04/05/2024');

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
    const updateButtons = screen.getAllByText(/Manage Actions/i);
    userEvent.click(updateButtons[0]);

    expect(screen.getByText('Action Item Details')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('updateActionItemFormSubmitBtn'));

    await wait();

    expect(toast.success).toBeCalledWith(translations.successfulUpdation);

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
});
