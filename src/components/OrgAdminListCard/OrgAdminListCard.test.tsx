import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgAdminListCard from './OrgAdminListCard';
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
  test('should show modal when the button is clicked', () => {
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
    userEvent.click(screen.getByText('Remove', { selector: 'button' }));
    expect(
      screen.getByText('Are you sure you want to Remove Admin')
    ).toBeInTheDocument();
  });

  test('should perform appropriate task ok clicking okay', async () => {
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
      await screen.queryByText('Are you sure you want to Remove Admin')
    ).toBeNull();
  });
});
