import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import TaskCard from './TaskCard';

const link = new StaticMockLink([], true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

let props = {
  id: '1',
  title: 'Test Task Card',
  deadline: '2023-09-28T16:25:47.000Z',
  description: 'Test Description',
  volunteers: [
    {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@user.com',
    },
  ],
  creator: {
    id: '2',
    firstName: 'Test',
    lastName: 'User',
  },
  event: {
    id: '3',
    title: 'Test Event',
    organization: {
      id: '1',
      name: 'Test Organization',
      image: '',
    },
  },
  createdAt: '2023-09-21T13:24:31.217Z',
  completed: false,
};

describe('Testing TaskCard Component [User Portal]', () => {
  test('Component should be rendered properly if task.completed === false', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <TaskCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.queryAllByText('Test Task Card')).not.toBe([]);
  });

  test('Component should be rendered properly if task.completed === true', async () => {
    props = {
      ...props,
      completed: true,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <TaskCard {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.queryAllByText('Test Task Card')).not.toBe([]);
  });
});
