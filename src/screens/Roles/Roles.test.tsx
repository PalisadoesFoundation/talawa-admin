import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import 'jest-localstorage-mock';
import 'jest-location-mock';

import Roles from './Roles';
import { UPDATE_USERTYPE_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_LIST,
} from 'GraphQl/Queries/Queries';
import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/react';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { ToastContainer } from 'react-toastify';

const MOCKS = [
  {
    request: {
      query: USER_LIST,
    },
    result: {
      data: {
        users: [
          {
            _id: '123',
            firstName: 'John',
            lastName: 'Doe',
            image: 'dummyImage',
            email: 'johndoe@gmail.com',
            userType: 'SUPERADMIN',
            adminApproved: true,
            createdAt: '20/06/2022',
            organizationsBlockedBy: [
              {
                _id: '256',
                name: 'ABC',
              },
            ],
          },
          {
            _id: '456',
            firstName: 'Sam',
            lastName: 'Smith',
            image: 'dummyImage',
            email: 'samsmith@gmail.com',
            userType: 'ADMIN',
            adminApproved: true,
            createdAt: '20/06/2022',
            organizationsBlockedBy: [
              {
                _id: '256',
                name: 'ABC',
              },
            ],
          },
          {
            _id: '789',
            firstName: 'Peter',
            lastName: 'Parker',
            image: 'dummyImage',
            email: 'peterparker@gmail.com',
            userType: 'USER',
            adminApproved: true,
            createdAt: '20/06/2022',
            organizationsBlockedBy: [
              {
                _id: '256',
                name: 'ABC',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_USERTYPE_MUTATION,
      variables: {
        id: '123',
        userType: 'ADMIN',
      },
    },
    result: {
      data: {
        updateUserType: true,
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
    result: {
      data: {
        organizationsConnection: [
          {
            _id: 1,
            image: '',
            name: 'Akatsuki',
            creator: {
              firstName: 'John',
              lastName: 'Doe',
            },
            admins: [
              {
                _id: '123',
              },
            ],
            members: {
              _id: '234',
            },
            createdAt: '02/02/2022',
            location: 'Washington DC',
          },
        ],
      },
    },
  },
];

const EMPTY_MOCKS = [
  {
    request: {
      query: USER_LIST,
    },
  },
  {
    request: {
      query: UPDATE_USERTYPE_MUTATION,
      variables: {
        id: '123',
        userType: 'ADMIN',
      },
    },
    result: {
      data: {
        updateUserType: false,
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

const EMPTY_ORG_MOCKS = [
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
const link3 = new StaticMockLink(EMPTY_ORG_MOCKS, true);

async function wait(ms = 100) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Roles screen', () => {
  test('Componenet should be rendered properly', async () => {
    window.location.assign('/orglist');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Roles />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByText(/Users List/i)).toBeInTheDocument();
    expect(screen.getByText(/Search By Name/i)).toBeInTheDocument();
    expect(window.location).toBeAt('/orglist');
  });

  test('Component should be rendered properly when user is not superAdmin', async () => {
    const localStorageMock = {
      getItem: jest.fn(() => 'ADMIN'),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Roles />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(window.location.assign).toHaveBeenCalled();
  });

  test('Component should be rendered properly when user is superAdmin', async () => {
    const localStorageMock = {
      getItem: jest.fn(() => 'SUPERADMIN'),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Roles />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(window.location.assign).not.toHaveBeenCalled();
  });

  test('Roles renders a <PaginationList /> and tests changing rowsPerPage in the select', () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Roles />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    const appHeader = screen.queryByTestId('roles-header');
    const function_when_appHeader_isNotNull = (app: any) => {
      const paginationList = within(app).getByTestId('something');
      const tablePagination =
        within(paginationList).getByTestId('table-pagination');

      expect(tablePagination).toBeInTheDocument();

      const rowsPerPageSelect = within(tablePagination).getByTestId(
        'rows-per-page-select'
      );
      fireEvent.change(rowsPerPageSelect, { target: { value: '-1' } });
      expect(rowsPerPageSelect).toHaveValue('-1');
    };

    const function_when_appHeader_isNull = () => {
      expect(appHeader).toBeNull();
    };

    const assertion =
      appHeader !== null
        ? function_when_appHeader_isNotNull(appHeader)
        : function_when_appHeader_isNull();

    assertion;
  });

  test('should update rowsPerPage when selected from menu', () => {
    const { getByRole } = render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Roles />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    const appHeader = screen.queryByTestId('roles-header');
    const len = MOCKS.length;

    const function_when_appHeader_isNotNull = (app: any) => {
      const table = getByRole('table');

      const rowsPerPageButton = getByRole('button', { name: /rows per page/i });

      fireEvent.click(rowsPerPageButton);

      const rowsPerPageOption = getByRole('option', { name: /10/i });

      fireEvent.click(rowsPerPageOption);

      const paginationList = within(app).getByTestId('something');
      const tablePagination =
        within(paginationList).getByTestId('table-pagination');

      expect(tablePagination).toHaveAttribute('rowsPerPage', '10');

      expect(table.querySelectorAll('tbody tr')).toHaveLength(len);
    };

    const function_when_appHeader_isNull = () => {
      expect(appHeader).toBeNull();
    };

    const assertion =
      appHeader !== null
        ? function_when_appHeader_isNotNull(appHeader)
        : function_when_appHeader_isNull();

    assertion;
  });

  test('Testing seach by name functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Roles />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    const search1 = 'John{backspace}{backspace}{backspace}{backspace}';
    userEvent.type(screen.getByTestId(/searchByName/i), search1);

    const search2 = 'Pete{backspace}{backspace}{backspace}{backspace}';
    userEvent.type(screen.getByTestId(/searchByName/i), search2);

    const search3 =
      'John{backspace}{backspace}{backspace}{backspace}Sam{backspace}{backspace}{backspace}';
    userEvent.type(screen.getByTestId(/searchByName/i), search3);

    const search4 = 'Sam{backspace}{backspace}P{backspace}';
    userEvent.type(screen.getByTestId(/searchByName/i), search4);

    const search5 = 'Xe';
    userEvent.type(screen.getByTestId(/searchByName/i), search5);
  });

  test('Testing change role functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Roles />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.selectOptions(screen.getByTestId(/changeRole123/i), 'ADMIN');
  });

  test('Testing User data is not present', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Roles />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Should render warning alert when there are no organizations', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Roles />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait(200);
    expect(container.textContent).toMatch(
      'Organizations not found, please create an organization through dashboard'
    );
  });

  test('Should not render warning alert when there are organizations present', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Roles />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(container.textContent).not.toMatch(
      'Organizations not found, please create an organization through dashboard'
    );
  });

  test('Should disable select when user is self', async () => {
    const localStorageMock = (function () {
      const store: any = {
        UserType: 'SUPERADMIN',
        id: '123',
      };

      return {
        getItem: jest.fn((key: string) => store[key]),
      };
    })();

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Roles />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByTestId('changeRole123')).toHaveProperty(
      'disabled',
      true
    );
  });

  test('Should not disable select when user is not self', async () => {
    const localStorageMock = (function () {
      const store: any = {
        UserType: 'SUPERADMIN',
        id: '123',
      };

      return {
        getItem: jest.fn((key: string) => store[key]),
      };
    })();

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Roles />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByTestId('changeRole456')).toHaveProperty(
      'disabled',
      false
    );

    expect(screen.getByTestId('changeRole789')).toHaveProperty(
      'disabled',
      false
    );
  });
});
