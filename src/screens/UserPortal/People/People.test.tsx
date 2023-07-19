import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  ORGANIZATION_ADMINS_LIST,
} from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import People from './People';
import userEvent from '@testing-library/user-event';
import * as getOrganizationId from 'utils/getOrganizationId';

const MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
      variables: {
        orgId: '',
        firstName_contains: '',
      },
    },
    result: {
      data: {
        organizationsMemberConnection: {
          edges: [
            {
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Noble',
              lastName: 'Mittal',
              image: null,
              email: 'noble@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
            },
            {
              _id: '64001660a711c62d5b4076a3',
              firstName: 'Noble',
              lastName: 'Mittal',
              image: 'mockImage',
              email: 'noble@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_ADMINS_LIST,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        organizations: [
          {
            __typename: 'Organization',
            _id: '6401ff65ce8e8406b8f07af2',
            admins: [
              {
                _id: '64001660a711c62d5b4076a2',
                firstName: 'Noble',
                lastName: 'Admin',
                image: null,
                email: 'noble@gmail.com',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
      variables: {
        orgId: '',
        firstName_contains: 'j',
      },
    },
    result: {
      data: {
        organizationsMemberConnection: {
          edges: [
            {
              _id: '64001660a711c62d5b4076a2',
              firstName: 'John',
              lastName: 'Cena',
              image: null,
              email: 'john@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
            },
          ],
        },
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

describe('Testing People Screen [User Portal]', () => {
  jest.mock('utils/getOrganizationId');

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  const getOrganizationIdSpy = jest
    .spyOn(getOrganizationId, 'default')
    .mockImplementation(() => {
      return '';
    });

  test('Screen should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(getOrganizationIdSpy).toHaveBeenCalled();
    expect(screen.queryAllByText('Noble Mittal')).not.toBe([]);
  });

  test('Search works properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.type(screen.getByTestId('searchInput'), 'j');
    await wait();

    expect(getOrganizationIdSpy).toHaveBeenCalled();
    expect(screen.queryByText('John Cena')).toBeInTheDocument();
    expect(screen.queryByText('Noble Mittal')).not.toBeInTheDocument();
  });

  test('Mode is changed to Admins', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('modeChangeBtn'));
    await wait();
    userEvent.click(screen.getByTestId('modeBtn1'));
    await wait();

    expect(getOrganizationIdSpy).toHaveBeenCalled();
    expect(screen.queryByText('Noble Admin')).toBeInTheDocument();
    expect(screen.queryByText('Noble Mittal')).not.toBeInTheDocument();
  });
});
