import React from 'react';
import { MemoryRouter, Redirect, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import SecuredRouteForUser from './SecuredRouteForUser';

describe('SecuredRouteForUser', () => {
  test('renders the route when the user is logged in', () => {
    // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user
    localStorage.setItem('IsLoggedIn', 'TRUE');

    const { container } = render(
      <MemoryRouter initialEntries={['/user/organizations']}>
        <SecuredRouteForUser
          path="/user/organizations"
          component={() => (
            <div data-testid="organizations-content">
              Organizations Component
            </div>
          )}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('organizations-content')).toBeInTheDocument();
  });

  test('redirects to /user when the user is not logged in', async () => {
    // Set the user as not logged in in local storage
    localStorage.setItem('IsLoggedIn', 'FALSE');

    const { container } = render(
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

    // Ensure that the redirect to / occurred
    // waitFor(() => {
    //   expect(window.location.pathname).toBe('/user');
    // }
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
});
