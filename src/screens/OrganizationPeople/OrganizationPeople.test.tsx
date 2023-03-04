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
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST,
} from 'GraphQl/Queries/Queries';
import 'jest-location-mock';
import i18nForTest from 'utils/i18nForTest';

const MOCKS = [
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
        ],
      },
    },
  },
];

async function wait(ms = 2) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Organisation People Page', () => {
  const searchData = {
    name: 'Aditya',
    location: 'Delhi, India',
    event: 'Event',
  };

  test('Correct mock data should be queried', async () => {
    const dataQuery1 =
      MOCKS[0]?.result?.data?.organizationsMemberConnection?.edges;
    const dataQuery2 =
      MOCKS[1]?.result?.data?.organizationsMemberConnection?.edges;
    const dataQuery3 = MOCKS[2]?.result?.data?.users;

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
    ]);
  });

  test('It is necessary to query the correct mock data.', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
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
    expect(container.textContent).toMatch('Filter by Event');
    window.location.assign('/orgpeople/id=6401ff65ce8e8406b8f07af1');
    expect(window.location).toBeAt('/orgpeople/id=6401ff65ce8e8406b8f07af1');
  });

  test('Testing MEMBERS list', async () => {
    render(
      <MockedProvider
        addTypename={true}
        mocks={MOCKS}
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
    userEvent.type(
      screen.getByPlaceholderText(/Enter Event/i),
      searchData.event
    );
    expect(screen.getByPlaceholderText(/Enter Name/i)).toHaveValue(
      searchData.name
    );
    expect(screen.getByPlaceholderText(/Enter Event/i)).toHaveValue(
      searchData.event
    );
  });

  test('Testing ADMIN LIST', async () => {
    window.location.assign('/orgpeople/id=6401ff65ce8e8406b8f07af1');
    render(
      <MockedProvider
        addTypename={true}
        mocks={MOCKS}
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
    userEvent.type(
      screen.getByPlaceholderText(/Enter Event/i),
      searchData.event
    );
    await wait();
    expect(screen.getByPlaceholderText(/Enter Name/i)).toHaveValue(
      searchData.name
    );
    await wait();
    expect(screen.getByPlaceholderText(/Enter Event/i)).toHaveValue(
      searchData.event
    );
  });

  test('Testing USERS list', async () => {
    window.location.assign('/orgpeople/id=6401ff65ce8e8406b8f07af1');
    render(
      <MockedProvider
        addTypename={true}
        mocks={MOCKS}
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

  test('No Mock Data', async () => {
    render(
      <MockedProvider addTypename={false}>
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
