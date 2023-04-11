import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import 'jest-localstorage-mock';

import ListNavbar from './ListNavbar';
import i18nForTest from 'utils/i18nForTest';

async function wait(ms = 100) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing List navbar component', () => {
  test('Component should be rendered properly', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <ListNavbar />
        </I18nextProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Talawa Admin Portal')).toBeInTheDocument();
    expect(screen.getByText('Roles')).toBeInTheDocument();
    expect(screen.getByText('Requests')).toBeInTheDocument();
  });

  test('Testing change language functionality', async () => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <ListNavbar />
        </I18nextProvider>
      </BrowserRouter>
    );

    await wait();

    userEvent.click(screen.getByTestId('changeLanguageBtn1'));
  });

  test('Testing when language cookie is not set', async () => {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'i18next=',
    });

    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <ListNavbar />
        </I18nextProvider>
      </BrowserRouter>
    );

    await wait();
  });

  test('Testing logout functionality', async () => {
    window.location.assign('/');

    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <ListNavbar />
        </I18nextProvider>
      </BrowserRouter>
    );

    userEvent.click(screen.getByTestId('logoutBtn'));
  });
});
