import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import {
  USER_CREATED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Organizations from './Organizations';
import userEvent from '@testing-library/user-event';
import useLocalStorage from 'utils/useLocalstorage';

const { getItem } = useLocalStorage();

const MOCKS = [
  {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: {
        id: getItem('userId'),
      },
    },
    result: {
      data: {
        users: [
          {
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
            userRegistrationRequired: true,
            creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
          },
          {
            __typename: 'Organization',
            _id: '6401ff65ce8e8406b8f07af3',
            image: '',
            name: 'anyOrganization2',
            description: 'desc',
            userRegistrationRequired: true,
            creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: getItem('userId'),
      },
    },
    result: {
      data: {
        users: [
          {
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
            userRegistrationRequired: true,
            creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
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
      </MockedProvider>,
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
      </MockedProvider>,
    );

    await wait();
    const searchBtn = screen.getByTestId('searchBtn');
    userEvent.type(screen.getByTestId('searchInput'), '2{enter}');
    await wait();

    expect(screen.queryByText('anyOrganization2')).toBeInTheDocument();
    expect(screen.queryByText('anyOrganization1')).not.toBeInTheDocument();

    userEvent.clear(screen.getByTestId('searchInput'));
    userEvent.click(searchBtn);
    await wait();
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
      </MockedProvider>,
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
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('modeChangeBtn'));
    await wait();
    userEvent.click(screen.getByTestId('modeBtn2'));
    await wait();

    expect(screen.queryAllByText('createdOrganization')).not.toBe([]);
  });
});
