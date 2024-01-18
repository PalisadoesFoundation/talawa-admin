import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { USER_TASKS_LIST } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Tasks from './Tasks';

const MOCKS = [
  {
    request: {
      query: UPDATE_USER_MUTATION,
      variables: {
        firstName: 'Noble',
        lastName: 'Mittal',
      },
      result: {
        data: {
          updateUserProfile: {
            _id: '453',
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_TASKS_LIST,
      variables: {
        id: localStorage.getItem('userId'),
      },
    },
    result: {
      data: {
        user: {
          _id: '63d6064458fce20ee25c3bf7',
          assignedTasks: [
            {
              _id: '650c440f2b5f121b9ceeaa88',
              title: 'Volunteer catering system',
              description: 'Lorem ipsum dolor sit amet',
              deadline: '2023-09-28T16:25:47.000Z',
              volunteers: [
                {
                  _id: '63d6064458fce20ee25c3bf7',
                  firstName: 'Noble',
                  lastName: 'Mittal',
                  email: 'test@gmail.com',
                  __typename: 'User',
                },
              ],
              createdAt: '2023-09-21T13:24:31.217Z',
              completed: false,
              event: {
                _id: '650982592328d374ba2881bc',
                title: 'sadas',
                organization: {
                  _id: '6493e4570ee6c913d7199291',
                  name: 'Test Organization',
                  image: null,
                  __typename: 'Organization',
                },
                __typename: 'Event',
              },
              creator: {
                _id: '63d6064458fce20ee25c3bf7',
                firstName: 'Noble',
                lastName: 'Mittal',
                __typename: 'User',
              },
              __typename: 'Task',
            },
          ],
          __typename: 'User',
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Tasks Screen [User Portal]', () => {
  // Mocks required for media queries for UserNavbar
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  test('Screen should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Tasks />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.queryAllByText('Your assigned tasks')).not.toBe([]);
  });
});
