import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import PostNotFound from './PostNotFound';

describe('PostNotFound', () => {
  test('should render error message', () => {
    const errorMessage = 'message';
    render(
      <I18nextProvider i18n={i18nForTest}>
        <PostNotFound title={errorMessage} />
      </I18nextProvider>
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
