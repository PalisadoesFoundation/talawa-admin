import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render } from '@testing-library/react';
import OrganizationDashboard from './OrganizationDashboard';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BrowserRouter } from 'react-router-dom';

const MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            _id: 1,
            image: '',
            name: 'Pikatchu',
            description: 'hello',
            creator: {
              firstName: '',
              lastName: '',
              email: '',
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

describe('Organisation Dashboard Page', () => {
  test('should render props and text elements test for the screen', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <OrganizationDashboard />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');
    await wait();
    expect(container.textContent).toMatch('Location : ');
  });
});
