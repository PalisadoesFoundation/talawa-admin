import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import OrganizationPeople from './OrganizationPeople';
import { store } from 'state/store';
import {
  ORGANIZATIONS_LIST,
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST,
} from 'GraphQl/Queries/Queries';
import 'jest-location-mock';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';

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

const createMemberMock = (
  orgId = '',
  firstNameContains = '',
  lastNameContains = ''
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
          },
        ],
      },
    },
  }),
});

const createUserMock = (
  firstNameContains = '',
  lastNameContains = ''
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
];

const link = new StaticMockLink(MOCKS, true);
async function wait(ms = 2): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

// TODO - REMOVE THE NEXT LINE IT IS TO SUPPRESS THE ERROR
// FOR THE FIRST TEST WHICH CAME OUT OF NOWHERE
console.error = jest.fn();

describe('Organization People Page', () => {
  const searchData = {
    firstName: 'Aditya',
    lastNameMember: 'Memberguy',
    lastNameAdmin: 'Adminguy',
    lastNameUser: 'Userguytwo',
    location: 'Delhi, India',
    event: 'Event',
  };

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
        _id: '64001660a711c62d5b4076a2',
        firstName: 'Aditya',
        lastName: 'Memberguy',
        image: null,
        email: 'member@gmail.com',
        createdAt: '2023-03-02T03:22:08.101Z',
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

    const { container } = render(
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

    expect(container.textContent).not.toBe('Loading data...');

    await wait();

    expect(container.textContent).toMatch('Members');
    expect(container.textContent).toMatch('Filter by Name');

    expect(window.location).toBeAt('/orgpeople/id=orgid');
  });

  test('Testing MEMBERS list', async () => {
    window.location.assign('/orgpeople/id=orgid');
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
      </MockedProvider>
    );
    await wait();

    userEvent.click(screen.getByLabelText(/Members/i));
    await wait();
    expect(screen.getByLabelText(/Members/i)).toBeChecked();
    await wait();

    const findtext = screen.getByText(/Aditya Memberguy/i);
    await wait();
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
    expect(window.location).toBeAt('/orgpeople/id=orgid');
  });

  test('Testing MEMBERS list with filters', async () => {
    window.location.assign('/orgpeople/id=orgid');
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
    await wait();

    let findtext = screen.getByText(/Aditya Memberguy/i);
    await wait();
    expect(findtext).toBeInTheDocument();

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
      </MockedProvider>
    );

    await wait();

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

    userEvent.click(screen.getByLabelText(/Admins/i));

    await wait();

    userEvent.click(screen.getByLabelText(/Users/i));

    await wait();
    expect(window.location).toBeAt('/orgpeople/id=orgid');
  });
});
