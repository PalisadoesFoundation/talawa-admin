import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import 'jest-location-mock';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import EventDashboardScreen from './EventDashboardScreen';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import useLocalStorage from 'utils/useLocalstorage';
const { setItem } = useLocalStorage();

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
};

describe('Testing LeftDrawer in OrganizationScreen', () => {
  test('should be redirected to / if IsLoggedIn is false', async () => {
    setItem('IsLoggedIn', false);
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(window.location.pathname).toEqual('/');
  });
  test('should be redirected to / if ss is false', async () => {
    setItem('IsLoggedIn', true);
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  });
  test('Testing LeftDrawer in page functionality', async () => {
    setItem('IsLoggedIn', true);
    setItem('AdminFor', [
      { _id: '6637904485008f171cf29924', __typename: 'Organization' },
    ]);
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
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
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(window.location.pathname).toEqual('/');
  });
});
