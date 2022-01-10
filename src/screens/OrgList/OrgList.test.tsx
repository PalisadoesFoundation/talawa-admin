import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render } from '@testing-library/react';
import OrgList from './OrgList';
import {
  ORGANIZATION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { store } from 'state/store';

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            _id: 1,
            image: '',
            name: 'Akatsuki',
            creator: {
              firstName: 'John',
              lastName: 'Doe',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: localStorage.getItem('id') },
    },
    result: {
      data: {
        user: [
          {
            firstName: 'John',
            lastName: 'Doe',
            image: '',
            email: 'John_Does_Palasidoes@gmail.com',
            userType: '',
            adminFor: {
              _id: 1,
              image: '',
              name: 'Akatsuki',
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

describe('Organisation List Page', () => {
  test('correct mock data should be queried', async () => {
    const dataQuery1 = MOCKS[0]?.result?.data?.organizations;

    console.log(`Data is ${dataQuery1}`);
    expect(dataQuery1).toEqual([
      {
        _id: 1,
        creator: { firstName: 'John', lastName: 'Doe' },
        image: '',
        name: 'Akatsuki',
      },
    ]);
  });
  test('should render props and text elements test for the screen', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <Provider store={store}>
          <OrgList />
        </Provider>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');
    await wait();
    console.log(container);
    expect(container.textContent).toMatch('Name:');
    expect(container.textContent).toMatch('Designation:');
    expect(container.textContent).toMatch('Email:');
    expect(container.textContent).toMatch('Contact:');
  });
});
