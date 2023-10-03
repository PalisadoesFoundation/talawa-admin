import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { FeedbackStats } from './Feedback';
import { EVENT_FEEDBACKS } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';

// Mock the modules for PieChart rendering as they require a trasformer being used (which is not done by Jest)
jest.mock('@mui/x-charts/PieChart', () => ({
  pieArcLabelClasses: jest.fn(),
  PieChart: jest.fn().mockImplementation(() => <>Test</>),
  pieArcClasses: jest.fn(),
}));

const nonEmptyMock = [
  {
    request: {
      query: EVENT_FEEDBACKS,
      variables: {
        id: '123',
      },
    },
    result: {
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
              rating: 7,
            },
          ],
        },
      },
    },
  },
];

const emptyMock = [
  {
    request: {
      query: EVENT_FEEDBACKS,
      variables: {
        id: '123',
      },
    },
    result: {
      data: {
        event: {
          _id: '123',
          feedback: [],
        },
      },
    },
  },
];

describe('Testing Feedback Statistics Modal', () => {
  const props = {
    eventId: '123',
  };

  test('The component should be rendered and the feedback should be shown if present', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} mocks={nonEmptyMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <FeedbackStats {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(queryByText('Feedback Analysis')).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(
        queryByText('3 people have filled feedback for this event.')
      ).toBeInTheDocument()
    );
  });

  test('The component should be rendered and message should be shown if no feedback is present', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} mocks={emptyMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <FeedbackStats {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(queryByText('Feedback Analysis')).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(
        queryByText('Please ask attendees to submit feedback for insights!')
      ).toBeInTheDocument()
    );
  });
});
