import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { DeleteTaskModal } from './DeleteTaskModal';
import { DELETE_EVENT_TASK_MUTATION } from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';

const successfulMutationMock = [
  {
    request: {
      query: DELETE_EVENT_TASK_MUTATION,
      variables: { id: '123' },
    },
    result: {
      data: {
        removeTask: {
          _id: '123',
        },
      },
    },
  },
];

const unsuccessfulMutationMock = [
  {
    request: {
      query: DELETE_EVENT_TASK_MUTATION,
      variables: {
        id: '123',
      },
    },
    error: new Error('Oops'),
  },
];

describe('Testing Delete Event Project Modal', () => {
  const props = {
    show: true,
    taskId: '123',
    handleClose: jest.fn(),
    refetchData: jest.fn(),
  };

  test('The modal should be rendered and delete button should work', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} mocks={successfulMutationMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <DeleteTaskModal {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => expect(queryByText('Delete Task')).toBeInTheDocument());

    fireEvent.click(queryByText('Delete') as Element);
    await waitFor(() =>
      expect(queryByText('Deleting the task...')).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(queryByText('Deleted the task successfully!')).toBeInTheDocument()
    );
  });

  test('The modal should be rendered and error message should be shown if mutation fails', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} mocks={unsuccessfulMutationMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <DeleteTaskModal {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => expect(queryByText('Delete Task')).toBeInTheDocument());

    fireEvent.click(queryByText('Delete') as Element);
    await waitFor(() =>
      expect(queryByText('Deleting the task...')).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        queryByText('There was an error in deleting the task!')
      ).toBeInTheDocument()
    );
  });
});
