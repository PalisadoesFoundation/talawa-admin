import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  BLOCK_USER_MUTATION,
  UNBLOCK_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import {
  BLOCK_PAGE_MEMBER_LIST,
  ORGANIZATIONS_LIST,
} from 'GraphQl/Queries/Queries';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import { toast } from 'react-toastify';
import BlockUser from './BlockUser';
import { vi, describe, beforeEach, test, expect } from 'vitest';

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
    organizationsMemberConnection: {
      edges: [USER_BLOCKED, USER_UNBLOCKED],
    },
  },
};

const DATA_AFTER_MUTATION = {
  data: {
    organizationsMemberConnection: {
      edges: [
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
  },
};

const INVALID_MOCKS = [
  {
    request: {
      query: BLOCK_PAGE_MEMBER_LIST,
      variables: {
        firstName_contains: '',
        lastName_contains: '',
        orgId: 'orgid',
      },
    },
    result: DATA_INITIAL,
    newData: (): typeof DATA_AFTER_MUTATION | typeof DATA_INITIAL => {
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
      query: BLOCK_USER_MUTATION,
      variables: {
        userId: '456',
        orgId: 'orgid',
      },
    },
    error: new Error('Mocked mutation error'),
  },

  {
    request: {
      query: UNBLOCK_USER_MUTATION,
      variables: {
        userId: '123',
        orgId: 'orgid',
      },
    },
    error: new Error('Mocked mutation error'),
  },
];

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
      query: BLOCK_PAGE_MEMBER_LIST,
      variables: {
        firstName_contains: '',
        lastName_contains: '',
        orgId: 'orgid',
      },
    },
    result: DATA_INITIAL,
    newData: (): typeof DATA_AFTER_MUTATION | typeof DATA_INITIAL => {
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
      query: BLOCK_PAGE_MEMBER_LIST,
      variables: {
        firstName_contains: 'john',
        lastName_contains: '',
        orgId: 'orgid',
      },
    },
    result: {
      data: {
        organizationsMemberConnection: {
          edges: [USER_BLOCKED],
        },
      },
    },
  },

  {
    request: {
      query: BLOCK_PAGE_MEMBER_LIST,
      variables: {
        firstName_contains: '',
        lastName_contains: 'doe',
        orgId: 'orgid',
      },
    },
    result: {
      data: {
        organizationsMemberConnection: {
          edges: [USER_BLOCKED],
        },
      },
    },
  },

  {
    request: {
      query: BLOCK_PAGE_MEMBER_LIST,
      variables: {
        firstName_contains: 'Peter',
        lastName_contains: '',
        orgId: 'orgid',
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
];

const link = new StaticMockLink(MOCKS, true);
const invalidLink = new StaticMockLink(INVALID_MOCKS, true);

async function wait(ms = 500): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useParams: () => ({ orgId: 'orgid' }),
  };
});

describe('Testing Block/Unblock user screen', () => {
  beforeEach(() => {
    userQueryCalled = false;
  });

  test('Components should be rendered properly', async () => {
    window.history.pushState({}, 'Test page', '/blockuser/orgid');

    render(
      <MockedProvider addTypename={true} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.getByText('Search By First Name')).toBeInTheDocument();

    expect(window.location.pathname).toBe('/blockuser/orgid');
  });

  test('Testing block user functionality', async () => {
    window.history.pushState({}, 'Test page', '/blockuser/orgid');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    userEvent.click(screen.getByTestId('userFilter'));
    userEvent.click(screen.getByTestId('allMembers'));
    await wait();

    expect(screen.getByTestId('unBlockUser123')).toBeInTheDocument();
    expect(screen.getByTestId('blockUser456')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('unBlockUser123'));
    await wait();

    expect(screen.getByTestId('blockUser123')).toBeInTheDocument();
    expect(screen.getByTestId('unBlockUser456')).toBeInTheDocument();

    expect(window.location.pathname).toBe('/blockuser/orgid');
  });

  test('Testing unblock user functionality', async () => {
    window.history.pushState({}, 'Test page', '/blockuser/orgid');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    userEvent.click(screen.getByTestId('userFilter'));
    userEvent.click(screen.getByTestId('allMembers'));

    await wait();

    expect(screen.getByTestId('unBlockUser123')).toBeInTheDocument();
    expect(screen.getByTestId('blockUser456')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('blockUser456'));
    await wait();

    expect(screen.getByTestId('blockUser123')).toBeInTheDocument();
    expect(screen.getByTestId('unBlockUser456')).toBeInTheDocument();

    expect(window.location.pathname).toBe('/blockuser/orgid');
  });

  test('Testing First Name Filter', async () => {
    window.history.pushState({}, 'Test page', '/blockuser/orgid');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    userEvent.click(screen.getByTestId('userFilter'));
    userEvent.click(screen.getByTestId('blockedUsers'));
    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Sam Smith')).not.toBeInTheDocument();

    userEvent.click(screen.getByTestId('userFilter'));
    userEvent.click(screen.getByTestId('allMembers'));
    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();

    // Open Dropdown
    userEvent.click(screen.getByTestId('nameFilter'));
    // Select option and enter first name
    userEvent.click(screen.getByTestId('searchByFirstName'));
    const firstNameInput = screen.getByPlaceholderText(/Search by First Name/i);
    userEvent.type(firstNameInput, 'john{enter}');

    await wait(700);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Sam Smith')).not.toBeInTheDocument();

    expect(window.location.pathname).toBe('/blockuser/orgid');
  });

  test('Testing Last Name Filter', async () => {
    window.history.pushState({}, 'Test page', '/blockuser/orgid');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    userEvent.click(screen.getByTestId('userFilter'));
    userEvent.click(screen.getByTestId('allMembers'));
    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();

    // Open Dropdown
    userEvent.click(screen.getByTestId('nameFilter'));
    // Select option and enter first name
    userEvent.click(screen.getByTestId('searchByLastName'));
    const firstNameInput = screen.getByPlaceholderText(/Search by Last Name/i);
    userEvent.type(firstNameInput, 'doe{enter}');

    await wait(700);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Sam Smith')).not.toBeInTheDocument();

    await wait();
    const searchBar = screen.getByTestId(/searchByName/i);
    const searchBtn = screen.getByTestId(/searchBtn/i);
    expect(searchBar).toBeInTheDocument();
    userEvent.type(searchBar, 'Dummy{enter}');
    await wait();
    userEvent.clear(searchBar);
    userEvent.type(searchBar, 'Dummy');
    userEvent.click(searchBtn);
    await wait();
    userEvent.clear(searchBar);
    userEvent.type(searchBar, '');
    userEvent.click(searchBtn);
  });

  test('Testing Error while mutation from server side', async () => {
    window.history.pushState({}, 'Test page', '/blockuser/orgid');

    render(
      <MockedProvider addTypename={true} link={invalidLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    userEvent.click(screen.getByTestId('userFilter'));
    userEvent.click(screen.getByTestId('allMembers'));
    await wait();

    userEvent.click(screen.getByTestId('blockUser456'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
    userEvent.click(screen.getByTestId('unBlockUser123'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
