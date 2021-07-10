import React from 'react';
import { render, screen } from '@testing-library/react';
import SuperAdminOrgMemberPage from './SuperAdminOrgMember';
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

describe('This is the test for Organization member page component', () => {
  test('should render 5 text elements test for the member page componet', async () => {
    render(
      <ApolloProvider client={client}>
        <SuperAdminOrgMemberPage />
      </ApolloProvider>
    );
  });
});
