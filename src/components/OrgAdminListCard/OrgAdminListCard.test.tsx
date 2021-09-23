import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgAdminListCard from './OrgAdminListCard';
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

describe('Testing Organization Admin List Card', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <ApolloProvider client={client}>
        <OrgAdminListCard
          key="123"
          id=""
          memberName="Saumya"
          memberLocation="India"
          joinDate="04/09/2001"
          memberImage=""
        />
      </ApolloProvider>
    );
    expect(screen.getByText('Saumya')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.getByText('04/09/2001')).toBeInTheDocument();
  });
});
