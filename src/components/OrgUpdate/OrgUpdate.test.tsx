import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgUpdate from './OrgUpdate';
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
  test('should render 2 text elements test for the member page componet', () => {
    render(
      <ApolloProvider client={client}>
        <OrgUpdate key="123" id="" orgid="" />
      </ApolloProvider>
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Creator')).toBeInTheDocument();
    expect(screen.getByText('Api Url')).toBeInTheDocument();
    expect(screen.getByText('Display Image:')).toBeInTheDocument();
    expect(screen.getByText('Is Public:')).toBeInTheDocument();
    expect(screen.getByText('Is Registrable:')).toBeInTheDocument();
  });
});
