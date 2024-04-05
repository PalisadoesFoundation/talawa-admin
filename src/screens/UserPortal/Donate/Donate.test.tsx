import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import {
  ORGANIZATION_DONATION_CONNECTION_LIST,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Donate from './Donate';
import userEvent from '@testing-library/user-event';
<<<<<<< HEAD
import useLocalStorage from 'utils/useLocalstorage';
import { DONATE_TO_ORGANIZATION } from 'GraphQl/Mutations/mutations';
=======
import * as getOrganizationId from 'utils/getOrganizationId';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_DONATION_CONNECTION_LIST,
      variables: {
        orgId: '',
      },
    },
    result: {
      data: {
        getDonationByOrgIdConnection: [
          {
            _id: '6391a15bcb738c181d238957',
            nameOfUser: 'firstName lastName',
            amount: 1,
            userId: '6391a15bcb738c181d238952',
            payPalId: 'payPalId',
<<<<<<< HEAD
            updatedAt: '2024-04-03T16:43:01.514Z',
=======
            __typename: 'Donation',
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
        id: '',
      },
    },
    result: {
      data: {
        organizationsConnection: [
          {
<<<<<<< HEAD
=======
            __typename: 'Organization',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
            createdAt: '12345678900',
            creator: { firstName: 'John', lastName: 'Doe' },
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
          },
        ],
      },
    },
  },
  {
    request: {
      query: DONATE_TO_ORGANIZATION,
      variables: {
        userId: '123',
        createDonationOrgId2: '',
        payPalId: 'paypalId',
        nameOfUser: 'name',
        amount: 123,
        nameOfOrg: 'anyOrganization2',
      },
    },
    result: {
      data: {
        createDonation: [
          {
            _id: '',
            amount: 123,
            nameOfUser: 'name',
            nameOfOrg: 'anyOrganization2',
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

<<<<<<< HEAD
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: '' }),
}));

describe('Testing Donate Screen [User Portal]', () => {
=======
describe('Testing Donate Screen [User Portal]', () => {
  jest.mock('utils/getOrganizationId');

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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

<<<<<<< HEAD
  beforeEach(() => {
    jest.clearAllMocks();
  });
=======
  const getOrganizationIdSpy = jest
    .spyOn(getOrganizationId, 'default')
    .mockImplementation(() => {
      return '';
    });
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  test('Screen should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
    );

    await wait();
    expect(screen.getByPlaceholderText('Search donations')).toBeInTheDocument();
    expect(screen.getByTestId('currency0')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
=======
      </MockedProvider>
    );

    await wait();

    expect(getOrganizationIdSpy).toHaveBeenCalled();
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });

  test('Currency is swtiched to USD', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
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

    userEvent.click(screen.getByTestId('changeCurrencyBtn'));

    userEvent.click(screen.getByTestId('currency0'));
<<<<<<< HEAD
    await wait();

    expect(screen.getByTestId('currency0')).toBeInTheDocument();
=======

    await wait();
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });

  test('Currency is swtiched to INR', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
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

    userEvent.click(screen.getByTestId('changeCurrencyBtn'));

    userEvent.click(screen.getByTestId('currency1'));

    await wait();
  });

  test('Currency is swtiched to EUR', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
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

    userEvent.click(screen.getByTestId('changeCurrencyBtn'));

    userEvent.click(screen.getByTestId('currency2'));

    await wait();
  });
<<<<<<< HEAD

  test('Checking the existence of Donation Cards', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(screen.getAllByTestId('donationCard')[0]).toBeInTheDocument();
  });

  test('For Donation functionality', async () => {
    const { setItem } = useLocalStorage();
    setItem('userId', '123');
    setItem('name', 'name');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('donationAmount'), '123');
    userEvent.click(screen.getByTestId('donateBtn'));
    await wait();
  });
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
});
