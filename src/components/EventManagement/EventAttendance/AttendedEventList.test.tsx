import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import AttendedEventList from './AttendedEventList';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

const mockEvent = {
  _id: 'event123',
  title: 'Test Event',
  startDate: '2023-06-15T10:00:00Z',
  description: 'This is a test event description',
};

const mocks = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { id: 'event123' },
    },
    result: {
      data: {
        event: mockEvent,
      },
    },
  },
];

describe('Testing AttendedEventList', () => {
  const props = {
    eventId: 'event123',
  };

  test('Component renders and displays event details correctly', async () => {
    const { queryByText, queryByTitle } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(queryByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(queryByText('Test Event')).toBeInTheDocument();
      expect(queryByText('Jun 15, 2023')).toBeInTheDocument();
      expect(queryByTitle('Event Date')).toBeInTheDocument();
    });
  });

  test('Component handles error state gracefully', async () => {
    const errorMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { id: 'event123' },
        },
        error: new Error('An error occurred'),
      },
    ];

    const { queryByText } = render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(queryByText('Loading...')).not.toBeInTheDocument();
      // The component doesn't explicitly render an error message, so we just check that the event details are not rendered
      expect(queryByText('Test Event')).not.toBeInTheDocument();
    });
  });

  test('Component renders link with correct URL', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      const link = container.querySelector('a');
      expect(link).not.toBeNull();
      expect(link).toHaveAttribute('href', expect.stringContaining('/event/'));
    });
  });
});
