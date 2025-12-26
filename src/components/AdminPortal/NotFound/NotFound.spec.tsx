import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';
import { expect, it, describe } from 'vitest';

describe('Tesing the NotFound Component', () => {
  it('renders the component with the correct title for posts', () => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <NotFound title="post" keyPrefix="postNotFound" />
      </I18nextProvider>,
    );
    expect(screen.getByText(/Not Found!/i)).toBeInTheDocument();
  });

  it('renders the component with the correct title for users', () => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <NotFound title="user" keyPrefix="userNotFound" />
      </I18nextProvider>,
    );
    expect(screen.getByText(/Not Found!/i)).toBeInTheDocument();
  });
});
