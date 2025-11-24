import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { AttendanceStatisticsModal } from './EventStatistics';
import { MockedProvider } from '@apollo/client/testing';
import { EVENT_DETAILS, RECURRING_EVENTS } from 'GraphQl/Queries/Queries';
import userEvent from '@testing-library/user-event';
import { exportToCSV } from 'utils/chartToPdf';
import { vi, describe, expect, it } from 'vitest';
import type { Mock } from 'vitest';

// Mock chart.js to avoid canvas errors
vi.mock('react-chartjs-2', async () => ({
  ...(await vi.importActual('react-chartjs-2')),
  Line: () => null,
  Bar: () => null,
}));
// Mock react-router-dom
vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useParams: () => ({
    orgId: 'org123',
    eventId: 'event123',
  }),
}));
vi.mock('utils/chartToPdf', async () => ({
  ...(await vi.importActual('utils/chartToPdf')),
  exportToCSV: vi.fn(),
}));
const mocks = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: {
          id: 'event123',
          name: 'Test Event',
          description: 'Test Description',
          location: 'Test Location',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          startAt: '2023-01-01T09:00:00Z',
          endAt: '2023-01-02T17:00:00Z',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          isRecurringEventTemplate: false,
          baseEvent: {
            id: 'base123',
          },
          recurrenceRule: null,
          creator: {
            id: 'creator1',
            name: 'Creator Name',
            emailAddress: 'creator@example.com',
          },
          updater: {
            id: 'updater1',
            name: 'Updater Name',
            emailAddress: 'updater@example.com',
          },
          organization: {
            id: 'org123',
            name: 'Test Organization',
          },
        },
      },
    },
  },
  {
    request: {
      query: RECURRING_EVENTS,
      variables: { baseRecurringEventId: 'base123' },
    },
    result: {
      data: {
        getRecurringEvents: [
          {
            id: 'event123',
            startAt: '2023-01-01T09:00:00Z',
            name: 'Test Event 1',
            attendees: [
              { id: 'user1', natalSex: 'male' },
              { id: 'user2', natalSex: 'female' },
            ],
          },
          {
            id: 'event456',
            startAt: '2023-01-08T09:00:00Z',
            name: 'Test Event 2',
            attendees: [
              { id: 'user1', natalSex: 'male' },
              { id: 'user3', natalSex: 'other' },
            ],
          },
          {
            id: 'event789',
            startAt: '2023-01-15T09:00:00Z',
            name: 'Test Event 3',
            attendees: [
              { id: 'user2', natalSex: 'female' },
              { id: 'user3', natalSex: 'other' },
            ],
          },
        ],
      },
    },
  },
];

const mockMemberData = [
  {
    id: 'user1',
    name: 'John Doe',
    emailAddress: 'john@example.com' as `${string}@${string}.${string}`,
    natalSex: 'male',
    birthDate: new Date('1990-01-01'),
    createdAt: '2023-01-01',
    role: 'MEMBER',
    tagsAssignedWith: {
      edges: [],
    },
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    emailAddress: 'jane@example.com' as `${string}@${string}.${string}`,
    natalSex: 'female',
    birthDate: new Date('1985-05-05'),
    createdAt: '2023-01-01',
    role: 'MEMBER',
    tagsAssignedWith: {
      edges: [],
    },
  },
];

const mockStatistics = {
  totalMembers: 2,
  membersAttended: 1,
  attendanceRate: 50,
};

describe('AttendanceStatisticsModal', () => {
  it('renders modal with correct initial state', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={() => {}}
          statistics={mockStatistics}
          memberData={mockMemberData}
          t={(key) => key}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('attendance-modal')).toBeInTheDocument();
      expect(screen.getByTestId('gender-button')).toBeInTheDocument();
      expect(screen.getByTestId('age-button')).toBeInTheDocument();
    });
  });

  it('switches between gender and age demographics', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={() => {}}
          statistics={mockStatistics}
          memberData={mockMemberData}
          t={(key) => key}
        />
      </MockedProvider>,
    );

    await waitFor(async () => {
      const genderButton = screen.getByTestId('gender-button');
      const ageButton = screen.getByTestId('age-button');

      await userEvent.click(ageButton);
      expect(ageButton).toHaveClass('btn-success');
      expect(genderButton).toHaveClass('btn-light');

      await userEvent.click(genderButton);
      expect(genderButton).toHaveClass('btn-success');
      expect(ageButton).toHaveClass('btn-light');
    });
  });

  it('handles data demographics export functionality', async () => {
    const mockExportToCSV = vi.fn();
    (exportToCSV as Mock).mockImplementation(mockExportToCSV);

    render(
      <MockedProvider mocks={mocks}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={() => {}}
          statistics={mockStatistics}
          memberData={mockMemberData}
          t={(key) => key}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Export Data' }),
      ).toBeInTheDocument();
    });

    await act(async () => {
      const exportButton = screen.getByRole('button', { name: 'Export Data' });
      await userEvent.click(exportButton);
    });

    await act(async () => {
      const demographicsExport = screen.getByTestId('demographics-export');
      await userEvent.click(demographicsExport);
    });

    expect(mockExportToCSV).toHaveBeenCalled();
  });
  it('handles data trends export functionality', async () => {
    const mockExportToCSV = vi.fn();
    (exportToCSV as Mock).mockImplementation(mockExportToCSV);

    render(
      <MockedProvider mocks={mocks}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={() => {}}
          statistics={mockStatistics}
          memberData={mockMemberData}
          t={(key) => key}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Export Data' }),
      ).toBeInTheDocument();
    });

    await act(async () => {
      const exportButton = screen.getByRole('button', { name: 'Export Data' });
      await userEvent.click(exportButton);
    });

    await act(async () => {
      const demographicsExport = screen.getByTestId('trends-export');
      await userEvent.click(demographicsExport);
    });

    expect(mockExportToCSV).toHaveBeenCalled();
  });

  it('displays recurring event data correctly', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={() => {}}
          statistics={mockStatistics}
          memberData={mockMemberData}
          t={(key) => key}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('today-button')).toBeInTheDocument();
    });
  });
  it('handles pagination and today button correctly', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={() => {}}
          statistics={mockStatistics}
          memberData={mockMemberData}
          t={(key) => key}
        />
      </MockedProvider>,
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByTestId('today-button')).toBeInTheDocument();
    });

    // Test pagination
    await act(async () => {
      const nextButton = screen.getByAltText('right-arrow');
      await userEvent.click(nextButton);
    });

    await act(async () => {
      const prevButton = screen.getByAltText('left-arrow');
      await userEvent.click(prevButton);
    });

    // Test today button
    await act(async () => {
      const todayButton = screen.getByTestId('today-button');
      await userEvent.click(todayButton);
    });

    // Verify buttons are present and interactive
    expect(screen.getByAltText('right-arrow')).toBeInTheDocument();
    expect(screen.getByAltText('left-arrow')).toBeInTheDocument();
    expect(screen.getByTestId('today-button')).toBeInTheDocument();
  });

  it('handles pagination in recurring events view', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={() => {}}
          statistics={mockStatistics}
          memberData={mockMemberData}
          t={(key) => key}
        />
      </MockedProvider>,
    );

    await waitFor(async () => {
      const nextButton = screen.getByAltText('right-arrow');
      const prevButton = screen.getByAltText('left-arrow');

      await userEvent.click(nextButton);
      await userEvent.click(prevButton);
    });
  });

  it('closes modal correctly', async () => {
    const handleClose = vi.fn();
    render(
      <MockedProvider mocks={mocks}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={handleClose}
          statistics={mockStatistics}
          memberData={mockMemberData}
          t={(key) => key}
        />
      </MockedProvider>,
    );

    await waitFor(async () => {
      const closeButton = screen.getByTestId('close-button');
      await userEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
