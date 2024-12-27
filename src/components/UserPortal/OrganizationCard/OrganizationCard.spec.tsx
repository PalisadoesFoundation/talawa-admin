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
  CANCEL_MEMBERSHIP_REQUEST,
} from 'GraphQl/Mutations/OrganizationMutations';
import { toast } from 'react-toastify';
import { vi } from 'vitest';

/**
 * Unit tests for the OrganizationCard component in the User Portal
 *
 * These tests validate the behavior and rendering of the OrganizationCard component.
 * The tests ensure the component displays properly with various states and that interactions
 * such as sending membership requests and visiting organizations work as expected.
 *
 * 1. **Component should be rendered properly**: Tests if the component renders correctly with the provided props.
 * 2. **Component should render properly with an image**: Verifies the component's behavior when an organization image is available.
 * 3. **Visit organization**: Simulates a click on the "manage" button and verifies that the user is redirected to the correct organization page.
 * 4. **Send membership request**: Tests if the membership request is successfully sent and verifies the success toast message.
 * 5. **Send membership request to a public organization**: Validates sending a membership request to a public organization and verifies multiple success toast messages.
 * 6. **Withdraw membership request**: Simulates withdrawing a membership request and verifies that the button works as expected.
 *
 * Mocked GraphQL queries and mutations are used to simulate the backend behavior for testing.
 */
const { getItem } = useLocalStorage();

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
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
  {
    request: {
      query: CANCEL_MEMBERSHIP_REQUEST,
      variables: {
        membershipRequestId: '56gheqyr7deyfuiwfewifruy8',
      },
    },
    result: {
      data: {
        cancelMembershipRequest: {
          _id: '56gheqyr7deyfuiwfewifruy8',
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
    city: 'Sample City',
    countryCode: 'US',
    line1: '123 Sample Street',
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
  it('Component should be rendered properly', async () => {
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

  it('Component should be rendered properly if organization Image is not undefined', async () => {
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

  it('Visit organization', async () => {
    const cardProps = {
      ...props,
      id: '3',
      image: 'organizationImage',
      userRegistrationRequired: true,
      membershipRequestStatus: 'accepted',
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

    expect(screen.getByTestId('manageBtn')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('manageBtn'));

    await wait();

    expect(window.location.pathname).toBe(`/user/organization/${cardProps.id}`);
  });

  it('Send membership request', async () => {
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

    expect(toast.success).toHaveBeenCalledWith('MembershipRequestSent');
  });

  it('send membership request to public org', async () => {
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

    expect(toast.success).toHaveBeenCalledTimes(2);
  });

  it('withdraw membership request', async () => {
    const cardProps = {
      ...props,
      id: '3',
      image: 'organizationImage',
      userRegistrationRequired: true,
      membershipRequestStatus: 'pending',
      membershipRequests: [
        {
          _id: '56gheqyr7deyfuiwfewifruy8',
          user: {
            _id: getItem('userId'),
          },
        },
      ],
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
