import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { AddEventProjectModal } from './AddEventProjectModal';
import { ADD_EVENT_PROJECT_MUTATION } from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';

const successfulMutationMock = [
  {
    request: {
      query: ADD_EVENT_PROJECT_MUTATION,
      variables: {
        title: 'Title',
        description: 'Description',
        eventId: '123',
      },
    },
    result: {
      data: {
        createEventProject: {
          _id: '456',
        },
      },
    },
  },
];

const unsuccessfulMutationMock = [
  {
    request: {
      query: ADD_EVENT_PROJECT_MUTATION,
      variables: {
        title: 'Title',
        description: 'Description',
        eventId: '123',
      },
    },
    error: new Error('Oops'),
  },
];

describe('Testing Add Event Project Modal', () => {
  const props = {
    show: true,
    eventId: '123',
    handleClose: jest.fn(),
    refetchData: jest.fn(),
  };

  test('The modal should be rendered and add button should not work with blank values', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider addTypename={false} mocks={successfulMutationMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <AddEventProjectModal {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(queryByText('Add an Event Project')).toBeInTheDocument(),
    );

    fireEvent.click(queryByText('Create Project') as Element);

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

    fireEvent.click(queryByText('Create Project') as Element);

    await waitFor(() =>
      expect(queryByText('Adding the project...')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(
        queryByText('Added the project successfully!'),
      ).toBeInTheDocument(),
    );
  });

  test('The modal should be rendered and error message should be shown if mutation fails', async () => {
    const { queryByText, queryByLabelText } = render(
      <MockedProvider addTypename={false} mocks={unsuccessfulMutationMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <AddEventProjectModal {...props} />
            </I18nextProvider>
          </Provider>
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

    fireEvent.click(queryByText('Create Project') as Element);

    await waitFor(() =>
      expect(
        queryByText('There was an error in adding the project!'),
      ).toBeInTheDocument(),
    );
  });
});
