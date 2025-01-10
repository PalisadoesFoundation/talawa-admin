import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { FeedbackStats } from './Feedback';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { vi, describe, expect, it } from 'vitest';

// Mock the modules for PieChart rendering as they require a trasformer being used (which is not done by Vitest)
vi.mock('@mui/x-charts/PieChart', async () => ({
  ...(await vi.importActual('@mui/x-charts/PieChart')),
  pieArcLabelClasses: vi.fn(),
  PieChart: vi.fn().mockImplementation(() => <>Test</>),
  pieArcClasses: vi.fn(),
}));

const nonEmptyProps = {
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

const emptyProps = {
  data: {
    event: {
      _id: '123',
      feedback: [],
      averageFeedbackScore: 5,
    },
  },
};

describe('Testing Feedback Statistics Card', () => {
  it('The component should be rendered and the feedback should be shown if present', async () => {
    const { queryByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <ToastContainer />
            <FeedbackStats {...nonEmptyProps} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    await waitFor(() =>
      expect(queryByText('Feedback Analysis')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(
        queryByText('3 people have filled feedback for this event.'),
      ).toBeInTheDocument(),
    );

    await waitFor(() => {
      expect(queryByText('Test')).toBeInTheDocument();
    });
  });

  it('The component should be rendered and message should be shown if no feedback is present', async () => {
    const { queryByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <ToastContainer />
            <FeedbackStats {...emptyProps} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    await waitFor(() =>
      expect(queryByText('Feedback Analysis')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(
        queryByText('Please ask attendees to submit feedback for insights!'),
      ).toBeInTheDocument(),
    );
  });
});
