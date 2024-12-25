import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import OtherSettings from './OtherSettings';
import { describe, it, expect } from 'vitest';

describe('Delete User component', () => {
  it('renders delete user correctly', () => {
    const { getByText } = render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OtherSettings />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(getByText('Other Settings')).toBeInTheDocument();
    expect(getByText('Change Language')).toBeInTheDocument();
  });
});
