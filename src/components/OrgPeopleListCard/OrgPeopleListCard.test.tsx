import React from 'react';
import { render, screen } from '@testing-library/react';
import OrgPeopleListCard from './OrgPeopleListCard';
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

  test('should show modal when the button is clicked', () => {
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
    userEvent.click(screen.getByText('Remove', { selector: 'button' }));
    expect(
      screen.getByText('Are you sure you want to Remove Member')
    ).toBeInTheDocument();
  });

  test('should return a message from server', async () => {
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
      await screen.queryByText('Are you sure you want to Remove Member')
    ).toBeNull();
  });
});
