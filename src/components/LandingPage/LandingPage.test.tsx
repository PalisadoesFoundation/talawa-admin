import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingPage from './LandingPage';
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

describe('Testing LandingPage', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <ApolloProvider client={client}>
        <LandingPage />
      </ApolloProvider>
    );
    expect(
      screen.getByText('Talawa Admin Management Portal')
    ).toBeInTheDocument();
    expect(screen.getByText('FROM PALISADOES')).toBeInTheDocument();
  });
});
