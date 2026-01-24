import React from 'react';
import dayjs from 'dayjs';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import AttendedEventList from './AttendedEventList';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { formatDate } from 'utils/dateFormatter';
import { describe, expect, it } from 'vitest';
import { MOCKEVENT, MOCKDETAIL } from '../EventAttendanceMocks';

describe('Testing AttendedEventList', () => {
  const props = {
    id: 'event123',
  };

  it('Component renders and displays event details correctly', async () => {
    const { queryByText, queryByTitle, queryByTestId } = render(
      <MockedProvider mocks={MOCKDETAIL}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(queryByTestId('spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(queryByText('Test Event')).toBeInTheDocument();
      expect(queryByText(formatDate(MOCKEVENT.startAt))).toBeInTheDocument();
      expect(queryByTitle('Event Date')).toBeInTheDocument();
    });
  });

  it('Component handles error state gracefully', async () => {
    const errorMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        error: new Error('An error occurred'),
      },
    ];

    const { queryByText, queryByTestId } = render(
      <MockedProvider mocks={errorMock}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(queryByTestId('spinner')).not.toBeInTheDocument();
      // The component doesn't explicitly render an error message, so we just check that the event details are not rendered
      expect(queryByText('Test Event')).not.toBeInTheDocument();
    });
  });

  it('Component renders link with correct URL', async () => {
    const { container } = render(
      <MockedProvider mocks={MOCKDETAIL}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      const link = container.querySelector('a');
      expect(link).not.toBeNull();
      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining('/admin/event/'),
      );
    });
  });

  it('Component handles fallback fields correctly (id instead of _id)', async () => {
    const fallbackMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              id: 'event123', // Using id instead of _id
              name: 'Fallback Event', // Using name instead of title
              startAt: dayjs().add(4, 'year').toISOString(), // Using startAt instead of startDate
              location: 'Fallback Location',
            },
          },
        },
      },
    ];

    const { queryByText } = render(
      <MockedProvider mocks={fallbackMock}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(queryByText('Fallback Event')).toBeInTheDocument();
      expect(
        queryByText(formatDate(dayjs().add(4, 'year').toISOString())),
      ).toBeInTheDocument();
    });
  });

  it('Component handles data.error gracefully', async () => {
    const errorDataMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            error: 'GraphQL error occurred',
          },
        },
      },
    ];

    const { queryByText } = render(
      <MockedProvider mocks={errorDataMock}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        queryByText('Error loading event details. Please try again later.'),
      ).toBeInTheDocument();
    });
  });
});
