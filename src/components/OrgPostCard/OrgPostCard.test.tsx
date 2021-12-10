import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgPostCard from './OrgPostCard';
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

describe('Testing Organization Post Card', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <ApolloProvider client={client}>
        <OrgPostCard
          key="123"
          id=""
          postTitle="Event Info"
          postInfo="Time change"
          postAuthor="Saumya xyz"
          postPhoto="photoLink"
          postVideo="videoLink"
        />
      </ApolloProvider>
    );
    expect(screen.getByText('Author:')).toBeInTheDocument();
    expect(screen.getByText('Image URL:')).toBeInTheDocument();
    expect(screen.getByText('Video URL:')).toBeInTheDocument();
    expect(screen.getByText('Event Info')).toBeInTheDocument();
    expect(screen.getByText('Time change')).toBeInTheDocument();
    expect(screen.getByText('Saumya xyz')).toBeInTheDocument();
    expect(screen.getByText('photoLink')).toBeInTheDocument();
    expect(screen.getByText('videoLink')).toBeInTheDocument();
  });
});
