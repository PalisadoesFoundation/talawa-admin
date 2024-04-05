import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import type { InterfaceEventListCardProps } from './EventListCard';
import EventListCard from './EventListCard';
import {
  DELETE_EVENT_MUTATION,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';

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

const ERROR_MOCKS = [
  {
    request: {
      query: DELETE_EVENT_MUTATION,
      variables: {
        id: '1',
      },
    },
    error: new Error('Something went wrong'),
  },
];
const link2 = new StaticMockLink(ERROR_MOCKS, true);

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const props: InterfaceEventListCardProps[] = [
  {
    key: '',
    id: '',
    eventLocation: '',
    eventName: '',
    eventDescription: '',
    regDate: '',
    regEndDate: '',
    startTime: '',
    endTime: '',
    allDay: false,
    recurring: false,
    isPublic: false,
    isRegisterable: false,
  },
  {
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
  },
];

const renderEventListCard = (
  props: InterfaceEventListCardProps,
): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgevents/orgId']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route
                path="/orgevents/:orgId"
                element={<EventListCard {...props} />}
              />
              <Route
                path="/event/:orgId/"
                element={<EventListCard {...props} />}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Testing Event List Card', () => {
  beforeAll(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId' }),
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('Testing for modal', async () => {
    renderEventListCard(props[0]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('showEventDashboardBtn'));
    userEvent.click(screen.getByTestId('createEventModalCloseBtn'));
  });

  test('Should render text elements when props value is not passed', async () => {
    global.confirm = (): boolean => false;

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <BrowserRouter>
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
          </BrowserRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    expect(screen.queryByText(props[1].eventName)).not.toBeInTheDocument();
  });

  test('Testing for update modal', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('editEventModalBtn'));
    userEvent.click(screen.getByTestId('EventUpdateModalCloseBtn'));
    userEvent.click(screen.getByTestId('createEventModalCloseBtn'));
  });

  test('Testing event update functionality', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('editEventModalBtn'));
    userEvent.type(screen.getByTestId('updateTitle'), props[1].eventName);
    userEvent.type(
      screen.getByTestId('updateDescription'),
      props[1].eventDescription,
    );
    userEvent.type(
      screen.getByTestId('updateLocation'),
      props[1].eventLocation,
    );
    userEvent.click(screen.getByTestId('updateAllDay'));
    userEvent.click(screen.getByTestId('updateRecurring'));
    userEvent.click(screen.getByTestId('updateIsPublic'));
    userEvent.click(screen.getByTestId('updateRegistrable'));

    userEvent.click(screen.getByTestId('updatePostBtn'));
  });

  test('should render props and text  elements test for the screen', async () => {
    const { container } = renderEventListCard(props[1]);

    expect(container.textContent).not.toBe('Loading data...');
  });

  test('Testing if the event is not for all day', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('editEventModalBtn'));
    userEvent.type(screen.getByTestId('updateTitle'), props[1].eventName);
    userEvent.type(
      screen.getByTestId('updateDescription'),
      props[1].eventDescription,
    );
    userEvent.type(
      screen.getByTestId('updateLocation'),
      props[1].eventLocation,
    );
    userEvent.click(screen.getByTestId('updateAllDay'));

    userEvent.type(
      screen.getByTestId('updateStartTime'),
      props[1].startTime ?? '',
    );
    userEvent.type(screen.getByTestId('updateEndTime'), props[1].endTime ?? '');
    userEvent.click(screen.getByTestId('updatePostBtn'));
  });

  test('Testing event preview modal', async () => {
    renderEventListCard(props[1]);
    expect(screen.getByText(props[1].eventName)).toBeInTheDocument();
  });

  test('should render the delete modal', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('deleteEventModalBtn'));

    userEvent.click(screen.getByTestId('EventDeleteModalCloseBtn'));
    userEvent.click(screen.getByTestId('createEventModalCloseBtn'));
  });

  test('should call the delete event mutation when the "Yes" button is clicked', async () => {
    renderEventListCard(props[1]);

    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('deleteEventModalBtn'));
    const deleteBtn = screen.getByTestId('deleteEventBtn');
    fireEvent.click(deleteBtn);
  });

  test('should show an error toast when the delete event mutation fails', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <MemoryRouter initialEntries={['/orgevents/orgId']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgevents/:orgId"
                  element={<EventListCard {...props[1]} />}
                />
                <Route
                  path="/event/:orgId/"
                  element={<EventListCard {...props[1]} />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    userEvent.click(screen.getByTestId('card'));
    userEvent.click(screen.getByTestId('deleteEventModalBtn'));
    const deleteBtn = screen.getByTestId('deleteEventBtn');
    fireEvent.click(deleteBtn);
  });

  test('Should render truncated event details', async () => {
    const longEventName =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. A very long event name that exceeds 150 characters and needs to be truncated';
    const longDescription =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. A very long description that exceeds 150 characters and needs to be truncated';
    const longEventNameLength = longEventName.length;
    const longDescriptionLength = longDescription.length;
    const truncatedEventName = longEventName.substring(0, 150) + '...';
    const truncatedDescriptionName = longDescription.substring(0, 150) + '...';
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <BrowserRouter>
            <EventListCard
              key="123"
              id="1"
              eventName={longEventName}
              eventLocation="location"
              eventDescription={longDescription}
              regDate="19/03/2022"
              regEndDate="26/03/2022"
              startTime="02:00"
              endTime="06:00"
              allDay={true}
              recurring={false}
              isPublic={true}
              isRegisterable={false}
            />
          </BrowserRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    expect(longEventNameLength).toBeGreaterThan(100);
    expect(longDescriptionLength).toBeGreaterThan(256);
    expect(truncatedEventName).toContain('...');
    expect(truncatedDescriptionName).toContain('...');
    await wait();
  });
});
