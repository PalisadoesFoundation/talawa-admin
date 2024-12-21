/**
 * This file contains unit tests for the UserScreen component.
 *
 * The tests cover:
 * - Rendering of the correct title based on the location.
 * - Functionality of the LeftDrawer component.
 * - Behavior when the orgId is undefined.
 *
 * These tests use Vitest for test execution and MockedProvider for mocking GraphQL queries.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import UserScreen from './UserScreen';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import '@testing-library/jest-dom';

let mockID: string | undefined = '123';
let mockLocation: string | undefined = '/user/organization/123';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: mockID }),
    useLocation: () => ({ pathname: mockLocation }),
    useNavigate: vi.fn(), // Mock only the necessary parts
  };
});

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

describe('UserScreen tests with LeftDrawer functionality', () => {
  beforeEach(() => {
    mockID = '123';
    mockLocation = '/user/organization/123';
  });

  it('renders the correct title for posts', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toHaveTextContent('Posts');
  });

  it('renders the correct title for people', () => {
    mockLocation = '/user/people/123';

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toHaveTextContent('People');
  });

  it('toggles LeftDrawer correctly based on window size and user interaction', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const toggleButton = screen.getByTestId('closeMenu') as HTMLElement;
    const icon = toggleButton.querySelector('i');

    // Resize to small screen and check toggle state
    resizeWindow(800);
    clickToggleMenuBtn(toggleButton);
    expect(icon).toHaveClass('fa fa-angle-double-left');

    // Resize to large screen and check toggle state
    resizeWindow(1000);
    clickToggleMenuBtn(toggleButton);
    expect(icon).toHaveClass('fa fa-angle-double-right');

    // Check state on re-click
    clickToggleMenuBtn(toggleButton);
    expect(icon).toHaveClass('fa fa-angle-double-left');
  });

  it('redirects to root when orgId is undefined', () => {
    mockID = undefined;
    const navigate = vi.fn();
    vi.spyOn({ useNavigate }, 'useNavigate').mockReturnValue(navigate);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(window.location.pathname).toEqual('/');
  });
});
