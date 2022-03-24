import React from 'react';
import { render, screen } from '@testing-library/react';
import SidePanel from './SidePanel';
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
  InMemoryCache,
} from '@apollo/client';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.REACT_APP_BACKEND_ENDPOINT,
});

describe('Testing Contribution Stats', () => {
  const props = {
    collapse: true,
    children: '234',
  };

  test('should render props and text elements test for the SidePanel component', () => {
    render(
      <ApolloProvider client={client}>
        <SidePanel {...props} />
      </ApolloProvider>
    );
    expect(screen.getByTestId('SidePanel')).toBeInTheDocument();
  });
});
