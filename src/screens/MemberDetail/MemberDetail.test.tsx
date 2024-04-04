import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import MemberDetail, { getLanguageName, prettyDate } from './MemberDetail';
import { toast } from 'react-toastify';

const MOCKS1 = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: 'rishav-jha-mech',
      },
    },
    result: {
      data: {
        user: {
          __typename: 'UserData',
          appUserProfile: {
            _id: '1',
            __typename: 'AppUserProfile',
            adminFor: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            isSuperAdmin: false,
            appLanguageCode: 'en',
            createdEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            createdOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            eventAdmin: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            pluginCreationAllowed: true,
          },
          user: {
            _id: '1',
            __typename: 'User',
            createdAt: '2024-02-26T10:36:33.098Z',
            email: 'adi790u@gmail.com',
            firstName: 'Aditya',
            image: null,
            lastName: 'Agarwal',
            gender: '',
            birthDate: '2024-03-14',
            educationGrade: '',
            employmentStatus: '',
            maritalStatus: '',
            address: {
              line1: '',
              countryCode: '',
              city: '',
              state: '',
            },
            phone: {
              mobile: '',
            },
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            membershipRequests: [],
            organizationsBlockedBy: [],
            registeredEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
          },
        },
      },
    },
  },
];

const MOCKS2 = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: 'rishav-jha-mech',
      },
    },
    result: {
      data: {
        user: {
          __typename: 'UserData',
          appUserProfile: {
            _id: '1',
            __typename: 'AppUserProfile',
            adminFor: [],
            isSuperAdmin: false,
            appLanguageCode: 'en',
            createdEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            createdOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            eventAdmin: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            pluginCreationAllowed: true,
          },
          user: {
            _id: '1',
            __typename: 'User',
            createdAt: '2024-02-26T10:36:33.098Z',
            email: 'adi790u@gmail.com',
            firstName: 'Aditya',
            image: 'https://placeholder.com/200x200',
            lastName: 'Agarwal',
            gender: '',
            birthDate: '2024-03-14',
            educationGrade: '',
            employmentStatus: '',
            maritalStatus: '',
            address: {
              line1: '',
              countryCode: '',
              city: '',
              state: '',
            },
            phone: {
              mobile: '',
            },
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            membershipRequests: [],
            organizationsBlockedBy: [],
            registeredEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
          },
        },
      },
    },
  },
];
const MOCKS3 = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: 'rishav-jha-mech',
      },
    },
    result: {
      data: {
        user: {
          __typename: 'UserData',
          appUserProfile: {
            _id: '1',
            __typename: 'AppUserProfile',
            adminFor: [],
            isSuperAdmin: true,
            appLanguageCode: 'en',
            createdEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            createdOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            eventAdmin: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
            pluginCreationAllowed: true,
          },
          user: {
            _id: '1',
            __typename: 'User',
            createdAt: '2024-02-26T10:36:33.098Z',
            email: 'adi790u@gmail.com',
            firstName: 'Aditya',
            image: 'https://placeholder.com/200x200',
            lastName: 'Agarwal',
            gender: '',
            birthDate: '2024-03-14',
            educationGrade: '',
            employmentStatus: '',
            maritalStatus: '',
            address: {
              line1: '',
              countryCode: '',
              city: '',
              state: '',
            },
            phone: {
              mobile: '',
            },
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '65e0df0906dd1228350cfd4a',
              },
              {
                __typename: 'Organization',
                _id: '65e0e2abb92c9f3e29503d4e',
              },
            ],
            membershipRequests: [],
            organizationsBlockedBy: [],
            registeredEvents: [
              {
                __typename: 'Event',
                _id: '65e32a5b2a1f4288ca1f086a',
              },
            ],
          },
        },
      },
    },
  },
];

const link1 = new StaticMockLink(MOCKS1, true);
const link2 = new StaticMockLink(MOCKS2, true);
const link3 = new StaticMockLink(MOCKS3, true);

async function wait(ms = 20): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

jest.mock('@mui/x-date-pickers/DateTimePicker', () => {
  return {
    DateTimePicker: jest.requireActual(
      '@mui/x-date-pickers/DesktopDateTimePicker',
    ).DesktopDateTimePicker,
  };
});

jest.mock('react-toastify');

describe('MemberDetail', () => {
  global.alert = jest.fn();

  test('should render the elements', async () => {
    const props = {
      id: 'rishav-jha-mech',
    };

    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    await wait();
    expect(screen.getAllByText(/Email/i)).toBeTruthy();
    expect(screen.getAllByText(/First name/i)).toBeTruthy();
    expect(screen.getAllByText(/Last name/i)).toBeTruthy();
    expect(screen.getAllByText(/Language/i)).toBeTruthy();
    expect(screen.getByText(/Plugin creation allowed/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Joined on/i)).toBeTruthy();
    expect(screen.getAllByText(/Joined On/i)).toHaveLength(1);
    expect(screen.getAllByText(/Personal Information/i)).toHaveLength(1);
    expect(screen.getAllByText(/Profile Details/i)).toHaveLength(1);
    expect(screen.getAllByText(/Actions/i)).toHaveLength(1);
    expect(screen.getAllByText(/Contact Information/i)).toHaveLength(1);
  });

  test('prettyDate function should work properly', () => {
    // If the date is provided
    const datePretty = jest.fn(prettyDate);
    expect(datePretty('2023-02-18T09:22:27.969Z')).toBe(
      prettyDate('2023-02-18T09:22:27.969Z'),
    );
    // If there's some error in formatting the date
    expect(datePretty('')).toBe('Unavailable');
  });

  test('getLanguageName function should work properly', () => {
    const getLangName = jest.fn(getLanguageName);
    // If the language code is provided
    expect(getLangName('en')).toBe('English');
    // If the language code is not provided
    expect(getLangName('')).toBe('Unavailable');
  });

  test('should render props and text elements test for the page component', async () => {
    const props = {
      id: '1',
    };

    const formData = {
      firstName: 'Ansh',
      lastName: 'Goyal',
      email: 'ansh@gmail.com',
      image: new File(['hello'], 'hello.png', { type: 'image/png' }),
      address: 'abc',
      countryCode: 'IN',
      state: 'abc',
      city: 'abc',
      phoneNumber: '1234567890',
      birthDate: '03/28/2022',
    };
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    await wait();
    expect(screen.getAllByText(/Email/i)).toBeTruthy();
    expect(screen.getByText('User')).toBeInTheDocument();
    const birthDateDatePicker = screen.getByTestId('birthDate');
    fireEvent.change(birthDateDatePicker, {
      target: { value: formData.birthDate },
    });

    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Last Name/i),
      formData.lastName,
    );
    userEvent.type(screen.getByPlaceholderText(/Address/i), formData.address);
    userEvent.type(
      screen.getByPlaceholderText(/Country Code/i),
      formData.countryCode,
    );
    userEvent.type(screen.getByPlaceholderText(/State/i), formData.state);
    userEvent.type(screen.getByPlaceholderText(/City/i), formData.city);
    userEvent.type(screen.getByPlaceholderText(/Email/i), formData.email);
    userEvent.type(screen.getByPlaceholderText(/Phone/i), formData.phoneNumber);
    userEvent.click(screen.getByPlaceholderText(/pluginCreationAllowed/i));
    userEvent.selectOptions(screen.getByTestId('applangcode'), 'Français');
    userEvent.upload(screen.getByLabelText(/Display Image:/i), formData.image);
    await wait();

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByPlaceholderText(/First Name/i)).toHaveValue(
      formData.firstName,
    );
    expect(screen.getByPlaceholderText(/Last Name/i)).toHaveValue(
      formData.lastName,
    );
    expect(birthDateDatePicker).toHaveValue(formData.birthDate);
    expect(screen.getByPlaceholderText(/Email/i)).toHaveValue(formData.email);
    expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Display Image/i)).toBeInTheDocument();
  });

  test('should display warnings for blank form submission', async () => {
    jest.spyOn(toast, 'warning');
    const props = {
      key: '123',
      id: '1',
      toggleStateValue: jest.fn(),
    };

    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(toast.warning).toHaveBeenCalledWith('First Name cannot be blank!');
    expect(toast.warning).toHaveBeenCalledWith('Last Name cannot be blank!');
    expect(toast.warning).toHaveBeenCalledWith('Email cannot be blank!');
  });
  test('display admin', async () => {
    const props = {
      id: 'rishav-jha-mech',
    };

    render(
      <MockedProvider addTypename={false} link={link1}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    await wait();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
  test('display super admin', async () => {
    const props = {
      id: 'rishav-jha-mech',
    };

    render(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    await wait();
    expect(screen.getByText('Super Admin')).toBeInTheDocument();
  });

  test('Should display dicebear image if image is null', async () => {
    const props = {
      id: 'rishav-jha-mech',
      from: 'orglist',
    };

    render(
      <MockedProvider addTypename={false} link={link1}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();

    const dicebearUrl = `mocked-data-uri`;

    const userImage = await screen.findByTestId('userImageAbsent');
    expect(userImage).toBeInTheDocument();
    expect(userImage.getAttribute('src')).toBe(dicebearUrl);
  });

  test('Should display image if image is present', async () => {
    const props = {
      id: 'rishav-jha-mech',
      from: 'orglist',
    };

    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();

    const user = MOCKS2[0].result?.data?.user?.user;
    const userImage = await screen.findByTestId('userImagePresent');
    expect(userImage).toBeInTheDocument();
    expect(userImage.getAttribute('src')).toBe(user?.image);
  });

  test('should call setState with 2 when button is clicked', async () => {
    const props = {
      id: 'rishav-jha-mech',
    };
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();

    waitFor(() => userEvent.click(screen.getByText(/Edit Profile/i)));
  });

  test('should be redirected to / if member id is undefined', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(window.location.pathname).toEqual('/');
  });
});
