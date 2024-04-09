import { MockedProvider } from '@apollo/react-testing';
import { act, fireEvent, render, screen } from '@testing-library/react';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import useLocalStorage from 'utils/useLocalstorage';
import OrganizationDashboard from './OrganizationDashboard';
import { EMPTY_MOCKS, ERROR_MOCKS, MOCKS } from './OrganizationDashboardMocks';
import React from 'react';
const { setItem } = useLocalStorage();
import type { InterfaceQueryOrganizationEventListItem } from 'utils/interfaces';

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

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));
const mockNavgate = jest.fn();
let mockId: string | undefined = undefined;
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavgate,
  useParams: () => ({ orgId: mockId }),
}));

beforeEach(() => {
  setItem('FirstName', 'John');
  setItem('LastName', 'Doe');
  setItem(
    'UserImage',
    'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
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
        </MockedProvider>,
      );
    });

    await wait();
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(screen.getByText('Admins')).toBeInTheDocument();
    expect(screen.getAllByText('Posts')).toHaveLength(1);
    expect(screen.getAllByText('Events')).toHaveLength(1);
    expect(screen.getByText('Blocked Users')).toBeInTheDocument();
    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
    expect(screen.getByText('Latest Posts')).toBeInTheDocument();
    expect(screen.getByText('Membership requests')).toBeInTheDocument();

    // Checking if posts are rendered
    expect(screen.getByText('postone')).toBeInTheDocument();

    // Checking if membership requests are rendered
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
    userEvent.click(postBtn[0]);
    userEvent.click(eventBtn[0]);
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
        </MockedProvider>,
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
      screen.getByText(/No membership requests present/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/No upcoming events/i)).toBeInTheDocument();
    expect(screen.getByText(/No Posts Present/i)).toBeInTheDocument();
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
        </MockedProvider>,
      );
    });

    await wait();
    expect(mockNavgate).toHaveBeenCalledWith('/orglist');
  });
  test('upcomingEvents cardItem component should render when length>0', async () => {
    mockId = '123';
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
        </MockedProvider>,
      );
    });
    screen.getByTestId('cardItem');
  });

  test('event data should get updated using useState function', async () => {
    mockId = '123';
    const mockSetState = jest.spyOn(React, 'useState');
    jest.doMock('react', () => ({
      ...jest.requireActual('react'),
      useState: (initial: InterfaceQueryOrganizationEventListItem[]) => [
        initial,
        mockSetState,
      ],
    }));
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
        </MockedProvider>,
      );
    });
    expect(mockSetState).toHaveBeenCalled();
  });
});
