import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { AddTaskModal } from './AddTaskModal';
import { ADD_EVENT_PROJECT_TASK_MUTATION } from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const today = dayjs(new Date());
const taskDatetime = today.add(7, 'days');

const successfulMutationMock = [
  {
    request: {
      query: ADD_EVENT_PROJECT_TASK_MUTATION,
      variables: {
        title: 'Title',
        description: 'Description',
        projectId: '123',
        deadline: null,
      },
    },
    result: {
      data: {
        createTask: {
          _id: '456',
        },
      },
    },
  },
];

const unsuccessfulMutationMock = [
  {
    request: {
      query: ADD_EVENT_PROJECT_TASK_MUTATION,
      variables: {
        title: 'Title',
        description: 'Description',
        projectId: '123',
        deadline: taskDatetime,
      },
    },
    error: new Error('Oops'),
  },
];

describe('Testing Add Event Task Modal', () => {
  const props = {
    show: true,
    projectId: '123',
    handleClose: jest.fn(),
    refetchData: jest.fn(),
  };

  test('The modal should be rendered and add button should not work with blank values', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider addTypename={false} mocks={successfulMutationMock}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <AddTaskModal {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(queryByText('Add an Event Task')).toBeInTheDocument(),
    );

    fireEvent.click(queryByText('Create Task') as Element);

    // Check for blank entry warning modals
    await waitFor(() =>
      expect(queryByText('Title cannot be empty!')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(queryByText('Description cannot be empty!')).toBeInTheDocument(),
    );

    // Type in the title and the description of the event project
    fireEvent.change(queryByLabelText('Title') as Element, {
      target: { value: 'Title' },
    });
    fireEvent.change(queryByLabelText('Description') as Element, {
      target: { value: 'Description' },
    });
    fireEvent.change(queryByLabelText('Deadline') as Element, {
      target: { value: taskDatetime },
    });

    fireEvent.click(queryByText('Create Task') as Element);

    await waitFor(() =>
      expect(queryByText('Adding the task...')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(queryByText('Added the task successfully!')).toBeInTheDocument(),
    );
  });

  test('The modal should be rendered and error message should be shown if mutation fails', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider addTypename={false} mocks={unsuccessfulMutationMock}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <AddTaskModal {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Type in the title and the description of the event project
    fireEvent.change(queryByLabelText('Title') as Element, {
      target: { value: 'Title' },
    });
    fireEvent.change(queryByLabelText('Description') as Element, {
      target: { value: 'Description' },
    });
    fireEvent.change(queryByLabelText('Deadline') as Element, {
      target: { value: taskDatetime },
    });

    fireEvent.click(queryByText('Create Task') as Element);

    await waitFor(() =>
      expect(
        queryByText('There was an error in adding the task!'),
      ).toBeInTheDocument(),
    );
  });
});
