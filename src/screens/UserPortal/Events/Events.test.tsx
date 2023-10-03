import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import { ORGANIZATION_EVENTS_CONNECTION } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Events from './Events';
import userEvent from '@testing-library/user-event';
import * as getOrganizationId from 'utils/getOrganizationId';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
  },
}));

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_EVENTS_CONNECTION,
      variables: {
        organization_id: '',
        title_contains: '',
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [
          {
            _id: '6404a267cc270739118e2349',
            title: 'NewEvent',
            description: 'sdadsasad',
            startDate: '2023-03-05',
            endDate: '2023-03-05',
            location: 'NewLocation',
            startTime: null,
            endTime: null,
            allDay: true,
            recurring: false,
            isPublic: true,
            isRegisterable: false,
            creator: {
              _id: '63d649417ffe6e4d5174ea32',
              firstName: 'Noble',
              lastName: 'Mittal',
              __typename: 'User',
            },
            attendees: [
              {
                _id: '63d649417ffe6e4d5174ea32',
                __typename: 'User',
              },
              {
                _id: '63d6064458fce20ee25c3bf7',
                __typename: 'User',
              },
            ],
            __typename: 'Event',
          },
          {
            _id: '6404e952c651df745358849d',
            title: '1parti',
            description: 'asddas',
            startDate: '2023-03-06',
            endDate: '2023-03-06',
            location: 'das',
            startTime: '00:40:00.000Z',
            endTime: '02:40:00.000Z',
            allDay: false,
            recurring: false,
            isPublic: true,
            isRegisterable: true,
            creator: {
              _id: '63d649417ffe6e4d5174ea32',
              firstName: 'Noble',
              lastName: 'Mittal',
              __typename: 'User',
            },
            attendees: [
              {
                _id: '63d649417ffe6e4d5174ea32',
                __typename: 'User',
              },
              {
                _id: '63dd52bbe69f63814b0a5dd4',
                __typename: 'User',
              },
              {
                _id: '63d6064458fce20ee25c3bf7',
                __typename: 'User',
              },
            ],
            __typename: 'Event',
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_EVENTS_CONNECTION,
      variables: {
        organization_id: '',
        title_contains: 'test',
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [
          {
            _id: '6404a267cc270739118e2349',
            title: 'NewEvent',
            description: 'sdadsasad',
            startDate: '2023-03-05',
            endDate: '2023-03-05',
            location: 'NewLocation',
            startTime: null,
            endTime: null,
            allDay: true,
            recurring: false,
            isPublic: true,
            isRegisterable: false,
            creator: {
              _id: '63d649417ffe6e4d5174ea32',
              firstName: 'Noble',
              lastName: 'Mittal',
              __typename: 'User',
            },
            attendees: [
              {
                _id: '63d649417ffe6e4d5174ea32',
                __typename: 'User',
              },
              {
                _id: '63d6064458fce20ee25c3bf7',
                __typename: 'User',
              },
            ],
            __typename: 'Event',
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        title: 'testEventTitle',
        description: 'testEventDescription',
        location: 'testEventLocation',
        isPublic: true,
        recurring: false,
        isRegisterable: true,
        organizationId: '',
        startDate: dayjs(new Date()).format('YYYY-MM-DD'),
        endDate: dayjs(new Date()).format('YYYY-MM-DD'),
        allDay: false,
        startTime: '08:00:00Z',
        endTime: '10:00:00Z',
      },
    },
    result: {
      data: {
        createEvent: {
          _id: '2',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        title: 'testEventTitle',
        description: 'testEventDescription',
        location: 'testEventLocation',
        isPublic: true,
        recurring: false,
        isRegisterable: true,
        organizationId: '',
        startDate: dayjs(new Date()).format('YYYY-MM-DD'),
        endDate: dayjs(new Date()).format('YYYY-MM-DD'),
        allDay: true,
        startTime: null,
        endTime: null,
      },
    },
    result: {
      data: {
        createEvent: {
          _id: '1',
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Events Screen [User Portal]', () => {
  jest.mock('utils/getOrganizationId');

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  test('Screen should be rendered properly', async () => {
    const getOrganizationIdSpy = jest
      .spyOn(getOrganizationId, 'default')
      .mockImplementation(() => {
        return '';
      });

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Events />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(getOrganizationIdSpy).toHaveBeenCalled();
  });

  test('Events are visible as expected without search query', async () => {
    const getOrganizationIdSpy = jest
      .spyOn(getOrganizationId, 'default')
      .mockImplementation(() => {
        return '';
      });

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Events />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    let mockEventTitle = '';
    if (MOCKS[0].result?.data.eventsByOrganizationConnection) {
      mockEventTitle =
        MOCKS[0].result?.data.eventsByOrganizationConnection[0].title;
    }

    expect(getOrganizationIdSpy).toHaveBeenCalled();
    expect(screen.queryByText(mockEventTitle)).toBeInTheDocument();
  });

  test('Search works as expected when user types in search input', async () => {
    const getOrganizationIdSpy = jest
      .spyOn(getOrganizationId, 'default')
      .mockImplementation(() => {
        return '';
      });

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Events />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(getOrganizationIdSpy).toHaveBeenCalled();

    const randomSearchInput = 'test';
    userEvent.type(screen.getByTestId('searchInput'), randomSearchInput);

    await wait();

    let mockEventTitle = '';
    if (MOCKS[0].result?.data.eventsByOrganizationConnection) {
      mockEventTitle =
        MOCKS[0].result?.data.eventsByOrganizationConnection[0].title;
    }

    let mockEventTitleAbsent = '';
    if (MOCKS[0].result?.data.eventsByOrganizationConnection) {
      mockEventTitleAbsent =
        MOCKS[0].result?.data.eventsByOrganizationConnection[1].title;
    }

    expect(screen.queryByText(mockEventTitle)).toBeInTheDocument();
    expect(screen.queryByText(mockEventTitleAbsent)).not.toBeInTheDocument();
  });

  test('Create event works as expected when event is not an all day event.', async () => {
    const getOrganizationIdSpy = jest
      .spyOn(getOrganizationId, 'default')
      .mockImplementation(() => {
        return '';
      });

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Events />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(getOrganizationIdSpy).toHaveBeenCalled();
    userEvent.click(screen.getByTestId('createEventModalBtn'));

    const randomEventTitle = 'testEventTitle';
    const randomEventDescription = 'testEventDescription';
    const randomEventLocation = 'testEventLocation';

    userEvent.type(screen.getByTestId('eventTitleInput'), randomEventTitle);
    userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      randomEventDescription
    );
    userEvent.type(
      screen.getByTestId('eventLocationInput'),
      randomEventLocation
    );

    userEvent.click(screen.getByTestId('publicEventCheck'));
    userEvent.click(screen.getByTestId('publicEventCheck'));

    userEvent.click(screen.getByTestId('registerableEventCheck'));
    userEvent.click(screen.getByTestId('registerableEventCheck'));

    userEvent.click(screen.getByTestId('recurringEventCheck'));
    userEvent.click(screen.getByTestId('recurringEventCheck'));

    userEvent.click(screen.getByTestId('recurringEventCheck'));
    userEvent.click(screen.getByTestId('recurringEventCheck'));

    userEvent.click(screen.getByTestId('allDayEventCheck'));

    userEvent.click(screen.getByTestId('createEventBtn'));

    await wait();

    expect(toast.success).toBeCalledWith(
      'Event created and posted successfully.'
    );
  });

  test('Create event works as expected when event is an all day event.', async () => {
    const getOrganizationIdSpy = jest
      .spyOn(getOrganizationId, 'default')
      .mockImplementation(() => {
        return '';
      });

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Events />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(getOrganizationIdSpy).toHaveBeenCalled();
    userEvent.click(screen.getByTestId('createEventModalBtn'));

    const randomEventTitle = 'testEventTitle';
    const randomEventDescription = 'testEventDescription';
    const randomEventLocation = 'testEventLocation';

    userEvent.type(screen.getByTestId('eventTitleInput'), randomEventTitle);
    userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      randomEventDescription
    );
    userEvent.type(
      screen.getByTestId('eventLocationInput'),
      randomEventLocation
    );

    userEvent.click(screen.getByTestId('createEventBtn'));

    await wait();

    expect(toast.success).toBeCalledWith(
      'Event created and posted successfully.'
    );
  });

  test('Switch to calendar view works as expected.', async () => {
    const getOrganizationIdSpy = jest
      .spyOn(getOrganizationId, 'default')
      .mockImplementation(() => {
        return '';
      });

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Events />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    expect(getOrganizationIdSpy).toHaveBeenCalled();

    userEvent.click(screen.getByTestId('modeChangeBtn'));
    userEvent.click(screen.getByTestId('modeBtn1'));

    await wait();
    const calenderView = 'Calendar View';

    expect(screen.queryAllByText(calenderView)).not.toBeNull();
  });
});
