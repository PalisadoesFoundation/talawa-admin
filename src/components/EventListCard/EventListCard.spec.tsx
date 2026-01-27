import React, { act } from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import type { InterfaceEvent } from 'types/Event/interface';
import EventListCard from './EventListCard';
import i18n from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import {
  AdapterDayjs,
  LocalizationProvider,
} from 'shared-components/DateRangePicker';
import dayjs from 'dayjs';
import { useLocalStorage } from 'utils/useLocalstorage';
import { props } from './EventListCardProps';
import { ERROR_MOCKS, MOCKS } from './Modal/EventListCardMocks';
import { vi, beforeAll, afterAll, afterEach, expect, it } from 'vitest';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

let setItem: ReturnType<typeof useLocalStorage>['setItem'];
let clearAllItems: ReturnType<typeof useLocalStorage>['clearAllItems'];

beforeAll(() => {
  const storage = useLocalStorage();
  setItem = storage.setItem;
  clearAllItems = storage.clearAllItems;
});

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(ERROR_MOCKS, true);

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventListCard ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const renderEventListCard = (
  props: InterfaceEvent & { refetchEvents?: () => void },
): RenderResult => {
  const { key, ...restProps } = props; // Destructure the key and separate other props

  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/admin/orgevents/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/admin/orgevents/:orgId"
                  element={<EventListCard key={key} {...restProps} />}
                />
                <Route
                  path="/admin/event/:orgId/:eventId"
                  element={<div>Event Dashboard (Admin)</div>}
                />
                <Route
                  path="/user/event/:orgId/:eventId"
                  element={<div>Event Dashboard (User)</div>}
                />
              </Routes>
            </I18nextProvider>
          </LocalizationProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Testing Event List Card', () => {
  afterEach(() => {
    vi.clearAllMocks();
    clearAllItems();
  });
  beforeAll(() => {
    vi.mock('react-router', async () => ({
      ...(await vi.importActual('react-router')),
    }));
  });

  afterAll(() => {
    clearAllItems();
  });

  it('Should navigate to "/" if orgId is not defined', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <EventListCard
              key="123"
              id="1"
              name=""
              location=""
              description=""
              startAt={dayjs().add(10, 'days').toISOString()}
              endAt={dayjs().add(17, 'days').toISOString()}
              startTime="02:00"
              endTime="06:00"
              allDay={true}
              isPublic={true}
              isRegisterable={false}
              isInviteOnly={false}
              attendees={[]}
              creator={{}}
            />
          </BrowserRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(window.location.pathname).toEqual('/');
    });
  });

  it('Should render default text if event details are null', async () => {
    renderEventListCard(props[0]);

    await waitFor(() => {
      expect(screen.getByText(translations.dogsCare)).toBeInTheDocument();
    });
  });

  it('Should navigate to event dashboard when clicked (For Admin)', async () => {
    renderEventListCard(props[4]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('showEventDashboardBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('showEventDashboardBtn'));

    await waitFor(() => {
      expect(screen.queryByTestId('card')).not.toBeInTheDocument();
      expect(screen.queryByText('Event Dashboard (Admin)')).toBeInTheDocument();
    });
  });

  it('Should navigate to event dashboard when clicked (For User)', async () => {
    setItem('userId', '123');
    renderEventListCard(props[2]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('showEventDashboardBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('showEventDashboardBtn'));

    await waitFor(() => {
      expect(screen.queryByTestId('card')).not.toBeInTheDocument();
      expect(screen.queryByText('Event Dashboard (User)')).toBeInTheDocument();
    });
  });

  it('should render the delete modal', async () => {
    renderEventListCard(props[4]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('deleteEventModalBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('deleteEventModalBtn'));

    await waitFor(() => {
      expect(
        screen.getByTestId('eventDeleteModalCloseBtn'),
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('eventDeleteModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('eventDeleteModalCloseBtn'),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('modalCloseBtn'));

    await waitFor(() => {
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument();
    });
  });

  it('should call the delete event mutation when the "Yes" button is clicked', async () => {
    renderEventListCard(props[4]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('deleteEventModalBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('deleteEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('deleteEventBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('deleteEventBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.eventDeleted,
      );
    });

    await waitFor(() => {
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument();
    });
  });

  it('should show an error toast when the delete event mutation fails', async () => {
    // Destructure key from props[1] and pass it separately to avoid spreading it
    const { key, ...otherProps } = props[4];
    render(
      <MockedProvider link={link2}>
        <MemoryRouter initialEntries={['/admin/orgevents/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/admin/orgevents/:orgId"
                    element={<EventListCard key={key} {...otherProps} />}
                  />
                  <Route
                    path="/admin/event/:orgId/:eventId"
                    element={<EventListCard key={key} {...otherProps} />}
                  />
                </Routes>
              </I18nextProvider>
            </LocalizationProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await userEvent.click(screen.getByTestId('card'));
    await userEvent.click(screen.getByTestId('deleteEventModalBtn'));
    await userEvent.click(screen.getByTestId('deleteEventBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('handle register should work properly', async () => {
    setItem('userId', '456');

    renderEventListCard(props[2]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() => {
      expect(screen.getByTestId('registerEventBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('registerEventBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        `Successfully registered for ${props[2].name}`,
      );
    });

    await waitFor(() => {
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument();
    });
  });

  it('should show already registered text when the user is registered for an event', async () => {
    setItem('userId', '456');
    renderEventListCard(props[3]);

    await userEvent.click(screen.getByTestId('card'));

    await waitFor(() =>
      expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument(),
    );

    await waitFor(() => {
      screen.getByText((text) => text.includes(translations.alreadyRegistered));
    });
  });
});
