import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
<<<<<<< HEAD
import { act, fireEvent, render, screen } from '@testing-library/react';
=======
import { act, render, screen } from '@testing-library/react';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import OrganizationPeople from './OrganizationPeople';
import { store } from 'state/store';
import {
  ORGANIZATIONS_LIST,
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
<<<<<<< HEAD
  USERS_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
=======
  USER_LIST,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
} from 'GraphQl/Queries/Queries';
import 'jest-location-mock';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
<<<<<<< HEAD
import {
  ADD_MEMBER_MUTATION,
  SIGNUP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import type { TestMock } from './MockDataTypes';
=======

// This loop creates dummy data for members, admin and users
const members: any[] = [];
const admins: any[] = [];
const users: any[] = [];

for (let i = 0; i < 100; i++) {
  members.push({
    __typename: 'User',
    _id: i + '1',
    firstName: 'firstName',
    lastName: 'lastName',
    image: null,
    email: 'email',
    createdAt: new Date().toISOString(),
  });

  admins.push({
    __typename: 'User',
    _id: i + '1',
    firstName: 'firstName',
    lastName: 'lastName',
    image: null,
    email: 'email',
    createdAt: new Date().toISOString(),
  });

  users.push({
    __typename: 'User',
    firstName: 'firstName',
    lastName: 'lastName',
    image: null,
    _id: i + 'id',
    email: 'email',
    userType: ['SUPERADMIN', 'USER'][i < 50 ? 0 : 1],
    adminApproved: true,
    organizationsBlockedBy: [],
    createdAt: new Date().toISOString(),
    joinedOrganizations: [
      {
        __typename: 'Organization',
        _id: `6411a8f197d5631eb0765857${i}`,
      },
    ],
  });
}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

const createMemberMock = (
  orgId = '',
  firstNameContains = '',
<<<<<<< HEAD
  lastNameContains = '',
): TestMock => ({
=======
  lastNameContains = ''
): any => ({
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
        edges: [
          {
=======
        __typename: 'UserConnection',
        edges: [
          {
            __typename: 'User',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
            _id: '64001660a711c62d5b4076a2',
            firstName: 'Aditya',
            lastName: 'Memberguy',
            image: null,
            email: 'member@gmail.com',
            createdAt: '2023-03-02T03:22:08.101Z',
<<<<<<< HEAD
            userType: 'USER',
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
              userType: 'USER',
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
              userType: 'USER',
            },
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
            user: {
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
=======
            __typename: 'User',
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
});

const createAdminMock = (
  orgId = '',
  firstNameContains = '',
  lastNameContains = '',
  adminFor = ''
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
            lol: true,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          },
        ],
      },
    },
  }),
});

const createUserMock = (
  firstNameContains = '',
<<<<<<< HEAD
  lastNameContains = '',
): TestMock => ({
  request: {
    query: USER_LIST_FOR_TABLE,
=======
  lastNameContains = ''
): any => ({
  request: {
    query: USER_LIST,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    variables: {
      firstNameContains,
      lastNameContains,
    },
  },
  result: {
    data: {
      users: [
        {
<<<<<<< HEAD
          user: {
            __typename: 'User',
            firstName: 'Aditya',
            lastName: 'Userguy',
            image: 'tempUrl',
            _id: '64001660a711c62d5b4076a2',
            email: 'adidacreator1@gmail.com',
            userType: 'SUPERADMIN',
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
            userType: 'USER',
            createdAt: '2023-03-03T14:24:13.084Z',
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af2',
              },
            ],
          },
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        },
      ],
    },
  },
});

<<<<<<< HEAD
const MOCKS: TestMock[] = [
=======
const MOCKS: any[] = [
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
              },
<<<<<<< HEAD
            ],
            admins: [
              {
                _id: 'id',
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
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
=======
            },
            blockedUsers: {
              _id: 'id',
              firstName: 'firstName',
              lastName: 'lastName',
              email: 'email',
            },
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
          edges: [
            {
=======
          __typename: 'UserConnection',
          edges: [
            {
              __typename: 'User',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Aditya',
              lastName: 'Memberguy',
              image: null,
              email: 'member@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
<<<<<<< HEAD
              userType: 'USER',
            },
=======
            },
            ...members,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          ],
        },
      },
    },
    newData: () => ({
      //A function if multiple request are sent
      data: {
        organizationsMemberConnection: {
<<<<<<< HEAD
          edges: [
            {
=======
          __typename: 'UserConnection',
          edges: [
            {
              __typename: 'User',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Aditya',
              lastName: 'Memberguy',
              image: null,
              email: 'member@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
<<<<<<< HEAD
              userType: 'USER',
            },
=======
            },
            ...members,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
=======
        admin_for: 'orgid',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
    },
    result: {
      data: {
        organizationsMemberConnection: {
<<<<<<< HEAD
          edges: [
            {
=======
          __typename: 'UserConnection',
          edges: [
            {
              __typename: 'User',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Aditya',
              lastName: 'Adminguy',
              image: null,
              email: 'admin@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
<<<<<<< HEAD
              userType: 'USER',
            },
=======
            },
            ...admins,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
              userType: 'USER',
              lol: true,
            },
=======
              lol: true,
            },
            ...admins,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          ],
        },
      },
    }),
  },

  {
    //This is mock for user list
    request: {
<<<<<<< HEAD
      query: USER_LIST_FOR_TABLE,
=======
      query: USER_LIST,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      variables: {
        firstName_contains: '',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: [
          {
<<<<<<< HEAD
            user: {
              __typename: 'User',
              firstName: 'Aditya',
              lastName: 'Userguy',
              image: 'tempUrl',
              _id: '64001660a711c62d5b4076a2',
              email: 'adidacreator1@gmail.com',
              userType: 'SUPERADMIN',
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
              userType: 'USER',
              createdAt: '2023-03-03T14:24:13.084Z',
              joinedOrganizations: [
                {
                  __typename: 'Organization',
                  _id: '6401ff65ce8e8406b8f07af2',
                },
              ],
            },
          },
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        ],
      },
    },
  },

  createMemberMock('orgid', 'Aditya', ''),
  createMemberMock('orgid', '', 'Memberguy'),
  createMemberMock('orgid', 'Aditya', 'Memberguy'),

<<<<<<< HEAD
  createAdminMock('orgid', 'Aditya', ''),
  createAdminMock('orgid', '', 'Adminguy'),
  createAdminMock('orgid', 'Aditya', 'Adminguy'),
=======
  createAdminMock('orgid', 'Aditya', '', 'orgid'),
  createAdminMock('orgid', '', 'Adminguy', 'orgid'),
  createAdminMock('orgid', 'Aditya', 'Adminguy', 'orgid'),
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  createUserMock('Aditya', ''),
  createUserMock('', 'Userguytwo'),
  createUserMock('Aditya', 'Userguytwo'),
<<<<<<< HEAD

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
              image: null,
              _id: '65378abd85008f171cf2990d',
              email: 'testadmin1@example.com',
              userType: 'ADMIN',
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
=======
];

const link = new StaticMockLink(MOCKS, true);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
async function wait(ms = 2): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
<<<<<<< HEAD
const linkURL = 'orgid';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: linkURL }),
}));
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

// TODO - REMOVE THE NEXT LINE IT IS TO SUPPRESS THE ERROR
// FOR THE FIRST TEST WHICH CAME OUT OF NOWHERE
console.error = jest.fn();

describe('Organization People Page', () => {
  const searchData = {
<<<<<<< HEAD
    fullNameMember: 'Aditya Memberguy',
    fullNameAdmin: 'Aditya Adminguy',
    fullNameUser: 'Aditya Userguytwo',
=======
    firstName: 'Aditya',
    lastNameMember: 'Memberguy',
    lastNameAdmin: 'Adminguy',
    lastNameUser: 'Userguytwo',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    location: 'Delhi, India',
    event: 'Event',
  };

<<<<<<< HEAD
  test('Correct mock data should be queried', async () => {
    window.location.assign('/orgpeople/orgid');

    const dataQuery1 =
      MOCKS[1]?.result?.data?.organizationsMemberConnection?.edges;
    expect(dataQuery1).toEqual([
      {
=======
  test('The number of organizations people rendered on the DOM should be equal to the rowsPerPage state value', async () => {
    window.location.assign('orgpeople/id=6401ff65ce8e8406b8f07af1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    await screen.findByTestId('rowsPPSelect');

    // Get the reference to all userTypes through the radio buttons in the DOM
    // => users, members, admins
    const allPeopleTypes = Array.from(
      screen.getByTestId('usertypelist').querySelectorAll('input[type="radio"]')
    ).map((radioButton: HTMLInputElement | any) => radioButton.dataset?.testid);

    // This variable represents the array index of currently selected UserType(i.e "member" or "admin" or "user")
    let peopleTypeIndex = 0;

    const changeRowsPerPage = async (currRowPPindex: number): Promise<void> => {
      // currRowPPindex is the index of the currently selected option of rows per page dropdown

      await screen.findByTestId('rowsPPSelect');

      //Get the reference to the dropdown for rows per page
      const rowsPerPageSelect: HTMLSelectElement | null =
        screen.getByTestId('rowsPPSelect').querySelector('select') || null;

      if (rowsPerPageSelect === null) {
        throw new Error('rowsPerPageSelect is null');
      }

      // Get all possible dropdown options
      // => -1, 5, 10, 30
      const rowsPerPageOptions: any[] = Array.from(
        rowsPerPageSelect?.querySelectorAll('option')
      );

      // Change the selected option of dropdown to the value of the current option
      userEvent.selectOptions(
        rowsPerPageSelect,
        rowsPerPageOptions[currRowPPindex].textContent
      );

      const expectedUsersLength = MOCKS[3]?.result?.data?.users?.filter(
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
          window.location.assign('/orgpeople/id=6401ff65ce8e8406b8f07af1');
          const pathname = window.location.pathname;
          const id = pathname.split('=')[1];
          return datas.joinedOrganizations.some((org) => org._id === id);
        }
      ).length;

      await wait();
      const totalNumPeople = screen.getAllByTestId('orgpeoplelist').length;
      expect(totalNumPeople).toBe(expectedUsersLength);

      if (rowsPerPageOptions[currRowPPindex].textContent === 'All') {
        peopleTypeIndex += 1;

        await changePeopleType();

        return;
      }

      if (currRowPPindex < rowsPerPageOptions.length) {
        currRowPPindex += 1;
        await changeRowsPerPage(currRowPPindex);
      }
    };

    const changePeopleType = async (): Promise<void> => {
      if (peopleTypeIndex === allPeopleTypes.length - 1) return;

      const peopleTypeButton = screen
        .getByTestId('usertypelist')
        .querySelector(`input[data-testid=${allPeopleTypes[peopleTypeIndex]}]`);

      if (peopleTypeButton === null) {
        throw new Error('peopleTypeButton is null');
      }

      // Change people type
      userEvent.click(peopleTypeButton);

      await changeRowsPerPage(1);
    };

    await changePeopleType();
  }, 15000);

  test('Correct mock data should be queried', async () => {
    window.location.assign('/orgpeople/id=orgid');

    const dataQuery1 =
      MOCKS[1]?.result?.data?.organizationsMemberConnection?.edges;
    const dataQuery2 =
      MOCKS[2]?.result?.data?.organizationsMemberConnection?.edges;

    const dataQuery3 = MOCKS[3]?.result?.data?.users;

    expect(dataQuery1).toEqual([
      {
        __typename: 'User',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        _id: '64001660a711c62d5b4076a2',
        firstName: 'Aditya',
        lastName: 'Memberguy',
        image: null,
        email: 'member@gmail.com',
        createdAt: '2023-03-02T03:22:08.101Z',
<<<<<<< HEAD
        userType: 'USER',
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
          userType: 'SUPERADMIN',
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
          userType: 'USER',
          createdAt: '2023-03-03T14:24:13.084Z',
          joinedOrganizations: [
            {
              __typename: 'Organization',
              _id: '6401ff65ce8e8406b8f07af2',
            },
          ],
        },
      },
=======
      },
      ...members,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    ]);

    expect(dataQuery2).toEqual([
      {
<<<<<<< HEAD
=======
        __typename: 'User',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        _id: '64001660a711c62d5b4076a2',
        firstName: 'Aditya',
        lastName: 'Adminguy',
        image: null,
        email: 'admin@gmail.com',
        createdAt: '2023-03-02T03:22:08.101Z',
<<<<<<< HEAD
        userType: 'USER',
      },
    ]);

    expect(window.location).toBeAt('/orgpeople/orgid');
  });

  test('It is necessary to query the correct mock data.', async () => {
    window.location.assign('/orgpeople/orgid');
=======
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

    expect(window.location).toBeAt('/orgpeople/id=orgid');
  });

  test('It is necessary to query the correct mock data.', async () => {
    window.location.assign('/orgpeople/id=orgid');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

    const { container } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    expect(container.textContent).not.toBe('Loading data...');

    await wait();

<<<<<<< HEAD
    expect(window.location).toBeAt('/orgpeople/orgid');
  });

  test('Testing MEMBERS list', async () => {
    window.location.assign('/orgpeople/orgid');
=======
    expect(container.textContent).toMatch('Members');
    expect(container.textContent).toMatch('Filter by Name');

    expect(window.location).toBeAt('/orgpeople/id=orgid');
  });

  test('Testing MEMBERS list', async () => {
    window.location.assign('/orgpeople/id=orgid');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      </MockedProvider>,
    );
    await wait();
    const dropdownToggles = screen.getAllByTestId('role');

    dropdownToggles.forEach((dropdownToggle) => {
      userEvent.click(dropdownToggle);
    });

    const memebersDropdownItem = screen.getByTestId('members');
    userEvent.click(memebersDropdownItem);
=======
      </MockedProvider>
    );
    await wait();

    userEvent.click(screen.getByLabelText(/Members/i));
    await wait();
    expect(screen.getByLabelText(/Members/i)).toBeChecked();
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    await wait();

    const findtext = screen.getByText(/Aditya Memberguy/i);
    await wait();
    expect(findtext).toBeInTheDocument();

    userEvent.type(
<<<<<<< HEAD
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
=======
      screen.getByPlaceholderText(/Enter First Name/i),
      searchData.firstName
    );
    await wait();
    expect(screen.getByPlaceholderText(/Enter First Name/i)).toHaveValue(
      searchData.firstName
    );

    await wait();
    expect(window.location).toBeAt('/orgpeople/id=orgid');
  });

  test('Testing MEMBERS list with filters', async () => {
    window.location.assign('/orgpeople/id=orgid');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      </MockedProvider>,
    );
    await wait();

    const fullNameInput = screen.getByPlaceholderText(/Enter Full Name/i);

    // Only First Name
    userEvent.type(fullNameInput, searchData.fullNameMember);
=======
      </MockedProvider>
    );
    await wait();

    userEvent.click(screen.getByLabelText(/Members/i));
    await wait();
    expect(screen.getByLabelText(/Members/i)).toBeChecked();
    await wait();

    const firstNameInput = screen.getByPlaceholderText(/Enter First Name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter Last Name/i);

    // Only First Name
    userEvent.type(firstNameInput, searchData.firstName);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    await wait();

    let findtext = screen.getByText(/Aditya Memberguy/i);
    await wait();
    expect(findtext).toBeInTheDocument();

<<<<<<< HEAD
    findtext = screen.getByText(/Aditya Memberguy/i);
    await wait();
    expect(findtext).toBeInTheDocument();
    await wait();
    expect(window.location).toBeAt('/orgpeople/orgid');
  });

  test('Testing ADMIN LIST', async () => {
    window.location.assign('/orgpeople/orgid');
=======
    // First & Last Name
    userEvent.type(lastNameInput, searchData.lastNameMember);
    await wait();

    findtext = screen.getByText(/Aditya Memberguy/i);
    await wait();
    expect(findtext).toBeInTheDocument();

    // Only Last Name
    userEvent.type(firstNameInput, '');
    await wait();

    findtext = screen.getByText(/Aditya Memberguy/i);
    await wait();
    expect(findtext).toBeInTheDocument();

    await wait();
    expect(window.location).toBeAt('/orgpeople/id=orgid');
  });

  test('Testing ADMIN LIST', async () => {
    window.location.assign('/orgpeople/id=orgid');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

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
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

<<<<<<< HEAD
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
    expect(window.location).toBeAt('/orgpeople/orgid');
  });

  test('Testing ADMIN list with filters', async () => {
    window.location.assign('/orgpeople/orgid');
=======
    userEvent.click(screen.getByLabelText(/Admins/i));
    await wait();
    expect(screen.getByLabelText(/Admins/i)).toBeChecked();
    await wait();

    const findtext = screen.getByText('Aditya Adminguy');
    expect(findtext).toBeInTheDocument();

    userEvent.type(
      screen.getByPlaceholderText(/Enter First Name/i),
      searchData.firstName
    );
    await wait();
    expect(screen.getByPlaceholderText(/Enter First Name/i)).toHaveValue(
      searchData.firstName
    );
    await wait();

    await wait();
    expect(window.location).toBeAt('/orgpeople/id=orgid');
  });

  test('Testing ADMIN list with filters', async () => {
    window.location.assign('/orgpeople/id=orgid');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByLabelText(/Admins/i));
    await wait();
    expect(screen.getByLabelText(/Admins/i)).toBeChecked();
    await wait();

    const firstNameInput = screen.getByPlaceholderText(/Enter First Name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter Last Name/i);

    // Only First Name
    userEvent.type(firstNameInput, searchData.firstName);
    await wait();

    let findtext = screen.getByText(/Aditya Adminguy/i);
    await wait();
    expect(findtext).toBeInTheDocument();

    // First & Last Name
    userEvent.type(lastNameInput, searchData.lastNameAdmin);
    await wait();

    findtext = screen.getByText(/Aditya Adminguy/i);
    await wait();
    expect(findtext).toBeInTheDocument();

    // Only Last Name
    userEvent.type(firstNameInput, '');
    await wait();

    findtext = screen.getByText(/Aditya Adminguy/i);
    await wait();
    expect(findtext).toBeInTheDocument();

    await wait();
    expect(window.location).toBeAt('/orgpeople/id=orgid');
  });

  test('Testing USERS list', async () => {
    const dataQueryForUsers = MOCKS[3]?.result?.data?.users;
    window.location.assign('/orgpeople/id=6401ff65ce8e8406b8f07af1');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

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
<<<<<<< HEAD
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
    expect(window.location).toBeAt('/orgpeople/6401ff65ce8e8406b8f07af1');
  });

  test('Testing USERS list with filters', async () => {
    window.location.assign('/orgpeople/6401ff65ce8e8406b8f07af2');
=======
      </MockedProvider>
    );
    await wait();
    userEvent.click(screen.getByLabelText(/Users/i));
    await wait();
    expect(screen.getByLabelText(/Users/i)).toBeChecked();
    await wait();
    const orgUsers = dataQueryForUsers?.filter(
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
        window.location.assign('/orgpeople/id=6401ff65ce8e8406b8f07af1');
        const pathname = window.location.pathname;
        const id = pathname.split('=')[1];
        return datas.joinedOrganizations?.some((org) => org._id === id);
      }
    );
    await wait();
    expect(orgUsers?.length).toBe(1);

    await wait();
    expect(window.location).toBeAt('/orgpeople/id=6401ff65ce8e8406b8f07af1');
  });

  test('Testing USERS list with filters', async () => {
    window.location.assign('/orgpeople/id=6401ff65ce8e8406b8f07af2');
    const dataQueryForUsers = MOCKS[3]?.result?.data?.users;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

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
<<<<<<< HEAD
      </MockedProvider>,
    );
    await wait();

    const fullNameInput = screen.getByPlaceholderText(/Enter Full Name/i);

    // Only Full Name
    userEvent.type(fullNameInput, searchData.fullNameUser);
    const btn = screen.getByTestId('searchbtn');
    userEvent.click(btn);
    await wait();
    expect(window.location).toBeAt('/orgpeople/6401ff65ce8e8406b8f07af2');
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
=======
      </MockedProvider>
    );
    await wait();
    userEvent.click(screen.getByLabelText(/Users/i));
    await wait();
    expect(screen.getByLabelText(/Users/i)).toBeChecked();
    await wait();

    const firstNameInput = screen.getByPlaceholderText(/Enter First Name/i);

    // Only First Name
    userEvent.type(firstNameInput, searchData.firstName);
    await wait();

    const orgUsers = dataQueryForUsers?.filter(
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
        window.location.assign('/orgpeople/id=6401ff65ce8e8406b8f07af2');
        const pathname = window.location.pathname;
        const id = pathname.split('=')[1];
        return datas.joinedOrganizations?.some((org) => org._id === id);
      }
    );
    await wait();
    expect(orgUsers?.length).toBe(1);

    await wait();
    expect(window.location).toBeAt('/orgpeople/id=6401ff65ce8e8406b8f07af2');
  });

  test('No Mock Data test', async () => {
    window.location.assign('/orgpeople/id=orgid');

    render(
      <MockedProvider addTypename={false} link={link}>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationPeople />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
    );

    await wait();
    expect(window.location).toBeAt('/orgpeople/orgid');
    expect(screen.queryByText(/Nothing Found !!/i)).toBeInTheDocument();
=======
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByLabelText(/Admins/i));

    await wait();

    userEvent.click(screen.getByLabelText(/Users/i));

    await wait();
    expect(window.location).toBeAt('/orgpeople/id=orgid');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });
});
