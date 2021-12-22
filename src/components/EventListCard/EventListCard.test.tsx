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
          eventLocation="Gujarat"
          eventName="Shelter for Dogs"
          totalAdmin="5"
          totalMember="107"
          eventImage=""
          regDate="07/04/2020"
          regDays="3"
        />
      </ApolloProvider>
    );
    expect(screen.getByText('Admin:')).toBeInTheDocument();
    expect(screen.getByText('Member:')).toBeInTheDocument();
    expect(screen.getByText('Days:')).toBeInTheDocument();
    expect(screen.getByText('Gujarat')).toBeInTheDocument();
    expect(screen.getByText('Shelter for Dogs')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('107')).toBeInTheDocument();
    expect(screen.getByText('07/04/2020')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
