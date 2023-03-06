import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import EventListCard from './EventListCard';
import {
  DELETE_EVENT_MUTATION,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';

const MOCKS = [
  {
    request: {
      query: DELETE_EVENT_MUTATION,
      variable: { id: '123' },
    },
    result: {
      data: {
        removeEvent: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_EVENT_MUTATION,
      variable: {
        id: '123',
        title: 'Updated title',
        description: 'This is a new update',
        isPublic: true,
        recurring: false,
        isRegisterable: true,
        allDay: false,
        location: 'New Delhi',
        startTime: '02:00',
        endTime: '07:00',
      },
    },
    result: {
      data: {
        updateEvent: {
          _id: '1',
        },
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
    eventDescription: 'This is shelter for dogs event',
    regDate: '19/03/2022',
    regEndDate: '26/03/2022',
    startTime: '02:00',
    endTime: '06:00',
    allDay: true,
    recurring: false,
    isPublic: true,
    isRegisterable: false,
  };

  global.alert = jest.fn();

  test('should render props and text elements test for the page component', async () => {
    global.confirm = () => true;

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
          <EventListCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByText(props.eventName)).toBeInTheDocument();
  });

  test('Should render text elements when props value is not passed', async () => {
    global.confirm = () => false;

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
          <EventListCard
            key="123"
            id="1"
            eventName=""
            eventLocation=""
            eventDescription=""
            regDate="19/03/2022"
            regEndDate="26/03/2022"
            startTime="02:00"
            endTime="06:00"
            allDay={true}
            recurring={false}
            isPublic={true}
            isRegisterable={false}
          />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    expect(screen.queryByText(props.eventName)).not.toBeInTheDocument();
  });

  test('Testing event update functionality', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
          <EventListCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('editEventModalBtn'));

    userEvent.type(screen.getByTestId('updateTitle'), props.eventName);
    userEvent.type(
      screen.getByTestId('updateDescription'),
      props.eventDescription
    );
    userEvent.type(screen.getByTestId('updateLocation'), props.eventLocation);
    userEvent.click(screen.getByTestId('updateAllDay'));
    userEvent.click(screen.getByTestId('updateRecurring'));
    userEvent.click(screen.getByTestId('updateIsPublic'));
    userEvent.click(screen.getByTestId('updateRegistrable'));

    userEvent.click(screen.getByTestId('updatePostBtn'));
  });

  test('Testing if the event is not for all day', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
          <EventListCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('editEventModalBtn'));

    userEvent.type(screen.getByTestId('updateTitle'), props.eventName);
    userEvent.type(
      screen.getByTestId('updateDescription'),
      props.eventDescription
    );
    userEvent.type(screen.getByTestId('updateLocation'), props.eventLocation);
    userEvent.click(screen.getByTestId('updateAllDay'));
    await wait();

    userEvent.type(screen.getByTestId('updateStartTime'), props.startTime);
    userEvent.type(screen.getByTestId('updateEndTime'), props.endTime);

    userEvent.click(screen.getByTestId('updatePostBtn'));
  });

  test('Testing delete event funcationality', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
          <EventListCard {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('deleteEventModalBtn'));
    userEvent.click(screen.getByTestId(/deleteEventBtn/i));
  });
});
