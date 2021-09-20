import React from 'react';
import { render, screen } from '@testing-library/react';
import MemberRequestCard from './MemberRequestCard';
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

describe('Testing Member Request Card', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <ApolloProvider client={client}>
        <MemberRequestCard
          key="123"
          id=""
          memberName=""
          memberLocation=""
          joinDate=""
          memberImage=""
          email=""
        />
      </ApolloProvider>
    );
    expect(screen.getByText('Joined:')).toBeInTheDocument();
  });
});
