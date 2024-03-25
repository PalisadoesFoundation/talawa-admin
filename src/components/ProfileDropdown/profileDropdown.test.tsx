import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ProfileDropdown from './profileDropdown';
import 'jest-localstorage-mock';
import { MockedProvider } from '@apollo/react-testing';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();
const MOCKS = [
  {
    request: {
      query: REVOKE_REFRESH_TOKEN,
    },
    result: {},
  },
];

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
  clear: jest.fn(),
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
afterEach(() => {
  jest.clearAllMocks();
});

describe('ProfileDropdown Component', () => {
  test('renders with user information', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <ProfileDropdown />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('display-name')).toBeInTheDocument();
    expect(screen.getByTestId('display-type')).toBeInTheDocument();
    expect(screen.getByAltText('profile picture')).toBeInTheDocument();
  });

  test('logout functionality clears local storage and redirects to home', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <ProfileDropdown />
        </BrowserRouter>
      </MockedProvider>,
    );
    await act(async () => {
      userEvent.click(screen.getByTestId('togDrop'));
    });

    userEvent.click(screen.getByTestId('logoutBtn'));
    expect(global.window.location.pathname).toBe('/');
  });
});
