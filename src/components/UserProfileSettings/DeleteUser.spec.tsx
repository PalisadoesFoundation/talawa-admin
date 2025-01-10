import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import DeleteUser from './DeleteUser';
import { describe, it, expect } from 'vitest';

describe('Delete User component', () => {
  it('renders delete user correctly', () => {
    const { getByText, getAllByText } = render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <DeleteUser />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(
      getByText(
        'By clicking on Delete User button your user will be permanently deleted along with its events, tags and all related data.',
      ),
    ).toBeInTheDocument();
    expect(getAllByText('Delete User')[0]).toBeInTheDocument();
  });
});
