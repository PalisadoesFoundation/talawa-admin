import React from 'react';
import { render, screen } from '@testing-library/react';
import MemberRequestCard from './MemberRequestCard';
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
  InMemoryCache,
} from '@apollo/client';
import userEvent from '@testing-library/user-event';
import ModalResponse from 'components/Response/ModalResponse';

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

  test('should show modal when the button is clicked', () => {
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
    userEvent.click(screen.getByText('Reject', { selector: 'button' }));
    expect(
      screen.getByText('Are you sure you want to Reject Member')
    ).toBeInTheDocument();
  });

  test('should perform appropriate task ok clicking okay', async () => {
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
        <ModalResponse
          show={true}
          message=""
          handleClose={() => {
            console.log('test');
          }}
          handleContinue={() => {
            console.log('test');
          }}
        />
      </ApolloProvider>
    );
    userEvent.click(screen.getByText('Okay', { selector: 'button' }));
    expect(
      await screen.queryByText('Are you sure you want to Reject Member')
    ).toBeNull();
  });
});
