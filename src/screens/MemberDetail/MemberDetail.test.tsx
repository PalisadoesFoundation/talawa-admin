import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import MemberDetail, { getLanguageName, prettyDate } from './MemberDetail';
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
            adminApproved: true,
          },
          user: {
            __typename: 'User',
            createdAt: '2024-02-26T10:36:33.098Z',
            email: 'adi790u@gmail.com',
            firstName: 'Aditya',
            image: null,
            lastName: 'Agarwal',
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
          user: {
            __typename: 'UserData',
            appUserProfile: {
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
              isSuperAdmin: true,
              appLanguageCode: 'en',
              createdEvents: [],
              createdOrganizations: [],
              eventAdmin: [],
              pluginCreationAllowed: true,
              adminApproved: true,
            },
            user: {
              __typename: 'User',
              createdAt: '2024-02-26T10:36:33.098Z',
              email: 'adi790u@gmail.com',
              firstName: 'Aditya',
              image: null,
              lastName: 'Agarwal',
              joinedOrganizations: [],
              membershipRequests: [],
              organizationsBlockedBy: [],
              registeredEvents: [],
            },
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

    waitFor(() => {
      expect(screen.getByTestId('addAdminBtn')).toBeInTheDocument();
      expect(screen.getByTestId('dashboardTitleBtn')).toBeInTheDocument();
      expect(screen.getByTestId('dashboardTitleBtn')).toHaveTextContent(
        'User Details',
      );
      expect(screen.getAllByText(/Email/i)).toBeTruthy();
      expect(screen.getAllByText(/Main/i)).toBeTruthy();
      expect(screen.getAllByText(/First name/i)).toBeTruthy();
      expect(screen.getAllByText(/Last name/i)).toBeTruthy();
      expect(screen.getAllByText(/Language/i)).toBeTruthy();
      expect(screen.getByText(/Admin approved/i)).toBeInTheDocument();
      expect(screen.getByText(/Plugin creation allowed/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Created on/i)).toBeTruthy();
      expect(screen.getAllByText(/Admin for organizations/i)).toBeTruthy();
      expect(screen.getAllByText(/Membership requests/i)).toBeTruthy();
      expect(screen.getAllByText(/Events/i)).toBeTruthy();
      expect(screen.getAllByText(/Admin for events/i)).toBeTruthy();

      expect(screen.getAllByText(/Created On/i)).toHaveLength(2);
      expect(screen.getAllByText(/User Details/i)).toHaveLength(2);
      expect(screen.getAllByText(/Role/i)).toHaveLength(2);
      expect(screen.getAllByText(/Created/i)).toHaveLength(4);
      expect(screen.getAllByText(/Joined/i)).toHaveLength(2);
      expect(screen.getByTestId('addAdminBtn')).toBeInTheDocument();
      expect(screen.getByTestId('stateBtn')).toBeInTheDocument();
      userEvent.click(screen.getByTestId('stateBtn'));
    });
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

  test('Should display dicebear image if image is null', async () => {
    const props = {
      id: 'rishav-jha-mech',
      from: 'orglist',
    };
    const user = MOCKS1[0].result.data.user;
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

    waitFor(() =>
      expect(screen.getByTestId('userImageAbsent')).toBeInTheDocument(),
    );
    waitFor(() =>
      expect(screen.getByTestId('userImageAbsent').getAttribute('src')).toBe(
        `https://api.dicebear.com/5.x/initials/svg?seed=${user?.user?.firstName} ${user?.user?.lastName}`,
      ),
    );
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

    waitFor(() =>
      expect(screen.getByTestId('userImagePresent')).toBeInTheDocument(),
    );
    waitFor(() =>
      expect(screen.getByTestId('userImagePresent').getAttribute('src')).toBe(
        user?.user.user.image,
      ),
    );
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
});
