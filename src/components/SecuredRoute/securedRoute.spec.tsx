import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import SecuredRoute from './SecuredRoute';
import useLocalStorage from 'utils/useLocalstorage';

describe('SecuredRoute', () => {
  it('for administrator', () => {
    // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user and role administrator to simulate admin login.
    const { setItem } = useLocalStorage();
    setItem('IsLoggedIn', 'TRUE');
    setItem('role', 'administrator');

    render(
      <MemoryRouter initialEntries={['/orglist']}>
        <Routes>
          <Route element={<SecuredRoute />}>
            <Route path="/orglist" />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
  });

  it('for regular user', () => {
    // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user and role regular to simulare a non admin user.
    const { setItem } = useLocalStorage();
    setItem('IsLoggedIn', 'TRUE');
    setItem('role', 'regular');

    render(
      <MemoryRouter initialEntries={['/orglist']}>
        <Routes>
          <Route element={<SecuredRoute />}>
            <Route path="/orglist" />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('talawaUser')).toBeInTheDocument();
  });
});
