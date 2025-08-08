import React from 'react';
import { render, screen } from '@testing-library/react';
import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';
import { describe, it, expect } from 'vitest';
import OrgDelete from './OrgDelete';
import i18nForTest from 'utils/i18nForTest';
import { BACKEND_URL } from 'Constant/constant';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: BACKEND_URL,
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
