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
<<<<<<< HEAD
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

const props = {
  hideDrawer: true,
  setHideDrawer: jest.fn(),
};

const propsOrg: InterfaceLeftDrawerProps = {
  ...props,
<<<<<<< HEAD
=======
  screenName: 'Organizations',
};
const propsReq: InterfaceLeftDrawerProps = {
  ...props,
  hideDrawer: false,
  screenName: 'Requests',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
};
const propsUsers: InterfaceLeftDrawerProps = {
  ...props,
  hideDrawer: null,
<<<<<<< HEAD
=======
  screenName: 'Users',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
  setItem('FirstName', 'John');
  setItem('LastName', 'Doe');
  setItem(
    'UserImage',
    'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
=======
  localStorage.setItem('FirstName', 'John');
  localStorage.setItem('LastName', 'Doe');
  localStorage.setItem(
    'UserImage',
    'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe'
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  );
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('Testing Left Drawer component for SUPERADMIN', () => {
  test('Component should be rendered properly', () => {
<<<<<<< HEAD
    setItem('UserImage', '');
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');
=======
    localStorage.setItem('UserImage', '');
    localStorage.setItem('UserType', 'SUPERADMIN');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawer {...propsOrg} />
          </I18nextProvider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
    );

    expect(screen.getByText('My Organizations')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Community Profile')).toBeInTheDocument();
    expect(screen.getByText('Talawa Admin Portal')).toBeInTheDocument();

    const orgsBtn = screen.getByTestId(/orgsBtn/i);
    const rolesBtn = screen.getByTestId(/rolesBtn/i);
    const communityProfileBtn = screen.getByTestId(/communityProfileBtn/i);

    orgsBtn.click();
    expect(
      orgsBtn.className.includes('text-white btn btn-success'),
    ).toBeTruthy();
    expect(rolesBtn.className.includes('text-secondary btn')).toBeTruthy();
    expect(
      communityProfileBtn.className.includes('text-secondary btn'),
    ).toBeTruthy();
=======
      </MockedProvider>
    );

    expect(screen.getByText('Organizations')).toBeInTheDocument();
    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

    // Send to roles screen
    userEvent.click(rolesBtn);
    expect(global.window.location.pathname).toContain('/users');
<<<<<<< HEAD
    userEvent.click(communityProfileBtn);
  });

  test('Testing Drawer when hideDrawer is null', () => {
=======
  });

  test('Testing in requests screen', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawer {...propsOrg} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    const orgsBtn = screen.getByTestId(/orgsBtn/i);

    // Send to organizations screen
    userEvent.click(orgsBtn);
    expect(global.window.location.pathname).toContain('/orglist');
  });

  test('Testing in roles screen', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawer {...propsUsers} />
          </I18nextProvider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
    );
  });
  test('Testing Drawer when hideDrawer is false', () => {
    const tempProps: InterfaceLeftDrawerProps = {
      ...props,
      hideDrawer: false,
    };
=======
      </MockedProvider>
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
<<<<<<< HEAD
            <LeftDrawer {...tempProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
=======
            <LeftDrawer {...propsOrg} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    const closeModalBtn = screen.getByTestId(/closeModalBtn/i);
    userEvent.click(closeModalBtn);
  });

  test('Testing Drawer when hideDrawer is null', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawer {...propsUsers} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
  });

  test('Testing Drawer when hideDrawer is true', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawer {...propsReq} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
  });

  test('Testing logout functionality', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawer {...propsOrg} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    userEvent.click(screen.getByTestId('logoutBtn'));
    expect(localStorage.clear).toHaveBeenCalled();
    expect(global.window.location.pathname).toBe('/');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });
});

describe('Testing Left Drawer component for ADMIN', () => {
  test('Components should be rendered properly', () => {
<<<<<<< HEAD
=======
    localStorage.setItem('UserType', 'ADMIN');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawer {...propsOrg} />
          </I18nextProvider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
    );

    expect(screen.getByText('My Organizations')).toBeInTheDocument();
    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText('Talawa Admin Portal')).toBeInTheDocument();

    expect(screen.getAllByText(/admin/i)).toHaveLength(1);

    const orgsBtn = screen.getByTestId(/orgsBtn/i);
    const requestsBtn = screen.getByTestId(/requestsBtn/i);
    orgsBtn.click();
    expect(
      orgsBtn.className.includes('text-white btn btn-success'),
    ).toBeTruthy();
    expect(requestsBtn.className.includes('text-secondary btn')).toBeTruthy();

    // These screens arent meant for admins so they should not be present
    expect(screen.queryByTestId(/rolesBtn/i)).toBeNull();

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
    expect(orgsBtn.className.includes('text-secondary btn')).toBeTruthy();
  });
=======
      </MockedProvider>
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

    // Send to roles screen
    userEvent.click(orgsBtn);
    expect(global.window.location.pathname).toContain('/orglist');
  });
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
});
