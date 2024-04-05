<<<<<<< HEAD
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import userEvent from '@testing-library/user-event';
=======
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import {
  USER_CREATED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
<<<<<<< HEAD
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import useLocalStorage from 'utils/useLocalstorage';
import Organizations from './Organizations';
import React from 'react';
const { getItem } = useLocalStorage();
=======
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Organizations from './Organizations';
import userEvent from '@testing-library/user-event';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

const MOCKS = [
  {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: {
<<<<<<< HEAD
        id: getItem('userId'),
=======
        id: localStorage.getItem('userId'),
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
    },
    result: {
      data: {
        users: [
          {
<<<<<<< HEAD
            appUserProfile: {
              createdOrganizations: [
                {
                  __typename: 'Organization',
                  _id: '6401ff65ce8e8406b8f07af2',
                  name: 'createdOrganization',
                  image: '',
                  description: 'New Desc',
                },
              ],
            },
=======
            createdOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af2',
                name: 'createdOrganization',
                image: '',
                description: 'New Desc',
              },
            ],
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_ORGANIZATION_CONNECTION,
      variables: {
        filter: '',
      },
    },
    result: {
      data: {
        organizationsConnection: [
          {
            __typename: 'Organization',
            _id: '6401ff65ce8e8406b8f07af2',
            image: '',
            name: 'anyOrganization1',
            description: 'desc',
<<<<<<< HEAD
            address: {
              city: 'abc',
              countryCode: '123',
              postalCode: '456',
              state: 'def',
              dependentLocality: 'ghi',
              line1: 'asdfg',
              line2: 'dfghj',
              sortingCode: '4567',
            },
            createdAt: '1234567890',
            userRegistrationRequired: true,
            creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
            members: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
            admins: [
              {
                _id: '45gj5678jk45678fvgbhnr4rtgh',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
            membershipRequests: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
=======
            isPublic: true,
            creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          },
          {
            __typename: 'Organization',
            _id: '6401ff65ce8e8406b8f07af3',
            image: '',
            name: 'anyOrganization2',
<<<<<<< HEAD
            createdAt: '1234567890',
            address: {
              city: 'abc',
              countryCode: '123',
              postalCode: '456',
              state: 'def',
              dependentLocality: 'ghi',
              line1: 'asdfg',
              line2: 'dfghj',
              sortingCode: '4567',
            },
            description: 'desc',
            userRegistrationRequired: true,
            creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
            members: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
            admins: [
              {
                _id: '45gj5678jk45678fvgbhnr4rtgh',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
            membershipRequests: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
=======
            description: 'desc',
            isPublic: true,
            creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
<<<<<<< HEAD
        id: getItem('userId'),
=======
        id: localStorage.getItem('userId'),
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
    },
    result: {
      data: {
        users: [
          {
<<<<<<< HEAD
            user: {
              joinedOrganizations: [
                {
                  __typename: 'Organization',
                  _id: '6401ff65ce8e8406b8f07af2',
                  name: 'joinedOrganization',
                  image: '',
                  description: 'New Desc',
                },
              ],
            },
=======
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af2',
                name: 'joinedOrganization',
                image: '',
                description: 'New Desc',
              },
            ],
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_ORGANIZATION_CONNECTION,
      variables: {
        filter: '2',
      },
    },
    result: {
      data: {
        organizationsConnection: [
          {
            __typename: 'Organization',
            _id: '6401ff65ce8e8406b8f07af3',
            image: '',
            name: 'anyOrganization2',
            description: 'desc',
<<<<<<< HEAD
            address: {
              city: 'abc',
              countryCode: '123',
              postalCode: '456',
              state: 'def',
              dependentLocality: 'ghi',
              line1: 'asdfg',
              line2: 'dfghj',
              sortingCode: '4567',
            },
            userRegistrationRequired: true,
            createdAt: '1234567890',
            creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
            members: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
            admins: [
              {
                _id: '45gj5678jk45678fvgbhnr4rtgh',
                user: {
                  _id: '4567890fgvhbjn',
                },
              },
            ],
            membershipRequests: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
=======
            isPublic: true,
            creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Organizations Screen [User Portal]', () => {
  test('Screen should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Organizations />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();
  });

  test('Search works properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Organizations />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
    );

    await wait();
    const searchBtn = screen.getByTestId('searchBtn');
    userEvent.type(screen.getByTestId('searchInput'), '2{enter}');
=======
      </MockedProvider>
    );

    await wait();

    userEvent.type(screen.getByTestId('searchInput'), '2');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    await wait();

    expect(screen.queryByText('anyOrganization2')).toBeInTheDocument();
    expect(screen.queryByText('anyOrganization1')).not.toBeInTheDocument();
<<<<<<< HEAD

    userEvent.clear(screen.getByTestId('searchInput'));
    userEvent.click(searchBtn);
    await wait();
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });

  test('Mode is changed to joined organizations', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Organizations />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

    userEvent.click(screen.getByTestId('modeChangeBtn'));
    await wait();
    userEvent.click(screen.getByTestId('modeBtn1'));
    await wait();

    expect(screen.queryAllByText('joinedOrganization')).not.toBe([]);
  });

  test('Mode is changed to created organizations', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Organizations />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

    userEvent.click(screen.getByTestId('modeChangeBtn'));
    await wait();
    userEvent.click(screen.getByTestId('modeBtn2'));
    await wait();

    expect(screen.queryAllByText('createdOrganization')).not.toBe([]);
  });
});
