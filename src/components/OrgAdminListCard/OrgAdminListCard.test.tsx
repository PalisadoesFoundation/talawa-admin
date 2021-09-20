import React from 'react';
import { render } from '@testing-library/react';
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
          id={''}
          memberName={''}
          memberLocation={''}
          joinDate={''}
          memberImage={''}
        />
      </ApolloProvider>
    );
  });
});
