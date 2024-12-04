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
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';

import OrganizationEvents from '../../screens/OrganizationEvents/OrganizationEvents';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import { createTheme } from '@mui/material';
import { ThemeProvider } from 'react-bootstrap';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MOCKS } from '../../screens/OrganizationEvents/OrganizationEventsMocks';

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

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationEvents,
  ),
);

jest.mock('@mui/x-date-pickers/DateTimePicker', () => {
  return {
    DateTimePicker: jest.requireActual(
      '@mui/x-date-pickers/DesktopDateTimePicker',
    ).DesktopDateTimePicker,
  };
});

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Testing the creaction of recurring events with custom recurrence patterns', () => {
  const formData = {
    title: 'Dummy Org',
    description: 'This is a dummy organization',
    startDate: '03/28/2022',
    endDate: '03/30/2022',
    recurrenceEndDate: '04/15/2023',
    location: 'New Delhi',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
  };

  test('Changing the recurrence frequency', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
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
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));

    await waitFor(() => {
      expect(screen.getByTestId('customDailyRecurrence')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('customDailyRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toHaveTextContent('Day');
    });

    userEvent.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));

    await waitFor(() => {
      expect(screen.getByTestId('customWeeklyRecurrence')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('customWeeklyRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toHaveTextContent('Week');
    });

    userEvent.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));

    await waitFor(() => {
      expect(screen.getByTestId('customMonthlyRecurrence')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('customMonthlyRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toHaveTextContent('Month');
    });

    userEvent.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));

    await waitFor(() => {
      expect(screen.getByTestId('customYearlyRecurrence')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('customYearlyRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toHaveTextContent('Year');
    });

    userEvent.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('customRecurrenceSubmitBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Selecting and unselecting recurrence weekdays', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
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

    const user = userEvent.setup();

    await user.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('recurringCheck')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('recurrenceOptions')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('recurringCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('customRecurrence')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('customRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceSubmitBtn'),
      ).toBeInTheDocument();
    });

    const weekDaysOptions = screen.getAllByTestId('recurrenceWeekDay');

    weekDaysOptions.forEach(async (weekDay) => {
      await user.click(weekDay);
    });

    weekDaysOptions.forEach(async (weekDay) => {
      await user.click(weekDay);
    });

    await user.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('customRecurrenceSubmitBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Selecting different monthly recurrence options from the dropdown menu', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
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

    const user = userEvent.setup();

    await user.click(screen.getByTestId('createEventModalBtn'));

    const startDatePicker = screen.getByLabelText('Start Date');
    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

    const endDatePicker = screen.getByLabelText('End Date');
    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });

    await waitFor(() => {
      expect(screen.getByTestId('recurringCheck')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('recurrenceOptions')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('recurringCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('customRecurrence')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('customRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));

    await waitFor(() => {
      expect(screen.getByTestId('customMonthlyRecurrence')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('customMonthlyRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toHaveTextContent('Month');
    });

    await waitFor(() => {
      expect(screen.getByTestId('monthlyRecurrenceOptions')).toHaveTextContent(
        'Monthly on Day 28',
      );
    });

    await user.click(screen.getByTestId('monthlyRecurrenceOptions'));

    await waitFor(() => {
      expect(
        screen.getByTestId('monthlyRecurrenceOptionOnThatOccurence'),
      ).toBeInTheDocument();
    });
    await user.click(
      screen.getByTestId('monthlyRecurrenceOptionOnThatOccurence'),
    );

    await waitFor(() => {
      expect(screen.getByTestId('monthlyRecurrenceOptions')).toHaveTextContent(
        'Monthly on Fourth Monday',
      );
    });

    await user.click(screen.getByTestId('monthlyRecurrenceOptions'));

    await waitFor(() => {
      expect(
        screen.getByTestId('monthlyRecurrenceOptionOnLastOccurence'),
      ).toBeInTheDocument();
    });
    await user.click(
      screen.getByTestId('monthlyRecurrenceOptionOnLastOccurence'),
    );

    await waitFor(() => {
      expect(screen.getByTestId('monthlyRecurrenceOptions')).toHaveTextContent(
        'Monthly on Last Monday',
      );
    });

    await user.click(screen.getByTestId('monthlyRecurrenceOptions'));

    await waitFor(() => {
      expect(
        screen.getByTestId('monthlyRecurrenceOptionOnThatDay'),
      ).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('monthlyRecurrenceOptionOnThatDay'));

    await waitFor(() => {
      expect(screen.getByTestId('monthlyRecurrenceOptions')).toHaveTextContent(
        'Monthly on Day 28',
      );
    });
  });

  test('Selecting the "Ends on" option for specifying the end of recurrence', async () => {
    //  i.e. when would the recurring event end: never, on a certain date, or after a certain number of occurences
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
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

    const user = userEvent.setup();

    await user.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('recurringCheck')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('recurrenceOptions')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('recurringCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('customRecurrence')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('customRecurrence'));

    await waitFor(() => {
      expect(screen.getByTestId('never')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('never'));
    await user.click(screen.getByTestId('on'));
    await user.click(screen.getByTestId('after'));
    await user.click(screen.getByTestId('never'));

    await user.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('customRecurrenceSubmitBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Creating a bi monthly recurring event through custom recurrence modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
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

    const user = userEvent.setup();

    await user.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter Title/i)).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText(/Enter Title/i),
      formData.title,
    );

    await user.type(
      screen.getByPlaceholderText(/Enter Description/i),
      formData.description,
    );

    await user.type(
      screen.getByPlaceholderText(/Enter Location/i),
      formData.location,
    );

    const startDatePicker = screen.getByLabelText('Start Date');
    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

    const eventEndDatePicker = screen.getByLabelText('End Date');
    fireEvent.change(eventEndDatePicker, {
      target: { value: formData.endDate },
    });

    await user.click(screen.getByTestId('recurringCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('customRecurrence')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('customRecurrence'));

    await user.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));

    await waitFor(() => {
      expect(screen.getByTestId('customMonthlyRecurrence')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('customMonthlyRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toHaveTextContent('Month');
    });

    await user.click(screen.getByTestId('monthlyRecurrenceOptions'));

    await waitFor(() => {
      expect(
        screen.getByTestId('monthlyRecurrenceOptionOnThatOccurence'),
      ).toBeInTheDocument();
    });
    await user.click(
      screen.getByTestId('monthlyRecurrenceOptionOnThatOccurence'),
    );

    await waitFor(() => {
      expect(screen.getByTestId('on')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('on'));

    await waitFor(() => {
      expect(screen.getByTestId('on')).toBeChecked();
    });

    await waitFor(() => {
      expect(screen.getAllByLabelText('End Date')[1]).toBeEnabled();
    });

    const recurrenceEndDatePicker = screen.getAllByLabelText('End Date')[1];
    fireEvent.change(recurrenceEndDatePicker, {
      target: { value: formData.recurrenceEndDate },
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceIntervalInput'),
      ).toBeInTheDocument();
    });

    const recurrenceCount = screen.getByTestId('customRecurrenceIntervalInput');
    fireEvent.change(recurrenceCount, {
      target: { value: 2 },
    });

    await user.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('customRecurrenceSubmitBtn'),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('recurrenceOptions')).toHaveTextContent(
      'Every 2 months on Fourth Monday, until April...',
      // "..." because of the overlay component that would trim the recurrence rule text at 45 characters
    );

    await user.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.eventCreated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Creating a daily recurring event with a certain number of occurences', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
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

    const user = userEvent.setup();

    await user.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter Title/i)).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText(/Enter Title/i),
      formData.title,
    );

    await user.type(
      screen.getByPlaceholderText(/Enter Description/i),
      formData.description,
    );

    await user.type(
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

    await user.click(screen.getByTestId('recurringCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOptions')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('recurrenceOptions'));

    await waitFor(() => {
      expect(screen.getByTestId('customRecurrence')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('customRecurrence'));

    await user.click(screen.getByTestId('customRecurrenceFrequencyDropdown'));

    await waitFor(() => {
      expect(screen.getByTestId('customDailyRecurrence')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('customDailyRecurrence'));

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceFrequencyDropdown'),
      ).toHaveTextContent('Day');
    });

    await waitFor(() => {
      expect(screen.getByTestId('after')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('after'));

    await waitFor(() => {
      expect(screen.getByTestId('after')).toBeChecked();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('customRecurrenceCountInput'),
      ).toBeInTheDocument();
    });

    const recurrenceCount = screen.getByTestId('customRecurrenceCountInput');
    fireEvent.change(recurrenceCount, {
      target: { value: 100 },
    });

    await waitFor(() => {
      expect(screen.getByTestId('customRecurrenceCountInput')).toHaveValue(100);
    });

    await user.click(screen.getByTestId('customRecurrenceSubmitBtn'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('customRecurrenceSubmitBtn'),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('recurrenceOptions')).toHaveTextContent(
      'Daily, 100 times',
    );

    await user.click(screen.getByTestId('createEventBtn'));

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
