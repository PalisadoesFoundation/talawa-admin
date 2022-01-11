import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render } from '@testing-library/react';
import OrgSettings from './OrgSettings';
import { MEMBERSHIP_REQUEST } from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BrowserRouter } from 'react-router-dom';

const MOCKS = [
  {
    request: {
      query: MEMBERSHIP_REQUEST,
    },
    result: {
      data: {
        organizations: [
          {
            _id: 1,
            membershipRequests: {
              _id: 1,
              user: {
                _id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@gmail.com',
              },
            },
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

describe('Organisation Settings Page', () => {
  test('correct mock data should be queried', async () => {
    const dataQuery1 = MOCKS[0]?.result?.data?.organizations[0];

    console.log(`Data is ${dataQuery1}`);
    expect(dataQuery1).toEqual({
      _id: 1,
      membershipRequests: {
        _id: 1,
        user: {
          _id: 1,
          email: 'johndoe@gmail.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    });
  });
  test('should render props and text elements test for the screen', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <OrgSettings />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');
    await wait();
    expect(container.textContent).toMatch('Settings');
    expect(container.textContent).toMatch('Update Your Details');
    expect(container.textContent).toMatch('Update Organization');
    expect(container.textContent).toMatch('Delete Organization');
    expect(container.textContent).toMatch('See Request');
  });
});
