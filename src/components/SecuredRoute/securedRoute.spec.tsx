import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import SecuredRoute from './SecuredRoute';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

describe('SecuredRoute', () => {
  it('for administrator', () => {
    // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user and do not set 'AdminFor' so that it remains undefined.
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

  it('for administrator', () => {
    // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user and do not set 'AdminFor' so that it remains undefined.
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
