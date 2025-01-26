import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ReviewStats } from './Review';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { describe, expect, it } from 'vitest';

const nonEmptyReviewProps = {
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

const emptyReviewProps = {
  data: {
    event: {
      _id: '123',
      feedback: [
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

describe('Testing Review Statistics Card', () => {
  it('The component should be rendered and the reviews should be shown if present', async () => {
    const { queryByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <ToastContainer />
            <ReviewStats {...nonEmptyReviewProps} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    await waitFor(() => expect(queryByText('Reviews')).toBeInTheDocument());

    await waitFor(() =>
      expect(queryByText('Filled by 2 people.')).toBeInTheDocument(),
    );

    await waitFor(() => expect(queryByText('review2')).toBeInTheDocument());
  });

  it('The component should be rendered and message should be shown if no review is present', async () => {
    const { queryByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <ToastContainer />
            <ReviewStats {...emptyReviewProps} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    await waitFor(() => expect(queryByText('Reviews')).toBeInTheDocument());

    await waitFor(() =>
      expect(
        queryByText('Waiting for people to talk about the event...'),
      ).toBeInTheDocument(),
    );
  });
});
