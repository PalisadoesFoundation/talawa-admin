import React from 'react';
import { render, screen } from '@testing-library/react';
import ContriStats from './ContriStats';
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

describe('Testing Contribution Stats', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <ApolloProvider client={client}>
        <ContriStats
          key="123"
          id=""
          recentAmount=""
          highestAmount=""
          totalAmount=""
        />
      </ApolloProvider>
    );
    expect(screen.getByText('Recent Contribution:')).toBeInTheDocument();
    expect(screen.getByText('Highest Contribution:')).toBeInTheDocument();
  });
});
