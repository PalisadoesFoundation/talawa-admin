import React from 'react';
import { render, screen } from '@testing-library/react';
import SidePanel from './SidePanel';
import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { BACKEND_URL } from 'Constant/constant';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: BACKEND_URL,
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
