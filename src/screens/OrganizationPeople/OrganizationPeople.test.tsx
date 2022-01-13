import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render } from '@testing-library/react';
import OrganizationPeople from './OrganizationPeople';
import { ADMIN_LIST, MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BrowserRouter } from 'react-router-dom';

const MOCKS = [
  {
    request: {
      query: MEMBERS_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            _id: 1,
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
            _id: 1,
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
];

async function wait(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Organisation People Page', () => {
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
});
