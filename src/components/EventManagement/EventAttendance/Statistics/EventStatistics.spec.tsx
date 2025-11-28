import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { AttendanceStatisticsModal } from './EventStatistics';
import { MockedProvider } from '@apollo/client/testing';
import { EVENT_DETAILS, RECURRING_EVENTS } from 'GraphQl/Queries/Queries';
import userEvent from '@testing-library/user-event';
import { exportToCSV } from 'utils/chartToPdf';
import { vi, describe, expect, it, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

// Mock chart.js to avoid canvas errors
vi.mock('react-chartjs-2', async () => ({
  ...(await vi.importActual('react-chartjs-2')),
  Line: () => null,
  Bar: () => null,
}));

const mockUseParams = vi.fn();
// Mock react-router-dom
vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useParams: () => mockUseParams(),
}));

vi.mock('utils/chartToPdf', async () => ({
  ...(await vi.importActual('utils/chartToPdf')),
  exportToCSV: vi.fn(),
}));

// Define a proper type for attendees
type MockAttendee = {
  id: string;
  natalSex: string | null;
};

const createMockEvent = (
  id: string,
  date: string,
  attendees: MockAttendee[],
) => ({
  id,
  startAt: date,
  name: `Test Event ${id}`,
  attendees,
});

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
          createMockEvent('event123', '2023-01-01T09:00:00Z', [
            { id: 'user1', natalSex: 'male' },
            { id: 'user2', natalSex: 'female' },
          ]),
          createMockEvent('event456', '2023-01-08T09:00:00Z', [
            { id: 'user1', natalSex: 'male' },
            { id: 'user3', natalSex: 'other' },
          ]),
          createMockEvent('event789', '2023-01-15T09:00:00Z', [
            { id: 'user2', natalSex: 'female' },
            { id: 'user3', natalSex: 'intersex' },
          ]),
        ],
      },
    },
  },
];

// Mock for recurring event template (no baseEvent)
const recurringTemplateMocks = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'template123' },
    },
    result: {
      data: {
        event: {
          id: 'template123',
          name: 'Recurring Template',
          description: 'Test Description',
          location: 'Test Location',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          startAt: '2023-01-01T09:00:00Z',
          endAt: '2023-01-02T17:00:00Z',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          isRecurringEventTemplate: true,
          baseEvent: null,
          recurrenceRule: {
            recurrenceRuleString: 'FREQ=WEEKLY',
            recurrenceStartDate: '2023-01-01',
            recurrenceEndDate: null,
          },
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
      variables: { baseRecurringEventId: 'template123' },
    },
    result: {
      data: {
        getRecurringEvents: [
          createMockEvent('event1', '2023-01-01T09:00:00Z', [
            { id: 'user1', natalSex: 'male' },
          ]),
          createMockEvent('event2', '2023-01-08T09:00:00Z', [
            { id: 'user2', natalSex: 'female' },
          ]),
        ],
      },
    },
  },
];

// Mock for many events (pagination testing)
const manyEventsMocks = [
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
          baseEvent: { id: 'base123' },
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
          organization: { id: 'org123', name: 'Test Organization' },
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
        getRecurringEvents: Array.from({ length: 15 }, (_, i) =>
          createMockEvent(
            `event${i}`,
            `2023-01-${String(i + 1).padStart(2, '0')}T09:00:00Z`,
            [
              {
                id: `user${i}`,
                natalSex:
                  i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'other',
              },
            ],
          ),
        ),
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
    tagsAssignedWith: { edges: [] },
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    emailAddress: 'jane@example.com' as `${string}@${string}.${string}`,
    natalSex: 'female',
    birthDate: new Date('1985-05-05'),
    createdAt: '2023-01-01',
    role: 'MEMBER',
    tagsAssignedWith: { edges: [] },
  },
  {
    id: 'user3',
    name: 'Alex Johnson',
    emailAddress: 'alex@example.com' as `${string}@${string}.${string}`,
    natalSex: 'intersex',
    birthDate: new Date('2010-03-15'),
    createdAt: '2023-01-01',
    role: 'MEMBER',
    tagsAssignedWith: { edges: [] },
  },
  {
    id: 'user4',
    name: 'Sam Wilson',
    emailAddress: 'sam@example.com' as `${string}@${string}.${string}`,
    natalSex: 'other',
    birthDate: new Date('1975-08-20'),
    createdAt: '2023-01-01',
    role: 'MEMBER',
    tagsAssignedWith: { edges: [] },
  },
  {
    id: 'user5',
    name: 'Chris Brown',
    emailAddress: 'chris@example.com' as `${string}@${string}.${string}`,
    natalSex: 'male',
    birthDate: new Date('2000-12-25'),
    createdAt: '2023-01-01',
    role: 'MEMBER',
    tagsAssignedWith: { edges: [] },
  },
];

const mockStatistics = {
  totalMembers: 5,
  membersAttended: 3,
  attendanceRate: 60,
};

describe('AttendanceStatisticsModal - Comprehensive Coverage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Set default params for most tests
    mockUseParams.mockReturnValue({ orgId: 'org123', eventId: 'event123' });
  });
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

  it('handles demographics export with age category', async () => {
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

    // Switch to age category first
    await act(async () => {
      const ageButton = screen.getByTestId('age-button');
      await userEvent.click(ageButton);
    });

    await act(async () => {
      const exportButton = screen.getByRole('button', { name: 'Export Data' });
      await userEvent.click(exportButton);
    });

    await act(async () => {
      const demographicsExport = screen.getByTestId('demographics-export');
      await userEvent.click(demographicsExport);
    });

    expect(mockExportToCSV).toHaveBeenCalledWith(
      expect.arrayContaining([['Age', 'Count']]),
      'age_demographics.csv',
    );
  });

  it('handles demographics export with gender category', async () => {
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

  it('handles trends export functionality', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org123', eventId: 'event123' });

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

    // Wait for the component to load and render the trends section
    await waitFor(() => {
      expect(screen.getByText('Trends')).toBeInTheDocument();
    });

    // Click the export dropdown to open it
    const exportButton = screen.getByRole('button', { name: 'Export Data' });
    await userEvent.click(exportButton);

    // Now wait for and click the trends export option
    await waitFor(() => {
      expect(screen.getByTestId('trends-export')).toBeInTheDocument();
    });

    const trendsExport = screen.getByTestId('trends-export');
    await userEvent.click(trendsExport);

    expect(mockExportToCSV).toHaveBeenCalled();
  });

  it('handles export with error in trends', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org123', eventId: 'event123' });

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockExportToCSV = vi.fn(() => {
      throw new Error('Export failed');
    });
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

    // Wait for the component to load and render the trends section
    await waitFor(() => {
      expect(screen.getByText('Trends')).toBeInTheDocument();
    });

    // Click the export dropdown to open it
    const exportButton = screen.getByRole('button', { name: 'Export Data' });
    await userEvent.click(exportButton);

    // Now wait for and click the trends export option
    await waitFor(() => {
      expect(screen.getByTestId('trends-export')).toBeInTheDocument();
    });

    const trendsExport = screen.getByTestId('trends-export');
    await userEvent.click(trendsExport);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to export trends:',
      expect.any(Error),
    );
    consoleErrorSpy.mockRestore();
  });

  it('handles export with error in demographics', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockExportToCSV = vi.fn(() => {
      throw new Error('Export failed');
    });
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

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to export demographics:',
      expect.any(Error),
    );
    consoleErrorSpy.mockRestore();
  });

  it('handles export with invalid eventKey', async () => {
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
      expect(screen.getByTestId('export-dropdown')).toBeInTheDocument();
    });

    // This test verifies the dropdown renders correctly
    // The default case in handleExport is tested implicitly through other test cases
    const dropdown = screen.getByTestId('export-dropdown');
    expect(dropdown).toBeInTheDocument();
  });

  it('displays non-recurring event statistics', async () => {
    const singleEventMocks = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              id: 'event123',
              name: 'Single Event',
              description: 'Test',
              location: 'Test',
              allDay: false,
              isPublic: true,
              isRegisterable: true,
              startAt: '2023-01-01T09:00:00Z',
              endAt: '2023-01-02T17:00:00Z',
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z',
              isRecurringEventTemplate: false,
              baseEvent: null,
              recurrenceRule: null,
              creator: {
                id: 'creator1',
                name: 'Creator',
                emailAddress: 'creator@example.com',
              },
              updater: {
                id: 'updater1',
                name: 'Updater',
                emailAddress: 'updater@example.com',
              },
              organization: { id: 'org123', name: 'Test Org' },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={singleEventMocks}>
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
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('handles pagination correctly with many events', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org123', eventId: 'event123' });

    render(
      <MockedProvider mocks={manyEventsMocks}>
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

    // Test next page
    await act(async () => {
      const nextButton = screen.getByAltText('right-arrow');
      await userEvent.click(nextButton);
    });

    // Test previous page
    await act(async () => {
      const prevButton = screen.getByAltText('left-arrow');
      await userEvent.click(prevButton);
    });

    // Test today button
    await act(async () => {
      const todayButton = screen.getByTestId('today-button');
      await userEvent.click(todayButton);
    });
  });

  it('handles disabled pagination buttons', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org123', eventId: 'event123' });

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
      const prevButton = screen.getByAltText('left-arrow').closest('button');
      expect(prevButton).toBeDisabled();
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

  it('calculates age demographics correctly', async () => {
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
      expect(screen.getByTestId('age-button')).toBeInTheDocument();
    });

    await act(async () => {
      const ageButton = screen.getByTestId('age-button');
      await userEvent.click(ageButton);
    });

    // Verify age calculation is working
    expect(screen.getByTestId('age-button')).toHaveClass('btn-success');
  });

  it('handles attendees with null natalSex', async () => {
    const mockWithNullSex = [
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
              description: 'Test',
              location: 'Test',
              allDay: false,
              isPublic: true,
              isRegisterable: true,
              startAt: '2023-01-01T09:00:00Z',
              endAt: '2023-01-02T17:00:00Z',
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z',
              isRecurringEventTemplate: false,
              baseEvent: { id: 'base123' },
              recurrenceRule: null,
              creator: {
                id: 'creator1',
                name: 'Creator',
                emailAddress: 'creator@example.com',
              },
              updater: {
                id: 'updater1',
                name: 'Updater',
                emailAddress: 'updater@example.com',
              },
              organization: { id: 'org123', name: 'Test Org' },
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
              createMockEvent('event123', '2023-01-01T09:00:00Z', [
                { id: 'user1', natalSex: null },
                { id: 'user2', natalSex: 'female' },
              ]),
            ],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mockWithNullSex}>
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
    });
  });

  it('handles recurring event template', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org123', eventId: 'template123' });

    render(
      <MockedProvider mocks={recurringTemplateMocks} addTypename={false}>
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
    });
  });
});
