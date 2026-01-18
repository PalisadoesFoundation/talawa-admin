import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import EventAttendance from './EventAttendance';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import { vi, describe, afterEach, expect, it, beforeEach } from 'vitest';
import { useLazyQuery } from '@apollo/client';
import * as ApolloClientModule from '@apollo/client';

// Mock chart.js to avoid canvas errors
vi.mock('react-chartjs-2', async () => ({
  ...(await vi.importActual('react-chartjs-2')),
  Line: () => null,
  Bar: () => null,
}));

const renderEventAttendanceWithSpy = () =>
  render(
    <BrowserRouter>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <EventAttendance />
        </I18nextProvider>
      </Provider>
    </BrowserRouter>,
  );

describe('EventAttendance CSS Tests', () => {
  const mockedAttendees = [
    {
      id: 'member1',
      name: 'John Doe',
      emailAddress: 'john@example.com',
      createdAt: dayjs.utc().toISOString(),
      role: 'attendee',
      eventsAttended: [{ id: 'event1' }, { id: 'event2' }],
    },
  ];

  beforeEach(() => {
    vi.spyOn(ApolloClientModule, 'useLazyQuery').mockReturnValue([
      () => {},
      {
        data: { event: { attendees: mockedAttendees } },
        loading: false,
        error: undefined,
        called: true,
        client: undefined,
        networkStatus: 7,
        refetch: vi.fn(),
      },
    ] as unknown as ReturnType<typeof useLazyQuery>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should apply correct styles to member name links', async () => {
    renderEventAttendanceWithSpy();

    await waitFor(() => {
      expect(screen.getAllByRole('row').length).toBeGreaterThan(1);
    });

    const memberLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.includes('/member/'));

    expect(memberLinks.length).toBeGreaterThan(0);

    memberLinks.forEach((link) => {
      expect(link.className).toContain('membername');
    });
  });

  it('should style events attended count correctly', async () => {
    renderEventAttendanceWithSpy();

    const countCell = await screen.findByText('2');

    expect(countCell).toBeInTheDocument();

    // ✅ assert semantic class name, not hash
    expect(countCell.className).toMatch(/eventsAttended/);
  });
});
