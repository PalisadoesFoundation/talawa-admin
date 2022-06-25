import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'jest-location-mock';

import OrganizationDashboard from './OrganizationDashboard';
import {
  ORGANIZATIONS_LIST,
  ORGANIZATION_EVENT_LIST,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';
import { store } from 'state/store';

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
            name: 'Dummy Organization',
            description: 'This is a Dummy Organization',
            creator: {
              firstName: '',
              lastName: '',
              email: '',
            },
            location: 'New Delhi',
            members: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            admins: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            membershipRequests: {
              _id: '456',
              user: {
                firstName: 'Sam',
                lastName: 'Smith',
                email: 'samsmith@gmail.com',
              },
            },
            blockedUsers: {
              _id: '789',
              firstName: 'Steve',
              lastName: 'Smith',
              email: 'stevesmith@gmail.com',
            },
            tags: ['Shelter', 'NGO', 'Open Source'],
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_POST_LIST,
    },
    result: {
      data: {
        postsByOrganization: [
          {
            _id: 1,
            title: 'Akatsuki',
            text: 'Capture Jinchuriki',
            imageUrl: '',
            videoUrl: '',
          },
        ],
      },
    },
  },
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

describe('Organisation Dashboard Page', () => {
  test('should render props and text elements test for the screen', async () => {
    window.location.replace('/orglist');

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
    expect(container.textContent).toMatch('Location');
    expect(container.textContent).toMatch('About');
    expect(container.textContent).toMatch('Statistics');
    expect(window.location).toBeAt('/orglist');
  });

  test('should check function call', async () => {
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
    fireEvent.click(screen.getByText('Delete This Organization'));
    fireEvent.click(screen.getByTestId(/deleteOrganizationBtn/i));
    expect(window.location).not.toBeNull();
  });
});
