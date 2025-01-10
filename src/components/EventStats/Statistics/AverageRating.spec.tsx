import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { AverageRating } from './AverageRating';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { describe, expect, it } from 'vitest';

const props = {
  data: {
    event: {
      _id: '123',
      feedback: [
        {
          _id: 'feedback1',
          review: 'review1',
          rating: 5,
        },
        {
          _id: 'feedback2',
          review: 'review2',
          rating: 5,
        },
        {
          _id: 'feedback3',
          review: null,
          rating: 5,
        },
      ],
      averageFeedbackScore: 5,
    },
  },
};

describe('Testing Average Rating Card', () => {
  it('The component should be rendered and the Score should be shown', async () => {
    const { queryByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <ToastContainer />
            <AverageRating {...props} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    await waitFor(() =>
      expect(queryByText('Average Review Score')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(queryByText('Rated 5.00 / 5')).toBeInTheDocument(),
    );
  });
});
