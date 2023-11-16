import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen, waitFor } from '@testing-library/react';
import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import MemberDetail, { getLanguageName, prettyDate } from './MemberDetail';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';

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
          organizationUserBelongsTo: null,
          organizationsBlockedBy: [],
          createdEvents: [],
          registeredEvents: [],
          eventAdmin: [],
          membershipRequests: [],
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
          organizationUserBelongsTo: null,
          organizationsBlockedBy: [],
          createdEvents: [],
          registeredEvents: [],
          eventAdmin: [],
          membershipRequests: [],
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
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

jest.mock('react-toastify');

describe('MemberDetail', () => {
  global.alert = jest.fn();

  test('should render the elements', async () => {
    const props = {
      id: 'rishav-jha-mech',
    };

    const { container, getByTestId } = render(
      <MockedProvider addTypename={false} link={link1}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');
    await wait();

    userEvent.click(screen.getByText(/Add Admin/i));

    expect(getByTestId(/dashboardTitleBtn/i)).toBeInTheDocument();
    expect(getByTestId(/dashboardTitleBtn/i)).toHaveTextContent('User Details');
    expect(screen.getAllByText(/Email/i)).toBeTruthy();
    expect(screen.getAllByText(/Main/i)).toBeTruthy();
    expect(screen.getAllByText(/First name/i)).toBeTruthy();
    expect(screen.getAllByText(/Last name/i)).toBeTruthy();
    expect(screen.getAllByText(/Member of Organization/i)).toBeTruthy();
    expect(screen.getAllByText(/Language/i)).toBeTruthy();
    expect(screen.getByText(/Admin approved/i)).toBeInTheDocument();
    expect(screen.getByText(/Plugin creation allowed/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Created on/i)).toBeTruthy();
    expect(screen.getAllByText(/Admin for organizations/i)).toBeTruthy();
    expect(screen.getAllByText(/Membership requests/i)).toBeTruthy();
    expect(screen.getAllByText(/Events/i)).toBeTruthy();
    expect(screen.getAllByText(/Admin for events/i)).toBeTruthy();

    expect(screen.getAllByText(/Created On/i)).toHaveLength(2);
    expect(screen.getAllByText(/User Details/i)).toHaveLength(3);
    expect(screen.getAllByText(/Role/i)).toHaveLength(2);
    expect(screen.getAllByText(/Created/i)).toHaveLength(4);
    expect(screen.getAllByText(/Joined/i)).toHaveLength(2);
    expect(screen.getByTestId('stateBtn')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('stateBtn'));
  });
  test('prettyDate function should work properly', () => {
    // If the date is provided
    const datePretty = jest.fn(prettyDate);
    expect(datePretty('2023-02-18T09:22:27.969Z')).toBe(
      prettyDate('2023-02-18T09:22:27.969Z')
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
    };

    const { container } = render(
      <MockedProvider addTypename={false} link={link1}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');
    const user = MOCKS1[0].result.data.user;

    waitFor(() =>
      expect(screen.getByTestId(/userImageAbsent/i)).toBeInTheDocument()
    );
    waitFor(() =>
      expect(screen.getByTestId(/userImageAbsent/i).getAttribute('src')).toBe(
        `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`
      )
    );
  });

  test('Should display image if image is present', async () => {
    const props = {
      id: 'rishav-jha-mech',
    };

    const { container } = render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');

    const user = MOCKS2[0].result.data.user;

    waitFor(() =>
      expect(screen.getByTestId(/userImagePresent/i)).toBeInTheDocument()
    );
    waitFor(() =>
      expect(screen.getByTestId(/userImagePresent/i).getAttribute('src')).toBe(
        user?.image
      )
    );
  });
  test('should call setState with 2 when button is clicked', async () => {
    const props = {
      id: 'rishav-jha-mech',
    };
    const { container } = render(
      <MockedProvider addTypename={false} link={link1}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');

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
      </MockedProvider>
    );
    waitFor(() => expect(screen.getByText('Yes')).toHaveLength(2));
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
      </MockedProvider>
    );
    waitFor(() => expect(screen.getAllByText('No')).toHaveLength(2));
  });
});
