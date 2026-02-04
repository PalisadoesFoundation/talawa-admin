import React from 'react';
import { render, screen } from '@testing-library/react';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { I18nextProvider } from 'react-i18next';
import { describe, it, expect } from 'vitest';
import OrgDelete from './OrgDelete';
import i18nForTest from 'utils/i18nForTest';
import { BACKEND_URL } from 'Constant/constant';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: BACKEND_URL }),
});

describe('Testing Organization People List Card', () => {
  it('should render props and text elements test for the page component', () => {
    render(
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgDelete />
        </I18nextProvider>
      </ApolloProvider>,
    );
    expect(screen.getByText('Delete Org')).toBeInTheDocument();
  });
});
