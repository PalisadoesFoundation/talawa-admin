import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import SecuredRouteForUser from './SecuredRouteForUser';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

describe('SecuredRouteForUser', () => {
  test('renders the route when the user is logged in', () => {
    // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user
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

  test('redirects to /user when the user is not logged in', async () => {
    // Set the user as not logged in in local storage
    setItem('IsLoggedIn', 'FALSE');

    render(
      <MemoryRouter initialEntries={['/user/organizations']}>
        <Routes>
          <Route
            path="/user/organizations"
            element={<div>User Login Page</div>}
          />
          <Route element={<SecuredRouteForUser />}>
            <Route
              path="/organizations"
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
});
