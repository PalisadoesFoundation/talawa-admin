import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import BlockUser from './BlockUser';
import {
  BLOCKED_USERS_LIST,
  ORGANIZATIONS_LIST,
} from 'GraphQl/Queries/Queries';
import {
  BLOCK_USER_MUTATION,
  UNBLOCK_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import 'jest-location-mock';
import { ToastContainer } from 'react-toastify';

let userQueryCalled = false;

const USER_BLOCKED = {
  _id: '123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  organizationsBlockedBy: [
    {
      _id: 'orgid',
    },
  ],
};

const USER_UNBLOCKED = {
  _id: '456',
  firstName: 'Sam',
  lastName: 'Smith',
  email: 'samsmith@gmail.com',
  organizationsBlockedBy: [],
};

const DATA_INITIAL = {
  data: {
    users: [USER_BLOCKED, USER_UNBLOCKED],
  },
};

const DATA_AFTER_MUTATION = {
  data: {
    users: [
      {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        organizationsBlockedBy: [],
      },
      {
        _id: '456',
        firstName: 'Sam',
        lastName: 'Smith',
        email: 'samsmith@gmail.com',
        organizationsBlockedBy: [
          {
            _id: 'orgid',
          },
        ],
      },
    ],
  },
};

const MOCKS = [
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
    request: {
      query: BLOCK_USER_MUTATION,
      variables: {
        userId: '456',
        orgId: 'orgid',
      },
    },
    result: {
      data: {
        blockUser: {
          _id: '456',
        },
      },
    },
  },

  {
    request: {
      query: UNBLOCK_USER_MUTATION,
      variables: {
        userId: '123',
        orgId: 'orgid',
      },
    },
    result: {
      data: {
        unblockUser: {
          _id: '123',
        },
      },
    },
  },

  {
    request: {
      query: BLOCKED_USERS_LIST,
      variables: {
        firstName_contains: '',
        lastName_contains: '',
        member_of: 'orgid',
      },
    },
    result: DATA_INITIAL,
    newData: () => {
      if (userQueryCalled) {
        return DATA_AFTER_MUTATION;
      } else {
        userQueryCalled = true;

        return DATA_INITIAL;
      }
    },
  },

  {
    request: {
      query: BLOCKED_USERS_LIST,
      variables: {
        firstName_contains: 'john',
        lastName_contains: '',
        member_of: 'orgid',
      },
    },
    result: {
      data: {
        users: [USER_BLOCKED],
      },
    },
  },

  {
    request: {
      query: BLOCKED_USERS_LIST,
      variables: {
        firstName_contains: '',
        lastName_contains: 'doe',
        member_of: 'orgid',
      },
    },
    result: {
      data: {
        users: [USER_BLOCKED],
      },
    },
  },

  {
    request: {
      query: BLOCKED_USERS_LIST,
      variables: {
        firstName_contains: 'sam',
        lastName_contains: 'smith',
        member_of: 'orgid',
      },
    },
    result: {
      data: {
        users: [USER_UNBLOCKED],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 500) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Block/Unblock user screen', () => {
  beforeEach(() => {
    userQueryCalled = false;
  });

  test('Components should be rendered properly', async () => {
    window.location.assign('/blockuser/id=orgid');

    render(
      <MockedProvider addTypename={true} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByText('Search By Name')).toBeInTheDocument();
    expect(screen.getByText('List of Users who spammed')).toBeInTheDocument();

    expect(window.location).toBeAt('/blockuser/id=orgid');
  });

  test('Testing block user functionality', async () => {
    window.location.assign('/blockuser/id=orgid');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByTestId('unBlockUser123')).toBeInTheDocument();
    expect(screen.getByTestId('blockUser456')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('unBlockUser123'));
    await wait();

    expect(screen.getByTestId('blockUser123')).toBeInTheDocument();
    expect(screen.getByTestId('unBlockUser456')).toBeInTheDocument();

    expect(window.location).toBeAt('/blockuser/id=orgid');
  });

  test('Testing unblock user functionality', async () => {
    window.location.assign('/blockuser/id=orgid');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByTestId('unBlockUser123')).toBeInTheDocument();
    expect(screen.getByTestId('blockUser456')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('blockUser456'));
    await wait();

    expect(screen.getByTestId('blockUser123')).toBeInTheDocument();
    expect(screen.getByTestId('unBlockUser456')).toBeInTheDocument();

    expect(window.location).toBeAt('/blockuser/id=orgid');
  });

  test('Testing First Name Filter', async () => {
    window.location.assign('/blockuser/id=orgid');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();

    const firstNameInput = screen.getByPlaceholderText(/Enter First Name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter Last Name/i);

    userEvent.type(firstNameInput, 'john');

    expect(firstNameInput).toHaveValue('john');
    expect(lastNameInput).toHaveValue('');

    await wait(700);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Sam Smith')).not.toBeInTheDocument();

    expect(window.location).toBeAt('/blockuser/id=orgid');
  });

  test('Testing Last Name Filter', async () => {
    window.location.assign('/blockuser/id=orgid');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();

    const firstNameInput = screen.getByPlaceholderText(/Enter First Name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter Last Name/i);

    userEvent.type(lastNameInput, 'doe');

    await wait(700);

    expect(firstNameInput).toHaveValue('');
    expect(lastNameInput).toHaveValue('doe');

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Sam Smith')).not.toBeInTheDocument();

    expect(window.location).toBeAt('/blockuser/id=orgid');
  });

  test('Testing Full Name Filter', async () => {
    window.location.assign('/blockuser/id=orgid');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
              <ToastContainer />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();

    const firstNameInput = screen.getByPlaceholderText(/Enter First Name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter Last Name/i);

    userEvent.type(firstNameInput, 'sam');
    userEvent.type(lastNameInput, 'smith');

    expect(firstNameInput).toHaveValue('sam');
    expect(lastNameInput).toHaveValue('smith');

    await wait(700);

    expect(screen.getByText('Sam Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();

    expect(window.location).toBeAt('/blockuser/id=orgid');
  });

  test('Testing All Members', async () => {
    window.location.assign('/blockuser/id=orgid');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
              <ToastContainer />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByLabelText(/All Members/i));
    await wait();

    expect(screen.getByLabelText(/All Members/i)).toBeChecked();
    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();

    expect(window.location).toBeAt('/blockuser/id=orgid');
  });

  test('Testing Blocked Members', async () => {
    window.location.assign('/blockuser/id=orgid');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
              <ToastContainer />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByLabelText(/Blocked Members/i));
    await wait();

    expect(screen.getByLabelText(/Blocked Members/i)).toBeChecked();
    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Sam Smith')).not.toBeInTheDocument();

    expect(window.location).toBeAt('/blockuser/id=orgid');
  });

  test('Testing table data getting rendered', async () => {
    window.location.assign('/orglist/id=orgid');
    const link = new StaticMockLink(MOCKS, true);
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByTestId(/blockedusers/)).toBeInTheDocument();
    expect(screen.getByTestId(/allusers/)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();
  });
});
