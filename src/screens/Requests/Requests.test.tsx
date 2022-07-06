import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'jest-localstorage-mock';
import 'jest-location-mock';

import Requests from './Requests';
import {
  ACCPET_ADMIN_MUTATION,
  REJECT_ADMIN_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { USER_LIST } from 'GraphQl/Queries/Queries';
import { store } from 'state/store';
import userEvent from '@testing-library/user-event';

const MOCKS = [
  {
    request: {
      query: USER_LIST,
    },
    result: {
      data: {
        users: [
          {
            _id: '123',
            firstName: 'John',
            lastName: 'Doe',
            image: 'dummyImage',
            email: 'johndoe@gmail.com',
            userType: 'SUPERADMIN',
            adminApproved: true,
            createdAt: '20/06/2022',
          },
          {
            _id: '456',
            firstName: 'Sam',
            lastName: 'Smith',
            image: 'dummyImage',
            email: 'samsmith@gmail.com',
            userType: 'ADMIN',
            adminApproved: false,
            createdAt: '20/06/2022',
          },
          {
            _id: '789',
            firstName: 'Peter',
            lastName: 'Parker',
            image: 'dummyImage',
            email: 'peterparker@gmail.com',
            userType: 'USER',
            adminApproved: true,
            createdAt: '20/06/2022',
          },
        ],
      },
    },
  },
  {
    request: {
      query: ACCPET_ADMIN_MUTATION,
      variables: {
        id: '123',
        userType: 'ADMIN',
      },
    },
    result: {
      data: {
        acceptAdmin: true,
      },
    },
  },
  {
    request: {
      query: REJECT_ADMIN_MUTATION,
      variables: {
        id: '123',
        userType: 'ADMIN',
      },
    },
    result: {
      data: {
        rejectAdmin: true,
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

describe('Testing Request screen', () => {
  test('Component should be rendered properly', async () => {
    window.location.assign('/orglist');

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <Requests />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByText(/Requests/i)).toBeInTheDocument();
    expect(screen.getByText(/Search By Name/i)).toBeInTheDocument();
    expect(window.location).toBeAt('/orglist');
  });

  test('Testing, If userType is not SUPERADMIN', async () => {
    localStorage.setItem('UserType', 'USER');

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <Requests />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Testing seach by name functionality', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <Requests />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.type(screen.getByTestId(/searchByName/i), 'John');
  });

  test('Testing accept user functionality', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <Requests />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId(/acceptUser456/i));
  });

  test('Testing reject user functionality', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <Requests />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId(/rejectUser456/i));
  });
});
