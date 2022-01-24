import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgDelete from './OrgDelete';
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

describe('Testing Organization People List Card', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <ApolloProvider client={client}>
        <OrgDelete />
      </ApolloProvider>
    );
    expect(screen.getByText('Delete Org')).toBeInTheDocument();
  });
});
