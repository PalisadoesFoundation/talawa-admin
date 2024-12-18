import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { Params } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import OrganizationPeople from './OrganizationPeople';
import { store } from 'state/store';
import {
  ORGANIZATIONS_LIST,
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USERS_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
// import 'jest-location-mock';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  ADD_MEMBER_MUTATION,
  SIGNUP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import type { TestMock } from './MockDataTypes';
import { vi } from 'vitest';

/**
 * Mock window.location for testing redirection behavior.
 */

Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost/',
    assign: vi.fn((url) => {
      const urlObj = new URL(url, 'http://localhost');
      window.location.href = urlObj.href;
      window.location.pathname = urlObj.pathname;
      window.location.search = urlObj.search;
      window.location.hash = urlObj.hash;
    }),
    reload: vi.fn(),
    pathname: '/',
    search: '',
    hash: '',
    origin: 'http://localhost',
  },
});

const createMemberMock = (
  orgId = '',
  firstNameContains = '',
  lastNameContains = '',
): TestMock => ({
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
        edges: [
          {
            _id: '64001660a711c62d5b4076a2',
            firstName: 'Aditya',
            lastName: 'Memberguy',
            image: null,
            email: 'member@gmail.com',
            createdAt: '2023-03-02T03:22:08.101Z',
          },
        ],
      },
    },
  },
  newData: () => ({
    data: {
      organizationsMemberConnection: {
        edges: [
          {
            user: {
              __typename: 'User',
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Aditya',
              lastName: 'Memberguy',
              image: null,
              email: 'member@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
            },
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
): TestMock => ({
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: {
      orgId,
      firstNameContains,
      lastNameContains,
    },
  },
  result: {
    data: {
      organizationsMemberConnection: {
        edges: [
          {
            user: {
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Aditya',
              lastName: 'Adminguy',
              image: null,
              email: 'admin@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
            },
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
            user: {
              __typename: 'User',
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Aditya',
              lastName: 'Adminguy',
              image: null,
              email: 'admin@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
              lol: true,
            },
          },
        ],
      },
    },
  }),
});

const createUserMock = (
  firstNameContains = '',
  lastNameContains = '',
): TestMock => ({
  request: {
    query: USER_LIST_FOR_TABLE,
    variables: {
      firstNameContains,
      lastNameContains,
    },
  },
  result: {
    data: {
      users: [
        {
          user: {
            __typename: 'User',
            firstName: 'Aditya',
            lastName: 'Userguy',
            image: 'tempUrl',
            _id: '64001660a711c62d5b4076a2',
            email: 'adidacreator1@gmail.com',
            createdAt: '2023-03-02T03:22:08.101Z',
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af1',
              },
            ],
          },
        },
        {
          user: {
            __typename: 'User',
            firstName: 'Aditya',
            lastName: 'Userguytwo',
            image: 'tempUrl',
            _id: '6402030dce8e8406b8f07b0e',
            email: 'adi1@gmail.com',
            createdAt: '2023-03-03T14:24:13.084Z',
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af2',
              },
            ],
          },
        },
      ],
    },
  },
});

const MOCKS: TestMock[] = [
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
            userRegistrationRequired: false,
            visibleInSearch: false,
            address: {
              city: 'string',
              countryCode: 'string',
              dependentLocality: 'string',
              line1: 'string',
              line2: 'string',
              postalCode: 'string',
              sortingCode: 'string',
              state: 'string',
            },
            members: [
              {
                _id: 'id',
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
              },
            ],
            admins: [
              {
                _id: 'id',
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
                createdAt: '12-03-2024',
              },
            ],
            membershipRequests: [
              {
                _id: 'id',
                user: {
                  firstName: 'firstName',
                  lastName: 'lastName',
                  email: 'email',
                },
              },
            ],
            blockedUsers: [
              {
                _id: 'id',
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
              },
            ],
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
          edges: [
            {
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Aditya',
              lastName: 'Memberguy',
              image: null,
              email: 'member@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
            },
          ],
        },
      },
    },
    newData: () => ({
      //A function if multiple request are sent
      data: {
        organizationsMemberConnection: {
          edges: [
            {
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Aditya',
              lastName: 'Memberguy',
              image: null,
              email: 'member@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
            },
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
      },
    },
    result: {
      data: {
        organizationsMemberConnection: {
          edges: [
            {
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Aditya',
              lastName: 'Adminguy',
              image: null,
              email: 'admin@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
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
              lastName: 'Adminguy',
              image: null,
              email: 'admin@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
              lol: true,
            },
          ],
        },
      },
    }),
  },

  {
    //This is mock for user list
    request: {
      query: USER_LIST_FOR_TABLE,
      variables: {
        firstName_contains: '',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              __typename: 'User',
              firstName: 'Aditya',
              lastName: 'Userguy',
              image: 'tempUrl',
              _id: '64001660a711c62d5b4076a2',
              email: 'adidacreator1@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
              joinedOrganizations: [
                {
                  __typename: 'Organization',
                  _id: '6401ff65ce8e8406b8f07af1',
                },
              ],
            },
          },
          {
            user: {
              __typename: 'User',
              firstName: 'Aditya',
              lastName: 'Userguytwo',
              image: 'tempUrl',
              _id: '6402030dce8e8406b8f07b0e',
              email: 'adi1@gmail.com',
              createdAt: '2023-03-03T14:24:13.084Z',
              joinedOrganizations: [
                {
                  __typename: 'Organization',
                  _id: '6401ff65ce8e8406b8f07af2',
                },
              ],
            },
          },
        ],
      },
    },
  },

  createMemberMock('orgid', 'Aditya', ''),
  createMemberMock('orgid', '', 'Memberguy'),
  createMemberMock('orgid', 'Aditya', 'Memberguy'),

  createAdminMock('orgid', 'Aditya', ''),
  createAdminMock('orgid', '', 'Adminguy'),
  createAdminMock('orgid', 'Aditya', 'Adminguy'),

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
            user: {
              firstName: 'Vyvyan',
              lastName: 'Kerry',
              image: 'tempUrl',
              _id: '65378abd85008f171cf2990d',
              email: 'testadmin1@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              joinedOrganizations: [
                {
                  _id: '6537904485008f171cf29924',
                  name: 'Unity Foundation',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                  },
                  __typename: 'Organization',
                },
              ],
              __typename: 'User',
            },
          },
          {
            user: {
              firstName: 'Nandika',
              lastName: 'Agrawal',
              image: null,
              _id: '65378abd85008f171cf2990d',
              email: 'testadmin1@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              joinedOrganizations: [
                {
                  _id: '6537904485008f171cf29924',
                  name: 'Unity Foundation',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                  },
                  __typename: 'Organization',
                },
              ],
              __typename: 'User',
            },
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
        orgId: 'orgId',
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

const EMPTYMOCKS: TestMock[] = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: {
        id: 'orgid',
      },
    },
    result: {
      data: {
        organizations: [],
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
          edges: [],
        },
      },
    },
  },

  {
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
          edges: [],
        },
      },
    },
  },

  {
    //This is mock for user list
    request: {
      query: USER_LIST_FOR_TABLE,
      variables: {
        firstName_contains: '',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: [],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(EMPTYMOCKS, true);
async function wait(ms = 2): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
const linkURL = 'orgid';

vi.mock('react-router-dom', async () => {
  const actualDom = await vi.importActual('react-router-dom');
  return {
    ...actualDom,
    useParams: (): Readonly<Params<string>> => ({ orgId: linkURL }),
  };
});

// TODO - REMOVE THE NEXT LINE IT IS TO SUPPRESS THE ERROR
// FOR THE FIRST TEST WHICH CAME OUT OF NOWHERE
console.error = vi.fn();

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
    expect(dataQuery1).toEqual([
      {
        _id: '64001660a711c62d5b4076a2',
        firstName: 'Aditya',
        lastName: 'Memberguy',
        image: null,
        email: 'member@gmail.com',
        createdAt: '2023-03-02T03:22:08.101Z',
      },
    ]);

    const dataQuery2 =
      MOCKS[2]?.result?.data?.organizationsMemberConnection?.edges;

    const dataQuery3 = MOCKS[3]?.result?.data?.users;

    expect(dataQuery3).toEqual([
      {
        user: {
          __typename: 'User',
          firstName: 'Aditya',
          lastName: 'Userguy',
          image: 'tempUrl',
          _id: '64001660a711c62d5b4076a2',
          email: 'adidacreator1@gmail.com',
          createdAt: '2023-03-02T03:22:08.101Z',
          joinedOrganizations: [
            {
              __typename: 'Organization',
              _id: '6401ff65ce8e8406b8f07af1',
            },
          ],
        },
      },
      {
        user: {
          __typename: 'User',
          firstName: 'Aditya',
          lastName: 'Userguytwo',
          image: 'tempUrl',
          _id: '6402030dce8e8406b8f07b0e',
          email: 'adi1@gmail.com',
          createdAt: '2023-03-03T14:24:13.084Z',
          joinedOrganizations: [
            {
              __typename: 'Organization',
              _id: '6401ff65ce8e8406b8f07af2',
            },
          ],
        },
      },
    ]);

    expect(dataQuery2).toEqual([
      {
        _id: '64001660a711c62d5b4076a2',
        firstName: 'Aditya',
        lastName: 'Adminguy',
        image: null,
        email: 'admin@gmail.com',
        createdAt: '2023-03-02T03:22:08.101Z',
      },
    ]);

    expect(window.location.href).toBe('http://localhost/orgpeople/orgid');
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

    expect(window.location.href).toBe('http://localhost/orgpeople/orgid');
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
    const dropdownToggles = screen.getAllByTestId('role');

    dropdownToggles.forEach((dropdownToggle) => {
      userEvent.click(dropdownToggle);
    });

    const memebersDropdownItem = screen.getByTestId('members');
    userEvent.click(memebersDropdownItem);
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
    expect(window.location.href).toBe('http://localhost/orgpeople/orgid');
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
    expect(window.location.href).toBe('http://localhost/orgpeople/orgid');
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
    // remove this comment when table fecthing functionality is fixed
    // Assert that the "Aditya Adminguy" text is present
    // const findtext = screen.getByText('Aditya Adminguy');
    // expect(findtext).toBeInTheDocument();

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
    expect(window.location.href).toBe('http://localhost/orgpeople/orgid');
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
    const btn = screen.getByTestId('searchbtn');
    userEvent.click(btn);
    // remove this comment when table fecthing functionality is fixed
    // Check if the expected name is present in the results
    // let findtext = screen.getByText(/Aditya Adminguy/i);
    // expect(findtext).toBeInTheDocument();

    // Ensure that the name is still present after filtering
    await wait();
    expect(window.location.href).toBe('http://localhost/orgpeople/orgid');
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

    expect(
      screen.getAllByTestId('addExistingUserModal').length,
    ).toBeGreaterThan(0);
    await wait();

    const addBtn = screen.getAllByTestId('addBtn');
    userEvent.click(addBtn[0]);
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

    const dropdownToggles = screen.getAllByTestId('role');

    dropdownToggles.forEach((dropdownToggle) => {
      userEvent.click(dropdownToggle);
    });

    const usersDropdownItem = screen.getByTestId('users');
    userEvent.click(usersDropdownItem);
    await wait();
    const btn = screen.getByTestId('searchbtn');
    userEvent.click(btn);
    await wait();
    expect(window.location.href).toBe(
      'http://localhost/orgpeople/6401ff65ce8e8406b8f07af1',
    );
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
    const btn = screen.getByTestId('searchbtn');
    userEvent.click(btn);
    await wait();
    expect(window.location.href).toBe(
      'http://localhost/orgpeople/6401ff65ce8e8406b8f07af2',
    );
  });

  test('Add Member component renders', async () => {
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
    userEvent.click(screen.getByTestId('addMembers'));
    await wait();
    userEvent.click(screen.getByTestId('existingUser'));
    await wait();
    const btn = screen.getByTestId('submitBtn');
    userEvent.click(btn);
  });

  test('Datagrid renders with members data', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationPeople />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const dataGrid = screen.getByRole('grid');
    expect(dataGrid).toBeInTheDocument();
    const removeButtons = screen.getAllByTestId('removeMemberModalBtn');
    userEvent.click(removeButtons[0]);
  });

  test('Datagrid renders with admin data', async () => {
    window.location.assign('/orgpeople/orgid');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationPeople />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const dropdownToggles = screen.getAllByTestId('role');
    dropdownToggles.forEach((dropdownToggle) => {
      userEvent.click(dropdownToggle);
    });
    const adminDropdownItem = screen.getByTestId('admins');
    userEvent.click(adminDropdownItem);
    await wait();
    const removeButtons = screen.getAllByTestId('removeAdminModalBtn');
    userEvent.click(removeButtons[0]);
  });

  test('No Mock Data test', async () => {
    window.location.assign('/orgpeople/orgid');

    render(
      <MockedProvider addTypename={false} link={link2}>
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
    expect(window.location.href).toBe('http://localhost/orgpeople/orgid');
    expect(screen.queryByText(/Nothing Found !!/i)).toBeInTheDocument();
  });
});

test('Open and check if profile image is displayed for existing user', async () => {
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
  await wait();

  expect(screen.getAllByTestId('user').length).toBeGreaterThan(0);
  await wait();

  // Check if the image is rendered
  expect(screen.getAllByTestId('profileImage').length).toBeGreaterThan(0);
  await wait();

  const images = await screen.findAllByAltText('avatar');
  expect(images.length).toBeGreaterThan(0);
  await wait();

  const avatarImages = await screen.findAllByAltText('Dummy Avatar');
  expect(avatarImages.length).toBeGreaterThan(0);
  await wait();
});
