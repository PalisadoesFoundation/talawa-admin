import React from 'react';
import {
  render,
  screen,
  waitFor,
  act,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import i18n from 'utils/i18nForTest';
// import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import EventAgendaItems from './EventAgendaItems';
import { vi } from 'vitest';
import {
  MOCKS,
  MOCKS_ERROR_QUERY,
  // MOCKS_ERROR_MUTATION,
} from './EventAgendaItemsMocks';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
}));

//temporarily fixes react-beautiful-dnd droppable method's depreciation error
//needs to be fixed in React 19
vi.spyOn(console, 'error').mockImplementation((message) => {
  if (message.includes('Support for defaultProps will be removed')) {
    return;
  }
  console.error(message);
});

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_QUERY, true);
// const link3 = new StaticMockLink(MOCKS_ERROR_MUTATION, true);

const translations = JSON.parse(
  JSON.stringify(i18n.getDataByLanguage('en')?.translation.agendaItems),
);

describe('Testing Agenda Items Components', () => {
  const formData = {
    title: 'AgendaItem 1',
    description: 'AgendaItem 1 Description',
    duration: '30',
    relatedEventId: '123',
    organizationId: '111',
    sequence: 1,
    categories: ['Category 1'],
    attachments: [],
    urls: [],
  };

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: vi.fn(),
        href: 'https://localhost:4321/event/111/123',
      },
    });
  });

  it('Component loads correctly', async () => {
    const { getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              {<EventAgendaItems eventId="123" />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(getByText(translations.createAgendaItem)).toBeInTheDocument();
    });
  });

  it('render error component on unsuccessful agenda item query', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              {<EventAgendaItems eventId="123" />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(
        queryByText(translations.createAgendaItem),
      ).not.toBeInTheDocument();
    });
  });

  it('opens and closes the create agenda item modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                {<EventAgendaItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('createAgendaItemBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createAgendaItemBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('createAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createAgendaItemModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('createAgendaItemModalCloseBtn'),
    );
  });

  it('creates new agenda item', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                {<EventAgendaItems eventId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createAgendaItemBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createAgendaItemBtn'));

    await waitFor(() => {
      expect(
        screen.getByTestId('createAgendaItemModalCloseBtn'),
      ).toBeInTheDocument();
    });

    userEvent.type(
      screen.getByPlaceholderText(translations.enterTitle),
      formData.title,
    );

    userEvent.type(
      screen.getByPlaceholderText(translations.enterDescription),
      formData.description,
    );
    userEvent.type(
      screen.getByPlaceholderText(translations.enterDuration),
      formData.duration,
    );
    const categorySelect = screen.getByTestId('categorySelect');
    userEvent.click(categorySelect);
    await waitFor(() => {
      const categoryOption = screen.getByText('Category 1');
      userEvent.click(categoryOption);
    });

    userEvent.click(screen.getByTestId('createAgendaItemFormBtn'));

    await waitFor(() => {
      // expect(toast.success).toBeCalledWith(translations.agendaItemCreated);
    });
  });
});
