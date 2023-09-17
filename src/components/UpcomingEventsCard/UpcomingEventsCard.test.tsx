import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import UpcomingEventsCard from './UpcomingEventsCard';

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

test('Should render UpcomingEvents when appropriate props are passed', () => {
  const eventProps: any[] = [
    {
      id: 1,
      title: 'Event 1',
      startDate: '2023-09-20',
      endDate: '2023-09-22',
      location: 'Location 1',
    },
    {
      id: 2,
      title: 'Event 2',
      startDate: '2023-10-05',
      endDate: '2023-10-07',
      location: 'Location 2',
    },
    {
      id: 3,
      title: 'Event 3',
      startDate: '2023-11-15',
      endDate: '2023-11-18',
      location: 'Location 3',
    },
  ];

  const { getByText } = render(
    <MockedProvider addTypename={false}>
      <I18nextProvider i18n={i18nForTest}>
        <UpcomingEventsCard events={eventProps} />
      </I18nextProvider>
    </MockedProvider>
  );

  eventProps.forEach((event) => {
    expect(getByText(event.title)).toBeInTheDocument();
    expect(
      getByText(`${event.startDate} | ${event.endDate}`)
    ).toBeInTheDocument();
    expect(getByText(event.location)).toBeInTheDocument();
  });
});

test('Should render no events when no events are passed in', async () => {
  const eventProps: any[] = [];

  const { queryByText } = render(
    <MockedProvider addTypename={false}>
      <I18nextProvider i18n={i18nForTest}>
        <UpcomingEventsCard events={eventProps} />
      </I18nextProvider>
    </MockedProvider>
  );
  await wait();
  expect(queryByText('No Upcoming Events')).toBeInTheDocument();
});
