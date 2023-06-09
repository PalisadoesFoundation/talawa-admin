import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { ManageVolunteerModal } from './ManageVolunteerModal';
import { SET_TASK_VOLUNTEERS_MUTATION } from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const successfulMutationMock = [
  {
    request: {
      query: SET_TASK_VOLUNTEERS_MUTATION,
      variables: {
        id: '123',
        volunteers: ['user1'],
      },
    },
    result: {
      data: {
        setTaskVolunteers: {
          _id: '456',
        },
      },
    },
  },
];

const unsuccessfulMutationMock = [
  {
    request: {
      query: SET_TASK_VOLUNTEERS_MUTATION,
      variables: {
        id: '123',
        volunteers: [],
      },
    },
    error: new Error('Oops'),
  },
];

describe('Testing Manage Volunteers Modal', () => {
  const props = {
    show: true,
    taskId: '123',
    organization: {
      _id: 'testorg',
      members: [
        { _id: 'user1', firstName: 'John1', lastName: 'Doe1' },
        { _id: 'user2', firstName: 'John2', lastName: 'Doe2' },
        { _id: 'user3', firstName: 'John3', lastName: 'Doe3' },
      ],
    },
    volunteers: [],
    handleClose: jest.fn(),
    refetchData: jest.fn(),
  };

  test('The modal should be rendered and update button should work properly', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider addTypename={false} mocks={successfulMutationMock}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <ManageVolunteerModal {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(queryByText('Manage Volunteers')).toBeInTheDocument()
    );

    // Fill out the autocomplete with volunteer information
    const volunteerInput = queryByLabelText('Assign Volunteers');
    expect(volunteerInput).toBeInTheDocument();

    fireEvent.change(volunteerInput as Element, {
      target: { value: 'John1 Doe1' },
    });
    fireEvent.keyDown(volunteerInput as HTMLElement, { key: 'Enter' });

    // Click the update button
    fireEvent.click(queryByText('Update Volunteers') as Element);

    await waitFor(() =>
      expect(queryByText('Updating the volunteers...')).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(
        queryByText('Successfully updated the volunteers!')
      ).toBeInTheDocument()
    );
  });

  test('The modal should be rendered and error message should be shown if mutation fails', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} mocks={unsuccessfulMutationMock}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <ManageVolunteerModal {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    fireEvent.click(queryByText('Update Volunteers') as Element);

    await waitFor(() =>
      expect(queryByText('Updating the volunteers...')).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(
        queryByText('There was an error in updating the volunteers!')
      ).toBeInTheDocument()
    );

    await waitFor(() => expect(queryByText('Oops')).toBeInTheDocument());
  });
});
