import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import EventsAttendedMemberModal from './EventsAttendedMemberModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockEvents = [
  { _id: 'event1' },
  { _id: 'event2' },
  { _id: 'event3' },
  { _id: 'event4' },
  { _id: 'event5' },
  { _id: 'event6' },
];

describe('MemberAttendedEventsModal', () => {
  it('renders modal when show is true', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal
            eventsAttended={mockEvents}
            setShow={() => {}}
            show={true}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('Events Attended List')).toBeInTheDocument();
  });

  it('displays no events message when eventsAttended is empty', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal
            eventsAttended={[]}
            setShow={() => {}}
            show={true}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('noeventsAttended')).toBeInTheDocument();
  });

  it('renders correct number of events per page', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal
            eventsAttended={mockEvents}
            setShow={() => {}}
            show={true}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getAllByTestId('custom-row')).toHaveLength(5);
  });

  it('updates page when pagination is clicked', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal
            eventsAttended={mockEvents}
            setShow={() => {}}
            show={true}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByText('Showing 1 - 5 of 6 Events')).toBeInTheDocument();
  });

  it('calls setShow when close button is clicked', () => {
    const mockSetShow = jest.fn();
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal
            eventsAttended={mockEvents}
            setShow={mockSetShow}
            show={true}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(mockSetShow).toHaveBeenCalledWith(false);
  });
});
