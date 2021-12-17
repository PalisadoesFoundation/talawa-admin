import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import EventListCard from './EventListCard';
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
  InMemoryCache,
} from '@apollo/client';
import ModalResponse from 'components/Response/ModalResponse';
import userEvent from '@testing-library/user-event';
import { ToastContainer, toast } from 'react-toastify';

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

  test('should show modal when the button is clicked', () => {
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
    userEvent.click(screen.getByText('Delete', { selector: 'button' }));
    expect(
      screen.getByText('Are you sure you want to delete this event')
    ).toBeInTheDocument();
  });

  test('should delete event when okay is clicked', async () => {
    render(
      <ApolloProvider client={client}>
        <ToastContainer />
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
      screen.queryByText('Are you sure you want to delete this event')
    ).toBeNull();
  });
});
