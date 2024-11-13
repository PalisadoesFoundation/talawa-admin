import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  BLOCK_USER_MUTATION,
  UNBLOCK_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import {
  BLOCK_PAGE_MEMBER_LIST,
  ORGANIZATIONS_LIST,
} from 'GraphQl/Queries/Queries';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';

import BlockUser from './BlockUser';

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
const MOCKS_EMPTY = [
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
const link2 = new StaticMockLink(MOCKS_EMPTY, true);

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: 'orgid' }),
}));

describe('Testing Block/Unblock user screen', () => {
  beforeEach(() => {
    userQueryCalled = false;
  });

  test('Components should be rendered properly', async () => {
    window.location.assign('/blockuser/orgid');

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

    expect(window.location).toBeAt('/blockuser/orgid');
  });

  test('Testing block user functionality', async () => {
    window.location.assign('/blockuser/orgid');

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

    await act(async () => {
      userEvent.click(screen.getByTestId('userFilter'));
    });
    userEvent.click(screen.getByTestId('showMembers'));
    await wait();

    expect(screen.getByTestId('unBlockUser123')).toBeInTheDocument();
    expect(screen.getByTestId('blockUser456')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('unBlockUser123'));
    await wait();

    expect(screen.getByTestId('blockUser123')).toBeInTheDocument();
    expect(screen.getByTestId('unBlockUser456')).toBeInTheDocument();

    expect(window.location).toBeAt('/blockuser/orgid');
  });

  test('Testing unblock user functionality', async () => {
    window.location.assign('/blockuser/orgid');

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
    await act(async () => {
      userEvent.click(screen.getByTestId('userFilter'));
    });
    userEvent.click(screen.getByTestId('showMembers'));

    await wait();

    expect(screen.getByTestId('unBlockUser123')).toBeInTheDocument();
    expect(screen.getByTestId('blockUser456')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('blockUser456'));
    await wait();

    expect(screen.getByTestId('blockUser123')).toBeInTheDocument();
    expect(screen.getByTestId('unBlockUser456')).toBeInTheDocument();

    expect(window.location).toBeAt('/blockuser/orgid');
  });

  test('Testing First Name Filter', async () => {
    window.location.assign('/blockuser/orgid');

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
    await act(async () => {
      userEvent.click(screen.getByTestId('userFilter'));
    });
    userEvent.click(screen.getByTestId('showMembers'));

    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();

    // Open Dropdown
    await act(async () => {
      userEvent.click(screen.getByTestId('nameFilter'));
    });
    // Select option and enter first name
    userEvent.click(screen.getByTestId('searchByFirstName'));
    const firstNameInput = screen.getByPlaceholderText(/Search by First Name/i);
    userEvent.type(firstNameInput, 'john{enter}');

    await wait(700);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Sam Smith')).not.toBeInTheDocument();

    expect(window.location).toBeAt('/blockuser/orgid');
  });

  test('Testing Last Name Filter', async () => {
    window.location.assign('/blockuser/orgid');

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

    await act(async () => {
      userEvent.click(screen.getByTestId('userFilter'));
    });
    userEvent.click(screen.getByTestId('showMembers'));

    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();

    // Open Dropdown
    await act(async () => {
      userEvent.click(screen.getByTestId('nameFilter'));
    });
    // Select option and enter last name
    userEvent.click(screen.getByTestId('searchByLastName'));
    const lastNameInput = screen.getByPlaceholderText(/Search by Last Name/i);
    userEvent.type(lastNameInput, 'doe{enter}');

    await wait(700);

    expect(lastNameInput).toHaveValue('doe');
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Sam Smith')).not.toBeInTheDocument();
    expect(window.location).toBeAt('/blockuser/orgid');
  });

  test('Testing No Spammers Present', async () => {
    window.location.assign('/blockuser/orgid');
    render(
      <MockedProvider addTypename={false} link={link2}>
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
    expect(screen.getByText(/No spammer found/i)).toBeInTheDocument();
    expect(window.location).toBeAt('/blockuser/orgid');
  });

  test('Testing All Members', async () => {
    window.location.assign('/blockuser/orgid');

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
      </MockedProvider>,
    );
    await wait();
    await act(async () => {
      userEvent.click(screen.getByTestId('userFilter'));
    });
    userEvent.click(screen.getByTestId('showMembers'));

    await wait(700);

    expect(screen.getByTestId(/userFilter/i)).toHaveTextContent('All Members');
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();

    expect(window.location).toBeAt('/blockuser/orgid');
  });

  test('Testing Blocked Users', async () => {
    window.location.assign('/blockuser/orgid');

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
      </MockedProvider>,
    );

    await act(async () => {
      userEvent.click(screen.getByTestId('userFilter'));
    });

    userEvent.click(screen.getByTestId('showBlockedMembers'));
    await wait();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Sam Smith')).not.toBeInTheDocument();

    expect(window.location).toBeAt('/blockuser/orgid');
  });

  test('Testing table data getting rendered', async () => {
    window.location.assign('/orglist/orgid');
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
      </MockedProvider>,
    );
    await act(async () => {
      userEvent.click(screen.getByTestId('userFilter'));
    });
    userEvent.click(screen.getByTestId('showMembers'));

    await wait();

    expect(screen.getByTestId(/userList/)).toBeInTheDocument();
    expect(screen.getAllByText('Block/Unblock')).toHaveLength(1);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();
  });

  test('Testing No Results Found', async () => {
    window.location.assign('/blockuser/orgid');
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const input = screen.getByPlaceholderText('Search By First Name');
    await act(async () => {
      userEvent.type(input, 'Peter{enter}');
    });
    await wait(700);
    expect(
      screen.getByText(`No results found for "Peter"`),
    ).toBeInTheDocument();
    expect(window.location).toBeAt('/blockuser/orgid');
  });

  test('Testing Search functionality', async () => {
    window.location.assign('/blockuser/orgid');

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
      </MockedProvider>,
    );
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
});
