import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18nForTest from 'utils/i18nForTest';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { StaticMockLink } from 'utils/StaticMockLink';
import { MockedProvider } from '@apollo/react-testing';
import useLocalStorage from 'utils/useLocalstorage';
import ProfileDropdown from './profileDropdown';

const { setItem } = useLocalStorage();

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

  test('Testing logout functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileDropdown />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('menu')).toBeInTheDocument();

    expect(
      await screen.getByRole('menuitem', { name: 'Option 1' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('menuitem', { name: 'Option 1' }));

    // expect(jest.fn()).toHaveBeenCalledTimes(1)
    //     userEvent.click(screen.getByTestId('togDrop'));
    //   waitFor(() => {
    //     userEvent.click(screen.getByTestId('logoutBtn'));
    //   });
    // // userEvent.click(screen.getByTestId('logoutBtn'));
    // expect(localStorage.clear).toHaveBeenCalled();
    // expect(global.window.location.pathname).toBe('/');
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
            <ProfileDropdown />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getAllByText(/admin/i)).toHaveLength(2);
    expect(screen.getByAltText(/profile picture/i)).toBeInTheDocument();

    const orgsBtn = screen.getByTestId(/orgsBtn/i);
    orgsBtn.click();
    expect(
      orgsBtn.className.includes('text-white btn btn-success'),
    ).toBeTruthy();

    // These screens arent meant for admins so they should not be present
    expect(screen.queryByTestId(/rolesBtn/i)).toBeNull();

    // Coming soon
    userEvent.click(screen.getByTestId(/profileBtn/i));

    // Send to roles screen
    userEvent.click(orgsBtn);
    expect(global.window.location.pathname).toContain('/orglist');
  });
});
