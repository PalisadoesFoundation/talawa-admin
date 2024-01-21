import React from 'react';
import 'jest-location-mock';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';

import type { NormalizedCacheObject } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import Advertisement from './Advertisements';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BACKEND_URL } from 'Constant/constant';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import {
  ADVERTISEMENTS_GET,
  ORGANIZATIONS_LIST,
  PLUGIN_GET,
} from 'GraphQl/Queries/Queries';
import userEvent from '@testing-library/user-event';
import { ADD_ADVERTISEMENT_MUTATION } from 'GraphQl/Mutations/mutations';
import { ToastContainer } from 'react-toastify';
import useLocalStorage from 'utils/useLocalstorage';

const { getItem } = useLocalStorage();

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + getItem('token') || '',
  },
});

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

jest.mock('components/AddOn/support/services/Plugin.helper', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    fetchInstalled: jest.fn().mockResolvedValue([]),
    fetchStore: jest.fn().mockResolvedValue([]),
  })),
}));

const today = new Date();
const tomorrow = today;
tomorrow.setDate(today.getDate() + 1);

const PLUGIN_GET_MOCK = {
  request: {
    query: PLUGIN_GET,
  },
  result: {
    data: {
      getPlugins: [
        {
          _id: '6581be50e88e74003aab436c',
          pluginName: 'Chats',
          pluginCreatedBy: 'Talawa Team',
          pluginDesc:
            'User can share messages with other users in a chat user interface.',
          uninstalledOrgs: [
            '62ccfccd3eb7fd2a30f41601',
            '62ccfccd3eb7fd2a30f41601',
          ],
          __typename: 'Plugin',
        },
      ],
    },
    loading: false,
  },
};

const ADD_ADVERTISEMENT_MUTATION_MOCK = {
  request: {
    query: ADD_ADVERTISEMENT_MUTATION,
    variables: {
      orgId: 'undefined',
      name: 'Cookie Shop',
      link: 'http://yourwebsite.com/photo',
      type: 'POPUP',
      startDate: '2023-01-01',
      endDate: '2023-02-02',
    },
  },
  result: {
    data: {
      createAdvertisement: {
        _id: '65844efc814dd4003db811c4',
        __typename: 'Advertisement',
      },
    },
  },
};

const ORGANIZATIONS_LIST_MOCK = {
  request: {
    query: ORGANIZATIONS_LIST,
    variables: {
      id: 'undefined',
    },
  },
  result: {
    data: {
      organizations: [
        {
          _id: 'undefined',
          image: '',
          creator: {
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
          },
          name: 'name',
          description: 'description',
          userRegistrationRequired: true,

          visibleInSearch: true,
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
};

describe('Testing Advertisement Component', () => {
  test('for creating new Advertisements', async () => {
    const mocks = [
      ORGANIZATIONS_LIST_MOCK,
      PLUGIN_GET_MOCK,
      ADD_ADVERTISEMENT_MUTATION_MOCK,
      {
        request: {
          query: ADVERTISEMENTS_GET,
        },
        result: {
          data: {
            getAdvertisements: [],
          },
          loading: false,
        },
      },
    ];

    render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Advertisement />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    await userEvent.click(screen.getByText('Create new advertisement'));
    userEvent.type(
      screen.getByLabelText('Enter name of Advertisement'),
      'Cookie Shop'
    );
    userEvent.type(
      screen.getByLabelText('Provide a link for content to be displayed'),
      'http://yourwebsite.com/photo'
    );
    userEvent.selectOptions(
      screen.getByLabelText('Select type of Advertisement'),
      'POPUP'
    );
    userEvent.type(screen.getByLabelText('Select Start Date'), '2023-01-01');
    userEvent.type(screen.getByLabelText('Select End Date'), '2023-02-02');

    await userEvent.click(screen.getByTestId('addonregister'));
    expect(
      await screen.findByText('Advertisement created successfully')
    ).toBeInTheDocument();
  });

  test('if the component renders correctly and ads are correctly categorized date wise', async () => {
    const mocks = [
      ORGANIZATIONS_LIST_MOCK,
      PLUGIN_GET_MOCK,
      ADD_ADVERTISEMENT_MUTATION_MOCK,
      {
        request: {
          query: ADVERTISEMENTS_GET,
        },
        result: {
          data: {
            getAdvertisements: [
              {
                _id: '1',
                name: 'Advertisement1',
                type: 'POPUP',
                orgId: 'undefined',
                link: 'http://example1.com',
                endDate: '2023-01-01',
                startDate: '2022-01-01',
              },
            ],
          },
          loading: false,
        },
      },
    ];

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    await wait();

    const date = await screen.findAllByText(/Ends/i);
    const dateString = date[0].innerHTML;
    const dateMatch = dateString.match(
      /\b(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})\s+(\d{4})\b/
    );
    let dateObject = new Date();

    if (dateMatch) {
      const monthName = dateMatch[1];
      const day = parseInt(dateMatch[2], 10);
      const year = parseInt(dateMatch[3], 10);

      const monthIndex =
        'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(monthName) / 3;

      dateObject = new Date(year, monthIndex, day);
    }

    expect(dateObject.getTime()).toBeLessThan(new Date().getTime());
  });

  test('for the working of the tabs', async () => {
    const mocks = [
      ORGANIZATIONS_LIST_MOCK,
      PLUGIN_GET_MOCK,
      ADD_ADVERTISEMENT_MUTATION_MOCK,
      {
        request: {
          query: ADVERTISEMENTS_GET,
        },
        result: {
          data: {
            getAdvertisements: [
              {
                _id: '1',
                name: 'Advertisement1',
                type: 'POPUP',
                orgId: 'undefined',
                link: 'http://example1.com',
                endDate: '2023-01-01',
                startDate: '2022-01-01',
              },
              {
                _id: '2',
                name: 'Advertisement2',
                type: 'BANNER',
                orgId: 'undefined',
                link: 'http://example2.com',
                endDate: tomorrow,
                startDate: today,
              },
            ],
          },
          loading: false,
        },
      },
    ];

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    await wait();
    userEvent.click(screen.getByText('Active Campaigns'));

    await wait();
    userEvent.click(screen.getByText('Completed Campaigns'));
  });
});
