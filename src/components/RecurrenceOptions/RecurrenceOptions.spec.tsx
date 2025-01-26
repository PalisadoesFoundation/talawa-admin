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
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import OrganizationEvents from '../../screens/OrganizationEvents/OrganizationEvents';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import { createTheme } from '@mui/material';
import { ThemeProvider } from 'react-bootstrap';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MOCKS } from '../../screens/OrganizationEvents/OrganizationEventsMocks';
import { describe, test, expect, vi } from 'vitest';

const theme = createTheme({
  palette: {
    primary: {
      main: '#31bb6b',
    },
  },
});

const link = new StaticMockLink(MOCKS, true);

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

describe('Testing the creaction of recurring events through recurrence options', () => {
  const formData = {
    title: 'Dummy Org',
    description: 'This is a dummy organization',
    startDate: '03/28/2022',
    endDate: '03/30/2022',
    location: 'New Delhi',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
  };

  test('Recurrence options Dropdown shows up after checking the Recurring switch', async () => {
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

    userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('recurringCheck')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('recurrenceOptions')).not.toBeInTheDocument();

    userEvent.click(screen.getByTestId('recurringCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });
  });

  test('Showing different recurrence options through the Dropdown', async () => {
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

    userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('recurringCheck')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('recurrenceOptions')).not.toBeInTheDocument();

    userEvent.click(screen.getByTestId('recurringCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('customRecurrence')).toBeInTheDocument();
    });
  });

  test('Toggling of custom recurrence modal', async () => {
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

    userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('recurringCheck')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('recurrenceOptions')).not.toBeInTheDocument();

    userEvent.click(screen.getByTestId('recurringCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('customRecurrence')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('customRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceModalCloseBtn'),
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('customRecurrenceModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('customRecurrenceModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Selecting different recurrence options from the dropdown menu', async () => {
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

    userEvent.click(screen.getByTestId('createEventModalBtn'));

    const startDatePicker = screen.getByLabelText('Start Date');
    const endDatePicker = screen.getByLabelText('End Date');

    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });

    await waitFor(() => {
      expect(screen.getByTestId('recurringCheck')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('recurrenceOptions')).not.toBeInTheDocument();

    userEvent.click(screen.getByTestId('recurringCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('dailyRecurrence')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('dailyRecurrence'));

    userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('weeklyRecurrence')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('weeklyRecurrence'));

    userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(
        screen.getByTestId('monthlyRecurrenceOnThatDay'),
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('monthlyRecurrenceOnThatDay'));

    userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(
        screen.getByTestId('monthlyRecurrenceOnThatOccurence'),
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('monthlyRecurrenceOnThatOccurence'));

    userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(
        screen.getByTestId('monthlyRecurrenceOnLastOccurence'),
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('monthlyRecurrenceOnLastOccurence'));

    // changing the startDate would change the weekDayOccurenceInMonth, if it is defined
    fireEvent.change(startDatePicker, {
      target: { value: formData.endDate },
    });

    userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('yearlyRecurrence')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('yearlyRecurrence'));

    userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(
        screen.getByTestId('mondayToFridayRecurrence'),
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('mondayToFridayRecurrence'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toHaveTextContent(
        'Monday to Friday',
      );
    });
  }, 30000);

  test('Creating a recurring event with the daily recurrence option', async () => {
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

    userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter Title/i)).toBeInTheDocument();
    });

    userEvent.type(screen.getByPlaceholderText(/Enter Title/i), formData.title);

    userEvent.type(
      screen.getByPlaceholderText(/Enter Description/i),
      formData.description,
    );

    userEvent.type(
      screen.getByPlaceholderText(/Enter Location/i),
      formData.location,
    );

    const startDatePicker = screen.getByLabelText('Start Date');
    const endDatePicker = screen.getByLabelText('End Date');

    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });

    userEvent.click(screen.getByTestId('alldayCheck'));

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

    await waitFor(() => {
      expect(screen.getByTestId('recurringCheck')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('recurringCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('dailyRecurrence')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('dailyRecurrence'));

    expect(screen.getByPlaceholderText(/Enter Title/i)).toHaveValue(
      formData.title,
    );
    expect(screen.getByPlaceholderText(/Enter Location/i)).toHaveValue(
      formData.location,
    );
    expect(screen.getByPlaceholderText(/Enter Description/i)).toHaveValue(
      formData.description,
    );
    expect(startDatePicker).toHaveValue(formData.startDate);
    expect(endDatePicker).toHaveValue(formData.endDate);
    expect(startTimePicker).toHaveValue(formData.startTime);
    expect(endTimePicker).toHaveValue(formData.endTime);
    expect(screen.getByTestId('alldayCheck')).not.toBeChecked();
    expect(screen.getByTestId('recurringCheck')).toBeChecked();

    expect(screen.getByTestId('recurrenceOptions')).toHaveTextContent('Daily');

    userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.eventCreated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Creating a recurring event with the monday to friday recurrence option', async () => {
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

    userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter Title/i)).toBeInTheDocument();
    });

    userEvent.type(screen.getByPlaceholderText(/Enter Title/i), formData.title);

    userEvent.type(
      screen.getByPlaceholderText(/Enter Description/i),
      formData.description,
    );

    userEvent.type(
      screen.getByPlaceholderText(/Enter Location/i),
      formData.location,
    );

    const startDatePicker = screen.getByLabelText('Start Date');
    const endDatePicker = screen.getByLabelText('End Date');

    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });

    userEvent.click(screen.getByTestId('alldayCheck'));

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

    await waitFor(() => {
      expect(screen.getByTestId('recurringCheck')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('recurringCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(
        screen.getByTestId('mondayToFridayRecurrence'),
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('mondayToFridayRecurrence'));

    expect(screen.getByPlaceholderText(/Enter Title/i)).toHaveValue(
      formData.title,
    );
    expect(screen.getByPlaceholderText(/Enter Location/i)).toHaveValue(
      formData.location,
    );
    expect(screen.getByPlaceholderText(/Enter Description/i)).toHaveValue(
      formData.description,
    );
    expect(startDatePicker).toHaveValue(formData.startDate);
    expect(endDatePicker).toHaveValue(formData.endDate);
    expect(startTimePicker).toHaveValue(formData.startTime);
    expect(endTimePicker).toHaveValue(formData.endTime);
    expect(screen.getByTestId('alldayCheck')).not.toBeChecked();
    expect(screen.getByTestId('recurringCheck')).toBeChecked();

    expect(screen.getByTestId('recurrenceOptions')).toHaveTextContent(
      'Monday to Friday',
    );

    userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.eventCreated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });
});
