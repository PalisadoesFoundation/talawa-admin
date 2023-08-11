import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import 'jest-localstorage-mock';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import userEvent from '@testing-library/user-event';
import { UPDATE_USERTYPE_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Users from './Users';
import { debug } from 'jest-preview';

const MOCKS = [
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: 'SUPERADMIN' },
    },
    result: {
      data: {
        user: {
          userType: 'SUPERADMIN',
          firstName: 'John',
          lastName: 'Doe',
          image: '',
          email: 'John_Does_Palasidoes@gmail.com',
          adminFor: {
            _id: 1,
            name: 'Palisadoes',
            image: '',
          },
        },
      },
    },
  },
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
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af1',
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
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af2',
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
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af3',
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
    result: {
      data: {
        users: [],
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

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(EMPTY_MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Users screen', () => {
  test('Component should be rendered properly', async () => {
    window.location.assign('/orglist');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    expect(screen.getAllByText(/Users/i)).toBeTruthy();
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
              <Users />
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
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(window.location.assign).not.toHaveBeenCalled();
  });

  test('Testing seach by name functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
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
              <Users />
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
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    expect(screen.getByText(/No User Found/i)).toBeTruthy();
  });

  test('Should render warning alert when there are no organizations', async () => {
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
      </MockedProvider>
    );

    await wait(200);
    debug();
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
              <Users />
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
    const localStorageMock = (function (): any {
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
              <Users />
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
    const localStorageMock = (function (): any {
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
              <Users />
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
