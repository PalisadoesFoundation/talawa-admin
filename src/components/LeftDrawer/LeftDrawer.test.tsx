import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import { toast } from 'react-toastify';
import i18nForTest from 'utils/i18nForTest';
import type { InterfaceLeftDrawerProps } from './LeftDrawer';
import LeftDrawer from './LeftDrawer';

const props = {
  data: {
    user: {
      firstName: 'John',
      lastName: 'Doe',
      image: null,
      email: 'johndoe@gmail.com',
      userType: 'SUPERADMIN',
      adminFor: [
        {
          _id: '123',
          name: 'Palisadoes',
          image: null,
        },
      ],
    },
  },
  showDrawer: true,
  setShowDrawer: jest.fn(),
};

const propsAdmin: InterfaceLeftDrawerProps = {
  data: {
    user: {
      firstName: 'John',
      lastName: 'Doe',
      image: `https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe`,
      email: 'johndoe@gmail.com',
      userType: 'ADMIN',
      adminFor: [
        {
          _id: '123',
          name: 'Palisadoes',
          image: null,
        },
      ],
    },
  },
  screenName: 'Organizations',
  showDrawer: true,
  setShowDrawer: jest.fn(),
};

const propsOrg: InterfaceLeftDrawerProps = {
  ...props,
  screenName: 'Organizations',
};
const propsReq: InterfaceLeftDrawerProps = {
  ...props,
  screenName: 'Requests',
};
const propsRoles: InterfaceLeftDrawerProps = {
  ...props,
  screenName: 'Roles',
  showDrawer: false,
};

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('Testing Left Drawer component for SUPERADMIN', () => {
  test('Component should be rendered properly', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <LeftDrawer {...propsOrg} />
        </I18nextProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Organizations')).toBeInTheDocument();
    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText('Roles')).toBeInTheDocument();
    expect(screen.getByText('Talawa Admin Portal')).toBeInTheDocument();

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Superadmin/i)).toBeInTheDocument();
    expect(screen.getByAltText(/dummy picture/i)).toBeInTheDocument();

    const orgsBtn = screen.getByTestId(/orgsBtn/i);
    const requestsBtn = screen.getByTestId(/requestsBtn/i);
    const rolesBtn = screen.getByTestId(/rolesBtn/i);

    expect(
      orgsBtn.className.includes('text-white btn btn-success')
    ).toBeTruthy();
    expect(
      requestsBtn.className.includes('text-secondary btn btn-light')
    ).toBeTruthy();
    expect(
      rolesBtn.className.includes('text-secondary btn btn-light')
    ).toBeTruthy();

    // Coming soon
    userEvent.click(screen.getByTestId(/profileBtn/i));
    expect(toast.success).toHaveBeenCalledWith('Profile page coming soon!');

    // Send to roles screen
    userEvent.click(rolesBtn);
    expect(global.window.location.pathname).toContain('/roles');
  });

  test('Testing when user data is undefined', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    const userUndefinedProps = {
      ...props,
      data: undefined,
      screenName: 'Organizations',
    };
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <LeftDrawer {...userUndefinedProps} />
        </I18nextProvider>
      </BrowserRouter>
    );
    expect(screen.getByTestId(/loadingProfile/i)).toBeInTheDocument();
  });

  test('Testing in requests screen', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <LeftDrawer {...propsReq} />
        </I18nextProvider>
      </BrowserRouter>
    );

    const orgsBtn = screen.getByTestId(/orgsBtn/i);
    const requestsBtn = screen.getByTestId(/requestsBtn/i);
    const rolesBtn = screen.getByTestId(/rolesBtn/i);

    expect(
      requestsBtn.className.includes('text-white btn btn-success')
    ).toBeTruthy();
    expect(
      orgsBtn.className.includes('text-secondary btn btn-light')
    ).toBeTruthy();
    expect(
      rolesBtn.className.includes('text-secondary btn btn-light')
    ).toBeTruthy();

    // Send to organizations screen
    userEvent.click(orgsBtn);
    expect(global.window.location.pathname).toContain('/orglist');
  });

  test('Testing in roles screen', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <LeftDrawer {...propsRoles} />
        </I18nextProvider>
      </BrowserRouter>
    );

    const orgsBtn = screen.getByTestId(/orgsBtn/i);
    const requestsBtn = screen.getByTestId(/requestsBtn/i);
    const rolesBtn = screen.getByTestId(/rolesBtn/i);

    expect(
      orgsBtn.className.includes('text-secondary btn btn-light')
    ).toBeTruthy();
    expect(
      requestsBtn.className.includes('text-secondary btn btn-light')
    ).toBeTruthy();
    expect(
      rolesBtn.className.includes('text-white btn btn-success')
    ).toBeTruthy();

    // Send to requests screen
    userEvent.click(requestsBtn);
    expect(global.window.location.pathname).toContain('/requests');
  });

  test('Testing Drawer open close functionality', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <LeftDrawer {...propsOrg} />
        </I18nextProvider>
      </BrowserRouter>
    );
    const closeModalBtn = screen.getByTestId(/closeModalBtn/i);
    userEvent.click(closeModalBtn);
  });

  test('Testing logout functionality', async () => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <LeftDrawer {...propsOrg} />
        </I18nextProvider>
      </BrowserRouter>
    );

    userEvent.click(screen.getByTestId('logoutBtn'));
  });
});

describe('Testing Left Drawer component for ADMIN', () => {
  test('Components should be rendered properly', () => {
    localStorage.setItem('UserType', 'ADMIN');
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <LeftDrawer {...propsAdmin} />
        </I18nextProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Organizations')).toBeInTheDocument();
    expect(screen.getByText('Talawa Admin Portal')).toBeInTheDocument();

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getAllByText(/admin/i)).toHaveLength(2);
    expect(screen.getByAltText(/profile picture/i)).toBeInTheDocument();

    const orgsBtn = screen.getByTestId(/orgsBtn/i);

    expect(
      orgsBtn.className.includes('text-white btn btn-success')
    ).toBeTruthy();

    // These screens arent meant for admins so they should not be present
    expect(screen.queryByTestId(/rolesBtn/i)).toBeNull();
    expect(screen.queryByTestId(/requestsBtn/i)).toBeNull();

    // Coming soon
    userEvent.click(screen.getByTestId(/profileBtn/i));
    expect(toast.success).toHaveBeenCalledWith('Profile page coming soon!');

    // Send to roles screen
    userEvent.click(orgsBtn);
    expect(global.window.location.pathname).toContain('/orglist');
  });
});
