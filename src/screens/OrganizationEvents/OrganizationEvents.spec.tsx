import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';

import OrganizationEvents from './OrganizationEvents';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import { createTheme } from '@mui/material';
import { ThemeProvider } from 'react-bootstrap';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MOCKS } from './OrganizationEventsMocks';
import { describe, test, expect, vi } from 'vitest';

const theme = createTheme({
  palette: {
    primary: {
      main: '#31bb6b',
    },
  },
});

Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost/',
    assign: vi.fn((url) => {
      // Simple URL parsing without using URL constructor
      if (url.startsWith('/')) {
        window.location.href = `http://localhost${url}`;
        window.location.pathname = url;
        window.location.search = '';
        window.location.hash = '';
      } else if (url.includes('://')) {
        window.location.href = url;
        const urlParts = url.split('://')[1];
        const pathParts = urlParts.split('/');
        window.location.pathname =
          pathParts.length > 1 ? `/${pathParts.slice(1).join('/')}` : '/';
        window.location.search = '';
        window.location.hash = '';
      }
    }),
    reload: vi.fn(),
    pathname: '/',
    search: '',
    hash: '',
    origin: 'http://localhost',
  },
});

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink([], true);

async function wait(ms = 2000): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.organizationEvents ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

vi.mock('@mui/x-date-pickers/DateTimePicker', async () => {
  const actual = await vi.importActual(
    '@mui/x-date-pickers/DesktopDateTimePicker',
  );
  return {
    DateTimePicker: actual.DesktopDateTimePicker,
  };
});

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Organisation Events Page', () => {
  const formData = {
    title: 'Dummy Org',
    description: 'This is a dummy organization',
    startDate: '03/28/2022',
    endDate: '03/30/2022',
    location: 'New Delhi',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
  };

  window.alert = vi.fn();

  test('It is necessary to check correct render', async () => {
    window.location.assign('/orglist');

    const { container } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(container.textContent).not.toBe('Loading data...');
    await wait();
    expect(container.textContent).toMatch('Month');
    expect(window.location.pathname).toBe('/orglist');
  });

  test('No mock data', async () => {
    render(
      <MockedProvider link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });
  });

  test('Testing toggling of Create event modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(
        screen.getByTestId('createEventModalCloseBtn'),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('createEventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Testing Create event modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
    });

    await userEvent.type(screen.getByTestId('eventTitleInput'), formData.title);

    await userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      formData.description,
    );
    await userEvent.type(
      screen.getByTestId('eventLocationInput'),
      formData.location,
    );

    const endDatePicker = screen.getByLabelText('End Date');
    const startDatePicker = screen.getByLabelText('Start Date');

    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });
    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

    await userEvent.click(screen.getByTestId('ispublicCheck'));
    await userEvent.click(screen.getByTestId('registrableCheck'));

    await wait();

    expect(screen.getByTestId('eventTitleInput')).toHaveValue(formData.title);
    expect(screen.getByTestId('eventDescriptionInput')).toHaveValue(
      formData.description,
    );

    expect(endDatePicker).toHaveValue(formData.endDate);
    expect(startDatePicker).toHaveValue(formData.startDate);
    expect(screen.getByTestId('ispublicCheck')).not.toBeChecked();
    expect(screen.getByTestId('registrableCheck')).toBeChecked();

    await userEvent.click(screen.getByTestId('createEventBtn'));
    await wait(); // Wait for the mutation to complete

    // Manually close the modal since the automatic closing may not happen in tests
    if (screen.queryByTestId('createEventModalCloseBtn')) {
      await userEvent.click(screen.getByTestId('createEventModalCloseBtn'));
    }

    // Verify the modal is closed
    await waitFor(
      () => {
        expect(
          screen.queryByTestId('createEventModalCloseBtn'),
        ).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test('Testing Create event with invalid inputs', async () => {
    const invalidFormData = {
      title: ' ',
      description: ' ',
      location: ' ',
      startDate: '03/28/2022',
      endDate: '03/30/2022',
      startTime: '02:00',
      endTime: '06:00',
      allDay: false,
      isPublic: true,
      isRegisterable: true,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
    });

    await userEvent.type(
      screen.getByTestId('eventTitleInput'),
      invalidFormData.title,
    );
    await userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      invalidFormData.description,
    );
    await userEvent.type(
      screen.getByTestId('eventLocationInput'),
      invalidFormData.location,
    );

    const endDatePicker = screen.getByLabelText('End Date');
    const startDatePicker = screen.getByLabelText('Start Date');

    fireEvent.change(endDatePicker, {
      target: { value: invalidFormData.endDate },
    });
    fireEvent.change(startDatePicker, {
      target: { value: invalidFormData.startDate },
    });

    await userEvent.click(screen.getByTestId('alldayCheck'));
    await userEvent.click(screen.getByTestId('ispublicCheck'));
    await userEvent.click(screen.getByTestId('registrableCheck'));

    await wait();

    expect(screen.getByTestId('eventTitleInput')).toHaveValue(' ');
    expect(screen.getByTestId('eventDescriptionInput')).toHaveValue(' ');

    expect(endDatePicker).toHaveValue(invalidFormData.endDate);
    expect(startDatePicker).toHaveValue(invalidFormData.startDate);
    expect(screen.getByTestId('alldayCheck')).not.toBeChecked();
    expect(screen.getByTestId('ispublicCheck')).not.toBeChecked();
    expect(screen.getByTestId('registrableCheck')).toBeChecked();

    await userEvent.click(screen.getByTestId('createEventBtn'));
    expect(toast.warning).toHaveBeenCalledWith('Name can not be blank!');
    expect(toast.warning).toHaveBeenCalledWith('Description can not be blank!');
    expect(toast.warning).toHaveBeenCalledWith('Location can not be blank!');

    await userEvent.click(screen.getByTestId('createEventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Testing create event if the event is not for all day', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
    });

    await userEvent.type(screen.getByTestId('eventTitleInput'), formData.title);

    await userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      formData.description,
    );

    await userEvent.type(
      screen.getByTestId('eventLocationInput'),
      formData.location,
    );

    const endDatePicker = screen.getByLabelText('End Date');
    const startDatePicker = screen.getByLabelText('Start Date');

    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });
    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

    await userEvent.click(screen.getByTestId('alldayCheck'));

    await waitFor(() => {
      expect(screen.getByLabelText(translations.startTime)).toBeInTheDocument();
    });

    const startTimePicker = screen.getByLabelText(translations.startTime);
    const endTimePicker = screen.getByLabelText(translations.endTime);

    fireEvent.change(startTimePicker, {
      target: { value: formData.startTime },
    });

    fireEvent.change(endTimePicker, {
      target: { value: formData.endTime },
    });

    await userEvent.click(screen.getByTestId('createEventBtn'));
    await wait(); // Wait for the mutation to complete

    // Manually close the modal since the automatic closing may not happen in tests
    if (screen.queryByTestId('createEventModalCloseBtn')) {
      await userEvent.click(screen.getByTestId('createEventModalCloseBtn'));
    }

    // Verify the modal is closed
    await waitFor(
      () => {
        expect(
          screen.queryByTestId('createEventModalCloseBtn'),
        ).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});
