import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
<<<<<<< HEAD
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import 'jest-location-mock';
=======
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
<<<<<<< HEAD
import OrganizationScreen from './OrganizationScreen';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

let mockID: string | undefined = '123';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: mockID }),
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
            address: {
              city: 'Mountain View',
              countryCode: 'US',
              dependentLocality: 'Some Dependent Locality',
              line1: '123 Main Street',
              line2: 'Apt 456',
              postalCode: '94040',
              sortingCode: 'XYZ-789',
              state: 'CA',
            },
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

const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new Event('resize'));
};

const clickToggleMenuBtn = (toggleButton: HTMLElement): void => {
  fireEvent.click(toggleButton);
=======
import type { InterfaceOrganizationScreenProps } from './OrganizationScreen';
import OrganizationScreen from './OrganizationScreen';

const props: InterfaceOrganizationScreenProps = {
  title: 'Dashboard',
  screenName: 'Dashboard',
  children: <div>Testing ...</div>,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
};

describe('Testing LeftDrawer in OrganizationScreen', () => {
  test('Testing LeftDrawer in page functionality', async () => {
<<<<<<< HEAD
    setItem('UserType', 'SUPERADMIN');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    const toggleButton = screen.getByTestId('toggleMenuBtn') as HTMLElement;
    const icon = toggleButton.querySelector('i');

    // Resize window to a smaller width
    resizeWindow(800);
    clickToggleMenuBtn(toggleButton);
    expect(icon).toHaveClass('fa fa-angle-double-right');
    // Resize window back to a larger width

    resizeWindow(1000);
    clickToggleMenuBtn(toggleButton);
    expect(icon).toHaveClass('fa fa-angle-double-left');

    clickToggleMenuBtn(toggleButton);
    expect(icon).toHaveClass('fa fa-angle-double-right');
  });

  test('should be redirected to / if orgId is undefined', async () => {
    mockID = undefined;
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(window.location.pathname).toEqual('/');
=======
    localStorage.setItem('UserType', 'SUPERADMIN');

    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationScreen {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    // sets hideDrawer to true
    userEvent.click(screen.getByTestId('menuBtn'));
    // sets hideDrawer to false
    userEvent.click(screen.getByTestId('menuBtn'));
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });
});
