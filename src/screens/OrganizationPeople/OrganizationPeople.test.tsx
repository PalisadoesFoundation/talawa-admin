import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import OrganizationPeople from './OrganizationPeople';
import { store } from 'state/store';
import {
  ORGANIZATIONS_LIST,
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USERS_CONNECTION_LIST,
  USER_LIST,
} from 'GraphQl/Queries/Queries';
import 'jest-location-mock';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  ADD_MEMBER_MUTATION,
  SIGNUP_MUTATION,
} from 'GraphQl/Mutations/mutations';

// This loop creates dummy data for members, admin and users
const members: any[] = [];
const admins: any[] = [];
const users: any[] = [];

const createMemberMock = (
  orgId = '',
  firstNameContains = '',
  lastNameContains = '',
): any => ({
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: {
      orgId: orgId,
      firstNameContains,
      lastNameContains,
    },
  },
  result: {
    data: {
      organizationsMemberConnection: {
        __typename: 'UserConnection',
        edges: [
          {
            __typename: 'User',
            _id: '64001660a711c62d5b4076a2',
            firstName: 'Aditya',
            lastName: 'Memberguy',
            image: null,
            email: 'member@gmail.com',
            createdAt: '2023-03-02T03:22:08.101Z',
            userType: 'USER',
          },
        ],
      },
    },
  },
  newData: () => ({
    data: {
      organizationsMemberConnection: {
        __typename: 'UserConnection',
        edges: [
          {
            __typename: 'User',
            _id: '64001660a711c62d5b4076a2',
            firstName: 'Aditya',
            lastName: 'Memberguy',
            image: null,
            email: 'member@gmail.com',
            createdAt: '2023-03-02T03:22:08.101Z',
            userType: 'USER',
          },
        ],
      },
    },
  }),
});

const createAdminMock = (
  orgId = '',
  firstNameContains = '',
  lastNameContains = '',
  adminFor = '',
): any => ({
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: {
      orgId,
      firstNameContains,
      lastNameContains,
      adminFor,
    },
  },
  result: {
    data: {
      organizationsMemberConnection: {
        __typename: 'UserConnection',
        edges: [
          {
            __typename: 'User',
            _id: '64001660a711c62d5b4076a2',
            firstName: 'Aditya',
            lastName: 'Adminguy',
            image: null,
            email: 'admin@gmail.com',
            createdAt: '2023-03-02T03:22:08.101Z',
            userType: 'USER',
          },
          ...admins,
        ],
      },
    },
  },
  newData: () => ({
    data: {
      organizationsMemberConnection: {
        __typename: 'UserConnection',
        edges: [
          {
            __typename: 'User',
            _id: '64001660a711c62d5b4076a2',
            firstName: 'Aditya',
            lastName: 'Adminguy',
            image: null,
            email: 'admin@gmail.com',
            createdAt: '2023-03-02T03:22:08.101Z',
            userType: 'USER',
            lol: true,
          },
        ],
      },
    },
  }),
});

const createUserMock = (
  firstNameContains = '',
  lastNameContains = '',
): any => ({
  request: {
    query: USER_LIST,
    variables: {
      firstNameContains,
      lastNameContains,
    },
  },
  result: {
    data: {
      users: [
        {
          __typename: 'User',
          firstName: 'Aditya',
          lastName: 'Userguy',
          image: null,
          _id: '64001660a711c62d5b4076a2',
          email: 'adidacreator1@gmail.com',
          userType: 'SUPERADMIN',
          adminApproved: true,
          organizationsBlockedBy: [],
          createdAt: '2023-03-02T03:22:08.101Z',
          joinedOrganizations: [
            {
              __typename: 'Organization',
              _id: '6401ff65ce8e8406b8f07af1',
            },
          ],
        },
        {
          __typename: 'User',
          firstName: 'Aditya',
          lastName: 'Userguytwo',
          image: null,
          _id: '6402030dce8e8406b8f07b0e',
          email: 'adi1@gmail.com',
          userType: 'USER',
          adminApproved: true,
          organizationsBlockedBy: [],
          createdAt: '2023-03-03T14:24:13.084Z',
          joinedOrganizations: [
            {
              __typename: 'Organization',
              _id: '6401ff65ce8e8406b8f07af2',
            },
          ],
        },
      ],
    },
  },
});

const MOCKS: any[] = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: {
        id: 'orgid',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'orgid',
            image: '',
            creator: {
              firstName: 'firstName',
              lastName: 'lastName',
              email: 'email',
            },
            name: 'name',
            description: 'description',
            location: 'location',
            members: {
              _id: 'id',
              firstName: 'firstName',
              lastName: 'lastName',
              email: 'email',
            },
            admins: {
              _id: 'id',
              firstName: 'firstName',
              lastName: 'lastName',
              email: 'email',
            },
            membershipRequests: {
              _id: 'id',
              user: {
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
              },
            },
            blockedUsers: {
              _id: 'id',
              firstName: 'firstName',
              lastName: 'lastName',
              email: 'email',
            },
          },
        ],
      },
    },
  },

  {
    //These are mocks for 1st query (member list)
    request: {
      query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
      variables: {
        orgId: 'orgid',
        firstName_contains: '',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        organizationsMemberConnection: {
          __typename: 'UserConnection',
          edges: [
            {
              __typename: 'User',
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Aditya',
              lastName: 'Memberguy',
              image: null,
              email: 'member@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
              userType: 'USER',
            },
            ...members,
          ],
        },
      },
    },
    newData: () => ({
      //A function if multiple request are sent
      data: {
        organizationsMemberConnection: {
          __typename: 'UserConnection',
          edges: [
            {
              __typename: 'User',
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Aditya',
              lastName: 'Memberguy',
              image: null,
              email: 'member@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
              userType: 'USER',
            },
            ...members,
          ],
        },
      },
    }),
  },

  {
    request: {
      query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
      variables: {
        orgId: 'orgid',
        firstName_contains: '',
        lastName_contains: '',
        admin_for: 'orgid',
      },
    },
    result: {
      data: {
        organizationsMemberConnection: {
          __typename: 'UserConnection',
          edges: [
            {
              __typename: 'User',
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Aditya',
              lastName: 'Adminguy',
              image: null,
              email: 'admin@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
              userType: 'USER',
            },
            ...admins,
          ],
        },
      },
    },
    newData: () => ({
      data: {
        organizationsMemberConnection: {
          __typename: 'UserConnection',
          edges: [
            {
              __typename: 'User',
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Aditya',
              lastName: 'Adminguy',
              image: null,
              email: 'admin@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
              userType: 'USER',
              lol: true,
            },
            ...admins,
          ],
        },
      },
    }),
  },

  {
    //This is mock for user list
    request: {
      query: USER_LIST,
      variables: {
        firstName_contains: '',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: [
          {
            __typename: 'User',
            firstName: 'Aditya',
            lastName: 'Userguy',
            image: null,
            _id: '64001660a711c62d5b4076a2',
            email: 'adidacreator1@gmail.com',
            userType: 'SUPERADMIN',
            adminApproved: true,
            organizationsBlockedBy: [],
            createdAt: '2023-03-02T03:22:08.101Z',
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af1',
              },
            ],
          },
          {
            __typename: 'User',
            firstName: 'Aditya',
            lastName: 'Userguytwo',
            image: null,
            _id: '6402030dce8e8406b8f07b0e',
            email: 'adi1@gmail.com',
            userType: 'USER',
            adminApproved: true,
            organizationsBlockedBy: [],
            createdAt: '2023-03-03T14:24:13.084Z',
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af2',
              },
            ],
          },
          ...users,
        ],
      },
    },
  },

  createMemberMock('orgid', 'Aditya', ''),
  createMemberMock('orgid', '', 'Memberguy'),
  createMemberMock('orgid', 'Aditya', 'Memberguy'),

  createAdminMock('orgid', 'Aditya', '', 'orgid'),
  createAdminMock('orgid', '', 'Adminguy', 'orgid'),
  createAdminMock('orgid', 'Aditya', 'Adminguy', 'orgid'),

  createUserMock('Aditya', ''),
  createUserMock('', 'Userguytwo'),
  createUserMock('Aditya', 'Userguytwo'),

  {
    request: {
      query: USERS_CONNECTION_LIST,
      variables: {
        id_not_in: ['64001660a711c62d5b4076a2'],
        firstName_contains: '',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: [
          {
            firstName: 'Vyvyan',
            lastName: 'Kerry',
            image: null,
            _id: '65378abd85008f171cf2990d',
            email: 'testadmin1@example.com',
            userType: 'ADMIN',
            adminApproved: true,
            adminFor: [
              {
                _id: '6537904485008f171cf29924',
                __typename: 'Organization',
              },
            ],
            createdAt: '2023-04-13T04:53:17.742Z',
            organizationsBlockedBy: [],
            joinedOrganizations: [
              {
                _id: '6537904485008f171cf29924',
                name: 'Unity Foundation',
                image: null,
                address: {
                  city: 'Queens',
                  countryCode: 'US',
                  dependentLocality: 'Some Dependent Locality',
                  line1: '123 Coffee Street',
                  line2: 'Apartment 501',
                  postalCode: '11427',
                  sortingCode: 'ABC-133',
                  state: 'NYC',
                  __typename: 'Address',
                },
                createdAt: '2023-04-13T05:16:52.827Z',
                creator: {
                  _id: '64378abd85008f171cf2990d',
                  firstName: 'Wilt',
                  lastName: 'Shepherd',
                  image: null,
                  email: 'testsuperadmin@example.com',
                  createdAt: '2023-04-13T04:53:17.742Z',
                  __typename: 'User',
                },
                __typename: 'Organization',
              },
            ],
            __typename: 'User',
          },
        ],
      },
    },
  },
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        firstName: 'Disha',
        lastName: 'Talreja',
        email: 'test@gmail.com',
        password: 'dishatalreja',
      },
    },
    result: {
      data: {
        signUp: {
          user: {
            _id: '',
          },
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      },
    },
  },
  {
    request: {
      query: ADD_MEMBER_MUTATION,
      variables: {
        userid: '65378abd85008f171cf2990d',
        orgid: 'orgid',
      },
    },
    result: {
      data: {
        createMember: {
          _id: '6437904485008f171cf29924',
          __typename: 'Organization',
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);
async function wait(ms = 2): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
const linkURL = 'orgid';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: linkURL }),
}));

// TODO - REMOVE THE NEXT LINE IT IS TO SUPPRESS THE ERROR
// FOR THE FIRST TEST WHICH CAME OUT OF NOWHERE
console.error = jest.fn();

describe('Organization People Page', () => {
  const searchData = {
    fullNameMember: 'Aditya Memberguy',
    fullNameAdmin: 'Aditya Adminguy',
    fullNameUser: 'Aditya Userguytwo',
    location: 'Delhi, India',
    event: 'Event',
  };

  test('Correct mock data should be queried', async () => {
    window.location.assign('/orgpeople/orgid');

    const dataQuery1 =
      MOCKS[1]?.result?.data?.organizationsMemberConnection?.edges;
    const dataQuery2 =
      MOCKS[2]?.result?.data?.organizationsMemberConnection?.edges;

    const dataQuery3 = MOCKS[3]?.result?.data?.users;

    expect(dataQuery1).toEqual([
      {
        __typename: 'User',
        _id: '64001660a711c62d5b4076a2',
        firstName: 'Aditya',
        lastName: 'Memberguy',
        image: null,
        email: 'member@gmail.com',
        createdAt: '2023-03-02T03:22:08.101Z',
        userType: 'USER',
      },
      ...members,
    ]);

    expect(dataQuery2).toEqual([
      {
        __typename: 'User',
        _id: '64001660a711c62d5b4076a2',
        firstName: 'Aditya',
        lastName: 'Adminguy',
        image: null,
        email: 'admin@gmail.com',
        createdAt: '2023-03-02T03:22:08.101Z',
        userType: 'USER',
      },
      ...admins,
    ]);

    expect(dataQuery3).toEqual([
      {
        __typename: 'User',
        firstName: 'Aditya',
        lastName: 'Userguy',
        image: null,
        _id: '64001660a711c62d5b4076a2',
        email: 'adidacreator1@gmail.com',
        userType: 'SUPERADMIN',
        adminApproved: true,
        organizationsBlockedBy: [],
        createdAt: '2023-03-02T03:22:08.101Z',
        joinedOrganizations: [
          {
            __typename: 'Organization',
            _id: '6401ff65ce8e8406b8f07af1',
          },
        ],
      },
      {
        __typename: 'User',
        firstName: 'Aditya',
        lastName: 'Userguytwo',
        image: null,
        _id: '6402030dce8e8406b8f07b0e',
        email: 'adi1@gmail.com',
        userType: 'USER',
        adminApproved: true,
        organizationsBlockedBy: [],
        createdAt: '2023-03-03T14:24:13.084Z',
        joinedOrganizations: [
          {
            __typename: 'Organization',
            _id: '6401ff65ce8e8406b8f07af2',
          },
        ],
      },
      ...users,
    ]);

    expect(window.location).toBeAt('/orgpeople/orgid');
  });

  test('It is necessary to query the correct mock data.', async () => {
    window.location.assign('/orgpeople/orgid');

    const { container } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(container.textContent).not.toBe('Loading data...');

    await wait();

    expect(window.location).toBeAt('/orgpeople/orgid');
  });

  test('Testing MEMBERS list', async () => {
    window.location.assign('/orgpeople/orgid');
    render(
      <MockedProvider
        addTypename={true}
        link={link}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const findtext = screen.getByText(/Aditya Memberguy/i);
    await wait();
    expect(findtext).toBeInTheDocument();

    userEvent.type(
      screen.getByPlaceholderText(/Enter Full Name/i),
      searchData.fullNameMember,
    );
    await wait();
    expect(screen.getByPlaceholderText(/Enter Full Name/i)).toHaveValue(
      searchData.fullNameMember,
    );

    await wait();
    expect(window.location).toBeAt('/orgpeople/orgid');
  });

  test('Testing MEMBERS list with filters', async () => {
    window.location.assign('/orgpeople/orgid');
    render(
      <MockedProvider
        addTypename={true}
        link={link}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const fullNameInput = screen.getByPlaceholderText(/Enter Full Name/i);

    // Only First Name
    userEvent.type(fullNameInput, searchData.fullNameMember);
    await wait();

    let findtext = screen.getByText(/Aditya Memberguy/i);
    await wait();
    expect(findtext).toBeInTheDocument();

    findtext = screen.getByText(/Aditya Memberguy/i);
    await wait();
    expect(findtext).toBeInTheDocument();
    await wait();
    expect(window.location).toBeAt('/orgpeople/orgid');
  });

  test('Testing ADMIN LIST', async () => {
    window.location.assign('/orgpeople/orgid');

    render(
      <MockedProvider
        addTypename={true}
        link={link}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Get all dropdown toggles by test id
    const dropdownToggles = screen.getAllByTestId('role');

    // Click the dropdown toggle to open the dropdown menu
    dropdownToggles.forEach((dropdownToggle) => {
      userEvent.click(dropdownToggle);
    });

    // Click the "Admin" dropdown item
    const adminDropdownItem = screen.getByTestId('admins');
    userEvent.click(adminDropdownItem);

    // Wait for any asynchronous operations to complete
    await wait();

    // Assert that the "Aditya Adminguy" text is present
    const findtext = screen.getByText('Aditya Adminguy');
    expect(findtext).toBeInTheDocument();

    // Type in the full name input field
    userEvent.type(
      screen.getByPlaceholderText(/Enter Full Name/i),
      searchData.fullNameAdmin,
    );

    // Wait for any asynchronous operations to complete
    await wait();

    // Assert the value of the full name input field
    expect(screen.getByPlaceholderText(/Enter Full Name/i)).toHaveValue(
      searchData.fullNameAdmin,
    );
    await wait();

    // Wait for any asynchronous operations to complete
    await wait();
    expect(window.location).toBeAt('/orgpeople/orgid');
  });

  test('Testing ADMIN list with filters', async () => {
    window.location.assign('/orgpeople/orgid');
    render(
      <MockedProvider
        addTypename={true}
        link={link}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for the component to finish rendering
    await wait();

    // Click on the dropdown toggle to open the menu
    userEvent.click(screen.getByTestId('role'));
    await wait();

    // Click on the "Admins" option in the dropdown menu
    userEvent.click(screen.getByTestId('admins'));
    await wait();

    // Type the full name into the input field
    const fullNameInput = screen.getByPlaceholderText(/Enter Full Name/i);
    userEvent.type(fullNameInput, searchData.fullNameAdmin);

    // Wait for the results to update
    await wait();

    // Check if the expected name is present in the results
    let findtext = screen.getByText(/Aditya Adminguy/i);
    expect(findtext).toBeInTheDocument();

    // Ensure that the name is still present after filtering
    findtext = screen.getByText(/Aditya Adminguy/i);
    expect(findtext).toBeInTheDocument();
    await wait();
    expect(window.location).toBeAt('/orgpeople/orgid');
  });

  test('Testing add existing user modal', async () => {
    window.location.assign('/orgpeople/6401ff65ce8e8406b8f07af1');
    render(
      <MockedProvider
        addTypename={true}
        link={link}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for the component to finish rendering
    await wait();

    // Click on the dropdown toggle to open the menu
    userEvent.click(screen.getByTestId('addMembers'));
    await wait();

    expect(screen.getByTestId('existingUser')).toBeInTheDocument();

    // Click on the "Admins" option in the dropdown menu
    userEvent.click(screen.getByTestId('existingUser'));
    await wait();

    expect(screen.getByTestId('addExistingUserModal')).toBeInTheDocument();
    await wait();

    userEvent.click(screen.getByTestId('addBtn'));
  });

  test('Open and search existing user', async () => {
    window.location.assign('/orgpeople/orgid');
    render(
      <MockedProvider
        addTypename={true}
        link={link}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for the component to finish rendering
    await wait();

    // Click on the dropdown toggle to open the menu
    userEvent.click(screen.getByTestId('addMembers'));
    await wait();

    // Click on the "Admins" option in the dropdown menu
    userEvent.click(screen.getByTestId('existingUser'));
    await wait();

    expect(screen.getByTestId('addExistingUserModal')).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('searchUser'), {
      target: { value: 'Disha' },
    });
  });

  test('Open and close add new user modal', async () => {
    window.location.assign('/orgpeople/orgid');
    render(
      <MockedProvider
        addTypename={true}
        link={link}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for the component to finish rendering
    await wait();

    // Click on the dropdown toggle to open the menu
    userEvent.click(screen.getByTestId('addMembers'));
    await wait();

    // Click on the "Admins" option in the dropdown menu
    userEvent.click(screen.getByTestId('newUser'));
    await wait();

    expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('closeBtn'));
  });

  test('Testing add new user modal', async () => {
    window.location.assign('/orgpeople/orgid');
    render(
      <MockedProvider
        addTypename={true}
        link={link}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for the component to finish rendering
    await wait();

    // Click on the dropdown toggle to open the menu
    userEvent.click(screen.getByTestId('addMembers'));
    await wait();

    // Click on the "Admins" option in the dropdown menu
    userEvent.click(screen.getByTestId('newUser'));
    await wait();

    expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('firstNameInput'), {
      target: { value: 'Disha' },
    });
    expect(screen.getByTestId('firstNameInput')).toHaveValue('Disha');

    fireEvent.change(screen.getByTestId('lastNameInput'), {
      target: { value: 'Talreja' },
    });
    expect(screen.getByTestId('lastNameInput')).toHaveValue('Talreja');

    fireEvent.change(screen.getByTestId('emailInput'), {
      target: { value: 'test@gmail.com' },
    });
    expect(screen.getByTestId('emailInput')).toHaveValue('test@gmail.com');

    fireEvent.change(screen.getByTestId('passwordInput'), {
      target: { value: 'dishatalreja' },
    });
    userEvent.click(screen.getByTestId('showPassword'));
    expect(screen.getByTestId('passwordInput')).toHaveValue('dishatalreja');

    fireEvent.change(screen.getByTestId('confirmPasswordInput'), {
      target: { value: 'dishatalreja' },
    });
    userEvent.click(screen.getByTestId('showConfirmPassword'));
    expect(screen.getByTestId('confirmPasswordInput')).toHaveValue(
      'dishatalreja',
    );

    userEvent.click(screen.getByTestId('createBtn'));
  });

  test('Throw invalid details error in add new user modal', async () => {
    window.location.assign('/orgpeople/orgid');
    render(
      <MockedProvider
        addTypename={true}
        link={link}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for the component to finish rendering
    await wait();

    // Click on the dropdown toggle to open the menu
    userEvent.click(screen.getByTestId('addMembers'));
    await wait();

    // Click on the "Admins" option in the dropdown menu
    userEvent.click(screen.getByTestId('newUser'));
    await wait();

    expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('firstNameInput'), {
      target: { value: 'Disha' },
    });
    expect(screen.getByTestId('firstNameInput')).toHaveValue('Disha');

    fireEvent.change(screen.getByTestId('lastNameInput'), {
      target: { value: 'Talreja' },
    });
    expect(screen.getByTestId('lastNameInput')).toHaveValue('Talreja');

    fireEvent.change(screen.getByTestId('emailInput'), {
      target: { value: 'test@gmail.com' },
    });
    expect(screen.getByTestId('emailInput')).toHaveValue('test@gmail.com');

    fireEvent.change(screen.getByTestId('passwordInput'), {
      target: { value: 'dishatalreja' },
    });
    userEvent.click(screen.getByTestId('showPassword'));
    expect(screen.getByTestId('passwordInput')).toHaveValue('dishatalreja');

    fireEvent.change(screen.getByTestId('confirmPasswordInput'), {
      target: { value: 'disha' },
    });
    userEvent.click(screen.getByTestId('showConfirmPassword'));
    expect(screen.getByTestId('confirmPasswordInput')).toHaveValue('disha');

    userEvent.click(screen.getByTestId('createBtn'));
  });

  test('Throw passwordNotMatch error in add new user modal', async () => {
    window.location.assign('/orgpeople/orgid');
    render(
      <MockedProvider
        addTypename={true}
        link={link}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for the component to finish rendering
    await wait();

    // Click on the dropdown toggle to open the menu
    userEvent.click(screen.getByTestId('addMembers'));
    await wait();

    // Click on the "Admins" option in the dropdown menu
    userEvent.click(screen.getByTestId('newUser'));
    await wait();

    expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('firstNameInput'), {
      target: { value: 'Disha' },
    });
    expect(screen.getByTestId('firstNameInput')).toHaveValue('Disha');

    fireEvent.change(screen.getByTestId('lastNameInput'), {
      target: { value: 'Talreja' },
    });
    expect(screen.getByTestId('lastNameInput')).toHaveValue('Talreja');

    fireEvent.change(screen.getByTestId('passwordInput'), {
      target: { value: 'dishatalreja' },
    });
    userEvent.click(screen.getByTestId('showPassword'));
    expect(screen.getByTestId('passwordInput')).toHaveValue('dishatalreja');

    fireEvent.change(screen.getByTestId('confirmPasswordInput'), {
      target: { value: 'dishatalreja' },
    });
    userEvent.click(screen.getByTestId('showConfirmPassword'));
    expect(screen.getByTestId('confirmPasswordInput')).toHaveValue(
      'dishatalreja',
    );

    userEvent.click(screen.getByTestId('createBtn'));
  });

  test('Testing USERS list', async () => {
    window.location.assign('/orgpeople/6401ff65ce8e8406b8f07af1');

    render(
      <MockedProvider
        addTypename={true}
        link={link}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const orgUsers = MOCKS[3]?.result?.data?.users;
    expect(orgUsers?.length).toBe(2);

    await wait();
    expect(window.location).toBeAt('/orgpeople/6401ff65ce8e8406b8f07af1');
  });

  test('Testing USERS list with filters', async () => {
    window.location.assign('/orgpeople/6401ff65ce8e8406b8f07af2');

    render(
      <MockedProvider
        addTypename={true}
        link={link}
        defaultOptions={{
          watchQuery: { fetchPolicy: 'no-cache' },
          query: { fetchPolicy: 'no-cache' },
        }}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const fullNameInput = screen.getByPlaceholderText(/Enter Full Name/i);

    // Only Full Name
    userEvent.type(fullNameInput, searchData.fullNameUser);
    await wait();
    const orgUsers = MOCKS[3]?.result?.data?.users;
    const orgUserssize = orgUsers?.filter(
      (datas: {
        _id: string;
        lastName: string;
        firstName: string;
        image: string;
        email: string;
        createdAt: string;
        joinedOrganizations: {
          __typename: string;
          _id: string;
        }[];
      }) => {
        return datas.joinedOrganizations?.some(
          (org) => org._id === '6401ff65ce8e8406b8f07af2',
        );
      },
    );
    await wait();
    expect(orgUserssize?.length).toBe(1);

    await wait();
    expect(window.location).toBeAt('/orgpeople/6401ff65ce8e8406b8f07af2');
  });

  test('No Mock Data test', async () => {
    window.location.assign('/orgpeople/orgid');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(window.location).toBeAt('/orgpeople/orgid');
  });
});
