import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Users from './Users';
import {
  EMPTY_MOCKS,
  MOCKS,
  MOCKS2,
  MOCKS_NEW,
  MOCKS_NEW2,
  MOCKS_NEW3,
  MOCKS_NEW_2,
} from './UsersMocks.mocks';
import useLocalStorage from 'utils/useLocalstorage';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

import { USER_LIST } from 'GraphQl/Queries/Queries';

const { setItem, removeItem } = useLocalStorage();

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(EMPTY_MOCKS, true);
const link3 = new StaticMockLink(MOCKS2, true);
const link5 = new StaticMockLink(MOCKS_NEW, true);
const link6 = new StaticMockLink(MOCKS_NEW2, true);
const link7 = new StaticMockLink(MOCKS_NEW3, true);

async function wait(ms = 1000): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
beforeEach(() => {
  setItem('id', '123');
  setItem('SuperAdmin', true);
  setItem('FirstName', 'John');
  setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);
  setItem('LastName', 'Doe');
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
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

    await wait();
    expect(screen.getByTestId('testcomp')).toBeInTheDocument();
  });

  it(`Component should be rendered properly when user is not superAdmin
  and or userId does not exists in localstorage`, async () => {
    setItem('AdminFor', ['123']);
    removeItem('SuperAdmin');
    await wait();
    setItem('id', '');
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
    await wait();
  });

  it(`Component should be rendered properly when userId does not exists in localstorage`, async () => {
    removeItem('AdminFor');
    removeItem('SuperAdmin');
    await wait();
    removeItem('id');
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
    await wait();
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

    await wait();
  });

  it('Testing seach by name functionality', async () => {
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

    await wait();
    const searchBtn = screen.getByTestId('searchButton');
    const search1 = 'John';
    userEvent.type(screen.getByTestId(/searchByName/i), search1);
    userEvent.click(searchBtn);
    await wait();
    expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();

    const search2 = 'Pete{backspace}{backspace}{backspace}{backspace}';
    userEvent.type(screen.getByTestId(/searchByName/i), search2);

    const search3 =
      'John{backspace}{backspace}{backspace}{backspace}Sam{backspace}{backspace}{backspace}';
    userEvent.type(screen.getByTestId(/searchByName/i), search3);

    const search4 = 'Sam{backspace}{backspace}P{backspace}';
    userEvent.type(screen.getByTestId(/searchByName/i), search4);

    const search5 = 'Xe';
    userEvent.type(screen.getByTestId(/searchByName/i), search5);
    userEvent.clear(screen.getByTestId(/searchByName/i));
    userEvent.type(screen.getByTestId(/searchByName/i), '');
    userEvent.click(searchBtn);
    await wait();
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
    await wait();

    const searchBtn = screen.getByTestId('searchButton');
    const searchInput = screen.getByTestId(/searchByName/i);

    await act(async () => {
      // Clear the search input
      userEvent.clear(searchInput);
      // Search for a name that doesn't exist
      userEvent.type(screen.getByTestId(/searchByName/i), 'NonexistentName');
      userEvent.click(searchBtn);
    });

    expect(screen.queryByText(/No User Found/i)).toBeInTheDocument();
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

    await wait();
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

    await wait(200);
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

    await wait();

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
    await wait();

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

    await wait();

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

    await wait();
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
    await wait();
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

    await wait(200);

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
    await wait();

    const filterButton = screen.getByTestId('filterUsers');

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const filterAdmin = screen.getByTestId('admin');

    await act(async () => {
      fireEvent.click(filterAdmin);
    });

    // await wait();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const filterSuperAdmin = screen.getByTestId('superAdmin');

    await act(async () => {
      fireEvent.click(filterSuperAdmin);
    });

    // await wait();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const filterUser = screen.getByTestId('user');
    await act(async () => {
      fireEvent.click(filterUser);
    });

    // await wait();
    expect(screen.getByText('Jack Smith')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const filterCancel = screen.getByTestId('cancel');

    await act(async () => {
      fireEvent.click(filterCancel);
    });

    // await wait();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Jack Smith')).toBeInTheDocument();
  });

  it('Users should be sorted in newest order correctly', async () => {
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
    await wait();

    const inputText = screen.getByTestId('sortUsers');

    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleTite = screen.getByTestId('newest');

    await act(async () => {
      fireEvent.click(toggleTite);
    });

    // Verify the users are sorted by newest

    const displayedUsers = screen.getAllByRole('row');
    await wait();
    expect(displayedUsers[1]).toHaveTextContent('Jane Doe');
    expect(displayedUsers[2]).toHaveTextContent('John Doe');
  });

  it('Check if pressing enter key triggers search', async () => {
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
    await wait();
    const searchInput = screen.getByTestId('searchByName');

    await act(async () => {
      userEvent.type(searchInput, 'John');
    });
    await act(async () => {
      userEvent.type(searchInput, '{enter}');
    });
  });

  it('Users should be sorted in oldest order correctly', async () => {
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
    await wait();

    const inputText = screen.getByTestId('sortUsers');

    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleTite = screen.getByTestId('oldest');

    await act(async () => {
      fireEvent.click(toggleTite);
    });

    // Verify the users are sorted by oldest

    const displayedUsers = screen.getAllByRole('row');
    await wait();
    expect(displayedUsers[1]).toHaveTextContent('Jack Smith');
    expect(displayedUsers[2]).toHaveTextContent('John Doe');
  });

  it('Role filter should not update if selected role is already selected', async () => {
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
    await wait();

    const filterButton = screen.getByTestId('filterUsers');

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const filterAdmin = screen.getByTestId('admin');

    await act(async () => {
      fireEvent.click(filterAdmin);
    });

    // await wait();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(filterAdmin);
    });

    // await wait();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('Sort filter should not update if selected sort is already selected', async () => {
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
    await wait();

    const inputText = screen.getByTestId('sortUsers');

    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleTite = screen.getByTestId('newest');

    await act(async () => {
      fireEvent.click(toggleTite);
    });

    // Verify the users are sorted by newest

    const displayedUsers = screen.getAllByRole('row');
    await wait();
    expect(displayedUsers[1]).toHaveTextContent('Jane Doe');
    expect(displayedUsers[2]).toHaveTextContent('John Doe');

    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleTite2 = screen.getByTestId('newest');

    await act(async () => {
      fireEvent.click(toggleTite2);
    });

    // Verify the users are sorted by newest

    const displayedUsers2 = screen.getAllByRole('row');
    await wait();
    expect(displayedUsers2[1]).toHaveTextContent('Jane Doe');
    expect(displayedUsers2[2]).toHaveTextContent('John Doe');
  });

  it('Reset and Refetch function should work when we search an empty string', async () => {
    render(
      <MockedProvider addTypename={false} link={link5}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const searchBtn = screen.getByTestId('searchButton');
    const search1 = '';
    userEvent.type(screen.getByTestId(/searchByName/i), search1);
    userEvent.click(searchBtn);
    await wait();
    expect(screen.queryByText(/Jane Doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/Jack Smith/i)).toBeInTheDocument();
  });

  it('Users should be loaded on scroll using loadmoreusers function', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} link={link6}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const users = container
      .getElementsByTagName('tbody')[0]
      .querySelectorAll('tr');
    expect(users.length).toBe(12);

    await act(async () => {
      fireEvent.scroll(window, { target: { scrollY: 1000 } });
    });

    await wait();

    const users2 = container
      .getElementsByTagName('tbody')[0]
      .querySelectorAll('tr');
    expect(users2.length).toBe(15);
  });

  it('should not show duplicate users when scrolling by using mergedUsers and loadUnqUsers', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} link={link7}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const users = container
      .getElementsByTagName('tbody')[0]
      .querySelectorAll('tr');
    expect(users.length).toBe(12);

    await act(async () => {
      fireEvent.scroll(window, { target: { scrollY: 1000 } });
    });

    await wait();

    const users2 = container
      .getElementsByTagName('tbody')[0]
      .querySelectorAll('tr');
    expect(users2.length).toBe(15);
  });

  it('should render "No results found" message with search query when search returns no users and isLoading is false', async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: USER_LIST,
              variables: {
                first: 12,
                skip: 0,
                firstName_contains: 'NonexistentName',
                lastName_contains: '',
                order: 'createdAt_DESC',
              },
            },
            result: {
              data: {
                users: [],
              },
            },
          },
        ]}
        addTypename={false}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const searchBtn = screen.getByTestId('searchButton');
    const searchInput = screen.getByTestId(/searchByName/i);

    await act(async () => {
      userEvent.clear(searchInput);
      userEvent.type(searchInput, 'NonexistentName');
      userEvent.click(searchBtn);
    });

    const noResultsMessage = screen.getByText(/No results found for/i);
    expect(noResultsMessage).toBeInTheDocument();
    expect(noResultsMessage).toHaveTextContent('NonexistentName');
  });

  describe('Testing sorting and loadMoreUsers functionality', () => {
    it('should set the correct order variable and update hasMore', async () => {
      render(
        <MockedProvider mocks={MOCKS_NEW} addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <Users />
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      const sortDropdown = await screen.findByTestId('sortUsers');
      fireEvent.click(sortDropdown);

      const newestOption = screen.getByTestId('newest');
      fireEvent.click(newestOption);

      expect(screen.getByTestId('sortUsers')).toHaveTextContent('newest');

      const rowsNewest = await screen.findAllByRole('row');
      expect(rowsNewest.length).toBeGreaterThan(0);

      fireEvent.click(sortDropdown);
      const oldestOption = screen.getByTestId('oldest');
      fireEvent.click(oldestOption);

      expect(screen.getByTestId('sortUsers')).toHaveTextContent('oldest');

      const rowsOldest = await screen.findAllByRole('row');
      expect(rowsOldest.length).toBeGreaterThan(0);
    });

    it('should load more users and merge them correctly', async () => {
      render(
        <MockedProvider mocks={MOCKS_NEW_2} addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <Users />
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      // Initial load
      await wait();
      let rows = screen.getAllByRole('row');
      expect(rows.length).toBe(4);

      // Simulate scrolling to the bottom
      await act(async () => {
        fireEvent.scroll(window, { target: { scrollY: 1000 } });
      });

      // Wait for loadMoreUsers to trigger
      await wait();
      rows = screen.getAllByRole('row');
      expect(rows.length).toBe(4);
    });
  });
});
