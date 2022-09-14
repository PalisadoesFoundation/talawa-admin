import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
  InMemoryCache,
} from '@apollo/client';
import { I18nextProvider } from 'react-i18next';

import OrgDelete from './OrgDelete';
import i18nForTest from 'utils/i18nForTest';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://talawa-graphql-api.herokuapp.com/graphql',
});

describe('Testing Organization People List Card', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgDelete />
        </I18nextProvider>
      </ApolloProvider>
    );
    expect(screen.getByText('Delete Org')).toBeInTheDocument();
  });
});
