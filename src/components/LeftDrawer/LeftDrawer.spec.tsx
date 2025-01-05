import React, { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18nForTest from 'utils/i18nForTest';
import type { InterfaceLeftDrawerProps } from './LeftDrawer';
import LeftDrawer from './LeftDrawer';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { StaticMockLink } from 'utils/StaticMockLink';
import { MockedProvider } from '@apollo/react-testing';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, it, describe, beforeEach, afterEach, expect } from 'vitest';

const { setItem } = useLocalStorage();

const props = {
  hideDrawer: true,
  setHideDrawer: vi.fn(),
};

const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new Event('resize'));
};

const propsOrg: InterfaceLeftDrawerProps = {
  ...props,
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

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
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
  vi.clearAllMocks();
  localStorage.clear();
});

describe('Testing Left Drawer component for SUPERADMIN', () => {
  it('Component should be rendered properly', async () => {
    setItem('UserImage', '');
    setItem('SuperAdmin', true);
    setItem('FirstName', 'John');
    setItem('LastName', 'Doe');

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawer {...propsOrg} />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    expect(screen.getByText('My Organizations')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Community Profile')).toBeInTheDocument();
    expect(screen.getByText('Talawa Admin Portal')).toBeInTheDocument();

    const orgsBtn = screen.getByTestId(/orgsBtn/i);
    const rolesBtn = screen.getByTestId(/rolesBtn/i);
    const communityProfileBtn = screen.getByTestId(/communityProfileBtn/i);

    await act(async () => {
      orgsBtn.click();
    });

    expect(
      orgsBtn.className.includes('text-black btn btn-success'),
    ).toBeTruthy();
    expect(rolesBtn.className.includes('text-secondary btn')).toBeTruthy();
    expect(
      communityProfileBtn.className.includes('text-secondary btn'),
    ).toBeTruthy();

    await act(async () => {
      userEvent.click(rolesBtn);
    });

    expect(global.window.location.pathname).toContain('/users');

    await act(async () => {
      userEvent.click(communityProfileBtn);
    });
  });

  it('Testing Drawer when hideDrawer is null', async () => {
    const tempProps: InterfaceLeftDrawerProps = {
      ...props,
      hideDrawer: false,
    };

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawer {...tempProps} />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
  });

  it('Testing Drawer when hideDrawer is false', async () => {
    const tempProps: InterfaceLeftDrawerProps = {
      ...props,
      hideDrawer: false,
    };

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawer {...tempProps} />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
  });

  it('Testing Drawer when the screen size is less than or equal to 820px', async () => {
    const tempProps: InterfaceLeftDrawerProps = {
      ...props,
      hideDrawer: false,
    };
    resizeWindow(800);

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawer {...tempProps} />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    expect(screen.getByText('My Organizations')).toBeInTheDocument();
    expect(screen.getByText('Talawa Admin Portal')).toBeInTheDocument();

    const orgsBtn = screen.getByTestId(/orgsBtn/i);

    await act(async () => {
      orgsBtn.click();
    });

    expect(orgsBtn.className.includes('text-black')).toBeTruthy();
  });
});

describe('Testing Left Drawer component for ADMIN', () => {
  it('Components should be rendered properly', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LeftDrawer {...propsOrg} />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    expect(screen.getByText('My Organizations')).toBeInTheDocument();
    expect(screen.getByText('Talawa Admin Portal')).toBeInTheDocument();

    expect(screen.getAllByText(/admin/i)).toHaveLength(1);

    const orgsBtn = screen.getByTestId(/orgsBtn/i);

    await act(async () => {
      orgsBtn.click();
    });

    expect(
      orgsBtn.className.includes('text-black btn btn-success'),
    ).toBeTruthy();

    // These screens aren't meant for admins, so they should not be present
    expect(screen.queryByTestId(/rolesBtn/i)).toBeNull();

    await act(async () => {
      userEvent.click(orgsBtn);
    });

    expect(global.window.location.pathname).toContain('/orglist');
  });
});
