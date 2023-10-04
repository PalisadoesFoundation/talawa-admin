import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { AverageRating } from './AverageRating';
import { EVENT_FEEDBACK_SCORE } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';

const mockData = [
  {
    request: {
      query: EVENT_FEEDBACK_SCORE,
      variables: {
        id: '123',
      },
    },
    result: {
      data: {
        event: {
          _id: '123',
          averageFeedbackScore: 5,
        },
      },
    },
  },
];

describe('Testing Average Rating Card', () => {
  const props = {
    eventId: '123',
  };

  test('The component should be rendered and the Score should be shown', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} mocks={mockData}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <AverageRating {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(queryByText('Average Review Score')).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(queryByText('Rated 5.00 / 10')).toBeInTheDocument()
    );
  });
});
