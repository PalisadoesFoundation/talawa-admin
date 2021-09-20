import React from 'react';
import { render, screen } from '@testing-library/react';
import EventListCard from './EventListCard';
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

describe('Testing Event List Card', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <ApolloProvider client={client}>
        <EventListCard
          key="123"
          id=""
          eventLocation=""
          eventName=""
          totalAdmin=""
          totalMember=""
          eventImage=""
          regDate=""
          regDays=""
        />
      </ApolloProvider>
    );
    expect(screen.getByText('Admin:')).toBeInTheDocument();
    expect(screen.getByText('Member:')).toBeInTheDocument();
    expect(screen.getByText('Days:')).toBeInTheDocument();
  });
});
