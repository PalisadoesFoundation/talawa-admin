import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { TaskListItem } from './TaskListItem';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

describe('Testing Delete Event Project Modal', () => {
  const props = {
    organization: {
      _id: '123',
      members: [
        {
          _id: 'abc1',
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          _id: 'abc2',
          firstName: 'John2',
          lastName: 'Doe2',
        },
      ],
    },
    task: {
      _id: 'xyz1',
      title: 'Task 1',
      deadline: '22/04/2025',
      description: 'Task description',
      volunteers: [],
    },
    refetchData: jest.fn(),
  };

  test('The modal should be rendered and data should be displayed correctly', async () => {
    const { queryByText, queryByRole } = render(
      <BrowserRouter>
        <MockedProvider addTypename={false}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <TaskListItem {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(queryByText(props.task.title)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(queryByText(props.task.description)).toBeInTheDocument()
    );

    // Open the Update Task Modal
    fireEvent.click(queryByText('View') as Element);

    await waitFor(() =>
      expect(queryByText('Update the Event Task')).toBeInTheDocument()
    );

    // Close the Update Task Modal
    fireEvent.click(queryByRole('button', { name: /close/i }) as HTMLElement);

    await waitFor(() =>
      expect(queryByText('Update the Event Task')).not.toBeInTheDocument()
    );
  });
});
