import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import {
  ADD_ADMIN_MUTATION,
  UPDATE_USERTYPE_MUTATION,
  UPDATE_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import MemberDetail, { getLanguageName, prettyDate } from './MemberDetail';
import { toast } from 'react-toastify';

const MOCKS = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        user: {
          __typename: 'User',
          image: null,
          firstName: '',
          lastName: '',
          email: '',
          role: 'SUPERADMIN',
          appLanguageCode: 'en',
          userType: 'SUPERADMIN',
          pluginCreationAllowed: true,
          adminApproved: true,
          createdAt: '2023-02-18T09:22:27.969Z',
          adminFor: [],
          createdOrganizations: [],
          joinedOrganizations: [],
          organizationsBlockedBy: [],
          createdEvents: [],
          registeredEvents: [],
          eventAdmin: [],
          membershipRequests: [],
          gender: '',
          birthDate: '',
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
            home: '',
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_MUTATION,
      variable: {
        firstName: '',
        lastName: '',
        email: '',
      },
    },
    result: {
      data: {
        users: [
          {
            _id: '1',
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

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
          __typename: 'User',
          image: null,
          firstName: 'Rishav',
          lastName: 'Jha',
          email: 'ris@gmail.com',
          role: 'SUPERADMIN',
          appLanguageCode: 'en',
          userType: 'SUPERADMIN',
          pluginCreationAllowed: true,
          adminApproved: true,
          createdAt: '2023-02-18T09:22:27.969Z',
          adminFor: [],
          createdOrganizations: [],
          joinedOrganizations: [],
          organizationsBlockedBy: [],
          createdEvents: [],
          registeredEvents: [],
          eventAdmin: [],
          membershipRequests: [],
          gender: 'MALE',
          birthDate: '2023-02-18T09:22:27.969Z',
          educationGrade: 'GRADE_A',
          employmentStatus: 'EMPLOYED',
          maritalStatus: 'SINGLE',
          address: {
            line1: 'abc',
            countryCode: 'IN',
            city: 'abc',
            state: 'abc',
          },
          phone: {
            home: '1234567890',
          },
        },
      },
    },
  },
  {
    request: {
      query: ADD_ADMIN_MUTATION,
      variables: {
        userid: '123',
        orgid: '456',
      },
    },
    result: {
      data: {
        success: true,
      },
    },
  },
  {
    request: {
      query: UPDATE_USERTYPE_MUTATION,
      variables: {
        id: '123',
        userType: 'Admin',
      },
    },
    result: {
      data: {
        success: true,
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
          __typename: 'User',
          image: 'https://placeholder.com/200x200',
          firstName: 'Rishav',
          lastName: 'Jha',
          email: 'ris@gmail.com',
          role: 'SUPERADMIN',
          appLanguageCode: 'en',
          userType: 'SUPERADMIN',
          pluginCreationAllowed: false,
          adminApproved: false,
          createdAt: '2023-02-18T09:22:27.969Z',
          adminFor: [],
          createdOrganizations: [],
          joinedOrganizations: [],
          organizationsBlockedBy: [],
          createdEvents: [],
          registeredEvents: [],
          eventAdmin: [],
          membershipRequests: [],
          gender: 'MALE',
          birthDate: '2023-02-18T09:22:27.969Z',
          educationGrade: 'GRADE_A',
          employmentStatus: 'EMPLOYED',
          maritalStatus: 'SINGLE',
          address: {
            line1: 'abc',
            countryCode: 'IN',
            city: 'abc',
            state: 'abc',
          },
          phone: {
            home: '1234567890',
          },
        },
      },
    },
  },
  {
    request: {
      query: ADD_ADMIN_MUTATION,
      variables: {
        userid: '123',
        orgid: '456',
      },
    },
    result: {
      data: {
        success: true,
      },
    },
  },
];

const link1 = new StaticMockLink(MOCKS1, true);
const link2 = new StaticMockLink(MOCKS2, true);

async function wait(ms = 2): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

jest.mock('react-toastify');

describe('MemberDetail', () => {
  global.alert = jest.fn();

  test('should render the elements', async () => {
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
    await wait();
    expect(screen.getAllByText(/Email/i)).toBeTruthy();
    expect(screen.getAllByText(/First name/i)).toBeTruthy();
    expect(screen.getAllByText(/Last name/i)).toBeTruthy();
    expect(screen.getAllByText(/Language/i)).toBeTruthy();
    expect(screen.getByText(/Admin approved/i)).toBeInTheDocument();
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
      key: '123',
      id: '1',
      toggleStateValue: jest.fn(),
    };

    const formData = {
      firstName: 'Ansh',
      lastName: 'Goyal',
      email: 'ansh@gmail.com',
      image: new File(['hello'], 'hello.png', { type: 'image/png' }),
    };
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <BrowserRouter>
            <MemberDetail {...props} />
          </BrowserRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Last Name/i),
      formData.lastName,
    );
    userEvent.type(screen.getByPlaceholderText(/Email/i), formData.email);
    // userEvent.click(screen.getByTestId('gender-dropdown-btn'));
    // userEvent.click(screen.getByTestId('change-gender-btn-FEMALE'));
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
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <BrowserRouter>
            <MemberDetail {...props} />
          </BrowserRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(toast.warning).toHaveBeenCalledWith('First Name cannot be blank!');
    expect(toast.warning).toHaveBeenCalledWith('Last Name cannot be blank!');
    expect(toast.warning).toHaveBeenCalledWith('Email cannot be blank!');
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

    const user = MOCKS2[0].result.data.user;
    const userImage = await screen.findByTestId('userImagePresent');
    expect(userImage).toBeInTheDocument();
    expect(userImage.getAttribute('src')).toBe(user?.image);
  });

  test('should call setState with 2 when button is clicked', async () => {
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

    waitFor(() => userEvent.click(screen.getByText(/Edit Profile/i)));
  });

  test('should show Yes if plugin creation is allowed and admin approved', async () => {
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
    waitFor(() =>
      expect(screen.getByTestId('adminApproved')).toHaveTextContent('Yes'),
    );
  });

  test('should show No if plugin creation is not allowed and not admin approved', async () => {
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

    waitFor(() => {
      expect(screen.getByTestId('adminApproved')).toHaveTextContent('No');
    });
  });
  test('should be redirected to / if member id is undefined', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
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
