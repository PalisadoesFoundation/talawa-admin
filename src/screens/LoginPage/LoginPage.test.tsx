import React from 'react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LoginPage from './LoginPage';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://talawa-graphql-api.herokuapp.com/graphql',
});

describe('Testing Login Page', () => {
  it('Landing page component should be rendered', () => {
    const { container } = render(
      <ApolloProvider client={client}>
        <LoginPage />
      </ApolloProvider>
    );

    expect(container.textContent).toMatch('Talawa Admin Management Portal');
    expect(container.textContent).toMatch(
      'for the seamless management of Talawa Application'
    );
    expect(container.textContent).toMatch('FROM PALISADOES');
  });

  test('Registration form is upto the mark', async () => {
    const { container } = render(
      <ApolloProvider client={client}>
        <LoginPage />
      </ApolloProvider>
    );

    expect(container.textContent).toMatch(/register/i);

    userEvent.type(await screen.findByPlaceholderText(/eg. John/i), 'John');
    userEvent.type(await screen.findByPlaceholderText(/eg. Doe/i), 'Doe');
    userEvent.type(await screen.findByPlaceholderText(/SUPERADMIN/i), 'ADMIN');
    userEvent.type(
      await screen.findByPlaceholderText(/Your Email/i),
      'johndoe@gmail.com'
    );
    userEvent.type(
      await screen.findByPlaceholderText('Password'),
      'qwerty1234'
    );
    userEvent.type(
      await screen.findByPlaceholderText('Confirm Password'),
      'qwerty1234'
    );

    await screen.findByRole('button', { name: /register/i });
  });
});
