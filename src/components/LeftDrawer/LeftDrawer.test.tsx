import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import i18nForTest from 'utils/i18nForTest';
import type { InterfaceLeftDrawerProps } from './LeftDrawer';
import LeftDrawer from './LeftDrawer';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { StaticMockLink } from 'utils/StaticMockLink';
import { MockedProvider } from '@apollo/react-testing';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

const props = {
  hideDrawer: true,
  setHideDrawer: jest.fn(),
};

const propsOrg: InterfaceLeftDrawerProps = {
  ...props,
};
const propsUsers: InterfaceLeftDrawerProps = {
  ...props,
  hideDrawer: null,
};

const MOCKS = [
  {
    request: {
      query: REVOKE_REFRESH_TOKEN,
    },
    result: {},
  },
];

const link = new StaticMockLink(MOCKS, true);

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

beforeEach(() => {
  setItem('FirstName', 'John');
  setItem('LastName', 'Doe');
  setItem(
    'UserImage',
    'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
  );
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('Testing Left Drawer component for SUPERADMIN', () => {
  beforeEach(() => {
    setItem('UserType', 'SUPERADMIN');
  });
  test('Component should be rendered properly', () => {
    setItem('UserImage', '');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawer {...propsOrg} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('My Organizations')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Talawa Admin Portal')).toBeInTheDocument();

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Superadmin/i)).toBeInTheDocument();
    expect(screen.getByAltText(/dummy picture/i)).toBeInTheDocument();

    const orgsBtn = screen.getByTestId(/orgsBtn/i);
    const rolesBtn = screen.getByTestId(/rolesBtn/i);
    orgsBtn.click();
    expect(
      orgsBtn.className.includes('text-white btn btn-success'),
    ).toBeTruthy();
    expect(
      rolesBtn.className.includes('text-secondary btn btn-light'),
    ).toBeTruthy();

    // These screens arent meant for SuperAdmins so they should not be present
    expect(screen.queryByTestId(/requestsBtn/i)).toBeNull();

    // Coming soon
    userEvent.click(screen.getByTestId(/profileBtn/i));

    // Send to roles screen
    userEvent.click(rolesBtn);
    expect(global.window.location.pathname).toContain('/users');
  });

  test('Testing in roles screen', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawer {...propsUsers} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const orgsBtn = screen.getByTestId(/orgsBtn/i);
    const rolesBtn = screen.getByTestId(/rolesBtn/i);

    expect(
      orgsBtn.className.includes('text-secondary btn btn-light'),
    ).toBeTruthy();
    expect(
      rolesBtn.className.includes('text-white btn btn-success'),
    ).toBeTruthy();
  });

  test('Testing Drawer when hideDrawer is null', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawer {...propsUsers} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
  });

  test('Testing logout functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawer {...propsOrg} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    userEvent.click(screen.getByTestId('logoutBtn'));
    expect(localStorage.clear).toHaveBeenCalled();
    expect(global.window.location.pathname).toBe('/');
  });
});

describe('Testing Left Drawer component for ADMIN', () => {
  beforeEach(() => {
    setItem('UserType', 'ADMIN');
  });
  test('Components should be rendered properly', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawer {...propsOrg} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('My Organizations')).toBeInTheDocument();
    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText('Talawa Admin Portal')).toBeInTheDocument();

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getAllByText(/admin/i)).toHaveLength(2);
    expect(screen.getByAltText(/profile picture/i)).toBeInTheDocument();

    const orgsBtn = screen.getByTestId(/orgsBtn/i);
    const requestsBtn = screen.getByTestId(/requestsBtn/i);
    orgsBtn.click();
    expect(
      orgsBtn.className.includes('text-white btn btn-success'),
    ).toBeTruthy();
    expect(
      requestsBtn.className.includes('text-secondary btn btn-light'),
    ).toBeTruthy();

    // These screens arent meant for admins so they should not be present
    expect(screen.queryByTestId(/rolesBtn/i)).toBeNull();

    // Coming soon
    userEvent.click(screen.getByTestId(/profileBtn/i));

    // Send to requests screen
    userEvent.click(requestsBtn);
    expect(global.window.location.pathname).toContain('/requests');

    // Send to orglist screen
    userEvent.click(orgsBtn);
    expect(global.window.location.pathname).toContain('/orglist');
  });

  test('Testing in requests screen', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawer {...propsUsers} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const orgsBtn = screen.getByTestId(/orgsBtn/i);
    const requestsBtn = screen.getByTestId(/requestsBtn/i);

    requestsBtn.click();
    expect(
      requestsBtn.className.includes('text-white btn btn-success'),
    ).toBeTruthy();
    expect(
      orgsBtn.className.includes('text-secondary btn btn-light'),
    ).toBeTruthy();
  });
});
