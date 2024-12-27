import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import SecuredRouteForUser from './SecuredRouteForUser';
import useLocalStorage from 'utils/useLocalstorage';

/**
 * Unit tests for SecuredRouteForUser component:
 *
 * 1. **Logged-in user**: Verifies that the route renders when 'IsLoggedIn' is set to 'TRUE'.
 * 2. **Not logged-in user**: Ensures redirection to the login page when 'IsLoggedIn' is 'FALSE'.
 * 3. **Logged-in user with admin access**: Checks that the route renders for a logged-in user with 'AdminFor' set (i.e., admin of an organization).
 *
 * LocalStorage values like 'IsLoggedIn' and 'AdminFor' are set to simulate different user states.
 */

const { setItem } = useLocalStorage();

describe('SecuredRouteForUser', () => {
  it('renders the route when the user is logged in', () => {
    // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user and do not set 'AdminFor' so that it remains undefined.
    setItem('IsLoggedIn', 'TRUE');

    render(
      <MemoryRouter initialEntries={['/user/organizations']}>
        <Routes>
          <Route element={<SecuredRouteForUser />}>
            <Route
              path="/user/organizations"
              element={
                <div data-testid="organizations-content">
                  Organizations Component
                </div>
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('organizations-content')).toBeInTheDocument();
  });

  it('redirects to /user when the user is not logged in', async () => {
    // Set the user as not logged in in local storage
    setItem('IsLoggedIn', 'FALSE');

    render(
      <MemoryRouter initialEntries={['/user/organizations']}>
        <Routes>
          <Route path="/" element={<div>User Login Page</div>} />
          <Route element={<SecuredRouteForUser />}>
            <Route
              path="/user/organizations"
              element={
                <div data-testid="organizations-content">
                  Organizations Component
                </div>
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('User Login Page')).toBeInTheDocument();
    });
  });

  it('renders the route when the user is logged in and user is ADMIN', () => {
    // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user and set 'AdminFor' to simulate ADMIN of some Organization.
    setItem('IsLoggedIn', 'TRUE');
    setItem('AdminFor', [
      {
        _id: '6537904485008f171cf29924',
        __typename: 'Organization',
      },
    ]);

    render(
      <MemoryRouter initialEntries={['/user/organizations']}>
        <Routes>
          <Route
            path="/user/organizations"
            element={<div>Oops! The Page you requested was not found!</div>}
          />
          <Route element={<SecuredRouteForUser />}>
            <Route
              path="/user/organizations"
              element={
                <div data-testid="organizations-content">
                  Organizations Component
                </div>
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/Oops! The Page you requested was not found!/i),
    ).toBeTruthy();
  });
});
