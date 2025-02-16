import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import AttendedEventList from './AttendedEventList';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { formatDate } from 'utils/dateFormatter';
import { describe, expect, it } from 'vitest';
import { MOCKEVENT, MOCKDETAIL } from '../EventAttendanceMocks';

describe('Testing AttendedEventList', () => {
  const props = {
    _id: 'event123',
  };

  it('Component renders and displays event details correctly', async () => {
    const { queryByText, queryByTitle } = render(
      <MockedProvider mocks={MOCKDETAIL} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(queryByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(queryByText('Test Event')).toBeInTheDocument();
      expect(queryByText(formatDate(MOCKEVENT.startDate))).toBeInTheDocument();
      expect(queryByTitle('Event Date')).toBeInTheDocument();
    });
  });

  it('Component handles error state gracefully', async () => {
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
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(queryByText('Loading...')).not.toBeInTheDocument();
      // The component doesn't explicitly render an error message, so we just check that the event details are not rendered
      expect(queryByText('Test Event')).not.toBeInTheDocument();
    });
  });

  it('Component renders link with correct URL', async () => {
    const { container } = render(
      <MockedProvider mocks={MOCKDETAIL} addTypename={false}>
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
      expect(link).toHaveAttribute('href', expect.stringContaining('/event/'));
    });
  });
});
