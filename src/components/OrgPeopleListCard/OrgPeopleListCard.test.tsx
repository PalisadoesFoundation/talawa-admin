import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgPeopleListCard from './OrgPeopleListCard';
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
        <OrgPeopleListCard
          key="123"
          id=""
          memberName="John Doe"
          memberLocation="USA"
          joinDate="04/07/2005"
          memberImage=""
        />
      </ApolloProvider>
    );
    expect(screen.getByText('Joined:')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
    expect(screen.getByText('04/07/2005')).toBeInTheDocument();
  });
});
