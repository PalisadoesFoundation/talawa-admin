import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, fireEvent, render, screen } from '@testing-library/react';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import OrganizationDashboard from './OrganizationDashboard';
import {
  EMPTY_MOCKS,
  ERROR_MOCKS,
  MOCKS,
  EVENT_MOCK,
} from './OrganizationDashboardMocks';
import i18nForTest from 'utils/i18nForTest';
import { toast } from 'react-toastify';
import userEvent from '@testing-library/user-event';

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
const link1 = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(EMPTY_MOCKS, true);
const link3 = new StaticMockLink(ERROR_MOCKS, true);
const link4 = new StaticMockLink(EVENT_MOCK, true);

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

beforeEach(() => {
  localStorage.setItem('FirstName', 'John');
  localStorage.setItem('LastName', 'Doe');
  localStorage.setItem('UserType', 'SUPERADMIN');
  localStorage.setItem(
    'UserImage',
    'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe'
  );
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('Organisation Dashboard Page', () => {
  test('Should render props and text elements test for the screen', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link1}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <OrganizationDashboard />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    await wait();
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(screen.getByText('Admins')).toBeInTheDocument();
    expect(screen.getAllByText('Posts')).toHaveLength(2);
    expect(screen.getAllByText('Events')).toHaveLength(2);
    expect(screen.getByText('Blocked Users')).toBeInTheDocument();
    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
    expect(screen.getByText('Latest Posts')).toBeInTheDocument();
    expect(screen.getByText('Membership requests')).toBeInTheDocument();

    // Checking if posts are rendered
    expect(screen.getByText('Post 15')).toBeInTheDocument();

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();

    const peopleBtn = screen.getByText('Members');
    const adminBtn = screen.getByText('Admins');
    const postBtn = screen.getAllByText('Posts');
    const eventBtn = screen.getAllByText('Events');
    const blockUserBtn = screen.getByText('Blocked Users');
    const requestBtn = screen.getByText('Requests');
    userEvent.click(peopleBtn);
    userEvent.click(adminBtn);
    userEvent.click(postBtn[0]);
    userEvent.click(eventBtn[0]);
    userEvent.click(postBtn[1]);
    userEvent.click(eventBtn[1]);
    userEvent.click(blockUserBtn);
    userEvent.click(requestBtn);
  });

  test('Testing buttons and checking empty events, posts and membership requests', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link2}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <OrganizationDashboard />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    await wait();
    const viewEventsBtn = screen.getByTestId('viewAllEvents');
    const viewPostsBtn = screen.getByTestId('viewAllPosts');
    const viewMSBtn = screen.getByTestId('viewAllMembershipRequests');

    userEvent.click(viewEventsBtn);
    userEvent.click(viewPostsBtn);
    fireEvent.click(viewMSBtn);
    expect(toast.success).toBeCalledWith('Coming soon!');

    expect(
      screen.getByText(/No membership requests present/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/No upcoming events/i)).toBeInTheDocument();
    expect(screen.getByText(/No posts present/i)).toBeInTheDocument();
  });

  test('Testing error scenario', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link3}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <OrganizationDashboard />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    await wait();
    expect(window.location).toBeAt('/orglist');
  });

  test('Testing empty membership requests and upcoming events with populated posts', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link2}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <OrganizationDashboard />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    await wait();

    const viewMSBtn = screen.getByTestId('viewAllMembershipRequests');

    fireEvent.click(viewMSBtn);
    expect(toast.success).toBeCalledWith('Coming soon!');

    expect(
      screen.getByText(/No Membership requests present/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/No Upcoming Events/i)).toBeInTheDocument();
    expect(screen.queryByText(/No Posts Present/i)).toBeInTheDocument();
  });

  test('Testing error scenario redirects to orglist page', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link3}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <OrganizationDashboard />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    await wait();

    expect(window.location.pathname).toBe('/orglist');
  });

  test('Clicking viewAllMembershipRequests triggers toast.success', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link1}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <OrganizationDashboard />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    await wait();

    const viewMSBtn = screen.getByTestId('viewAllMembershipRequests');
    fireEvent.click(viewMSBtn);

    // Ensure that toast.success is called with 'Coming soon!'
    expect(toast.success).toBeCalledWith('Coming soon!');
  });

  test('Checking for Upcoming Event is getting rendered or not.', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link4}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <OrganizationDashboard />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    await wait();
    expect(screen.getByText('Sample Event')).toBeInTheDocument();
  });
});
