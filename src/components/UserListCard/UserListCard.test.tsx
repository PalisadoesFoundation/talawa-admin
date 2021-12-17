import React from 'react';
import { render, screen } from '@testing-library/react';
import UserListCard from './UserListCard';
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

describe('Testing User List Card', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <ApolloProvider client={client}>
        <UserListCard
          key="123"
          id=""
          memberName="Dogs Care"
          memberLocation="India"
          joinDate="04/07/2019"
          memberImage=""
        />
      </ApolloProvider>
    );
    expect(screen.getByText('Joined:')).toBeInTheDocument();
    expect(screen.getByText('Dogs Care')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.getByText('04/07/2019')).toBeInTheDocument();
  });

  test('should show modal when the button is clicked', () => {
    render(
      <ApolloProvider client={client}>
        <UserListCard
          key="123"
          id=""
          memberName="Dogs Care"
          memberLocation="India"
          joinDate="04/07/2019"
          memberImage=""
        />
      </ApolloProvider>
    );
    userEvent.click(screen.getByText('Add Admin', { selector: 'button' }));
    expect(
      screen.getByText('Are you sure you want to add Admin')
    ).toBeInTheDocument();
  });

  test('should perform appropriate task ok clicking okay', async () => {
    render(
      <ApolloProvider client={client}>
        <UserListCard
          key="123"
          id=""
          memberName="Dogs Care"
          memberLocation="India"
          joinDate="04/07/2019"
          memberImage=""
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
      await screen.queryByText('Are you sure you want to add Admin')
    ).toBeNull();
  });
});
