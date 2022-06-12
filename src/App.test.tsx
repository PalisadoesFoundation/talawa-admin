import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { store } from 'state/store';
import { CHECK_AUTH } from 'GraphQl/Queries/Queries';

const MOCKS = [
  {
    request: {
      query: CHECK_AUTH,
    },
    result: {
      data: {
        checkAuth: {
          _id: '123',
          firstName: 'John',
          lastName: 'Doe',
          image: 'john.jpg',
          email: 'johndoe@gmail.com',
          userType: 'SUPERADMIN',
        },
      },
    },
  },
];

async function wait(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing the App Component', () => {
  test('Component should be rendered properly and user is loggedin', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByText('Talawa Admin Management Portal')).toBeTruthy();
    expect(screen.getByText('FROM PALISADOES')).toBeTruthy();
  });

  test('Component should be rendered properly and user is loggedout', async () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });
});
