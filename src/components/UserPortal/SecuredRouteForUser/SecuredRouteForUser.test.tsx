import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import SecuredRouteForUser from './SecuredRouteForUser';

describe('SecuredRouteForUser', () => {
  test('renders the route when the user is logged in', () => {
    // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user
    localStorage.setItem('IsLoggedIn', 'TRUE');

    render(
      <MemoryRouter initialEntries={['/user/organizations']}>
        <Route
          path="/user/organizations"
          render={() => (
            <SecuredRouteForUser
              path="/user/organizations"
              component={() => (
                <div data-testid="organizations-content">
                  Organizations Component
                </div>
              )}
            />
          )}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('organizations-content')).toBeInTheDocument();
  });

  test('redirects to /user when the user is not logged in', async () => {
    // Set the user as not logged in in local storage
    localStorage.setItem('IsLoggedIn', 'FALSE');

    render(
      <MemoryRouter initialEntries={['/secured']}>
        <Route
          path="/secured"
          exact
          render={() => (
            <SecuredRouteForUser>
              <div data-testid="secured-content">Secured Content</div>
            </SecuredRouteForUser>
          )}
        />
      </MemoryRouter>
    );

      await waitFor(() => {
        expect(window.location.pathname).toBe('/');
      });
  });
});
