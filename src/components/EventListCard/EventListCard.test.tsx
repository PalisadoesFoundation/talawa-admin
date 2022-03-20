import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';

import EventListCard from './EventListCard';
import { DELETE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';

const MOCKS = [
  {
    request: {
      query: DELETE_EVENT_MUTATION,
      variable: { id: '123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
      },
    },
  },
];

async function wait(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Event List Card', () => {
  const props = {
    key: '123',
    id: '1',
    eventLocation: 'India',
    eventName: 'Shelter for Dogs',
    totalAdmin: '5',
    totalMember: '107',
    eventImage: 'https://via.placeholder.com/200x100',
    regDate: '19/03/2022',
    regDays: '3',
  };

  global.alert = jest.fn();

  test('should render props and text elements test for the page component', async () => {
    global.confirm = () => true;

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <EventListCard {...props} />
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByText(/Delete/i));

    expect(screen.getByText('Admin:')).toBeInTheDocument();
    expect(screen.getByText('Member:')).toBeInTheDocument();
    expect(screen.getByText('Days:')).toBeInTheDocument();
    expect(screen.getByText(props.eventLocation)).toBeInTheDocument();
    expect(screen.getByText(props.eventName)).toBeInTheDocument();
    expect(screen.getByText(props.totalAdmin)).toBeInTheDocument();
    expect(screen.getByText(props.totalMember)).toBeInTheDocument();
    expect(screen.getByText(props.regDate)).toBeInTheDocument();
    expect(screen.getByText(props.regDays)).toBeInTheDocument();
  });

  test('Should render text elements when props value is not passed', async () => {
    global.confirm = () => false;

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <EventListCard
          key="123"
          id="1"
          eventName=""
          eventLocation=""
          totalAdmin="5"
          eventImage=""
          totalMember="107"
          regDate="19/03/2022"
          regDays="3"
        />
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByText(/Delete/i));

    expect(screen.getByText('Admin:')).toBeInTheDocument();
    expect(screen.getByText('Member:')).toBeInTheDocument();
    expect(screen.getByText('Days:')).toBeInTheDocument();
    expect(screen.queryByText(props.eventLocation)).toBeInTheDocument();
    expect(screen.queryByText(props.eventName)).not.toBeInTheDocument();
    expect(screen.getByText(props.totalAdmin)).toBeInTheDocument();
    expect(screen.getByText(props.totalMember)).toBeInTheDocument();
    expect(screen.getByText(props.regDate)).toBeInTheDocument();
    expect(screen.getByText(props.regDays)).toBeInTheDocument();
  });
});
