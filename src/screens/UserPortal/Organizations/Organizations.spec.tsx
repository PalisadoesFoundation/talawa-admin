// Organizations.test.tsx

import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { act } from 'react-dom/test-utils';

import i18nForTest from 'utils/i18nForTest';
import { store } from 'state/store';
import useLocalStorage from 'utils/useLocalstorage';
import {
  ALL_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
  USER_CREATED_ORGANIZATIONS,
} from 'GraphQl/Queries/Queries';
import Organizations from './Organizations';

// In your real code, you might import getItem/setItem from "utils/useLocalstorage" directly
const { setItem, getItem } = useLocalStorage();

const TEST_USER_ID = '01958985-600e-7cde-94a2-b3fc1ce66cf3';

const mocks = [
  {
    request: { query: ALL_ORGANIZATIONS, variables: { filter: '' } },
    result: {
      data: {
        organizations: [
          {
            _id: 'allOrgId1',
            name: 'All Org 1',
            description: 'desc 1',
            image: null,
          },
          {
            _id: 'allOrgId2',
            name: 'All Org 2',
            description: 'desc 2',
            image: null,
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: { id: TEST_USER_ID, first: 5, filter: '' },
    },
    result: {
      data: {
        user: {
          organizationsWhereMember: {
            edges: [
              {
                node: {
                  _id: 'joinedOrgId1',
                  name: 'Joined Org 1',
                  description: 'Joined Desc',
                  isJoined: true,
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: { id: TEST_USER_ID, filter: '' },
    },
    result: {
      data: {
        user: {
          createdOrganizations: [
            {
              _id: 'createdOrgId1',
              name: 'Created Org 1',
              description: 'Created Desc',
              isJoined: true,
            },
          ],
        },
      },
    },
  },
  {
    request: { query: ALL_ORGANIZATIONS, variables: { filter: 'search' } },
    result: {
      data: {
        organizations: [
          {
            _id: 'allOrgId3',
            name: 'Search Org',
            description: 'Found by search',
            image: null,
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: { id: TEST_USER_ID, first: 5, filter: '2' },
    },
    result: {
      data: {
        user: {
          organizationsWhereMember: {
            edges: [
              {
                node: {
                  _id: 'joinedOrgId2',
                  name: 'Joined Org 2',
                  description: 'Joined Desc',
                  isJoined: true,
                },
              },
            ],
          },
        },
      },
    },
  },
];

async function waitMs(ms = 100) {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

describe('Organizations Screen Tests', () => {
  it('displays a loading indicator while fetching', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Organizations />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByTestId('loading-spinner')).toBeNull(),
    );
  });

  it('shows all organizations by default', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Organizations />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await waitMs();
    expect(screen.getByText(/All Org 1/i)).toBeInTheDocument();
    expect(screen.getByText(/All Org 2/i)).toBeInTheDocument();
  });

  it('switches to joined organizations (mode=1)', async () => {
    setItem('userId', TEST_USER_ID);
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Organizations />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await waitMs();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await waitMs();
    await userEvent.click(screen.getByTestId('modeBtn1'));

    await waitMs();
    expect(screen.getByText('Joined Org 1')).toBeInTheDocument();
  });

  it('switches to created organizations (mode=2)', async () => {
    setItem('userId', TEST_USER_ID);
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Organizations />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await waitMs();
    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await waitMs();
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await waitMs();
    expect(screen.getByText('Created Org 1')).toBeInTheDocument();
  });

  it('searches joined organizations by filter text', async () => {
    setItem('userId', TEST_USER_ID);
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Organizations />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await waitMs();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await waitMs();
    await userEvent.click(screen.getByTestId('modeBtn1'));

    await waitMs();

    const searchInput = screen.getByTestId('searchInput');
    await userEvent.type(searchInput, '2');
    await userEvent.keyboard('{Enter}');
    await waitMs(500);
    expect(screen.getByText(/Joined Org 2/i)).toBeInTheDocument();
  });
});
