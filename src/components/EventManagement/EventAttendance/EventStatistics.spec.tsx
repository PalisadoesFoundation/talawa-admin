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
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
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
      variables: { id: 'event123' },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          title: 'Test Event',
          description: 'Test Description',
          startDate: '2023-01-01',
          endDate: '2023-01-02',
          startTime: '09:00',
          endTime: '17:00',
          allDay: false,
          location: 'Test Location',
          recurring: true,
          baseRecurringEvent: { _id: 'base123' },
          organization: {
            _id: 'org123',
            members: [
              { _id: 'user1', firstName: 'John', lastName: 'Doe' },
              { _id: 'user2', firstName: 'Jane', lastName: 'Smith' },
            ],
          },
          attendees: [
            {
              _id: 'user1',
              gender: 'MALE',
            },
            {
              _id: 'user2',
              gender: 'FEMALE',
            },
          ],
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
            _id: 'event123',
            startDate: '2023-01-01',
            title: 'Test Event 1',
            attendees: [
              { _id: 'user1', gender: 'MALE' },
              { _id: 'user2', gender: 'FEMALE' },
            ],
          },
          {
            _id: 'event456',
            startDate: '2023-01-08',
            title: 'Test Event 2',
            attendees: [
              { _id: 'user1', gender: 'MALE' },
              { _id: 'user3', gender: 'OTHER' },
            ],
          },
          {
            _id: 'event789',
            startDate: '2023-01-15',
            title: 'Test Event 3',
            attendees: [
              { _id: 'user2', gender: 'FEMALE' },
              { _id: 'user3', gender: 'OTHER' },
            ],
          },
        ],
      },
    },
  },
];

const mockMemberData = [
  {
    _id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'MALE',
    birthDate: new Date('1990-01-01'),
    email: 'john@example.com' as `${string}@${string}.${string}`,
    createdAt: '2023-01-01',
    __typename: 'User',
    tagsAssignedWith: {
      edges: [],
    },
  },
  {
    _id: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
    gender: 'FEMALE',
    birthDate: new Date('1985-05-05'),
    email: 'jane@example.com' as `${string}@${string}.${string}`,
    createdAt: '2023-01-01',
    __typename: 'User',
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

    await waitFor(() => {
      const genderButton = screen.getByTestId('gender-button');
      const ageButton = screen.getByTestId('age-button');

      userEvent.click(ageButton);
      expect(ageButton).toHaveClass('btn-success');
      expect(genderButton).toHaveClass('btn-light');

      userEvent.click(genderButton);
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

    await waitFor(() => {
      const nextButton = screen.getByAltText('right-arrow');
      const prevButton = screen.getByAltText('left-arrow');

      userEvent.click(nextButton);
      userEvent.click(prevButton);
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

    await waitFor(() => {
      const closeButton = screen.getByTestId('close-button');
      userEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
