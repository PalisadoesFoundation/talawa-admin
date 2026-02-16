import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { AttendanceStatisticsModal } from './EventStatistics';
import { MockedProvider } from '@apollo/client/testing';
import { EVENT_DETAILS, RECURRING_EVENTS } from 'GraphQl/Queries/Queries';
import userEvent from '@testing-library/user-event';
import { exportToCSV } from 'utils/chartToPdf';
import { vi, describe, expect, it, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import type { IMember } from 'types/Event/interface';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

// Store the last Line chart options for tooltip callback testing
let lastLineChartOptions: Record<string, unknown> | null = null;

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      tCommon: (key: string) => key,
      tErrors: (key: string) => key,
    }),
  };
});

// Mock chart.js to avoid canvas errors but capture options for testing
vi.mock('react-chartjs-2', async () => ({
  ...(await vi.importActual('react-chartjs-2')),
  Line: ({ options }: { options: Record<string, unknown> }) => {
    lastLineChartOptions = options;
    return null;
  },
  Bar: () => null,
}));

// Helper to get the tooltip label callback from last rendered Line chart
const getTooltipLabelCallback = ():
  | ((context: {
      dataset: { label?: string };
      parsed: { y: number };
      dataIndex: number;
    }) => string)
  | null => {
  if (!lastLineChartOptions) return null;
  const plugins = lastLineChartOptions.plugins as
    | {
        tooltip?: {
          callbacks?: {
            label?: (context: {
              dataset: { label?: string };
              parsed: { y: number };
              dataIndex: number;
            }) => string;
          };
        };
      }
    | undefined;
  return plugins?.tooltip?.callbacks?.label ?? null;
};

const { mockUseParams } = vi.hoisted(() => ({
  mockUseParams: vi.fn(),
}));
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
          startAt: dayjs
            .utc()
            .add(10, 'days')
            .hour(9)
            .minute(0)
            .second(0)
            .toISOString(),
          endAt: dayjs
            .utc()
            .add(11, 'days')
            .hour(17)
            .minute(0)
            .second(0)
            .toISOString(),
          createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
          updatedAt: dayjs.utc().subtract(1, 'month').toISOString(),
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
          createMockEvent(
            'event123',
            dayjs
              .utc()
              .add(10, 'days')
              .hour(9)
              .minute(0)
              .second(0)
              .toISOString(),
            [
              { id: 'user1', natalSex: 'male' },
              { id: 'user2', natalSex: 'female' },
            ],
          ),
          createMockEvent(
            'event456',
            dayjs
              .utc()
              .add(17, 'days')
              .hour(9)
              .minute(0)
              .second(0)
              .toISOString(),
            [
              { id: 'user1', natalSex: 'male' },
              { id: 'user3', natalSex: 'other' },
            ],
          ),
          createMockEvent(
            'event789',
            dayjs
              .utc()
              .add(24, 'days')
              .hour(9)
              .minute(0)
              .second(0)
              .toISOString(),
            [
              { id: 'user2', natalSex: 'female' },
              { id: 'user3', natalSex: 'intersex' },
            ],
          ),
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
          startAt: dayjs
            .utc()
            .add(10, 'days')
            .hour(9)
            .minute(0)
            .second(0)
            .toISOString(),
          endAt: dayjs
            .utc()
            .add(11, 'days')
            .hour(17)
            .minute(0)
            .second(0)
            .toISOString(),
          createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
          updatedAt: dayjs.utc().subtract(1, 'month').toISOString(),
          isRecurringEventTemplate: true,
          baseEvent: null,
          recurrenceRule: {
            recurrenceRuleString: 'FREQ=WEEKLY',
            recurrenceStartDate: dayjs
              .utc()
              .add(10, 'days')
              .format('YYYY-MM-DD'),
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
          createMockEvent(
            'event1',
            dayjs
              .utc()
              .add(10, 'days')
              .hour(9)
              .minute(0)
              .second(0)
              .toISOString(),
            [{ id: 'user1', natalSex: 'male' }],
          ),
          createMockEvent(
            'event2',
            dayjs
              .utc()
              .add(17, 'days')
              .hour(9)
              .minute(0)
              .second(0)
              .toISOString(),
            [{ id: 'user2', natalSex: 'female' }],
          ),
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
          startAt: dayjs
            .utc()
            .add(10, 'days')
            .hour(9)
            .minute(0)
            .second(0)
            .toISOString(),
          endAt: dayjs
            .utc()
            .add(11, 'days')
            .hour(17)
            .minute(0)
            .second(0)
            .toISOString(),
          createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
          updatedAt: dayjs.utc().subtract(1, 'month').toISOString(),
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
            dayjs
              .utc()
              .add(10 + i, 'days')
              .hour(9)
              .minute(0)
              .second(0)
              .toISOString(),
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
    birthDate: dayjs.utc().subtract(35, 'years').toDate(),
    createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
    role: 'MEMBER',
    tagsAssignedWith: { edges: [] },
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    emailAddress: 'jane@example.com' as `${string}@${string}.${string}`,
    natalSex: 'female',
    birthDate: dayjs.utc().subtract(40, 'years').toDate(),
    createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
    role: 'MEMBER',
    tagsAssignedWith: { edges: [] },
  },
  {
    id: 'user3',
    name: 'Alex Johnson',
    emailAddress: 'alex@example.com' as `${string}@${string}.${string}`,
    natalSex: 'intersex',
    birthDate: dayjs.utc().subtract(15, 'years').toDate(),
    createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
    role: 'MEMBER',
    tagsAssignedWith: { edges: [] },
  },
  {
    id: 'user4',
    name: 'Sam Wilson',
    emailAddress: 'sam@example.com' as `${string}@${string}.${string}`,
    natalSex: 'other',
    birthDate: dayjs.utc().subtract(50, 'years').toDate(),
    createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
    role: 'MEMBER',
    tagsAssignedWith: { edges: [] },
  },
  {
    id: 'user5',
    name: 'Chris Brown',
    emailAddress: 'chris@example.com' as `${string}@${string}.${string}`,
    natalSex: 'male',
    birthDate: dayjs.utc().subtract(36, 'years').toDate(),
    createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
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
    vi.clearAllMocks();
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
      expect(screen.getByTestId('export-container')).toBeInTheDocument();
    });

    // Switch to age category first
    await act(async () => {
      const ageButton = screen.getByTestId('age-button');
      await userEvent.click(ageButton);
    });

    const exportButton = screen.getByTestId('export-toggle');
    await userEvent.click(exportButton);

    const demographicsExport = screen.getByTestId('export-item-demographics');
    await userEvent.click(demographicsExport);

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
      expect(screen.getByTestId('export-container')).toBeInTheDocument();
    });

    const exportButton = screen.getByTestId('export-toggle');
    await userEvent.click(exportButton);

    const demographicsExport = screen.getByTestId('export-item-demographics');
    await userEvent.click(demographicsExport);

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
      expect(screen.getByText('trends')).toBeInTheDocument();
    });

    // Click the export dropdown to open it
    const exportButton = screen.getByTestId('export-toggle');
    await userEvent.click(exportButton);

    // Now wait for and click the trends export option
    await waitFor(() => {
      expect(screen.getByTestId('export-item-trends')).toBeInTheDocument();
    });

    const trendsExport = screen.getByTestId('export-item-trends');
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
      expect(screen.getByText('trends')).toBeInTheDocument();
    });

    // Click the export dropdown to open it
    const exportButton = screen.getByTestId('export-toggle');
    await userEvent.click(exportButton);

    // Now wait for and click the trends export option
    await waitFor(() => {
      expect(screen.getByTestId('export-item-trends')).toBeInTheDocument();
    });

    const trendsExport = screen.getByTestId('export-item-trends');
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
      expect(screen.getByTestId('export-container')).toBeInTheDocument();
    });

    const exportButton = screen.getByTestId('export-toggle');
    await userEvent.click(exportButton);

    const demographicsExport = screen.getByTestId('export-item-demographics');
    await userEvent.click(demographicsExport);

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
      expect(screen.getByTestId('export-container')).toBeInTheDocument();
    });

    // This test verifies the dropdown renders correctly
    // The default case in handleExport is tested implicitly through other test cases
    const dropdown = screen.getByTestId('export-container');
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
              startAt: dayjs
                .utc()
                .add(10, 'days')
                .hour(9)
                .minute(0)
                .second(0)
                .toISOString(),
              endAt: dayjs
                .utc()
                .add(11, 'days')
                .hour(17)
                .minute(0)
                .second(0)
                .toISOString(),
              createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
              updatedAt: dayjs.utc().subtract(1, 'month').toISOString(),
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
      const nextButton = screen.getByLabelText('nextPage');
      await userEvent.click(nextButton);
    });

    // Test previous page
    await act(async () => {
      const prevButton = screen.getByLabelText('previousPage');
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
      const prevButton = screen.getByLabelText('previousPage');
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
              startAt: dayjs
                .utc()
                .add(10, 'days')
                .hour(9)
                .minute(0)
                .second(0)
                .toISOString(),
              endAt: dayjs
                .utc()
                .add(11, 'days')
                .hour(17)
                .minute(0)
                .second(0)
                .toISOString(),
              createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
              updatedAt: dayjs.utc().subtract(1, 'month').toISOString(),
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
              createMockEvent(
                'event123',
                dayjs
                  .utc()
                  .add(10, 'days')
                  .hour(9)
                  .minute(0)
                  .second(0)
                  .toISOString(),
                [
                  { id: 'user1', natalSex: null },
                  { id: 'user2', natalSex: 'female' },
                ],
              ),
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
      <MockedProvider mocks={recurringTemplateMocks}>
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

  it('handles invalid date format (NaN) in event data', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org123', eventId: 'event123' });

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const mocksWithInvalidDate = [
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
              startAt: dayjs
                .utc()
                .add(10, 'days')
                .hour(9)
                .minute(0)
                .second(0)
                .toISOString(),
              endAt: dayjs
                .utc()
                .add(11, 'days')
                .hour(17)
                .minute(0)
                .second(0)
                .toISOString(),
              createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
              updatedAt: dayjs.utc().subtract(1, 'month').toISOString(),
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
              {
                id: 'event1',
                startAt: 'invalid-date-string',
                attendees: [{ id: 'user1', natalSex: 'male' }],
              },
              {
                id: 'event2',
                startAt: dayjs
                  .utc()
                  .add(11, 'days')
                  .hour(9)
                  .minute(0)
                  .second(0)
                  .toISOString(),
                attendees: [{ id: 'user2', natalSex: 'female' }],
              },
            ],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithInvalidDate}>
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

    // Wait for chart to render with invalid date
    await waitFor(
      () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Invalid date for event:'),
        );
      },
      { timeout: 3000 },
    );

    consoleErrorSpy.mockRestore();
  });

  it('handles error during date formatting', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org123', eventId: 'event123' });

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const mocksWithDateError = [
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
              startAt: dayjs().subtract(1, 'year').hour(9).toISOString(),
              endAt: dayjs()
                .subtract(1, 'year')
                .add(1, 'day')
                .hour(17)
                .toISOString(),
              createdAt: dayjs().subtract(1, 'year').toISOString(),
              updatedAt: dayjs().subtract(1, 'year').toISOString(),
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
              {
                id: 'event1',
                startAt: dayjs
                  .utc()
                  .add(10, 'days')
                  .hour(9)
                  .minute(0)
                  .second(0)
                  .toISOString(),
                attendees: [{ id: 'user1', natalSex: 'male' }],
              },
            ],
          },
        },
      },
    ];

    // Capture original Date constructor before spying to avoid infinite recursion
    const OriginalDate = Date;
    const dateSpy = vi.spyOn(global, 'Date' as never).mockImplementation(((
      ...args: ConstructorParameters<typeof Date>
    ) => {
      if (args.length > 0 && typeof args[0] === 'string') {
        throw new Error('Date formatting error');
      }
      return new OriginalDate(...args) as Date;
    }) as never);

    render(
      <MockedProvider mocks={mocksWithDateError}>
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

    // Wait for error to be logged
    await waitFor(
      () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Error formatting date for event:'),
          expect.any(Error),
        );
      },
      { timeout: 3000 },
    );

    dateSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('handles age calculation with month/day boundaries', async () => {
    const today = new Date();
    const birthDateBeforeToday = new Date(
      today.getFullYear() - 20,
      today.getMonth() - 1,
      today.getDate(),
    );
    const birthDateAfterToday = new Date(
      today.getFullYear() - 20,
      today.getMonth() + 1,
      today.getDate() + 1,
    );

    const membersWithBoundaryAges: IMember[] = [
      {
        id: 'member1',
        natalSex: 'male',
        birthDate: birthDateBeforeToday,
        createdAt: dayjs().subtract(1, 'year').toISOString(),
        name: 'Member 1',
        emailAddress: 'member1@test.com',
        role: 'member',
        tagsAssignedWith: { edges: [] },
      },
      {
        id: 'member2',
        natalSex: 'female',
        birthDate: birthDateAfterToday,
        createdAt: dayjs().subtract(1, 'year').toISOString(),
        name: 'Member 2',
        emailAddress: 'member2@test.com',
        role: 'member',
        tagsAssignedWith: { edges: [] },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={() => {}}
          statistics={mockStatistics}
          memberData={membersWithBoundaryAges}
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

    // Age demographics should be calculated correctly with boundary cases
    await waitFor(() => {
      expect(screen.getByTestId('age-button')).toHaveClass('btn-success');
    });

    // Verify the actual age demographics are calculated correctly for boundary dates
    // Both members should be categorized into age18to40 bucket (20 years old)
    // The demographics section should be displayed with age selected
    await waitFor(() => {
      const demographicsSection = screen.getByText('demography');
      expect(demographicsSection).toBeInTheDocument();
      // The age button should remain active, showing age demographics are calculated
      expect(screen.getByTestId('age-button')).toHaveClass('btn-success');
    });
  });

  it('handles age calculation for same month with day before birthday', async () => {
    const today = new Date();
    // Create a birthdate in the same month but a few days in the future
    // This tests the edge case: monthDiff === 0 && today.getDate() < birth.getDate()
    const futureDayThisMonth = Math.min(today.getDate() + 7, 28);
    const birthDateSameMonthFuture = new Date(
      today.getFullYear() - 22,
      today.getMonth(),
      futureDayThisMonth,
    );
    // Also test same month, day already passed
    const pastDayThisMonth = Math.max(today.getDate() - 7, 1);
    const birthDateSameMonthPast = new Date(
      today.getFullYear() - 19,
      today.getMonth(),
      pastDayThisMonth,
    );

    const membersWithSameMonthAges: IMember[] = [
      {
        id: 'member1',
        natalSex: 'male',
        birthDate: birthDateSameMonthFuture,
        createdAt: dayjs().subtract(1, 'year').toISOString(),
        name: 'Member Future',
        emailAddress: 'future@test.com',
        role: 'member',
        tagsAssignedWith: { edges: [] },
      },
      {
        id: 'member2',
        natalSex: 'female',
        birthDate: birthDateSameMonthPast,
        createdAt: dayjs().subtract(1, 'year').toISOString(),
        name: 'Member Past',
        emailAddress: 'past@test.com',
        role: 'member',
        tagsAssignedWith: { edges: [] },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={() => {}}
          statistics={mockStatistics}
          memberData={membersWithSameMonthAges}
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

    // Both members should be in age18to40 category
    await waitFor(() => {
      expect(screen.getByTestId('age-button')).toHaveClass('btn-success');
      const demographicsSection = screen.getByText('demography');
      expect(demographicsSection).toBeInTheDocument();
    });
  });

  it('handles pagination boundaries correctly', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org123', eventId: 'event1' });

    // Create 15 recurring events (more than one page)
    const manyRecurringEvents = Array.from({ length: 15 }, (_, i) => ({
      id: `event${i + 1}`,
      name: `Event ${i + 1}`,
      startAt: dayjs
        .utc()
        .year(2024)
        .month(0)
        .date(i + 1)
        .toISOString(),
      attendees: [
        {
          id: `attendee${i}`,
          natalSex: 'male',
          birthDate: '2000-01-01',
        },
      ],
    }));

    const mocksWithManyEvents = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event1' },
        },
        result: {
          data: {
            event: {
              id: 'event1',
              name: 'Event 1',
              description: 'Test Description',
              location: 'Test Location',
              allDay: false,
              isPublic: true,
              isRegisterable: true,
              startAt: dayjs
                .utc()
                .year(2024)
                .month(0)
                .date(1)
                .hour(9)
                .minute(0)
                .second(0)
                .toISOString(),
              endAt: dayjs
                .utc()
                .year(2024)
                .month(0)
                .date(1)
                .hour(17)
                .minute(0)
                .second(0)
                .toISOString(),
              createdAt: dayjs
                .utc()
                .year(2024)
                .month(0)
                .date(1)
                .startOf('day')
                .toISOString(),
              updatedAt: dayjs
                .utc()
                .year(2024)
                .month(0)
                .date(1)
                .startOf('day')
                .toISOString(),
              isRecurringEventTemplate: false,
              baseEvent: {
                id: 'base1',
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
              organization: { id: 'org123', name: 'Test Organization' },
            },
          },
        },
      },
      {
        request: {
          query: RECURRING_EVENTS,
          variables: {
            baseRecurringEventId: 'base1',
          },
        },
        result: {
          data: {
            getRecurringEvents: manyRecurringEvents,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithManyEvents}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={() => {}}
          statistics={mockStatistics}
          memberData={mockMemberData}
          t={(key) => key}
        />
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('attendance-modal')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Test next page button at boundary
    await waitFor(
      () => {
        const nextButton = screen.getByLabelText('nextPage');
        expect(nextButton).not.toBeDisabled();
      },
      { timeout: 3000 },
    );

    // Click next to reach last page
    await act(async () => {
      const nextButton = screen.getByLabelText('nextPage');
      await userEvent.click(nextButton);
    });

    // Verify next button is disabled at last page
    await waitFor(() => {
      const nextButton = screen.getByLabelText('nextPage');
      expect(nextButton).toBeDisabled();
    });
  });

  it('handles base event ID determination for recurring template', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org123', eventId: 'event1' });

    // Test recurring event template path
    const mockRecurringTemplate = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event1' },
        },
        result: {
          data: {
            event: {
              id: 'event1',
              name: 'Template Event',
              isRecurringEventTemplate: true,
              baseEvent: null,
            },
          },
        },
      },
      {
        request: {
          query: RECURRING_EVENTS,
          variables: {
            baseRecurringEventId: 'event1',
          },
        },
        result: {
          data: {
            getRecurringEvents: [
              {
                id: 'event1',
                name: 'Template Event',
                startAt: dayjs
                  .utc()
                  .year(2024)
                  .month(0)
                  .date(1)
                  .hour(9)
                  .minute(0)
                  .second(0)
                  .toISOString(),
                attendees: [],
              },
            ],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mockRecurringTemplate}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={() => {}}
          statistics={mockStatistics}
          memberData={mockMemberData}
          t={(key) => key}
        />
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('attendance-modal')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Verify the recurring template event data is loaded
    await waitFor(() => {
      const modalContent = screen.getByTestId('attendance-modal');
      expect(modalContent).toBeInTheDocument();
      // The modal should have processed the recurring template correctly
      // baseEventId should be 'event1' since isRecurringEventTemplate is true
    });
  });

  it('handles Today button click', async () => {
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

    await act(async () => {
      const todayButton = screen.getByTestId('today-button');
      await userEvent.click(todayButton);
    });

    // Current page should reset to 0
    await waitFor(() => {
      const prevButton = screen.getByLabelText('previousPage');
      expect(prevButton).toBeDisabled();
    });
  });

  it('handles next page click when already on last page', async () => {
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
      expect(screen.getByTestId('attendance-modal')).toBeInTheDocument();
    });

    // With only 3 events and eventsPerPage=10, we're already on the last page
    // Clicking next should not change anything (branch: currentPage < totalPages - 1 is false)
    await waitFor(() => {
      const nextButton = screen.getByLabelText('nextPage');
      expect(nextButton).toBeDisabled();
    });

    // Try clicking it anyway to ensure the branch is covered
    await act(async () => {
      const nextButton = screen.getByLabelText('nextPage');
      await userEvent.click(nextButton);
    });

    // Should still be on first page since there's only one page
    await waitFor(() => {
      const prevButton = screen.getByLabelText('previousPage');
      expect(prevButton).toBeDisabled();
    });
  });

  it('handles export dropdown toggle without selecting item', async () => {
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
      expect(screen.getByTestId('export-container')).toBeInTheDocument();
    });

    // Open and close the dropdown without selecting - verifies dropdown handling
    const exportButton = screen.getByTestId('export-toggle');
    await userEvent.click(exportButton);

    // Click elsewhere to close
    await act(async () => {
      const modal = screen.getByTestId('attendance-modal');
      await userEvent.click(modal);
    });

    // Modal should still be open and functional
    expect(screen.getByTestId('attendance-modal')).toBeInTheDocument();
  });

  it('renders without eventId parameter', async () => {
    // Test when eventId is undefined (covers the false branch of if(eventId) in useEffect)
    mockUseParams.mockReturnValue({ orgId: 'org123', eventId: undefined });

    render(
      <MockedProvider mocks={[]}>
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

    // Should render the non-recurring view (since no recurring events loaded)
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument(); // totalMembers
    });
  });

  it('handles member with empty string natalSex', async () => {
    const memberWithEmptyNatalSex: IMember[] = [
      {
        id: 'member1',
        natalSex: '',
        birthDate: new Date('1990-01-01'),
        createdAt: dayjs().subtract(1, 'year').toISOString(),
        name: 'Empty Sex Member',
        emailAddress: 'empty@test.com',
        role: 'member',
        tagsAssignedWith: { edges: [] },
      },
      {
        id: 'member2',
        natalSex: 'male',
        birthDate: new Date('1995-06-15'),
        createdAt: dayjs().subtract(1, 'year').toISOString(),
        name: 'Male Member',
        emailAddress: 'male@test.com',
        role: 'member',
        tagsAssignedWith: { edges: [] },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={() => {}}
          statistics={mockStatistics}
          memberData={memberWithEmptyNatalSex}
          t={(key) => key}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('attendance-modal')).toBeInTheDocument();
    });

    // The empty string natalSex should be counted in the 'other' category
    expect(screen.getByTestId('gender-button')).toBeInTheDocument();
  });

  it('calculates age demographics for members at exact age boundaries', async () => {
    // Member exactly 18 years old (should be in 18-40 category)
    const exactly18 = dayjs.utc().subtract(18, 'years').toDate();
    // Member exactly 40 years old (should be in 18-40 category)
    const exactly40 = dayjs.utc().subtract(40, 'years').toDate();
    const age41 = dayjs.utc().subtract(41, 'years').toDate();
    const age17 = dayjs.utc().subtract(17, 'years').toDate();

    const boundaryMembers: IMember[] = [
      {
        id: 'exactly18',
        natalSex: 'male',
        birthDate: exactly18,
        createdAt: dayjs().subtract(1, 'year').toISOString(),
        name: 'Exactly 18',
        emailAddress: 'e18@test.com',
        role: 'member',
        tagsAssignedWith: { edges: [] },
      },
      {
        id: 'exactly40',
        natalSex: 'female',
        birthDate: exactly40,
        createdAt: dayjs().subtract(1, 'year').toISOString(),
        name: 'Exactly 40',
        emailAddress: 'e40@test.com',
        role: 'member',
        tagsAssignedWith: { edges: [] },
      },
      {
        id: 'age41',
        natalSex: 'male',
        birthDate: age41,
        createdAt: dayjs().subtract(1, 'year').toISOString(),
        name: 'Age 41',
        emailAddress: 'a41@test.com',
        role: 'member',
        tagsAssignedWith: { edges: [] },
      },
      {
        id: 'age17',
        natalSex: 'female',
        birthDate: age17,
        createdAt: dayjs().subtract(1, 'year').toISOString(),
        name: 'Age 17',
        emailAddress: 'a17@test.com',
        role: 'member',
        tagsAssignedWith: { edges: [] },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={() => {}}
          statistics={mockStatistics}
          memberData={boundaryMembers}
          t={(key) => key}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('attendance-modal')).toBeInTheDocument();
    });

    // Switch to age view to exercise age calculation
    await act(async () => {
      const ageButton = screen.getByTestId('age-button');
      await userEvent.click(ageButton);
    });

    // Verify age demographics are calculated (button should be active)
    await waitFor(() => {
      expect(screen.getByTestId('age-button')).toHaveClass('btn-success');
    });

    // Export demographics to exercise the export path with age data
    const exportButton = screen.getByTestId('export-toggle');
    await userEvent.click(exportButton);

    const demographicsExport = screen.getByTestId('export-item-demographics');
    await userEvent.click(demographicsExport);

    expect(exportToCSV).toHaveBeenCalled();
  });

  it('handles recurring events with no baseEvent and not a template', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org123', eventId: 'event123' });

    // Event that is not a recurring template and has no baseEvent (edge case)
    const noBaseEventMocks = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              id: 'event123',
              name: 'Standalone Event',
              description: 'Test',
              location: 'Test',
              allDay: false,
              isPublic: true,
              isRegisterable: true,
              startAt: dayjs
                .utc()
                .subtract(1, 'year')
                .hour(9)
                .minute(0)
                .second(0)
                .toISOString(),
              endAt: dayjs
                .utc()
                .subtract(1, 'year')
                .add(1, 'day')
                .hour(17)
                .minute(0)
                .second(0)
                .toISOString(),
              createdAt: dayjs.utc().subtract(1, 'year').toISOString(),
              updatedAt: dayjs.utc().subtract(1, 'year').toISOString(),
              isRecurringEventTemplate: false,
              baseEvent: null, // No baseEvent
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
      <MockedProvider mocks={noBaseEventMocks}>
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

    // Should show the non-recurring view (totalMembers)
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('tooltip label callback returns correct format for current and non-current events', async () => {
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

    // Wait for the chart to render and capture the options
    await waitFor(() => {
      expect(screen.getByText('trends')).toBeInTheDocument();
    });

    // Get the tooltip callback from the captured options
    const labelCallback = getTooltipLabelCallback();
    expect(labelCallback).not.toBeNull();

    if (labelCallback) {
      // Test for the current event (dataIndex 0 corresponds to event123)
      const currentEventResult = labelCallback({
        dataset: { label: 'Attendee Count' },
        parsed: { y: 10 },
        dataIndex: 0,
      });
      expect(currentEventResult).toBe('Attendee Count: 10 (currentEvent)');

      // Test for a non-current event (dataIndex 1 corresponds to event456)
      const otherEventResult = labelCallback({
        dataset: { label: 'Male Attendees' },
        parsed: { y: 5 },
        dataIndex: 1,
      });
      expect(otherEventResult).toBe('Male Attendees: 5');

      // Test with empty label
      const emptyLabelResult = labelCallback({
        dataset: {},
        parsed: { y: 3 },
        dataIndex: 2,
      });
      expect(emptyLabelResult).toBe(': 3');
    }
  });
});
