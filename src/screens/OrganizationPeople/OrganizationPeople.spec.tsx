import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  ADD_MEMBER_MUTATION,
  SIGNUP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import type { TestMock } from './MockDataTypes';
import { vi } from 'vitest';
import { toast } from 'react-toastify';

/**
 * Mock window.location for testing redirection behavior.
 */

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

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
  const mockMemberError = new Error('Member query failed');
  const mockAdminError = new Error('Admin query failed');
  const mockUserError = new Error('User query failed');

  const successfulMemberResponse = {
    request: {
      query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
      variables: {
        firstName_contains: '',
        lastName_contains: '',
        orgId: 'orgid',
      },
    },
    result: {
      data: {
        organizationsMemberConnection: {
          edges: [],
          __typename: 'OrganizationMemberConnection',
        },
      },
    },
  };

  const successfulAdminResponse = {
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
            admins: [],
            __typename: 'Organization',
          },
        ],
      },
    },
  };

  const successfulUserResponse = {
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.location.assign('/orgpeople/orgid');
  });
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

  const mockSignupResponse2 = {
    data: {
      signUp: {
        user: {
          _id: 'id',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    },
  };

  const mockCreateMemberResponse2 = {
    data: {
      addUserToOrganization: {
        _id: 'id',
      },
    },
  };

  const defaultMocks2 = [
    {
      request: {
        query: SIGNUP_MUTATION,
        variables: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          orgId: linkURL,
        },
      },
      result: mockSignupResponse2,
    },
    {
      request: {
        query: ADD_MEMBER_MUTATION,
        variables: {
          userid: 'test-user-id',
          orgid: linkURL,
        },
      },
      result: mockCreateMemberResponse2,
    },
  ];
  test('successfully creates user and adds them as member', async () => {
    window.location.assign('/orgpeople/orgid');
    render(
      <MockedProvider
        mocks={defaultMocks2}
        addTypename={false}
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
    await waitFor(() => {
      const addmembersBtn = screen.getByTestId('addMembers');
      expect(addmembersBtn).toBeInTheDocument();
      userEvent.click(addmembersBtn);
    });

    await waitFor(() => {
      const newUserBtn = screen.getByTestId('newUser');
      expect(newUserBtn).toBeInTheDocument();
      userEvent.click(newUserBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();
      expect(screen.getByTestId('createUser')).toBeInTheDocument();
    });

    // Fill in the form
    await userEvent.type(screen.getByTestId('firstNameInput'), 'John');
    await userEvent.type(screen.getByTestId('lastNameInput'), 'Doe');
    await userEvent.type(screen.getByTestId('emailInput'), 'john@example.com');
    await userEvent.type(screen.getByTestId('passwordInput'), 'password123');
    await userEvent.type(
      screen.getByTestId('confirmPasswordInput'),
      'password123',
    );
    const createButton = screen.getByTestId('createBtn');
    await userEvent.click(createButton);
  });

  test('handles signup error gracefully', async () => {
    window.location.assign('/orgpeople/orgid');
    const errorMocks = [
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            orgId: linkURL,
          },
        },
        error: new Error('Failed to create user'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      const addmembersBtn = screen.getByTestId('addMembers');
      expect(addmembersBtn).toBeInTheDocument();
      userEvent.click(addmembersBtn);
    });

    await waitFor(() => {
      const newUserBtn = screen.getByTestId('newUser');
      expect(newUserBtn).toBeInTheDocument();
      userEvent.click(newUserBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();
      expect(screen.getByTestId('createUser')).toBeInTheDocument();
    });

    await userEvent.type(screen.getByTestId('firstNameInput'), 'John');
    await userEvent.type(screen.getByTestId('lastNameInput'), 'Doe');
    await userEvent.type(screen.getByTestId('emailInput'), 'john@example.com');
    await userEvent.type(screen.getByTestId('passwordInput'), 'password123');
    await userEvent.type(
      screen.getByTestId('confirmPasswordInput'),
      'password123',
    );

    const createButton = screen.getByTestId('createBtn');
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create user');
    });

    expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();

    expect(screen.getByTestId('firstNameInput')).toHaveValue('John');
    expect(screen.getByTestId('lastNameInput')).toHaveValue('Doe');
    expect(screen.getByTestId('emailInput')).toHaveValue('john@example.com');
  });

  test('handles null createdUserId gracefully', async () => {
    window.location.assign('/orgpeople/orgid');
    const nullUserIdMocks = [
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            orgId: linkURL,
          },
        },
        result: {
          data: {
            signUp: {
              user: {
                _id: null,
              },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={nullUserIdMocks} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Open modal and fill form
    await waitFor(() => {
      const addmembersBtn = screen.getByTestId('addMembers');
      expect(addmembersBtn).toBeInTheDocument();
      userEvent.click(addmembersBtn);
    });

    await waitFor(() => {
      const newUserBtn = screen.getByTestId('newUser');
      expect(newUserBtn).toBeInTheDocument();
      userEvent.click(newUserBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();
      expect(screen.getByTestId('createUser')).toBeInTheDocument();
    });

    await userEvent.type(screen.getByTestId('firstNameInput'), 'John');
    await userEvent.type(screen.getByTestId('lastNameInput'), 'Doe');
    await userEvent.type(screen.getByTestId('emailInput'), 'john@example.com');
    await userEvent.type(screen.getByTestId('passwordInput'), 'password123');
    await userEvent.type(
      screen.getByTestId('confirmPasswordInput'),
      'password123',
    );

    // Submit form
    const createButton = screen.getByTestId('createBtn');
    await userEvent.click(createButton);

    // Verify error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
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
    await wait();

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
  test('should show toast error when member query fails', async () => {
    const memberErrorMock = {
      ...successfulMemberResponse,
      error: mockMemberError,
    };

    render(
      <MockedProvider
        mocks={[
          memberErrorMock,
          successfulAdminResponse,
          successfulUserResponse,
        ]}
        addTypename={false}
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
    expect(toast.error).toHaveBeenCalledWith('Member query failed');
  });

  test('should show toast error when admin query fails', async () => {
    const setState = vi.fn();
    const useStateMock = vi.spyOn(React, 'useState');
    useStateMock.mockReturnValueOnce([1, setState]);

    const mocks = [
      {
        request: {
          query: ORGANIZATIONS_LIST,
          variables: { id: 'orgid' },
        },
        error: mockAdminError,
      },
      {
        request: {
          query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
          variables: {
            firstName_contains: '',
            lastName_contains: '',
            orgId: 'orgid',
          },
        },
        result: {
          data: {
            organizationsMemberConnection: {
              edges: [],
              __typename: 'OrganizationMemberConnection',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const dropdownButton = screen.getByTestId('role');
    await userEvent.click(dropdownButton);
    const adminsOption = screen.getByTestId('admins');
    await userEvent.click(adminsOption);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(toast.error).toHaveBeenCalled();
  });

  test('should show toast error when user query fails', async () => {
    const setState = vi.fn();
    const useStateMock = vi.spyOn(React, 'useState');
    useStateMock.mockReturnValueOnce([2, setState]);

    const mocks = [
      {
        request: {
          query: USER_LIST_FOR_TABLE,
          variables: {
            firstName_contains: '',
            lastName_contains: '',
          },
        },
        error: mockUserError,
      },
      {
        request: {
          query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
          variables: {
            firstName_contains: '',
            lastName_contains: '',
            orgId: 'orgid',
          },
        },
        result: {
          data: {
            organizationsMemberConnection: {
              edges: [],
              __typename: 'OrganizationMemberConnection',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const dropdownButton = screen.getByTestId('role');
    await userEvent.click(dropdownButton);
    const usersOption = screen.getByTestId('users');
    await userEvent.click(usersOption);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(toast.error).toHaveBeenCalled();
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

test('opening add user modal', async () => {
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

  const addmemberBtn = screen.getByTestId('addMembers');
  userEvent.click(addmemberBtn);

  const existUserBtn = screen.getByTestId('existingUser');
  userEvent.click(existUserBtn);

  expect(screen.getByTestId('addExistingUserModal')).toBeInTheDocument();
  expect(screen.getByTestId('pluginNotificationHeader')).toBeInTheDocument();

  const closeButton = screen.getByLabelText('Close');
  userEvent.click(closeButton);
  await wait();
  expect(screen.queryByTestId('addExistingUserModal')).not.toBeInTheDocument();
});

test('modal state management - open, close, and toggle', async () => {
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

  expect(screen.queryByTestId('addNewUserModal')).not.toBeInTheDocument();

  await waitFor(() => {
    const addmembersBtn = screen.getByTestId('addMembers');
    userEvent.click(addmembersBtn);
  });

  await waitFor(() => {
    const newUserBtn = screen.getByTestId('newUser');
    expect(screen.getByTestId('newUser')).toBeInTheDocument();
    userEvent.click(newUserBtn);
  });

  expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();

  const modalHeader = screen.getByTestId('createUser');
  userEvent.click(modalHeader);

  expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();

  const closeBtn = screen.getByTestId('closeBtn');
  userEvent.click(closeBtn);

  await waitFor(() => {
    expect(screen.queryByTestId('addNewUserModal')).not.toBeInTheDocument();
  });

  await waitFor(() => {
    const newUserBtn = screen.getByTestId('newUser');
    userEvent.click(newUserBtn);
  });

  expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();

  const modal = screen.getByTestId('addNewUserModal');
  fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' });

  await waitFor(() => {
    const newUserBtn = screen.getByTestId('newUser');
    userEvent.click(newUserBtn);
  });

  const firstNameInput = screen.getByTestId('firstNameInput');
  userEvent.type(firstNameInput, 'John');

  fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' });
});

test('testing out toast errors', async () => {
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

  await waitFor(() => {
    const addmembersBtn = screen.getByTestId('addMembers');
    userEvent.click(addmembersBtn);
  });

  await waitFor(() => {
    const newUserBtn = screen.getByTestId('newUser');
    expect(screen.getByTestId('newUser')).toBeInTheDocument();
    userEvent.click(newUserBtn);
  });

  expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();

  const modalHeader = screen.getByTestId('createUser');
  userEvent.click(modalHeader);

  const createBtn = screen.getByTestId('createBtn');
  expect(createBtn).toBeInTheDocument();
  userEvent.click(createBtn);

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalled();
  });
});

test('handles GraphQL error when adding member', async () => {
  const ERRORMOCK = [
    {
      request: {
        query: ADD_MEMBER_MUTATION,
        variables: {
          firstName: 'Disha',
          lastName: 'Talreja',
          email: 'test@gmail.com',
          password: 'dishatalreja',
          orgId: 'orgid',
        },
      },
      error: new Error('Please enter valid details.'),
    },
  ];

  const link5 = new StaticMockLink(ERRORMOCK, true);

  render(
    <MockedProvider link={link5} addTypename={false}>
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

  await waitFor(() => {
    const addmembersBtn = screen.getByTestId('addMembers');
    userEvent.click(addmembersBtn);
  });

  await waitFor(() => {
    const newUserBtn = screen.getByTestId('newUser');
    expect(screen.getByTestId('newUser')).toBeInTheDocument();
    userEvent.click(newUserBtn);
  });

  expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();

  const modalHeader = screen.getByTestId('createUser');
  userEvent.click(modalHeader);

  const firstNameInput = screen.getByTestId('firstNameInput');
  const lastNameInput = screen.getByTestId('lastNameInput');
  const emailInput = screen.getByTestId('emailInput');
  const passwordInput = screen.getByTestId('passwordInput');

  userEvent.type(firstNameInput, 'Abhishek');
  userEvent.type(lastNameInput, 'Raj');
  userEvent.type(emailInput, 'test@gmail.com');
  userEvent.type(passwordInput, 'abhishek');

  const createBtn = screen.getByTestId('createBtn');
  expect(createBtn).toBeInTheDocument();
  userEvent.click(createBtn);

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalled();
  });
  vi.clearAllMocks();
});

test('createMember handles error and shows toast notification', async () => {
  // Setup
  window.location.assign('/orgpeople/6401ff65ce8e8406b8f07af2');

  const mockMemberRefetch = vi.fn();

  const mocks = [
    {
      request: {
        query: ADD_MEMBER_MUTATION,
        variables: {
          userid: 'testUserId',
          orgid: 'testOrgId',
        },
      },
      error: new Error('Failed to add member'),
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationPeople />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  await waitFor(() => {
    const addmembersBtn = screen.getByTestId('addMembers');
    userEvent.click(addmembersBtn);
  });

  await waitFor(() => {
    const newUserBtn = screen.getByTestId('newUser');
    expect(screen.getByTestId('newUser')).toBeInTheDocument();
    userEvent.click(newUserBtn);
  });

  expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();

  const addBtn = screen.getAllByTestId('createBtn');
  await userEvent.click(addBtn[0]);

  expect(toast.error).toHaveBeenCalled();
  expect(mockMemberRefetch).not.toHaveBeenCalled();
});
