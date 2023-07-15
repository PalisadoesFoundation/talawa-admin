import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { UpdateTaskModal } from './UpdateTaskModal';
import { UPDATE_EVENT_PROJECT_TASK_MUTATION } from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { ModalPropType } from './UpdateTaskModal';

const today = dayjs(new Date());
const oldDeadline = today.add(7, 'days');
const newDeadline = today.add(10, 'days');

const successfulMutationMock = [
  {
    request: {
      query: UPDATE_EVENT_PROJECT_TASK_MUTATION,
      variables: {
        title: 'Title',
        description: 'Description',
        taskId: 'task1',
        completed: true,
        deadline: null,
      },
    },
    result: {
      data: {
        updateTask: {
          _id: '456',
        },
      },
    },
  },
];

const unsuccessfulMutationMock = [
  {
    request: {
      query: UPDATE_EVENT_PROJECT_TASK_MUTATION,
      variables: {
        title: 'Title',
        description: 'Description',
        taskId: 'task1',
        completed: true,
        deadline: null,
      },
    },
    error: new Error('Oops'),
  },
];

describe('Testing Update Event Task Modal', () => {
  const props = {
    show: true,
    task: {
      _id: 'task1',
      title: 'Task 1',
      description: 'Description 1',
      deadline: oldDeadline.toString(),
      completed: false,
      volunteers: [],
    },
    organization: {
      _id: 'org1',
      members: [],
    },
    handleClose: jest.fn(),
    refetchData: jest.fn(),
  };

  test('The modal should be rendered and update button should not work with blank values', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider addTypename={false} mocks={successfulMutationMock}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <UpdateTaskModal {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(queryByText('Update the Event Task')).toBeInTheDocument()
    );

    // Set the title and the description of the event task to blank
    fireEvent.change(queryByLabelText('Title') as Element, {
      target: { value: '' },
    });
    fireEvent.change(queryByLabelText('Description') as Element, {
      target: { value: '' },
    });

    fireEvent.click(queryByText('Update Task') as Element);

    // Check for blank entry warning modals
    await waitFor(() =>
      expect(queryByText('Title cannot be empty!')).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(queryByText('Description cannot be empty!')).toBeInTheDocument()
    );

    // Type in the title and the description of the event task
    fireEvent.change(queryByLabelText('Title') as Element, {
      target: { value: 'Title' },
    });
    fireEvent.change(queryByLabelText('Description') as Element, {
      target: { value: 'Description' },
    });
    fireEvent.change(queryByLabelText('Deadline') as Element, {
      target: { value: newDeadline },
    });
    fireEvent.click(queryByLabelText('Completed') as Element);

    // Click the update button
    fireEvent.click(queryByText('Update Task') as Element);

    await waitFor(() =>
      expect(queryByText('Updating the task...')).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(queryByText('Updated the task successfully!')).toBeInTheDocument()
    );
  });

  test('The modal should show message when there are no volunteers', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} mocks={successfulMutationMock}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <UpdateTaskModal {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(
        queryByText('There are no volunteers assigned for this task.')
      ).toBeInTheDocument()
    );
  });

  test('The modal should not show message when there are no volunteers', async () => {
    const customProps: ModalPropType = { ...props };
    customProps.task.volunteers = [
      {
        _id: 'user1',
        firstName: 'John',
        lastName: 'Doe',
      },
    ];

    const { queryByText } = render(
      <MockedProvider addTypename={false} mocks={successfulMutationMock}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <UpdateTaskModal {...customProps} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(
        queryByText('There are no volunteers assigned for this task.')
      ).not.toBeInTheDocument()
    );

    await waitFor(() => expect(queryByText('John Doe')).toBeInTheDocument());
  });

  test('The modal should be rendered and error message should be shown if mutation fails', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider addTypename={false} mocks={unsuccessfulMutationMock}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <UpdateTaskModal {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    // Type in the title and the description of the event project
    fireEvent.change(queryByLabelText('Title') as Element, {
      target: { value: 'Title' },
    });
    fireEvent.change(queryByLabelText('Description') as Element, {
      target: { value: 'Description' },
    });
    fireEvent.change(queryByLabelText('Deadline') as Element, {
      target: { value: newDeadline },
    });
    fireEvent.click(queryByLabelText('Completed') as Element);

    fireEvent.click(queryByText('Update Task') as Element);

    await waitFor(() =>
      expect(
        queryByText('There was an error in updating the task!')
      ).toBeInTheDocument()
    );

    await waitFor(() => expect(queryByText('Oops')).toBeInTheDocument());
  });

  test('Manage volunteer modal and delete task modal should open and close properly', async () => {
    const { queryByText, queryByRole } = render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <UpdateTaskModal {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    // Manage Volunteer Modal
    fireEvent.click(queryByText('Manage Volunteers') as Element);
    fireEvent.click(queryByRole('button', { name: /close/i }) as HTMLElement);

    // Delete Task Modal
    fireEvent.click(queryByText('Delete Task') as Element);
    fireEvent.click(queryByRole('button', { name: /close/i }) as HTMLElement);
  });
});
