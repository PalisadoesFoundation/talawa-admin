import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AttendanceStatisticsModal } from './EventStatistics';
import { MockedProvider } from '@apollo/client/testing';
import { EVENT_DETAILS, RECURRING_EVENTS } from 'GraphQl/Queries/Queries';
import type {
  InterfaceEvent,
  InterfaceMember,
  InterfaceRecurringEvent,
} from './InterfaceEvents';
import type { MockedResponse } from '@apollo/client/testing';
import type { RenderResult } from '@testing-library/react';

interface InterfaceQueryResult {
  event?: InterfaceEvent;
  getRecurringEvents?: InterfaceRecurringEvent[];
}

interface InterfaceQueryVariables {
  id?: string;
  baseRecurringEventId?: string;
}
// Mock react-router-dom useParams
jest.mock('react-router-dom', () => ({
  useParams: () => ({
    orgId: 'org123',
    eventId: 'event123',
  }),
}));

jest.mock('utils/chartToPdf', () => ({
  exportToCSV: jest.fn(),
}));

const mockMemberData: InterfaceMember[] = [
  {
    _id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    gender: 'MALE',
    eventsAttended: [{ _id: 'event1' }, { _id: 'event2' }],
    createdAt: new Date().toISOString(),
    birthDate: new Date('1990-01-01'),
    __typename: 'User',
    tagsAssignedWith: {
      edges: [{ node: { name: 'Tag1' } }],
    },
  },
  {
    _id: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'janesmith@example.com',
    gender: 'FEMALE',
    eventsAttended: [
      { _id: 'event1' },
      { _id: 'event2' },
      { _id: 'event3' },
      { _id: 'event4' },
    ],
    createdAt: '2023-01-01',
    birthDate: new Date('1985-05-05'),
    __typename: 'Admin',
    tagsAssignedWith: {
      edges: [],
    },
  },
];

const nonRecurringMocks = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { id: 'event123' },
    },
  },
];

const recurringMocks = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { id: 'event123' },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          recurring: true,
          baseRecurringEvent: { _id: 'base123' },
          title: 'Test Event',
          startDate: new Date().toISOString(),
          attendees: mockMemberData,
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
        getRecurringEvents: Array.from({ length: 5 }, (_, i) => ({
          _id: `event${i}`,
          title: `Event ${i}`,
          startDate: new Date(2023, 4, i + 1).toISOString(),
          endDate: new Date(2023, 4, i + 1).toISOString(),
          frequency: 'WEEKLY',
          interval: 1,
          attendees: mockMemberData.map((member) => ({
            _id: `${member._id}_${i}`,
            gender: member.gender as
              | 'MALE'
              | 'FEMALE'
              | 'OTHER'
              | 'PREFER_NOT_TO_SAY',
          })),
          isPublic: true,
          isRegisterable: true,
        })),
      },
    },
  },
];

const renderModal = (
  mocks: MockedResponse<InterfaceQueryResult, InterfaceQueryVariables>[],
): RenderResult => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AttendanceStatisticsModal
        show={true}
        handleClose={jest.fn()}
        statistics={{
          totalMembers: 100,
          membersAttended: 40,
          attendanceRate: 40,
        }}
        memberData={mockMemberData}
        t={(key: string) => key}
      />
    </MockedProvider>,
  );
};

describe('AttendanceStatisticsModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Recurring Events', () => {
    it('renders recurring event data and line chart', async () => {
      renderModal(
        recurringMocks as MockedResponse<
          InterfaceQueryResult,
          InterfaceQueryVariables
        >[],
      );

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toBeInTheDocument();
      });

      const charts = document.querySelectorAll('canvas');
      expect(charts).toHaveLength(2); // Line chart and demographic bar chart
      expect(screen.getByTestId('today-button')).toBeInTheDocument();
      expect(screen.getByAltText('left-arrow')).toBeInTheDocument();
      expect(screen.getByAltText('right-arrow')).toBeInTheDocument();
    });
    it('handles pagination in recurring view', async () => {
      renderModal(
        recurringMocks as MockedResponse<
          InterfaceQueryResult,
          InterfaceQueryVariables
        >[],
      );
      await waitFor(() => {
        expect(screen.getByAltText('right-arrow')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByAltText('right-arrow'));

      await waitFor(() => {
        // Add any specific assertions for pagination here
      });
    });

    it('updates date range when Today button is clicked', async () => {
      renderModal(
        recurringMocks as MockedResponse<
          InterfaceQueryResult,
          InterfaceQueryVariables
        >[],
      );

      fireEvent.click(screen.getByTestId('today-button'));

      await waitFor(() => {
        const charts = document.querySelectorAll('canvas');
        expect(charts).toHaveLength(2);
      });
    });
  });

  describe('Non-Recurring Events', () => {
    it('renders non-recurring event data with attendance count', async () => {
      renderModal(nonRecurringMocks);

      await waitFor(() => {
        expect(screen.getByTestId('modal-title')).toBeInTheDocument();
        const attendanceCount = screen.getByText('100');
        expect(attendanceCount).toBeInTheDocument();
      });
    });

    it('displays demographic bar chart for non-recurring event', async () => {
      renderModal(nonRecurringMocks);

      await waitFor(() => {
        const charts = document.querySelectorAll('canvas');
        expect(charts).toHaveLength(1); // Only demographic bar chart
      });
    });

    it('switches between gender and age demographics', async () => {
      renderModal(
        nonRecurringMocks as MockedResponse<
          InterfaceQueryResult,
          InterfaceQueryVariables
        >[],
      );

      await waitFor(() => {
        expect(screen.getByTestId('age-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('age-button'));

      await waitFor(() => {
        expect(screen.getByTestId('age-button')).toHaveClass('btn-light');
      });
    });
  });

  describe('Shared Functionality', () => {
    it('exports data correctly for both types', async () => {
      renderModal(
        recurringMocks as MockedResponse<
          InterfaceQueryResult,
          InterfaceQueryVariables
        >[],
      );

      await waitFor(() => {
        expect(screen.getByTestId('export-dropdown')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('export-dropdown'));
    });

    it('closes modal when close button is clicked', async () => {
      renderModal(
        recurringMocks as MockedResponse<
          InterfaceQueryResult,
          InterfaceQueryVariables
        >[],
      );

      await waitFor(() => {
        expect(screen.getByTestId('close-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('close-button'));
      // Add assertions related to modal closing here
    });

    it('handles demographic toggles correctly', async () => {
      renderModal(
        recurringMocks as MockedResponse<
          InterfaceQueryResult,
          InterfaceQueryVariables
        >[],
      );
      await waitFor(() => {
        expect(screen.getByTestId('gender-button')).toBeInTheDocument();
        expect(screen.getByTestId('age-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('gender-button'));
      expect(screen.getByTestId('gender-button')).toHaveTextContent('Gender');

      fireEvent.click(screen.getByTestId('age-button'));
      expect(screen.getByTestId('age-button')).toHaveTextContent('Age');
    });
  });
});
