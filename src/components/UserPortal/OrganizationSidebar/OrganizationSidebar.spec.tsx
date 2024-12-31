import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
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
import { vi } from 'vitest';

/**
 * Unit tests for the OrganizationSidebar component in the User Portal.
 *
 * These tests validate the rendering and behavior of the OrganizationSidebar component,
 * ensuring that it displays correct content based on the availability of members and events.
 *
 * 1. **Component renders properly when members and events lists are empty**: Verifies the correct display of "No Members to show" and "No Events to show" when both lists are empty.
 * 2. **Component renders properly when events list is not empty**: Tests that the events section is rendered correctly when events are available, and "No Events to show" is not displayed.
 * 3. **Component renders properly when members list is not empty**: Verifies the correct display of members when available, ensuring "No Members to show" is not displayed.
 * 4. **Handles GraphQL errors properly**: Validates that the component properly handles GraphQL query errors by displaying appropriate fallback content ("No Members to show" and "No Events to show") when data fetching fails.
 * 5. **Should show Loading state initially** : Checks that loading indicators are properly displayed while data is being fetched, verifying that "Loading..." text appears in both the members and events sections before data loads.
 * 6. **Should render Member images properly** : Validates the correct rendering of member profile images, ensuring that default images are shown when no custom image is provided and that custom images are properly displayed when available.
 *
 * Mocked GraphQL queries simulate backend responses for members and events lists.
 */

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
            startDate: '2024-01-01',
            endDate: '2024-01-02',
            location: 'New Delhi',
            startTime: '02:00',
            endTime: '06:00',
            allDay: false,
            recurring: false,
            attendees: [],
            recurrenceRule: null,
            isRecurringEventException: false,
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
let mockId = '';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: mockId }),
  };
});

describe('Testing OrganizationSidebar Component [User Portal]', () => {
  it('Component should be rendered properly when members and events list is empty', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.queryByText('No Members to show')).toBeInTheDocument();
    expect(screen.queryByText('No Events to show')).toBeInTheDocument();
  });

  it('Component should be rendered properly when events list is not empty', async () => {
    mockId = 'events';
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(screen.queryByText('No Members to show')).toBeInTheDocument();
    expect(screen.queryByText('No Events to show')).not.toBeInTheDocument();
    expect(screen.queryByText('Event')).toBeInTheDocument();
  });

  it('Component should be rendered properly when members list is not empty', async () => {
    mockId = 'members';
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(screen.queryByText('No Members to show')).not.toBeInTheDocument();
    expect(screen.queryByText('No Events to show')).toBeInTheDocument();
  });

  it('Handles GraphQL errors properly', async () => {
    mockId = 'error';
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(screen.queryByText('No Members to show')).toBeInTheDocument();
    expect(screen.queryByText('No Events to show')).toBeInTheDocument();
  });

  it('Should show Loading state initially', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getAllByText('Loading...').length).toBe(2);
  });

  it('Should render Member images properly', async () => {
    mockId = 'members';
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute(
      'src',
      expect.stringContaining('defaultImg.png'),
    );
    expect(images[1]).toHaveAttribute('src', 'mockImage');
  });
});
