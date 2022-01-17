import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render } from '@testing-library/react';
import OrganizationEvents from './OrganizationEvents';
import { ORGANIZATION_EVENT_LIST } from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BrowserRouter } from 'react-router-dom';

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_EVENT_LIST,
    },
    result: {
      data: {
        eventsByOrganization: [
          {
            _id: 1,
            title: 'Event',
            description: 'Event Test',
            startDate: '',
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

describe('Organisation Events Page', () => {
  test('It is necessary to query the correct mock data.', async () => {
    const dataQuery1 = MOCKS[0]?.result?.data?.eventsByOrganization[0];

    console.log(`Data is ${dataQuery1}`);
    expect(dataQuery1).toEqual({
      _id: 1,
      title: 'Event',
      description: 'Event Test',
      startDate: '',
    });
  });
  test('It is necessary to check correct render', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <OrganizationEvents />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');
    await wait();
    expect(container.textContent).toMatch('Events');
    expect(container.textContent).toMatch('Filter by Organization');
    expect(container.textContent).toMatch('Filter by Location');
    expect(container.textContent).toMatch('Events');
  });
});
