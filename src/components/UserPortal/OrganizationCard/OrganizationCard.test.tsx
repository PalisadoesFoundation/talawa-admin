import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import OrganizationCard from './OrganizationCard';
import {
  USER_JOINED_ORGANIZATIONS,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/OrganizationQueries';
import useLocalStorage from 'utils/useLocalstorage';
import {
  SEND_MEMBERSHIP_REQUEST,
  JOIN_PUBLIC_ORGANIZATION,
} from 'GraphQl/Mutations/OrganizationMutations';
import { toast } from 'react-toastify';

const { getItem } = useLocalStorage();

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const MOCKS = [
  {
    request: {
      query: SEND_MEMBERSHIP_REQUEST,
      variables: {
        organizationId: '1',
      },
    },
    result: {
      data: {
        sendMembershipRequest: {
          _id: 'edgwrgui4y28urfejwiwfw',
          organization: {
            _id: '1',
            name: 'organizationName',
          },
          user: {
            _id: '1',
          },
        },
      },
    },
  },
  {
    request: {
      query: JOIN_PUBLIC_ORGANIZATION,
      variables: {
        organizationId: '2',
      },
    },
    result: {
      data: {
        joinPublicOrganization: {
          _id: 'edgwrgui4y28urfejwiwfw',
        },
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        users: {
          joinedOrganizations: [
            {
              __typename: 'Organization',
              _id: '2',
              image: 'organizationImage',
              name: 'organizationName',
              description: 'organizationDescription',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: USER_ORGANIZATION_CONNECTION,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        organizationsConnection: [
          {
            __typename: 'Organization',
            _id: '2',
            image: 'organizationImage',
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
            name: 'organizationName',
            description: 'organizationDescription',
            userRegistrationRequired: false,
            createdAt: '12345678900',
            creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
            members: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: getItem('userId'),
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
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

let props = {
  id: '1',
  name: 'organizationName',
  image: '',
  description: 'organizationDescription',
  admins: [
    {
      id: '123',
    },
  ],
  members: [],
  address: {
    city: '',
    countryCode: '',
    postalCode: '',
    state: '',
  },
  membershipRequestStatus: '',
  userRegistrationRequired: true,
  membershipRequests: [
    {
      _id: '',
      user: {
        _id: '',
      },
    },
  ],
};

describe('Testing OrganizationCard Component [User Portal]', () => {
  test('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });

  test('Component should be rendered properly if organization Image is not undefined', async () => {
    props = {
      ...props,
      image: 'organizationImage',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });

  test('Send membership request', async () => {
    props = {
      ...props,
      image: 'organizationImage',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.getByTestId('joinBtn')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('joinBtn'));
    await wait();

    expect(toast.success).toHaveBeenCalledWith(
      'Membership request sent successfully',
    );
  });

  test('send membership request to public org', async () => {
    const cardProps = {
      ...props,
      id: '2',
      image: 'organizationImage',
      userRegistrationRequired: false,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.getByTestId('joinBtn')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('joinBtn'));
    await wait();

    expect(toast.success).toHaveBeenCalledWith(
      'Joined organization successfully',
    );
  });

  test('withdraw membership request', async () => {
    const cardProps = {
      ...props,
      id: '3',
      image: 'organizationImage',
      userRegistrationRequired: true,
      membershipRequestStatus: 'pending',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.getByTestId('withdrawBtn')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('withdrawBtn'));
  });
});
