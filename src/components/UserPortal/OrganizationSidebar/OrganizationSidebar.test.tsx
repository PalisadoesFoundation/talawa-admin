import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  ORGANIZATION_EVENT_CONNECTION_LIST,
} from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import OrganizationSidebar from './OrganizationSidebar';
import * as getOrganizationId from 'utils/getOrganizationId';

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_EVENT_CONNECTION_LIST,
      variables: {
        organization_id: 'events',
        first: 3,
        skip: 0,
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [
          {
            _id: 1,
            title: 'Event',
            description: 'Event Test',
            startDate: '',
            endDate: '',
            location: 'New Delhi',
            startTime: '02:00',
            endTime: '06:00',
            allDay: false,
            recurring: false,
            isPublic: true,
            isRegisterable: true,
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
      variables: {
        orgId: 'members',
        first: 3,
        skip: 0,
      },
    },
    result: {
      data: {
        organizationsMemberConnection: {
          edges: [
            {
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Noble',
              lastName: 'Mittal',
              image: null,
              email: 'noble@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
            },
            {
              _id: '64001660a711c62d5b4076a3',
              firstName: 'Noble',
              lastName: 'Mittal',
              image: 'mockImage',
              email: 'noble@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
            },
          ],
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

describe('Testing OrganizationSidebar Component [User Portal]', () => {
  jest.mock('utils/getOrganizationId');

  test('Component should be rendered properly when members and events list is empty', async () => {
    const getOrganizationIdSpy = jest
      .spyOn(getOrganizationId, 'default')
      .mockImplementation(() => {
        return '';
      });

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(getOrganizationIdSpy).toHaveBeenCalled();
    expect(screen.queryByText('No Members to show')).toBeInTheDocument();
    expect(screen.queryByText('No Events to show')).toBeInTheDocument();
  });

  test('Component should be rendered properly when events list is not empty', async () => {
    const getOrganizationIdSpy = jest
      .spyOn(getOrganizationId, 'default')
      .mockImplementation(() => {
        return 'events';
      });

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    expect(getOrganizationIdSpy).toHaveBeenCalled();
    expect(screen.queryByText('No Members to show')).toBeInTheDocument();
    expect(screen.queryByText('No Events to show')).not.toBeInTheDocument();
    expect(screen.queryByText('Event')).toBeInTheDocument();
  });

  test('Component should be rendered properly when members list is not empty', async () => {
    const getOrganizationIdSpy = jest
      .spyOn(getOrganizationId, 'default')
      .mockImplementation(() => {
        return 'members';
      });

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    expect(getOrganizationIdSpy).toHaveBeenCalled();
    expect(screen.queryByText('No Members to show')).not.toBeInTheDocument();
    expect(screen.queryByText('No Events to show')).toBeInTheDocument();
  });
});
