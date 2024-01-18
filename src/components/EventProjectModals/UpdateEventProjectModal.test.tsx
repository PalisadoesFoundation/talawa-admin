import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { UpdateEventProjectModal } from './UpdateEventProjectModal';
import { UPDATE_EVENT_PROJECT_MUTATION } from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';

const successfulMutationMock = [
  {
    request: {
      query: UPDATE_EVENT_PROJECT_MUTATION,
      variables: {
        title: 'NewTitle',
        description: 'NewDescription',
        id: '123',
      },
    },
    result: {
      data: {
        updateEventProject: {
          _id: '123',
        },
      },
    },
  },
];

const unsuccessfulMutationMock = [
  {
    request: {
      query: UPDATE_EVENT_PROJECT_MUTATION,
      variables: {
        title: 'NewTitle',
        description: 'NewDescription',
        id: '123',
      },
    },
    error: new Error('Oops'),
  },
];

describe('Testing Update Event Project Modal', () => {
  const props = {
    show: true,
    project: {
      title: 'OldTitle',
      description: 'OldDescription',
      _id: '123',
    },
    handleClose: jest.fn(),
    refetchData: jest.fn(),
  };

  test('The modal should be rendered, the default text should be added from the props and update button should not work with blank values', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider addTypename={false} mocks={successfulMutationMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <UpdateEventProjectModal {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(queryByText('Update Event Project')).toBeInTheDocument()
    );

    // Check for already populated values
    await waitFor(() =>
      expect(queryByLabelText('Title')).toHaveValue('OldTitle')
    );
    await waitFor(() =>
      expect(queryByLabelText('Description')).toHaveValue('OldDescription')
    );

    // Update the values to blank ones
    // Type in the title and the description of the event project
    fireEvent.change(queryByLabelText('Title') as Element, {
      target: { value: '' },
    });
    fireEvent.change(queryByLabelText('Description') as Element, {
      target: { value: '' },
    });

    fireEvent.click(queryByText('Update Details') as Element);

    // Check for blank entry warning modals
    await waitFor(() =>
      expect(queryByText('Title cannot be empty!')).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(queryByText('Description cannot be empty!')).toBeInTheDocument()
    );

    // Set the title and the description of the event project to new values
    fireEvent.change(queryByLabelText('Title') as Element, {
      target: { value: 'NewTitle' },
    });
    fireEvent.change(queryByLabelText('Description') as Element, {
      target: { value: 'NewDescription' },
    });

    fireEvent.click(queryByText('Update Details') as Element);

    await waitFor(() =>
      expect(queryByText('Updating the project...')).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(
        queryByText('Updated the project successfully!')
      ).toBeInTheDocument()
    );
  });

  test('The modal should be rendered and error message should be shown if mutation fails', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider addTypename={false} mocks={unsuccessfulMutationMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <UpdateEventProjectModal {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    // Type in the title and the description of the event project
    fireEvent.change(queryByLabelText('Title') as Element, {
      target: { value: 'NewTitle' },
    });
    fireEvent.change(queryByLabelText('Description') as Element, {
      target: { value: 'NewDescription' },
    });

    fireEvent.click(queryByText('Update Details') as Element);

    await waitFor(() =>
      expect(
        queryByText('There was an error in updating the project details!')
      ).toBeInTheDocument()
    );
  });
});
