import React from 'react';
import { render, screen, within } from '@testing-library/react';
import SuperAdminOrgHomePage from './SuperAdminOrgHomePage';
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
  InMemoryCache,
} from '@apollo/client';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://talawa-graphql-api.herokuapp.com/graphql',
});

describe('Testing the LoginPage', () => {
  test('should show the text on the website', async () => {
    render(
      <ApolloProvider client={client}>
        <SuperAdminOrgHomePage />
      </ApolloProvider>
    );
  });
});
