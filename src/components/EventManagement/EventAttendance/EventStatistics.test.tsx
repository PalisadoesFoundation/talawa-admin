import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AttendanceStatisticsModal } from './EventStatistics';
import { MockedProvider } from '@apollo/client/testing';
import { EVENT_DETAILS, RECURRING_EVENTS } from 'GraphQl/Queries/Queries';
import type { InterfaceMember } from './InterfaceEvents';

const mockEventData = {
  event: {
    recurring: true,
    baseRecurringEvent: { _id: 'base123' },
  },
};

const mockRecurringData = {
  getRecurringEvents: [
    {
      startDate: '2023-05-01',
      attendees: [{ gender: 'MALE' }, { gender: 'FEMALE' }],
    },
    {
      startDate: '2023-05-08',
      attendees: [{ gender: 'MALE' }, { gender: 'OTHER' }],
    },
  ],
};

const mocks = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { id: 'event123' },
    },
    result: { data: mockEventData },
  },
  {
    request: {
      query: RECURRING_EVENTS,
      variables: { baseRecurringEventId: 'base123' },
    },
    result: { data: mockRecurringData },
  },
];

describe('AttendanceStatisticsModal', () => {
  const mockHandleClose = jest.fn();
  const mockStatistics = {
    totalMembers: 100,
    membersAttended: 40,
    attendanceRate: 40,
  };
  const mockMemberData: InterfaceMember[] = [
    {
      _id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      gender: 'male',
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
      gender: 'female',
      eventsAttended: [],
      createdAt: '2023-01-01',
      birthDate: new Date('1985-05-05'),
      __typename: 'Admin',
      tagsAssignedWith: {
        edges: [],
      },
    },
    {
      _id: 'user3',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      gender: 'male',
      eventsAttended: [{ _id: 'event1' }, { _id: 'event2' }],
      createdAt: new Date().toISOString(),
      birthDate: new Date('1990-01-01'),
      __typename: 'User',
      tagsAssignedWith: {
        edges: [{ node: { name: 'Tag1' } }],
      },
    },
  ];

  it('renders recurring event data correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={mockHandleClose}
          statistics={mockStatistics}
          memberData={mockMemberData}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('modal-title')).toBeInTheDocument();
      expect(screen.getByTestId('trends-export')).toBeInTheDocument();
    });
  });

  it('changes category when Age button is clicked', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={mockHandleClose}
          statistics={mockStatistics}
          memberData={mockMemberData}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('age-button'));
      expect(screen.getByTestId('age-button')).toHaveClass('btn-light');
      expect(screen.getByTestId('gender-button')).toHaveClass('btn-success');
    });
  });

  it('calls handleClose when close button is clicked', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={mockHandleClose}
          statistics={mockStatistics}
          memberData={mockMemberData}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('close-button'));
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });

  it('displays export options correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={mockHandleClose}
          statistics={mockStatistics}
          memberData={mockMemberData}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('export-dropdown'));
      expect(screen.getByTestId('trends-export')).toBeInTheDocument();
      expect(screen.getByTestId('demographics-export')).toBeInTheDocument();
    });
  });

  it("changes to today's date when Today button is clicked", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AttendanceStatisticsModal
          show={true}
          handleClose={mockHandleClose}
          statistics={mockStatistics}
          memberData={mockMemberData}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('today-button'));
      // Add expectations for date change
    });
  });
});
