import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import OrganizationPeople from './OrganizationPeople';
import { store } from 'state/store';
import { ADMIN_LIST, MEMBERS_LIST, USER_LIST } from 'GraphQl/Queries/Queries';

const MOCKS = [
  {
    request: {
      query: MEMBERS_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            _id: 10,
            members: [
              {
                _id: 100,
                firstName: 'John',
                lastName: 'Doe',
                image: '',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: ADMIN_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            _id: 20,
            admins: [
              {
                _id: 500,
                firstName: 'Sam',
                lastName: 'Francisco',
                image: '',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_LIST,
    },
    result: {
      data: {
        users: [
          {
            _id: 800,
            firstName: 'Peter',
            lastName: 'Parker',
            image: '',
          },
        ],
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

describe('Organisation People Page', () => {
  const searchData = {
    name: 'John Doe',
    location: 'Delhi, India',
    event: 'Dummy Event',
  };

  test('Correct mock data should be queried', async () => {
    const dataQuery1 = MOCKS[0]?.result?.data?.organizations;
    const dataQuery2 = MOCKS[1]?.result?.data?.organizations;
    const dataQuery3 = MOCKS[2]?.result?.data?.users;

    expect(dataQuery1).toEqual([
      {
        _id: 10,
        members: [
          {
            _id: 100,
            firstName: 'John',
            lastName: 'Doe',
            image: '',
          },
        ],
      },
    ]);

    expect(dataQuery2).toEqual([
      {
        _id: 20,
        admins: [
          {
            _id: 500,
            firstName: 'Sam',
            lastName: 'Francisco',
            image: '',
          },
        ],
      },
    ]);

    expect(dataQuery3).toEqual([
      {
        _id: 800,
        firstName: 'Peter',
        lastName: 'Parker',
        image: '',
      },
    ]);
  });

  test('It is necessary to query the correct mock data.', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <OrganizationPeople />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');

    await wait();

    expect(container.textContent).toMatch('Members');
    expect(container.textContent).toMatch('Filter by Name');
    expect(container.textContent).toMatch('Filter by Location');
    expect(container.textContent).toMatch('Filter by Event');
  });

  test('Testing filters and MEMBER LIST', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <OrganizationPeople />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.type(screen.getByPlaceholderText(/Enter Name/i), searchData.name);
    userEvent.type(
      screen.getByPlaceholderText(/Enter Location/i),
      searchData.location
    );
    userEvent.type(
      screen.getByPlaceholderText(/Enter Event/i),
      searchData.event
    );

    expect(screen.getByPlaceholderText(/Enter Name/i)).toHaveValue(
      searchData.name
    );
    expect(screen.getByPlaceholderText(/Enter Location/i)).toHaveValue(
      searchData.location
    );
    expect(screen.getByPlaceholderText(/Enter Event/i)).toHaveValue(
      searchData.event
    );

    userEvent.click(screen.getByLabelText(/Members/i));

    expect(screen.getByLabelText(/Members/i)).toBeChecked();
  });

  test('Testing ADMIN LIST', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <OrganizationPeople />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByLabelText(/Admins/i));

    await wait();

    expect(screen.getByLabelText(/Admins/i)).toBeChecked();
  });

  test('Testing USER LIST', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <OrganizationPeople />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByLabelText(/Users/i));

    await wait();

    expect(screen.getByLabelText(/Users/i)).toBeChecked();
  });

  test('No Mock Data', async () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <OrganizationPeople />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByLabelText(/Admins/i));

    await wait();

    userEvent.click(screen.getByLabelText(/Users/i));

    await wait();
  });
});
