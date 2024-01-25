import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import 'jest-location-mock';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import OrganizationScreen from './OrganizationScreen';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: '123' }),
}));
const MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '123',
            image: null,
            creator: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'JohnDoe@example.com',
            },
            name: 'Test Organization',
            description: 'Testing this organization',
            location: 'Lucknow, India',
            userRegistrationRequired: true,
            visibleInSearch: true,
            members: [],
            admins: [],
            membershipRequests: [],
            blockedUsers: [],
          },
        ],
      },
    },
  },
];
const link = new StaticMockLink(MOCKS, true);

describe('Testing LeftDrawer in OrganizationScreen', () => {
  test('Testing LeftDrawer in page functionality', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    // Resize window to trigger handleResize
    window.innerWidth = 800; // Set a width less than or equal to 820
    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('openMenu') as HTMLElement);
    });

    // sets hideDrawer to true
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('menuBtn') as HTMLElement);
    });

    // Resize window back to a larger width
    window.innerWidth = 1000; // Set a larger width
    fireEvent(window, new Event('resize'));

    // sets hideDrawer to false
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('openMenu') as HTMLElement);
    });

    // sets hideDrawer to true
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('menuBtn') as HTMLElement);
    });
  });
});
