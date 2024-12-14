import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from '@testing-library/react';
import { vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Users from './Users';
import { EMPTY_MOCKS, MOCKS, MOCKS2 } from './UsersMocks';

import {
  USER_LIST,
  ORGANIZATION_CONNECTION_LIST,
} from 'GraphQl/Queries/Queries';

const MOCK_USERS = [
  {
    user: {
      _id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      image: null,
      email: 'john@example.com',
      createdAt: '20/06/2022',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: {
            city: 'Kingston',
            countryCode: 'JM',
            dependentLocality: 'Sample Dependent Locality',
            line1: '123 Jamaica Street',
            line2: 'Apartment 456',
            postalCode: 'JM12345',
            sortingCode: 'ABC-123',
            state: 'Kingston Parish',
          },
          createdAt: '20/06/2022',
          creator: {
            _id: '123',
            firstName: 'John',
            lastName: 'Doe',
            image: null,
            email: 'john@example.com',
            createdAt: '20/06/2022',
          },
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: {
            city: 'Kingston',
            countryCode: 'JM',
            dependentLocality: 'Sample Dependent Locality',
            line1: '123 Jamaica Street',
            line2: 'Apartment 456',
            postalCode: 'JM12345',
            sortingCode: 'ABC-123',
            state: 'Kingston Parish',
          },
          createdAt: '20/06/2022',
          creator: {
            _id: '123',
            firstName: 'John',
            lastName: 'Doe',
            image: null,
            email: 'john@example.com',
            createdAt: '20/06/2022',
          },
        },
      ],
    },
    appUserProfile: {
      _id: 'user1',
      adminFor: [
        {
          _id: '123',
        },
      ],
      isSuperAdmin: true,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
  {
    user: {
      _id: 'user2',
      firstName: 'Jane',
      lastName: 'Doe',
      image: null,
      email: 'john@example.com',
      createdAt: '21/06/2022',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: '456',
          name: 'ABC',
          image: null,
          address: {
            city: 'Kingston',
            countryCode: 'JM',
            dependentLocality: 'Sample Dependent Locality',
            line1: '123 Jamaica Street',
            line2: 'Apartment 456',
            postalCode: 'JM12345',
            sortingCode: 'ABC-123',
            state: 'Kingston Parish',
          },
          createdAt: '21/06/2022',
          creator: {
            _id: '123',
            firstName: 'John',
            lastName: 'Doe',
            image: null,
            email: 'john@example.com',
            createdAt: '21/06/2022',
          },
        },
      ],
      joinedOrganizations: [
        {
          _id: '123',
          name: 'Palisadoes',
          image: null,
          address: {
            city: 'Kingston',
            countryCode: 'JM',
            dependentLocality: 'Sample Dependent Locality',
            line1: '123 Jamaica Street',
            line2: 'Apartment 456',
            postalCode: 'JM12345',
            sortingCode: 'ABC-123',
            state: 'Kingston Parish',
          },
          createdAt: '21/06/2022',
          creator: {
            _id: '123',
            firstName: 'John',
            lastName: 'Doe',
            image: null,
            email: 'john@example.com',
            createdAt: '21/06/2022',
          },
        },
      ],
    },
    appUserProfile: {
      _id: 'user2',
      adminFor: [
        {
          _id: '123',
        },
      ],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
  {
    user: {
      _id: 'user3',
      firstName: 'Jack',
      lastName: 'Smith',
      image: null,
      email: 'jack@example.com',
      createdAt: '19/06/2022',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: {
            city: 'Kingston',
            countryCode: 'JM',
            dependentLocality: 'Sample Dependent Locality',
            line1: '123 Jamaica Street',
            line2: 'Apartment 456',
            postalCode: 'JM12345',
            sortingCode: 'ABC-123',
            state: 'Kingston Parish',
          },
          createdAt: '19/06/2022',
          creator: {
            _id: '123',
            firstName: 'Jack',
            lastName: 'Smith',
            image: null,
            email: 'jack@example.com',
            createdAt: '19/06/2022',
          },
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: {
            city: 'Kingston',
            countryCode: 'JM',
            dependentLocality: 'Sample Dependent Locality',
            line1: '123 Jamaica Street',
            line2: 'Apartment 456',
            postalCode: 'JM12345',
            sortingCode: 'ABC-123',
            state: 'Kingston Parish',
          },
          createdAt: '19/06/2022',
          creator: {
            _id: '123',
            firstName: 'Jack',
            lastName: 'Smith',
            image: null,
            email: 'jack@example.com',
            createdAt: '19/06/2022',
          },
        },
      ],
    },
    appUserProfile: {
      _id: 'user3',
      adminFor: [],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
];

const MOCKS_NEW = [
  {
    request: {
      query: USER_LIST,
      variables: {
        first: 12,
        skip: 0,
        firstName_contains: '',
        lastName_contains: '',
        order: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        users: MOCK_USERS,
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
    result: {
      data: {
        organizationsConnection: [],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(EMPTY_MOCKS, true);
const link3 = new StaticMockLink(MOCKS2, true);
const link5 = new StaticMockLink(MOCKS_NEW, true);

const mockLocalStorage = {
  setItem: vi.fn(),
  getItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });

  mockLocalStorage.setItem('id', '123');
  mockLocalStorage.setItem('SuperAdmin', 'true');
  mockLocalStorage.setItem('FirstName', 'John');
  mockLocalStorage.setItem(
    'AdminFor',
    JSON.stringify([{ name: 'adi', _id: '1234', image: '' }]),
  );
  mockLocalStorage.setItem('LastName', 'Doe');
});

afterEach(() => {
  localStorage.clear();
});

describe('Testing Users screen', () => {
  it('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('testcomp')).toBeInTheDocument();
    });
  });

  it(`Component should be rendered properly when user is not superAdmin
  and or userId does not exists in localstorage`, async () => {
    mockLocalStorage.setItem('AdminFor', JSON.stringify(['123']));
    mockLocalStorage.removeItem('SuperAdmin');
    mockLocalStorage.setItem('id', '');

    await waitFor(() => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
  });

  it(`Component should be rendered properly when userId does not exists in localstorage`, async () => {
    mockLocalStorage.removeItem('AdminFor');
    mockLocalStorage.removeItem('SuperAdmin');
    mockLocalStorage.removeItem('id');
    await waitFor(() => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
  });

  it('Component should be rendered properly when user is superAdmin', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('testcomp')).toBeInTheDocument();
    });
  });

  it('Testing search by name functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {});
    const searchBtn = screen.getByTestId('searchButton');
    const search1 = 'John';
    await act(async () => {
      userEvent.type(screen.getByTestId(/searchByName/i), search1);
      userEvent.click(searchBtn);
      await waitFor(() => {});
      expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();
    });

    const search2 = 'Pete{backspace}{backspace}{backspace}{backspace}';
    await act(async () => {
      userEvent.type(screen.getByTestId(/searchByName/i), search2);
    });

    const search3 =
      'John{backspace}{backspace}{backspace}{backspace}Sam{backspace}{backspace}{backspace}';
    await act(async () => {
      userEvent.type(screen.getByTestId(/searchByName/i), search3);
    });

    const search4 = 'Sam{backspace}{backspace}P{backspace}';
    await act(async () => {
      userEvent.type(screen.getByTestId(/searchByName/i), search4);
    });

    const search5 = 'Xe';
    await act(async () => {
      userEvent.type(screen.getByTestId(/searchByName/i), search5);
      userEvent.clear(screen.getByTestId(/searchByName/i));
      userEvent.type(screen.getByTestId(/searchByName/i), '');
      userEvent.click(searchBtn);
      await waitFor(() => {});
    });
  });

  it('testing search not found', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link2}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await waitFor(() => {});

    const searchBtn = screen.getByTestId('searchButton');
    const searchInput = screen.getByTestId(/searchByName/i);

    await act(async () => {
      // Clear the search input
      userEvent.clear(searchInput);
      // Search for a name that doesn't exist
      userEvent.type(screen.getByTestId(/searchByName/i), 'NonexistentName');
      userEvent.click(searchBtn);
    });

    await waitFor(() => {
      expect(screen.queryByText(/No User Found/i)).toBeInTheDocument();
    });
  });

  it('Testing User data is not present', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {});
    expect(screen.getByText(/No User Found/i)).toBeTruthy();
  });

  it('Should render warning alert when there are no organizations', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 200)));
    expect(container.textContent).toMatch(
      'Organizations not found, please create an organization through dashboard',
    );
  });

  it('Should not render warning alert when there are organizations present', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {});

    expect(container.textContent).not.toMatch(
      'Organizations not found, please create an organization through dashboard',
    );
  });

  it('Testing filter functionality', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await waitFor(() => {});

    const searchInput = screen.getByTestId('filter');
    expect(searchInput).toBeInTheDocument();

    const inputText = screen.getByTestId('filterUsers');

    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleText = screen.getByTestId('admin');

    await act(async () => {
      fireEvent.click(toggleText);
    });

    expect(searchInput).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(inputText);
    });

    let toggleTite = screen.getByTestId('superAdmin');

    await act(async () => {
      fireEvent.click(toggleTite);
    });

    expect(searchInput).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(inputText);
    });

    toggleTite = screen.getByTestId('user');

    await act(async () => {
      fireEvent.click(toggleTite);
    });

    expect(searchInput).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(inputText);
    });

    toggleTite = screen.getByTestId('cancel');

    await act(async () => {
      fireEvent.click(toggleTite);
    });

    expect(searchInput).toBeInTheDocument();
  });

  it('check for rerendering', async () => {
    const { rerender } = render(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {});
    rerender(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await waitFor(() => {});
  });

  it('should set hasMore to false if users length is less than perPageResult', async () => {
    const link = new StaticMockLink(EMPTY_MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 200)));

    // Check if "No User Found" is displayed
    expect(screen.getByText(/No User Found/i)).toBeInTheDocument();
  });

  it('should filter users correctly', async () => {
    await act(async () => {
      render(
        <MockedProvider link={link5} addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await waitFor(() => {});

    const filterButton = screen.getByTestId('filterUsers');

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const filterAdmin = screen.getByTestId('admin');

    await act(async () => {
      fireEvent.click(filterAdmin);
    });

    await waitFor(() => {});
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const filterSuperAdmin = screen.getByTestId('superAdmin');

    await act(async () => {
      fireEvent.click(filterSuperAdmin);
    });

    await waitFor(() => {});
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const filterUser = screen.getByTestId('user');
    await act(async () => {
      fireEvent.click(filterUser);
    });

    await waitFor(() => {});
    expect(screen.getByText('Jack Smith')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const filterCancel = screen.getByTestId('cancel');

    await act(async () => {
      fireEvent.click(filterCancel);
    });

    await waitFor(() => {});
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Jack Smith')).toBeInTheDocument();
  });

  it('Users should be sorted and filtered correctly', async () => {
    await act(async () => {
      render(
        <MockedProvider link={link5} addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await waitFor(() => {});

    // Check if the sorting and filtering logic was applied correctly
    const rows = screen.getAllByRole('row');

    const firstRow = rows[1];
    const secondRow = rows[2];

    expect(firstRow).toHaveTextContent('John Doe');
    expect(secondRow).toHaveTextContent('Jane Doe');

    await waitFor(() => {});

    const inputText = screen.getByTestId('sortUsers');

    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleText = screen.getByTestId('oldest');

    await act(async () => {
      fireEvent.click(toggleText);
      fireEvent.click(inputText);
    });

    const toggleTite = screen.getByTestId('newest');

    await act(async () => {
      fireEvent.click(toggleTite);
    });

    // Verify the users are sorted by oldest
    await waitFor(() => {});

    const displayedUsers = screen.getAllByRole('row');
    expect(displayedUsers[1]).toHaveTextContent('John Doe'); // assuming User1 is the oldest
    expect(displayedUsers[displayedUsers.length - 1]).toHaveTextContent(
      'Jack Smith',
    ); // assuming UserN is the newest

    await waitFor(() => {});

    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleOld = screen.getByTestId('oldest');

    await act(async () => {
      fireEvent.click(toggleOld);
      fireEvent.click(inputText);
    });

    const toggleNewest = screen.getByTestId('newest');
    await act(async () => {
      fireEvent.click(toggleNewest);
    });
  });
});
