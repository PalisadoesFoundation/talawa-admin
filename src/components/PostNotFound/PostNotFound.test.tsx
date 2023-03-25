import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

import { render, screen } from '@testing-library/react';
import PostNotFound from './PostNotFound';

describe('Tesing the PostNotFound Component', () => {
  it('renders the component with the correct title for posts', () => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <PostNotFound title="post" keyPrefix="postNotFound" />
      </I18nextProvider>
    );
    expect(screen.getByText(/Not Found!/i)).toBeInTheDocument();
  });

  it('renders the component with the correct title for users', () => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <PostNotFound title="user" keyPrefix="userNotFound" />
      </I18nextProvider>
    );
    expect(screen.getByText(/Not Found!/i)).toBeInTheDocument();
  });
});
