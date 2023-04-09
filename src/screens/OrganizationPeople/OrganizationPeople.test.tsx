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
  });
}

const MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: {
        id: undefined,
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
        orgId: undefined,
        firstName_contains: '',
        event_title_contains: '',
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
    //This is mock for Admin list
    request: {
      query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
      variables: {
        orgId: undefined,
        firstName_contains: '',
        admin_for: undefined,
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
          },
          ...users,
        ],
      },
    },
  },
];
const link = new StaticMockLink(MOCKS, true);
async function wait(ms = 2) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

// The numbers added to the total number of each people type is based
// on the number of the prepended objects in the mocks being added to
// the generated ones
const getTotalNumPeople = (userType: string) => {
  switch (userType) {
    case 'members':
      return members.length + 1;
    case 'users':
      return users.length + 2;
    case 'admins':
      return admins.length + 1;
  }
};

describe('Organisation People Page', () => {
  const searchData = {
    name: 'Aditya',
    location: 'Delhi, India',
    event: 'Event',
  };

  test('The number of organizations people rendered on the DOM should be equal to the rowsPerPage state value', async () => {
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
    const allPeopleTypes = Array.from(
      screen.getByTestId('usertypelist').querySelectorAll('input[type="radio"]')
    ).map((radioButton: HTMLInputElement | any) => radioButton.dataset?.testid);

    // This variable represents the array index of currently selected UserType(i.e "member" or "admin" or "user")
    let peopleTypeIndex = 0;

    const changeRowsPerPage = async (currRowPPindex: number) => {
      // currRowPPindex is the index of the currently selected option of rows per page dropdown

      await screen.findByTestId('rowsPPSelect');

      //Get the reference to the dropdown for rows per page
      const rowsPerPageSelect: HTMLSelectElement | null =
        screen.getByTestId('rowsPPSelect').querySelector('select') || null;

      if (rowsPerPageSelect === null) {
        throw new Error('rowsPerPageSelect is null');
      }

      // Get all possible dropdown options
      const rowsPerPageOptions: any[] = Array.from(
        rowsPerPageSelect?.querySelectorAll('option')
      );

      const peopleListContainer = screen.getByTestId('orgpeoplelist');

      //Change the selected option of dropdown to the value of the current option
      userEvent.selectOptions(
        rowsPerPageSelect,
        rowsPerPageOptions[currRowPPindex].textContent
      );

      const totalNumPeople =
        rowsPerPageOptions[currRowPPindex].textContent === 'All'
          ? getTotalNumPeople(allPeopleTypes[peopleTypeIndex])
          : parseInt(rowsPerPageOptions[currRowPPindex].value);

      expect(
        Array.from(
          peopleListContainer.querySelectorAll('[data-testid="peoplelistitem"]')
        ).length
      ).toBe(totalNumPeople);

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

    const changePeopleType = async () => {
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
      },
      ...users,
    ]);
  });

  test('It is necessary to query the correct mock data.', async () => {
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
    window.location.assign('/orgpeople/id=6401ff65ce8e8406b8f07af1');
    expect(window.location).toBeAt('/orgpeople/id=6401ff65ce8e8406b8f07af1');
  });

  test('Testing MEMBERS list', async () => {
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
    userEvent.type(screen.getByPlaceholderText(/Enter Name/i), searchData.name);
    await wait();
    expect(screen.getByPlaceholderText(/Enter Name/i)).toHaveValue(
      searchData.name
    );
  });

  test('Testing ADMIN LIST', async () => {
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
    userEvent.click(screen.getByLabelText(/Admins/i));
    await wait();
    expect(screen.getByLabelText(/Admins/i)).toBeChecked();
    await wait();
    const findtext = screen.getByText('Aditya Adminguy');
    expect(findtext).toBeInTheDocument();

    userEvent.type(screen.getByPlaceholderText(/Enter Name/i), searchData.name);
    await wait();
    expect(screen.getByPlaceholderText(/Enter Name/i)).toHaveValue(
      searchData.name
    );
    await wait();
  });

  test('Testing USERS list', async () => {
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
    const findtext = screen.getByText('Aditya Userguy');
    expect(findtext).toBeInTheDocument();
  });

  test('No Mock Data test', async () => {
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
  });
});
