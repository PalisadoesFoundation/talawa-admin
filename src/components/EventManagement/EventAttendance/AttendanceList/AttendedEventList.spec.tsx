import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
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
      expect(
        queryByText('Error loading event details. Please try again later.'),
      ).toBeInTheDocument();
    });
  });

  it('Component handles GraphQL data errors gracefully', async () => {
    const dataErrorMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: null,
          errors: [{ message: 'Event not accessible' }],
        },
      },
    ];

    render(
      <MockedProvider mocks={dataErrorMock} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'Error loading event details. Please try again later.',
        ),
      ).toBeInTheDocument();
      expect(screen.queryByText('Test Event')).not.toBeInTheDocument();
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

  it('falls back to "Unnamed Event" when name and title are missing', async () => {
    const unnamedEvent = {
      ...MOCKEVENT,
      name: null,
      title: null,
    };

    const fallbackMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: unnamedEvent,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={fallbackMock} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Unnamed Event')).toBeInTheDocument();
      const row = screen.getByRole('row', {
        name: /Event: Unnamed Event/i,
      });
      expect(row).toBeInTheDocument();
    });
  });

  it('uses title as fallback when name is missing', async () => {
    const eventWithTitleOnly = {
      ...MOCKEVENT,
      name: null,
      title: 'Fallback Title Event',
    };

    const titleFallbackMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: eventWithTitleOnly,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={titleFallbackMock} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Fallback Title Event')).toBeInTheDocument();
    });
  });

  it('renders event when only name is present (without title)', async () => {
    const eventWithNameOnly = {
      ...MOCKEVENT,
      name: 'Name Only Event',
      title: null,
    };

    const nameOnlyMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: eventWithNameOnly,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={nameOnlyMock} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Name Only Event')).toBeInTheDocument();
    });
  });

  it('handles null event data gracefully', async () => {
    const nullEventMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: null,
          },
        },
      },
    ];

    const { container } = render(
      <MockedProvider mocks={nullEventMock} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      // Table should render but be empty when event is null
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
      expect(screen.queryByText('Test Event')).not.toBeInTheDocument();
    });
  });

  it('renders table with correct aria-label', async () => {
    render(
      <MockedProvider mocks={MOCKDETAIL} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      const table = screen.getByRole('table', {
        name: 'Attended events list',
      });
      expect(table).toBeInTheDocument();
    });
  });

  it('renders DateIcon with correct properties', async () => {
    render(
      <MockedProvider mocks={MOCKDETAIL} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      const dateIcon = screen.getByTitle('Event Date');
      expect(dateIcon).toBeInTheDocument();
      expect(dateIcon.tagName.toLowerCase()).toBe('svg');
    });
  });

  it('formats date correctly using formatDate utility', async () => {
    render(
      <MockedProvider mocks={MOCKDETAIL} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AttendedEventList {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      const formattedDate = formatDate(MOCKEVENT.startAt);
      expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });
  });

  it('applies correct CSS classes to table elements', async () => {
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
      const table = container.querySelector('table');
      expect(table).toHaveClass('bg-primary');

      const tableBody = container.querySelector('tbody');
      expect(tableBody).toHaveClass('bg-primary');

      const tableRow = container.querySelector('tr');
      expect(tableRow).toHaveClass('bg-white', 'rounded');
    });
  });

  it('renders link with correct styling', async () => {
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
      expect(link).toHaveStyle({
        color: 'blue',
        textDecoration: 'none',
      });
      expect(link).toHaveClass(
        'd-flex',
        'justify-items-center',
        'align-items-center',
      );
    });
  });
});
