import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import { toast } from 'react-toastify';
import i18nForTest from 'utils/i18nForTest';
import LeftDrawer, { InterfaceLeftDrawerProps } from './LeftDrawer';

let props = {
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
let propsOrg: InterfaceLeftDrawerProps = {
  ...props,
  screenName: 'Organizations',
};
let propsReq: InterfaceLeftDrawerProps = {
  ...props,
  screenName: 'Requests',
};
let propsRoles: InterfaceLeftDrawerProps = {
  ...props,
  screenName: 'Roles',
  showDrawer: false,
};

describe('Testing Left Drawer component', () => {
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

    const orgsBtn = screen.getByTestId(/orgsBtn/i);
    const requestsBtn = screen.getByTestId(/requestsBtn/i);
    const rolesBtn = screen.getByTestId(/rolesBtn/i);

    expect(orgsBtn.classList.contains('btn btn-success'));
    expect(requestsBtn.classList.contains('btn btn-light'));
    expect(rolesBtn.classList.contains('btn btn-light'));

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
      screenName: 'Organizations' as 'Organizations',
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

    expect(orgsBtn.classList.contains('btn btn-success'));
    expect(requestsBtn.classList.contains('btn btn-light'));
    expect(rolesBtn.classList.contains('btn btn-light'));

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

    expect(orgsBtn.classList.contains('btn btn-light'));
    expect(requestsBtn.classList.contains('btn btn-light'));
    expect(rolesBtn.classList.contains('btn btn-success'));

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
    const leftDrawer = screen.getByTestId(/leftDrawerContainer/i);
    const closeModalBtn = screen.getByTestId(/closeModalBtn/i);
    expect(leftDrawer.classList.contains('activeDrawer'));
    userEvent.click(closeModalBtn);
    expect(leftDrawer.classList.contains('inactiveDrawer'));
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
