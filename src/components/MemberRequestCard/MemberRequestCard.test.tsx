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
          memberName="Saumya Singh"
          memberLocation="India"
          joinDate="07/04/2019"
          memberImage=""
          email="xyz@gmail.com"
        />
      </ApolloProvider>
    );
    expect(screen.getByText('Joined:')).toBeInTheDocument();
    expect(screen.getByText('Saumya Singh')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.getByText('07/04/2019')).toBeInTheDocument();
    expect(screen.getByText('xyz@gmail.com')).toBeInTheDocument();
  });
});
