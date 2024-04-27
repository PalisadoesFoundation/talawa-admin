import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import SecuredRouteForUser from './SecuredRouteForUser';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

describe('SecuredRouteForUser', () => {
  test('renders the route when the user is logged in', () => {
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

  test('redirects to /user when the user is not logged in', async () => {
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

  test('renders the route when the user is logged in and user is ADMIN', () => {
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
