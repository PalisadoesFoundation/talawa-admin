import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
<<<<<<< HEAD
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
=======
import { act, render, screen, fireEvent } from '@testing-library/react';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';

import OrganizationEvents from './OrganizationEvents';
<<<<<<< HEAD
import { store } from 'state/store';
=======
import { ORGANIZATION_EVENT_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { store } from 'state/store';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import i18nForTest from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
<<<<<<< HEAD
import { createTheme } from '@mui/material';
import { ThemeProvider } from 'react-bootstrap';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MOCKS } from './OrganizationEventsMocks';

const theme = createTheme({
  palette: {
    primary: {
      main: '#31bb6b',
    },
  },
});

=======

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_EVENT_CONNECTION_LIST,
      variables: {
        organization_id: undefined,
        title_contains: '',
        description_contains: '',
        location_contains: '',
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [
          {
            _id: 1,
            title: 'Event',
            description: 'Event Test',
            startDate: '',
            endDate: '',
            location: 'New Delhi',
            startTime: '02:00',
            endTime: '06:00',
            allDay: false,
            recurring: false,
            isPublic: true,
            isRegisterable: true,
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_EVENT_CONNECTION_LIST,
      variables: {
        title_contains: '',
        description_contains: '',
        organization_id: undefined,
        location_contains: '',
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [
          {
            _id: '1',
            title: 'Dummy Org',
            description: 'This is a dummy organization',
            location: 'string',
            startDate: '',
            endDate: '',
            startTime: '02:00',
            endTime: '06:00',
            allDay: false,
            recurring: false,
            isPublic: true,
            isRegisterable: true,
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        title: 'Dummy Org',
        description: 'This is a dummy organization',
        isPublic: false,
        recurring: true,
        isRegisterable: true,
        organizationId: undefined,
        startDate: 'Thu Mar 28 20222',
        endDate: 'Fri Mar 28 20223',
        allDay: true,
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink([], true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

<<<<<<< HEAD
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

=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Organisation Events Page', () => {
  const formData = {
    title: 'Dummy Org',
    description: 'This is a dummy organization',
    startDate: '03/28/2022',
    endDate: '04/15/2023',
    location: 'New Delhi',
<<<<<<< HEAD
    startTime: '09:00 AM',
    endTime: '05:00 PM',
=======
    startTime: '02:00',
    endTime: '06:00',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  };

  global.alert = jest.fn();

  test('It is necessary to query the correct mock data.', async () => {
    const dataQuery1 = MOCKS[0]?.result?.data?.eventsByOrganizationConnection;

    expect(dataQuery1).toEqual([
      {
        _id: 1,
        title: 'Event',
        description: 'Event Test',
        startDate: '',
        endDate: '',
        location: 'New Delhi',
        startTime: '02:00',
        endTime: '06:00',
        allDay: false,
        recurring: false,
        isPublic: true,
        isRegisterable: true,
      },
    ]);
  });
  test('It is necessary to query the correct mock data for organization.', async () => {
    const dataQuery1 = MOCKS[1]?.result?.data?.eventsByOrganizationConnection;

    expect(dataQuery1).toEqual([
      {
        _id: '1',
        title: 'Dummy Org',
        description: 'This is a dummy organization',
        location: 'string',
        startDate: '',
        endDate: '',
        startTime: '02:00',
        endTime: '06:00',
        allDay: false,
        recurring: false,
        isPublic: true,
        isRegisterable: true,
      },
    ]);
  });
  test('It is necessary to check correct render', async () => {
    window.location.assign('/orglist');

    const { container } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
<<<<<<< HEAD
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
=======
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationEvents />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    expect(container.textContent).not.toBe('Loading data...');
    await wait();
<<<<<<< HEAD
    expect(container.textContent).toMatch('Month');
=======
    expect(container.textContent).toMatch('Events');
    expect(container.textContent).toMatch('Search Date');
    expect(container.textContent).toMatch('Events');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    expect(window.location).toBeAt('/orglist');
  });

  test('No mock data', async () => {
    render(
      <MockedProvider link={link2}>
        <BrowserRouter>
          <Provider store={store}>
<<<<<<< HEAD
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
=======
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationEvents />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });

  test('Testing toggling of Create event modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
<<<<<<< HEAD
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
=======
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationEvents />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

<<<<<<< HEAD
    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(
        screen.getByTestId('createEventModalCloseBtn'),
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('createEventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
=======
    userEvent.click(screen.getByTestId('createEventModalBtn'));

    userEvent.click(screen.getByTestId('createEventModalCloseBtn'));
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });

  test('Testing Create event modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
<<<<<<< HEAD
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
=======
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationEvents />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

<<<<<<< HEAD
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

    const endDatePicker = screen.getByLabelText('End Date');
    const startDatePicker = screen.getByLabelText('Start Date');

    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });
    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

=======
    userEvent.click(screen.getByTestId('createEventModalBtn'));

    userEvent.type(screen.getByPlaceholderText(/Enter Title/i), formData.title);
    userEvent.type(
      screen.getByPlaceholderText(/Enter Description/i),
      formData.description
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Location/i),
      formData.location
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Location/i),
      formData.location
    );

    const endDateDatePicker = screen.getByPlaceholderText(/End Date/i);
    const startDateDatePicker = screen.getByPlaceholderText(/Start Date/i);

    fireEvent.click(endDateDatePicker);
    fireEvent.click(startDateDatePicker);

    await act(async () => {
      fireEvent.change(endDateDatePicker, {
        target: {
          value: formData.endDate,
        },
      });
      fireEvent.change(startDateDatePicker, {
        target: {
          value: formData.startDate,
        },
      });
    });
    userEvent.click(screen.getByTestId('alldayCheck'));
    userEvent.click(screen.getByTestId('recurringCheck'));
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    userEvent.click(screen.getByTestId('ispublicCheck'));
    userEvent.click(screen.getByTestId('registrableCheck'));

    await wait();

    expect(screen.getByPlaceholderText(/Enter Title/i)).toHaveValue(
<<<<<<< HEAD
      formData.title,
    );
    expect(screen.getByPlaceholderText(/Enter Description/i)).toHaveValue(
      formData.description,
    );

    expect(endDatePicker).toHaveValue(formData.endDate);
    expect(startDatePicker).toHaveValue(formData.startDate);
=======
      formData.title
    );
    expect(screen.getByPlaceholderText(/Enter Description/i)).toHaveValue(
      formData.description
    );

    expect(endDateDatePicker).toHaveValue(formData.endDate);
    expect(startDateDatePicker).toHaveValue(formData.startDate);
    expect(screen.getByTestId('alldayCheck')).not.toBeChecked();
    expect(screen.getByTestId('recurringCheck')).toBeChecked();
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    expect(screen.getByTestId('ispublicCheck')).not.toBeChecked();
    expect(screen.getByTestId('registrableCheck')).toBeChecked();

    userEvent.click(screen.getByTestId('createEventBtn'));
<<<<<<< HEAD

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.eventCreated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });
=======
  }, 15000);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  test('Testing Create event with invalid inputs', async () => {
    const formData = {
      title: ' ',
      description: ' ',
      location: ' ',
      startDate: '03/28/2022',
      endDate: '04/15/2023',
      startTime: '02:00',
      endTime: '06:00',
      allDay: false,
      recurring: false,
      isPublic: true,
      isRegisterable: true,
    };
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
<<<<<<< HEAD
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
=======
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationEvents />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

<<<<<<< HEAD
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
    userEvent.type(
      screen.getByPlaceholderText(/Enter Location/i),
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

=======
    userEvent.click(screen.getByTestId('createEventModalBtn'));

    userEvent.type(screen.getByPlaceholderText(/Enter Title/i), formData.title);
    userEvent.type(
      screen.getByPlaceholderText(/Enter Description/i),
      formData.description
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Location/i),
      formData.location
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Location/i),
      formData.location
    );

    const endDateDatePicker = screen.getByPlaceholderText(/End Date/i);
    const startDateDatePicker = screen.getByPlaceholderText(/Start Date/i);

    fireEvent.click(endDateDatePicker);
    fireEvent.click(startDateDatePicker);

    await act(async () => {
      fireEvent.change(endDateDatePicker, {
        target: {
          value: formData.endDate,
        },
      });
      fireEvent.change(startDateDatePicker, {
        target: {
          value: formData.startDate,
        },
      });
    });
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    userEvent.click(screen.getByTestId('alldayCheck'));
    userEvent.click(screen.getByTestId('recurringCheck'));
    userEvent.click(screen.getByTestId('ispublicCheck'));
    userEvent.click(screen.getByTestId('registrableCheck'));

    await wait();

    expect(screen.getByPlaceholderText(/Enter Title/i)).toHaveValue(' ');
    expect(screen.getByPlaceholderText(/Enter Description/i)).toHaveValue(' ');

<<<<<<< HEAD
    expect(endDatePicker).toHaveValue(formData.endDate);
    expect(startDatePicker).toHaveValue(formData.startDate);
=======
    expect(endDateDatePicker).toHaveValue(formData.endDate);
    expect(startDateDatePicker).toHaveValue(formData.startDate);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    expect(screen.getByTestId('alldayCheck')).not.toBeChecked();
    expect(screen.getByTestId('recurringCheck')).toBeChecked();
    expect(screen.getByTestId('ispublicCheck')).not.toBeChecked();
    expect(screen.getByTestId('registrableCheck')).toBeChecked();

    userEvent.click(screen.getByTestId('createEventBtn'));
    expect(toast.warning).toBeCalledWith('Title can not be blank!');
    expect(toast.warning).toBeCalledWith('Description can not be blank!');
    expect(toast.warning).toBeCalledWith('Location can not be blank!');
<<<<<<< HEAD

    userEvent.click(screen.getByTestId('createEventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });
=======
  }, 15000);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  test('Testing if the event is not for all day', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
<<<<<<< HEAD
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
=======
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationEvents />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

<<<<<<< HEAD
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

    const endDatePicker = screen.getByLabelText('End Date');
    const startDatePicker = screen.getByLabelText('Start Date');

    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });
    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
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

    userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.eventCreated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
=======
    userEvent.click(screen.getByTestId('createEventModalBtn'));
    userEvent.type(screen.getByPlaceholderText(/Enter Title/i), formData.title);
    userEvent.type(
      screen.getByPlaceholderText(/Enter Description/i),
      formData.description
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Location/i),
      formData.location
    );
    userEvent.click(screen.getByTestId('alldayCheck'));
    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Start Time/i),
      formData.startTime
    );
    userEvent.type(screen.getByPlaceholderText(/End Time/i), formData.endTime);

    userEvent.click(screen.getByTestId('createEventBtn'));
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });
});
