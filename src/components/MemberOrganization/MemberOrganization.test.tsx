import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import MemberOrganization from './MemberOrganization';
import {
  USER_ORGANIZATION_LIST,
  ORGANIZATION_CONNECTION_LIST,
} from 'GraphQl/Queries/Queries';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import useLocalStorage from 'utils/useLocalstorage';
import { StaticMockLink } from 'utils/StaticMockLink';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';

const { getItem, setItem } = useLocalStorage();

afterEach(() => {
  localStorage.clear();
  cleanup();
});

const mocks = [
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { userId: 'testUserId' },
    },
    result: {
      data: {
        user: {
          user: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            image: '',
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
      variables: { filter: '', first: 8, skip: 0, orderBy: 'createdAt_ASC' },
      notifyOnNetworkStatusChange: true,
    },
    result: {
      data: {
        organizationsConnection: [
          {
            _id: 'org1',
            name: 'Sample Organization',
            image: '',
            creator: { _id: 'testUserId', firstName: 'John', lastName: 'Doe' },
            members: [{ _id: 'testUserId' }, { _id: 'testUserId1' }],
            admins: [{ _id: 'testUserId' }],
            createdAt: '2023-01-01T00:00:00Z',
            address: {
              city: 'Sample City',
              countryCode: 'US',
              dependentLocality: '',
              line1: '123 Main St',
              line2: '',
              postalCode: '12345',
              sortingCode: '',
              state: 'Sample State',
            },
            blockedUsers: [],
            description: 'Sample description',
          },
          {
            _id: 'org2',
            name: 'Sample Organization 2',
            image: '',
            creator: { _id: 'testUserId', firstName: 'John', lastName: 'Doe' },
            members: [{ _id: 'testUserId' }, { _id: 'testUserId1' }],
            admins: [{ _id: 'testUserId1' }],
            createdAt: '2024-01-01T00:00:00Z',
            address: {
              city: 'Sample City',
              countryCode: 'US',
              dependentLocality: '',
              line1: '123 Main St',
              line2: '',
              postalCode: '12345',
              sortingCode: '',
              state: 'Sample State',
            },
            blockedUsers: [],
            description: 'Sample description',
          },
        ],
      },
    },
  },
];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    orgId: 'org1',
  }),
  useRouteMatch: () => ({ url: '/members/org1' }),
}));

describe('MemberOrganization', () => {
  const link = new StaticMockLink(mocks, true);

  test('renders the member organization component for super admin', async () => {
    const beforeUserId = getItem('userId');
    setItem('id', 'testUserId');

    setItem('userId', 'testUserId');
    setItem('AdminFor', [{ _id: 'org1' }]);
    setItem('SuperAdmin', true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberOrganization userId="testUserId" />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Sample Organization')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('emptyContainerForImage')).toHaveLength(2);
    });

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('renders the member organization component for admin', async () => {
    const beforeUserId = getItem('userId');
    setItem('id', 'testUserId');

    setItem('userId', 'testUserId');
    setItem('AdminFor', [{ _id: 'org1' }]);
    setItem('SuperAdmin', false);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberOrganization userId="testUserId" />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Sample Organization')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('emptyContainerForImage')).toHaveLength(1);
    });

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  // test('renders MemberOrganization component for Superadmin', async () => {
  //   const beforeUserId = getItem('userId');
  //   setItem('userId', 'testUserId');
  //   setItem('AdminFor', [{ _id: 'org1' }]);
  //   setItem('SuperAdmin', true);

  //   render(
  //     <MockedProvider mocks={mocks} addTypename={false}>
  //       <I18nextProvider i18n={i18nForTest}>
  //         <MemberOrganization userId="testUserId" />
  //       </I18nextProvider>
  //     </MockedProvider>,
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByText('Sample Organization')).toBeInTheDocument();
  //   });

  //   await waitFor(() => {
  //     expect(screen.getAllByTestId('emptyContainerForImage')).toHaveLength(2);
  //   });

  //   if (beforeUserId) {
  //     setItem('userId', beforeUserId);
  //   }
  // });

  // test('renders MemberOrganization component for Admin', async () => {
  //   const beforeUserId = getItem('userId');

  //   setItem('userId', 'testUserId');
  //   setItem('AdminFor', [{ _id: 'org1' }]);
  //   setItem('SuperAdmin', false);
  //   setItem('orgId', 'org1');

  //   render(
  //     <MockedProvider mocks={mocks} addTypename={false}>
  //       <I18nextProvider i18n={i18nForTest}>
  //         <MemberOrganization userId="testUserId" />
  //       </I18nextProvider>
  //     </MockedProvider>,
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByText('Sample Organization')).toBeInTheDocument();
  //   });

  //   await waitFor(() => {
  //     expect(screen.getAllByTestId('emptyContainerForImage')).toHaveLength(1);
  //   });

  //   if (beforeUserId) {
  //     setItem('userId', beforeUserId);
  //   }
  // });
});
